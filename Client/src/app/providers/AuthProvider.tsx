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
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  getLocalDate: () => string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // prevent duplicate /auth/me calls
  const hasFetched = useRef(false);

  const getLocalDate = () => {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  }

  const fetchAuth = async () => {
    try {
      const res = await AxiosInstance.get(`/auth/me/${getLocalDate()}`);
      const data = res.data;
      const userData: User = {
        username: data.username,
        user_id: data.user_id,
        email: data.email,
        role: data.role,
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
      getLocalDate
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
