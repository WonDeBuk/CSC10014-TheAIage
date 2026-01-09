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
  username: string;
  user_id: string;
  email: string;
  role: "Student" | "Counsellor" | "AI";
  created_at?: string;
  description?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_CACHE_KEY = "auth_user_cache";
const TOKEN_KEY = "token";

// Get user from cache
const getCachedUser = (): User | null => {
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error("getCachedUser error:", e);
    return null;
  }
};

// Save user to cache
const setCachedUser = (user: User | null) => {
  if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_CACHE_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCachedUser());
  const [loading, setLoading] = useState(true);

  // prevent duplicate /auth/me calls
  const hasFetched = useRef(false);

  const fetchAuth = async () => {
    try {
      const res = await AxiosInstance.get("/auth/me");
      const data = res.data;
      const userData: User = {
        username: data.username,
        user_id: data.user_id,
        email: data.email,
        role: data.role,
        created_at: data.created_at,
        description: data.description,
      };

      setUser(userData);
    } catch (e) {
      console.error("fetchAuth: error", e);
      localStorage.removeItem(TOKEN_KEY)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AxiosInstance.post("/auth/login", {
      email,
      password,
    });

    const token = res.data.token;

    // Save token
    localStorage.setItem(TOKEN_KEY, token);

    // Fetch user info from /auth/me
    await fetchAuth();
  };

  const logout = async () => {
    console.log("logout: starting");
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    console.log("logout: finished");
  };

  const refreshAuth = async () => {
    await fetchAuth();
  };

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
