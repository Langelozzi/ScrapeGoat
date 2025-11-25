import { useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { useConfigs } from "../context/ConfigContext";
import { useRetrievalInstructions } from "../context/RetrievalInstructionContext.jsx";

function ConfigListItem({
  cfg,
  index,
  isOpen,
  onToggle,
  onEdit,
  // Home passes this as true so deletes there redirect to /configs/new.
  redirectOnDeleteToNewConfig = false,
  // /configs/select passes this as true to show "Select" instead of Edit/Delete
  isSelectMode = false,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteConfig } = useConfigs();
  const {
    resetConfig,
    setUrl,
    setName,
    setDescription,
    setRetrievalInstructions,
    setFlow,
    setTree,
    flow,
  } = useRetrievalInstructions();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const name = cfg?.name || "<untitled>";
  const url = cfg?.url || "";
  const description = cfg?.description || "";
  const retrievalInstructions = cfg?.retrieval_instructions || [];
  const isSaved = cfg?.saved !== false; // treat undefined as saved

  const isHome = location.pathname === "/";
  const isHomeSavedFlow = isHome && flow === "saved";

  const handleDeleteConfirm = async () => {
    // If this item represents an actual saved config with an id,
    // delete it from the backend.
    if (cfg?.id && isSaved) {
      await deleteConfig(cfg.id);
    }

    // For any "saved" config (including the Home pseudo-config),
    // clear retrieval context and optionally redirect.
    if (isSaved) {
      resetConfig();

      // Only used for Home's unsaved/pseudo config behavior
      if (redirectOnDeleteToNewConfig) {
        navigate("/configs/new", { state: { from: "/" } });
      }
    }

    setConfirmOpen(false);
  };

  const handleEditClick = () => {
    if (onEdit) onEdit(cfg);

    if (!isSaved) {
      // UNSAVED CONFIG:
      // match the same state shape Home uses for "New Config"
      // so ConfigEditor can show "Continue without saving"
      navigate("/configs/new", {
        state: {
          from: "/",
        },
      });
    } else {
      // SAVED CONFIG: normal edit flow, pass config + from so editor can preload
      navigate("/configs/edit", {
        state: {
          from: "/configs",
          config: cfg,
        },
      });
    }
  };

  const handleSelectClick = () => {
    // Load this config into retrieval instructions context
    resetConfig();

    setUrl(cfg?.url || "");
    setName(cfg?.name || null);
    setDescription(cfg?.description || null);
    setRetrievalInstructions(cfg?.retrieval_instructions || []);
    setFlow("saved");

    if (cfg?.tree) {
      setTree(cfg.tree);
    }

    // Go back to Home
    navigate("/", { replace: true });
  };

  const handleSwapClick = () => {
    // Same behavior as choosing "Saved Config" on Home
    setFlow("saved");
    navigate("/configs/select");
  };

  return (
    <>
      <div
        className="px-6 py-5 rounded-xl border transition-all duration-200"
        style={{
          borderColor: alpha(theme.palette.divider, 0.6),
          boxShadow: `0 8px 22px ${alpha(theme.palette.common.black, 0.18)}`,
          fontSize: 14,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.palette.primary.main;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = alpha(
            theme.palette.divider,
            0.6
          );
        }}
      >
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={onToggle}
        >
          <span
            style={{
              display: "inline-block",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
              fontSize: 18,
              color: theme.palette.primary.main,
            }}
          >
            ▸
          </span>

          <div className="flex items-baseline gap-3 min-w-0 flex-1">
            <span
              className="font-mono text-lg leading-tight truncate"
              style={{ color: theme.palette.primary.main }}
            >
              {name}
            </span>

            {url && (
              <span
                className="text-sm truncate"
                style={{
                  color: theme.palette.text.secondary,
                  lineHeight: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {url}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {isSelectMode ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleSelectClick}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  paddingInline: 2,
                }}
              >
                Select <span style={{ marginLeft: 4 }}>→</span>
              </Button>
            ) : (
              <>
                {/* Red "not saved" label for unsaved configs */}
                {!isSaved && (
                  <span
                    style={{
                      color: theme.palette.error.main,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    not saved
                  </span>
                )}

                {/* Edit button always visible */}
                <IconButton size="small" onClick={handleEditClick}>
                  <EditIcon fontSize="small" />
                </IconButton>

                {/* 
                  On Home + saved flow:
                  show "Swap" button instead of Delete.
                */}
                {isHomeSavedFlow ? (
                  <IconButton
                    size="small"
                    onClick={handleSwapClick}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ⇄
                  </IconButton>
                ) : (
                  // Delete button only if saved and not in the special Home+saved-case
                  isSaved && (
                    <IconButton
                      size="small"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="mt-4 space-y-4">
            {description && (
              <p
                style={{
                  color: theme.palette.text.primary,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}

            {retrievalInstructions.length > 0 && (
              <div className="space-y-3">
                {retrievalInstructions.map((inst, idx) => {
                  const preview = inst._preview || inst.preview || {};
                  const currentKey = inst?.output?.key ?? "";
                  const currentLocation = inst?.output?.location ?? "body";

                  return (
                    <div
                      key={idx}
                      className="px-4 py-3 rounded-lg border flex flex-wrap items-center gap-4"
                      style={{
                        borderColor: alpha(theme.palette.divider, 0.7),
                        backgroundColor: alpha(
                          theme.palette.background.default,
                          0.7
                        ),
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-7 h-7 rounded-full text-black text-xs font-bold flex items-center justify-center"
                          style={{
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="font-mono text-base leading-none"
                            style={{ color: theme.palette.primary.main }}
                          >
                            &lt;
                            {preview.tag_type || inst.output?.key || "node"}
                            &gt;
                          </span>

                          <span
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }}
                          >
                            {currentLocation}
                          </span>
                        </div>
                      </div>

                      {currentKey && (
                        <div className="flex-1 min-w-[8rem]">
                          <span
                            className="text-xs"
                            style={{ color: theme.palette.text.secondary }}
                          >
                            key:{" "}
                            <span
                              className="font-mono"
                              style={{
                                color: theme.palette.text.primary,
                              }}
                            >
                              {currentKey}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete config?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete "{name}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConfigListItem;
