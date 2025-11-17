import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import AxiosInstance from "@/util/AxiosInstance"; 

type User = {
  UserID: string;
  Email: string;
  Role: "Student" | "Counsellor" | "AI";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, plainPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key để lưu vào localStorage
const AUTH_CACHE_KEY = "auth_user_cache";

// Helper functions để cache user vào localStorage
const getCachedUser = (): User | null => {
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
};

const setCachedUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_CACHE_KEY);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Khởi tạo state với cached user để tránh flash loading
  const [user, setUser] = useState<User | null>(() => getCachedUser());
  const [loading, setLoading] = useState(true);
  
  // Sử dụng useRef để đảm bảo chỉ gọi /auth/me một lần
  const hasCalledAuthMe = useRef(false);

  // Hàm để fetch user từ server
  const fetchAuth = async () => {
    try {
      const res = await AxiosInstance.get("/auth/me");
      const data = res.data;
      const userData: User = {
        UserID: data.UserID,
        Email: data.Email,
        Role: data.Role,
      };
      setUser(userData);
      setCachedUser(userData);
    } catch {
      setUser(null);
      setCachedUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Chỉ gọi /auth/me một lần khi component mount
  useEffect(() => {
    if (!hasCalledAuthMe.current) {
      hasCalledAuthMe.current = true;
      fetchAuth();
    } else {
      // Nếu đã gọi rồi, chỉ cần set loading = false
      setLoading(false);
    }
  }, []);

  const login = async (Email: string, PlainPassword: string) => {
    const res = await AxiosInstance.post("/auth/login", {
      Email,
      PlainPassword,
    });

    const data = res.data;
    const userData: User = {
      UserID: data.UserID,
      Email: data.Email,
      Role: data.Role,
    };
    setUser(userData);
    setCachedUser(userData);
  };

  const logout = async () => {
    try {
      await AxiosInstance.post("/auth/logout");
    } finally {
      setUser(null);
      setCachedUser(null);
    }
  };

  // Hàm để refresh auth khi cần (ví dụ sau khi update profile)
  const refreshAuth = async () => {
    await fetchAuth();
  };

  // Sử dụng useMemo để cache context value, tránh re-render không cần thiết
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshAuth,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
