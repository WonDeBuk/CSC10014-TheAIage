import {
  createContext,
  useContext,
  useEffect,
  useState,
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await AxiosInstance.get("/auth/me");
        const data = res.data;
        setUser({
          UserID: data.UserID,
          Email: data.Email,
          Role: data.Role,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (Email: string, PlainPassword: string) => {
    const res = await AxiosInstance.post("/auth/login", {
      Email,
      PlainPassword,
    });

    const data = res.data;
    setUser({
      UserID: data.UserID,
      Email: data.Email,
      Role: data.Role,
    });
  };

  const logout = async () => {
    try {
      await AxiosInstance.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
