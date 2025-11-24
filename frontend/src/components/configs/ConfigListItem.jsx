import { useState } from "react"
import { useTheme, alpha } from "@mui/material/styles"
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useNavigate } from "react-router-dom"
import { useConfigs } from "../../context/ConfigContext"

function ConfigListItem({ cfg, index, isOpen, onToggle, onEdit }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { deleteConfig } = useConfigs()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const name = cfg?.name || "<untitled>"
  const url = cfg?.url || ""
  const description = cfg?.description || ""
  const retrievalInstructions = cfg?.retrieval_instructions || []

  const handleDeleteConfirm = async () => {
    if (!cfg?.id) {
      setConfirmOpen(false)
      return
    }
    await deleteConfig(cfg.id)
    setConfirmOpen(false)
  }

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
          e.currentTarget.style.borderColor = theme.palette.primary.main
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = alpha(
            theme.palette.divider,
            0.6
          )
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
              className="font-mono text-lg leading-none truncate"
              style={{ color: theme.palette.primary.main }}
            >
              {name}
            </span>

            {url && (
              <span
                className="text-sm truncate"
                style={{ color: theme.palette.text.secondary }}
              >
                {url}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={() => {
                if (onEdit) onEdit(cfg)
                navigate("/configs/edit")
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setConfirmOpen(true)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
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
                  const preview = inst._preview || inst.preview || {}
                  const currentKey = inst?.output?.key ?? ""
                  const currentLocation = inst?.output?.location ?? "body"

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
                              style={{ color: theme.palette.text.primary }}
                            >
                              {currentKey}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Delete config?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete "{name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfigListItem
