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

function ConfigEditor({ placeholderRoot }) {
  const location = useLocation();
  const { postConfig } = useConfigs();

  const {
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
      clearInstructions();
      return;
    }

    if (path === "/configs/edit") {
      const cfg = location.state?.config;

      if (cfg) {
        setName(cfg.name ?? null);
        setDescription(cfg.description ?? null);
        setRetrievalInstructions(
          Array.isArray(cfg.retrieval_instructions)
            ? [...cfg.retrieval_instructions]
            : []
        );
      } else {
        setName(null);
        setDescription(null);
        clearInstructions();
      }
    }
  }, [location.pathname]); // <- only depend on pathname

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
