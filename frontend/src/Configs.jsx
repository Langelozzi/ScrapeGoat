import { useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useConfigs } from "./context/ConfigContext";
import ConfigListItem from "./components/ConfigListItem";
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
  const handleNewConfig = () => navigate("/configs/new", { state: { from: "/configs" }});

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
        mt: 4,
        py: 3,
        px: 4,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <div className="space-y-4" style={{ fontFamily: "monospace" }}>
        {/* Top bar */}
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
    </Paper>
  );
}

export default Configs;
