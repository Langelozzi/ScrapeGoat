import { useTheme, alpha } from "@mui/material/styles";
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRetrievalInstructions } from "../context/RetrievalInstructionContext.jsx";

export default function NodeSelection() {
  const theme = useTheme();
  const { retrievalInstructions, setKey, deleteInstruction } =
    useRetrievalInstructions();

  const handleKeyChange = (idx, val) => setKey(idx, val);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Your Selection
          </Typography>
        </Box>

        {/* Body (scroll area) */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            p: 3,
            pt: 2,
            minWidth: 0,
          }}
        >
          {retrievalInstructions.length > 0 && (
            <Stack spacing={2}>
              {retrievalInstructions.map((inst, idx) => {
                const pv = inst._preview || {};
                const currentKey = inst?.output?.key ?? "";
                const currentLocation = inst?.output?.location ?? "body";

                return (
                  <Box
                    key={idx}
                    sx={{
                      px: 2.5,
                      py: 2,
                      borderRadius: 2.5,
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        0.6
                      )}`,
                      boxShadow: `0 6px 18px ${alpha(
                        theme.palette.common.black,
                        0.25
                      )}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 10px 24px ${alpha(
                          theme.palette.primary.main,
                          0.25
                        )}`,
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Row 1 — index + tag + location + delete */}
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ flexWrap: "wrap", rowGap: 1.5 }}
                      >
                        {/* Left: index + tag + location */}
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ flexWrap: "wrap" }}
                        >
                          {/* index */}
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: "bold",
                              color: theme.palette.getContrastText(
                                theme.palette.primary.main
                              ),
                              bgcolor: theme.palette.primary.main,
                              boxShadow: 2,
                            }}
                          >
                            {idx + 1}
                          </Box>

                          {/* tag + location */}
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ flexWrap: "wrap" }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "1rem",
                                color: theme.palette.primary.main,
                                whiteSpace: "nowrap",
                              }}
                            >
                              &lt;{pv.tag_type || inst.output?.key || "node"}&gt;
                            </Typography>

                            <Box
                              sx={{
                                fontSize: 12,
                                px: 1.2,
                                py: 0.4,
                                borderRadius: 999,
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.12
                                ),
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                              }}
                            >
                              @{currentLocation}
                            </Box>
                          </Stack>
                        </Stack>

                        {/* delete */}
                        <IconButton
                          onClick={() => deleteInstruction(idx)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>

                      {/* Row 2 — KEY + inline input */}
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                            color: alpha(
                              theme.palette.text.secondary,
                              0.9
                            ),
                            whiteSpace: "nowrap",
                          }}
                        >
                          Key
                        </Typography>

                        <TextField
                          size="small"
                          fullWidth
                          value={currentKey}
                          placeholder="enter key..."
                          onChange={(e) =>
                            handleKeyChange(idx, e.target.value)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 999,
                              backgroundColor: alpha(
                                theme.palette.background.default,
                                0.9
                              ),
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
