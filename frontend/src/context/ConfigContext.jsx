import { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [health, setHealth] = useState("loading...");

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/configs/`, {
          credentials: "include",
        });
        const data = await res.json();
        setHealth(data?.status || JSON.stringify(data));
      } catch (err) {
        setHealth("error");
        console.error("Health fetch failed:", err);
      }
    };

    fetchHealth();
  }, []);

  return (
    <ConfigContext.Provider value={{ health }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigs = () => useContext(ConfigContext);
