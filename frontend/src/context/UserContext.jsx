import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/status`, {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data?.user)
        }
      } catch (err) {
        console.error("Session check failed:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [API_URL])

  const login = async (email, password) => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")
      setUser(data)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, first_name, last_name) => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name, last_name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Register failed")
      setUser(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Logout failed")
      setUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <UserContext.Provider value={{ user, error, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}
