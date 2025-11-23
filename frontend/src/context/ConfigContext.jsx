import { createContext, useContext, useState, useEffect } from "react"
import { useRetrievalInstructions } from "./RetrievalInstructionContext.jsx"

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [configs, setConfigs] = useState("Loading...")
  const API_URL = import.meta.env.VITE_API_URL
  const { retrievalInstructions, url } = useRetrievalInstructions()

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/configs/`, {
        credentials: "include",
      })
      const data = await res.json()
      setConfigs(JSON.stringify(data))
    } catch (err) {
      console.error("Config fetch failed:", err)
      setConfigs(null)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const postConfig = async (name) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/configs/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: null,
          url,
          retrieval_instructions: retrievalInstructions,
          folder_id: null,
        }),
      })

      if (!res.ok) throw new Error(`Failed to save config: ${res.status}`)

      const created = await res.json()
      await fetchConfigs()
      return created
    } catch (err) {
      console.error("Config POST failed:", err)
      throw err
    }
  }

  return (
    <ConfigContext.Provider value={{ configs, postConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfigs = () => useContext(ConfigContext)
