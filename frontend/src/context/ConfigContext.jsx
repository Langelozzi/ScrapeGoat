import { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [configs, setConfigs] = useState("Loading...");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/configs/`, {
          credentials: "include",
        });
        const data = await res.json();
        setConfigs(JSON.stringify(data));
      } catch (err) {
        console.error("Config fetch failed:", err);
        setConfigs(null);
      }
    };

    fetchConfigs();
  }, []);

  return (
    <ConfigContext.Provider value={{ configs }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigs = () => useContext(ConfigContext);
