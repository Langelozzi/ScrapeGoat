import { useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { useConfigs } from "./context/ConfigContext";
import ConfigListItem from "./components/ConfigListItem";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "./context/UserContext";

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
  const { user } = useUser();
  const [openMap, setOpenMap] = useState({});

  const parsedConfigs = normalizeConfigs(configs);

  const toggleOpen = (key) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isSelectMode = location.pathname === "/configs/select";

  const handleNewConfig = () =>
    navigate("/configs/new", { state: { from: "/configs" } });

  // -------------------------------
  // NOT LOGGED IN VIEW
  // -------------------------------
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
          }}
        >
          {/* Title */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
            }}
          >
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
          </Box>

          {/* Container that auto-sizes vertically */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              px: 4,
              py: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: 999, textTransform: "none" }}
            >
              Login to view your configs
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  // -------------------------------
  // LOGGED IN VIEW
  // -------------------------------
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      {/* Center layout wrapper */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isSelectMode && (
              <Button
                variant="text"
                onClick={() => navigate(-1)}
                sx={{
                  minWidth: 0,
                  p: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                <ArrowBackIcon />
              </Button>
            )}

            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                margin: 0,
              }}
            >
              {isSelectMode ? "Select a Config" : "My Configs"}
            </h2>
          </Box>

          {!isSelectMode && (
            <Button
              variant="contained"
              size="medium"
              onClick={handleNewConfig}
              sx={{ borderRadius: 999, textTransform: "none" }}
            >
              New Config
            </Button>
          )}
        </Box>

        {/* Paper auto-sizes vertically */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            py: 3,
            px: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <div className="space-y-4" style={{ fontFamily: "monospace" }}>
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
                  isSelectMode={isSelectMode}
                />
              );
            })}
          </div>
        </Paper>
      </Box>
    </Box>
  );
}

export default Configs;
