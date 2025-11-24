import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DomTree from "./components/DomTree.jsx";
import NodeSelection from "./components/NodeSelection.jsx";
import { useConfigs } from "./context/ConfigContext.jsx";
import { useRetrievalInstructions } from "./context/RetrievalInstructionContext.jsx";
import { useTheme } from "@mui/material/styles";

function ConfigEditor() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { postConfig } = useConfigs();

  const {
    url,
    setUrl,
    tree,
    setTree,
    lastBuiltUrlRef,
    name,
    setName,
    description,
    setDescription,
    retrievalInstructions,
    setRetrievalInstructions,
    clearInstructions,
  } = useRetrievalInstructions();

  // --- LOAD CONFIG (new/edit) ---
  useEffect(() => {
    const path = location.pathname;

    if (path === "/configs/new") {
      setName(null);
      setDescription(null);
      setUrl("");
      clearInstructions();
      return;
    }

    if (path === "/configs/edit") {
      const cfg = location.state?.config;

      if (cfg) {
        setName(cfg.name ?? null);
        setDescription(cfg.description ?? null);
        setUrl(cfg.url ?? "");
        setRetrievalInstructions(
          Array.isArray(cfg.retrieval_instructions)
            ? [...cfg.retrieval_instructions]
            : []
        );
      } else {
        setName(null);
        setDescription(null);
        setUrl("");
        clearInstructions();
      }
    }
  }, [location.pathname]);

  // --- BUILD TREE --- (only on button click)
  const buildTree = async (givenUrl) => {
    const targetUrl = givenUrl ?? url;
    if (!targetUrl) return;

    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/v1/scraper/dom-tree/build",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: targetUrl }),
        }
      );

      const json = await res.json();
      setTree(json.root);
      lastBuiltUrlRef.current = targetUrl;
    } catch (err) {
      console.error("buildTree error:", err);
    }
  };

  const saveAndContinue = async () => {
    await postConfig(name ?? "", description ?? "", retrievalInstructions);
  };

  const continueWithoutSaving = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      {/* Title row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 0.5,
        }}
      >
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

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
            margin: 0,
          }}
        >
          New Config
        </h2>
      </Box>

      {/* Website URL card (unchanged) */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Website URL
          </Typography>
        </Box>

        <Box
          sx={{
            px: 3,
            pb: 3,
            maxWidth: 520,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            placeholder="https://example.com"
            size="small"
            value={url ?? ""}
            onChange={(e) => setUrl(e.target.value)}
          />

          <Button
            variant="contained"
            size="medium"
            onClick={() => buildTree()}
            sx={{ whiteSpace: "nowrap", px: 3 }}
          >
            Build tree
          </Button>
        </Box>
      </Paper>

      {/* DOM Tree + Selection – no internal styling here now */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          minHeight: 600,
          overflow: "hidden",
        }}
      >
        {/* Left: DomTree handles its own look */}
        <Box
          sx={{
            flex: 2,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DomTree />
        </Box>

        {/* Right: NodeSelection handles its own look */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NodeSelection />
        </Box>
      </Box>

      {/* Bottom section (unchanged) */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1.5}>
              <TextField
                label="Config Name"
                size="small"
                fullWidth
                value={name ?? ""}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Description"
                size="small"
                fullWidth
                multiline
                minRows={2}
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button variant="outlined" onClick={saveAndContinue}>
                Save and Continue
              </Button>
            </Stack>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button variant="outlined" onClick={continueWithoutSaving}>
              Continue without saving
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ConfigEditor;
