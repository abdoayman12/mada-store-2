"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
} from "react";
import { User } from "@/generated/prisma/client";

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

const userLocal = (() => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return defaultValueUser;
    }
})();

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(() => userLocal ?? defaultValueUser);

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
