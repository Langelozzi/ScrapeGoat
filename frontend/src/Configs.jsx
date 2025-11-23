import { useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useConfigs } from "./context/ConfigContext";
import ConfigListItem from "./components/configs/ConfigListItem";
import { useNavigate } from "react-router-dom";

function normalizeConfigs(configs) {
  if (!configs) return [];

  if (Array.isArray(configs)) return configs;

  if (typeof configs === "string") {
    try {
      const data = JSON.parse(configs);
      return Array.isArray(data) ? data : [data];
    } catch {
      return [];
    }
  }

  return [configs];
}

function Configs() {
  const theme = useTheme();
  const { configs } = useConfigs();
  const [openMap, setOpenMap] = useState({});

  const parsedConfigs = normalizeConfigs(configs);

  const toggleOpen = (key) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigate = useNavigate();

  const handleNewConfig = () => {
    navigate("/configs/new");
  };

  return (
    <div
      className="w-full max-w-[1400px] mx-auto mt-6 space-y-4"
      style={{ paddingInline: theme.spacing(3), fontFamily: "monospace" }}
    >
      {/* Top bar with title and New Config button */}
      <div className="flex justify-between items-center mb-4">
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
            margin: 0,
          }}
        >
          My Configs
        </h2>

        <Button
          variant="contained"
          size="medium"
          onClick={handleNewConfig}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          New Config
        </Button>
      </div>

      {parsedConfigs.length === 0 && (
        <div
          className="px-6 py-5 rounded-xl border"
          style={{
            color: theme.palette.text.secondary,
            borderColor: alpha(theme.palette.divider, 0.6),
          }}
        >
          No configs found.
        </div>
      )}

      {parsedConfigs.map((cfg, index) => {
        const key = cfg.id ?? index;
        const isOpen = !!openMap[key];

        return (
          <ConfigListItem
            key={key}
            cfg={cfg}
            index={index}
            isOpen={isOpen}
            onToggle={() => toggleOpen(key)}
          />
        );
      })}
    </div>
  );
}

export default Configs;
