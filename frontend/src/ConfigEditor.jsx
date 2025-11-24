import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import DomTree from "./components/DomTree.jsx";
import NodeSelection from "./components/NodeSelection.jsx";
import { useConfigs } from "./context/ConfigContext.jsx";
import { useRetrievalInstructions } from "./context/RetrievalInstructionContext.jsx";
import { useTheme } from "@mui/material/styles";

function ConfigEditor({ placeholderRoot }) {
  const theme = useTheme();
  const location = useLocation();
  const { postConfig } = useConfigs();

  const {
    url,
    setUrl,
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

  useEffect(() => {
    if (url === lastBuiltUrlRef.current) return;
    if (!url) return;

    const t = setTimeout(() => buildTree(url), 700);
    return () => clearTimeout(t);
  }, [url]);

  const saveAndContinue = async () => {
    await postConfig(name ?? "", description ?? "", retrievalInstructions);
  };

  const continueWithoutSaving = () => {
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "calc(100vh - 120px)",
        p: 2,
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
        New Config
      </h2>

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 2 }}>
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="h6">Website URL</Typography>

          <Box sx={{ width: "100%", maxWidth: 760, mx: "auto" }}>
            <TextField
              fullWidth
              label="Website URL"
              placeholder="https://example.com"
              value={url ?? ""}
              onChange={(e) => setUrl(e.target.value)}
              slotProps={{
                input: {
                  sx: {
                    fontSize: 16,
                    height: 52,
                    "& .MuiInputBase-input": { py: 1, lineHeight: 1.5 },
                  },
                },
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ flex: 1, display: "flex", gap: 2, minHeight: 0 }}>
        <Box
          sx={{
            flex: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DomTree placeholderRoot={placeholderRoot} />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paper
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Selection
              </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              <NodeSelection />
            </Box>
          </Paper>
        </Box>
      </Box>

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
            <Button variant="text" onClick={continueWithoutSaving}>
              Continue without saving
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ConfigEditor;
