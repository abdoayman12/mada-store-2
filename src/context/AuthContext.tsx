"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    useEffect,
} from "react";
import { User } from "@/generated/prisma/client";
import axios from "axios";

type AuthContextValue = {
    user: User | null;
    setUser: Dispatch<User>;
};

export const defaultValueUser = {
    name: "",
    id: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};
// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(() => defaultValueUser);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                setUser(JSON.parse(raw));
            } else {
                axios
                    .get("/api/user")
                    .then((res) => {
                        setUser(res.data);
                        localStorage.setItem("user", JSON.stringify(res.data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } catch {
            setUser(defaultValueUser);
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
