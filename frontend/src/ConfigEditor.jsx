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
import { useUser } from "./context/UserContext.jsx"; // ✅ added

function ConfigEditor() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { postConfig, updateConfig } = useConfigs();
  const { user } = useUser(); // ✅ added

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
    resetConfig,
  } = useRetrievalInstructions();

  // did we just come from home?
  const cameFromHome = location.state?.from === "/";

  // --- LOAD CONFIG (new/edit) ---
  useEffect(() => {
    const path = location.pathname;

    if (path === "/configs/new") {
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
        clearInstructions();
      }
    }
  }, [location.pathname]);

  // --- BUILD TREE ---
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
    const path = location.pathname;
    const from = location.state?.from;
    const cfg = location.state?.config;

    if (path === "/configs/edit" && cfg?.id) {
      // UPDATE existing config
      await updateConfig(cfg.id, {
        name: name ?? "",
        description: description ?? "",
        url: url ?? "",
        retrieval_instructions: retrievalInstructions,
        folder_id: cfg.folder_id ?? null,
      });
    } else {
      // CREATE new config
      await postConfig(name ?? "", description ?? "", retrievalInstructions);
    }

    if (from === "/configs") {
      resetConfig();
      navigate("/configs", { state: { fromConfigNew: true } });
    } else if (from === "/") {
      navigate("/", { state: { fromConfigNew: true } });
    }
  };

  const continueWithoutSaving = () => {
    navigate("/", { state: { fromConfigNew: true } });
  };

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
          {location.pathname === "/configs/new" ? "New Config" : "Edit Config"}
        </h2>
      </Box>

      {/* Website URL card */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            pt: 1.5,
            pb: 1,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Website URL
          </Typography>
        </Box>

        <Box
          sx={{
            px: 3,
            pb: 2,
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

      {/* DOM Tree + Selection */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          minHeight: 600,
          overflow: "hidden",
        }}
      >
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

      {/* Bottom section */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "stretch",
            minHeight: user ? 160 : "auto",
            py: user ? 0 : 1.5,
          }}
        >
          {/* Left side */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
              pr: cameFromHome ? 2 : 0,
            }}
          >
            {user ? (
              <>
                {/* Centered fields */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Stack spacing={2} sx={{ maxWidth: 500, width: "100%" }}>
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
                  </Stack>
                </Box>

                {/* Save button centered */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={saveAndContinue}
                    sx={{ width: "fit-content" }}
                  >
                    Save and Continue
                  </Button>
                </Box>
              </>
            ) : (
              // When not logged in: show login CTA instead of fields + save
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  flex: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate("/login", {
                      state: { from: location.pathname },
                    })
                  }
                  sx={{ px: 4 }}
                >
                  Log in to save your progress
                </Button>
              </Box>
            )}
          </Box>

          {/* Right side (only if from "/") */}
          {cameFromHome && (
            <>
              <Divider orientation="vertical" flexItem />

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pl: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={continueWithoutSaving}
                  sx={{ px: 4 }}
                >
                  Continue without saving
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default ConfigEditor;
