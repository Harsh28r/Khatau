import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type User = { name: string; email: string; role?: 'user' | 'admin' }
type AuthState = { user: User | null; token: string | null }

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<User>
  signup: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'khatau_auth_v1'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as AuthState) : { user: null, token: null }
    } catch {
      return { user: null, token: null }
    }
  })

  const persist = (next: AuthState) => {
    setAuth(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!res.ok) throw new Error('Login failed')
    const data = (await res.json()) as { token: string; user: User }
    persist({ user: data.user, token: data.token })
    return data.user
  }

  async function signup(name: string, email: string, password: string) {
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    if (!res.ok) throw new Error('Signup failed')
    const data = (await res.json()) as { token: string; user: User }
    persist({ user: data.user, token: data.token })
    return data.user
  }

  function logout() {
    persist({ user: null, token: null })
  }

  const value = useMemo(() => ({ ...auth, login, signup, logout }), [auth])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


