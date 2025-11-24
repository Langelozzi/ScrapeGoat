import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTheme } from "@mui/material/styles";

import ConfigListItem from "./components/ConfigListItem.jsx";
import { useRetrievalInstructions } from "./context/RetrievalInstructionContext.jsx";
import { useConfigs } from "./context/ConfigContext.jsx";

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { url, name, description, flow, setFlow, retrievalInstructions } =
    useRetrievalInstructions();

  const { postConfig } = useConfigs();
  const [importedFile, setImportedFile] = useState(null);
  const [homeItemOpen, setHomeItemOpen] = useState(false);

  const placeholderRoot = {
    id: 1,
    tag_type: "html",
    children: [
      {
        id: 2,
        tag_type: "h1",
        body: "No Data Currently Displayed",
        hasData: true,
      },
      {
        id: 3,
        tag_type: "p",
        body: "Please enter a URL",
        hasData: true,
      },
    ],
  };

  const scrapeHandler = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/scraper/scrape",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            retrieval_instructions: retrievalInstructions,
          }),
        }
      );

      const json = await res.json();
      console.log(json);
      navigate("/results", { state: { scrapeData: json } });
    } catch (err) {
      console.error("scrapeHandler error:", err);
    }
  };

  const saveConfigHandler = async () => {
    await postConfig("My first config");
  };

  const handleFlowChange = (_, val) => {
    if (!val) return;
    setFlow(val);

    if (val === "saved") {
      // When user chooses "Saved Config", go to selection screen
      navigate("/configs/select");
    }
  };

  const handleNewConfigClick = () => {
    // keep flow in sync
    if (flow !== "new") {
      setFlow("new");
    }

    // always allow clicking New Config to open the editor,
    // even if it's already the active flow
    navigate("/configs/new", {
      state: { placeholderRoot, from: "/" },
    });
  };

  // Build a pseudo-config from context for displaying on Home
  const hasCurrentConfig =
    Boolean(name?.trim()) ||
    Boolean(url?.trim()) ||
    Boolean(description?.trim()) ||
    (retrievalInstructions && retrievalInstructions.length > 0);

  const currentCfg = {
    name,
    url,
    description,
    retrieval_instructions: retrievalInstructions,
    // treat selected configs from /configs/select as "saved",
    // and in-progress "new" configs as unsaved
    saved: flow === "saved",
  };

  // --- EFFECTS ---

  // When coming back from /configs/new after saving/working on a config,
  // ensure "New Config" is selected.
  useEffect(() => {
    if (location.state?.fromConfigNew) {
      setFlow("new");
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate, setFlow]);

  // On initial/plain page load with no config, don't pre-select any flow.
  // Run this only once, on first mount.
  const didRunInitialFlowReset = useRef(false);
  useEffect(() => {
    if (didRunInitialFlowReset.current) return;
    didRunInitialFlowReset.current = true;

    if (!location.state && !hasCurrentConfig && flow !== null) {
      setFlow(null);
    }
  }, [location.state, hasCurrentConfig, flow, setFlow]);

  // Effective value for the toggle group:
  // - If there is no current config and flow === "new", show *nothing* selected.
  // - Otherwise, just use whatever flow is in context (may be "new" or "saved").
  const effectiveFlow =
    !hasCurrentConfig && flow === "new" ? null : flow ?? null;

  return (
    <Box
      sx={{
        p: 2,
        minHeight: "calc(100vh - 250px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <Typography
        component="h1"
        sx={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: theme.palette.text.primary,
          m: 0,
          pb: 2,
          letterSpacing: "0.5px",
        }}
      >
        ScrapeGoat
      </Typography>

      {/* Main card */}
      <Paper
        sx={{
          p: 3,
          mb: 2,
          width: "100%",
          maxWidth: 700,
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          {/* Header text */}
          <Stack alignItems="center" textAlign="center" spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Choose Configuration Source
            </Typography>
          </Stack>

          {/* Toggle buttons */}
          <Stack direction="row" justifyContent="center">
            <ToggleButtonGroup
              value={effectiveFlow}
              exclusive
              onChange={handleFlowChange}
              size="small"
            >
              <ToggleButton value="new" onClick={handleNewConfigClick}>
                <AddCircleIcon sx={{ mr: 1 }} />
                New Config
              </ToggleButton>

              <ToggleButton value="saved">
                <LibraryBooksIcon sx={{ mr: 1 }} />
                Saved Config
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {/* Current config (either in-progress "new" OR selected "saved") */}
          {hasCurrentConfig && (
            <Box sx={{ mt: 1 }}>
              <ConfigListItem
                cfg={currentCfg}
                index={0}
                isOpen={homeItemOpen}
                onToggle={() => setHomeItemOpen((prev) => !prev)}
              />
            </Box>
          )}

          {/* Saved flow but nothing selected yet */}
          {effectiveFlow === "saved" && !hasCurrentConfig && (
            <Typography
              variant="body2"
              sx={{
                opacity: 0.7,
                fontSize: "0.85rem",
                textAlign: "center",
              }}
            >
              Log in to see your saved configurations!
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* Scrape button */}
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mt: 1 }}>
        <Button
          variant="contained"
          onClick={scrapeHandler}
          sx={{
            mt: 0.5,
            px: 3.5,
            py: 1.3,
            borderRadius: 9999,
            fontSize: "1rem",
            fontWeight: 500,
            boxShadow: 6,
          }}
        >
          Scrape ➔
        </Button>
      </Stack>
    </Box>
  );
}

export default Home;
