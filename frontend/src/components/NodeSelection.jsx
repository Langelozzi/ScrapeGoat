import { useTheme, alpha } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useRetrievalInstructions } from "../context/RetrievalInstructionContext.jsx";

export default function NodeSelection() {
  const theme = useTheme();
  const { retrievalInstructions, setKey, deleteInstruction } =
    useRetrievalInstructions();

  if (!retrievalInstructions?.length) {
    return (
      <div
        className="w-full max-w-[1400px] mx-auto mt-6"
        style={{ paddingInline: theme.spacing(3) }}
      >
        <div
          className="p-10 rounded-2xl shadow-xl border"
          style={{
            color: theme.palette.text.primary,
            borderColor: alpha(theme.palette.divider, 0.6),
          }}
        >
          <div
            className="text-xl font-semibold mb-3"
            style={{ color: theme.palette.text.primary }}
          >
            Nothing selected yet
          </div>
          <p
            className="text-sm"
            style={{ color: theme.palette.text.secondary, opacity: 0.9 }}
          >
            Click the <AddCircleOutlineIcon /> icon on any node to add it here.
          </p>
        </div>
      </div>
    );
  }

  const handleKeyChange = (idx, val) => setKey(idx, val);

  return (
    <div
      className="w-full max-w-[1400px] mx-auto mt-6 space-y-4"
      style={{ paddingInline: theme.spacing(3) }}
    >
      {retrievalInstructions.map((inst, idx) => {
        const pv = inst._preview || {};
        const currentKey = inst?.output?.key ?? "";
        const currentLocation = inst?.output?.location ?? "body";

        return (
          <div
            key={idx}
            className="relative px-6 py-5 rounded-xl border transition-all duration-200"
            style={{
              borderColor: alpha(theme.palette.divider, 0.6),
              boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.25)}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.palette.primary.main;
              e.currentTarget.style.boxShadow = `0 10px 24px ${alpha(
                theme.palette.primary.main,
                0.25
              )}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = alpha(
                theme.palette.divider,
                0.6
              );
              e.currentTarget.style.boxShadow = `0 6px 18px ${alpha(
                theme.palette.common.black,
                0.25
              )}`;
            }}
          >
            <div className="flex flex-wrap items-center gap-5">
              {/* Left row: number + tag + static location */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-full text-black text-xs font-bold flex items-center justify-center shadow-md"
                  style={{ backgroundColor: theme.palette.primary.main }}
                >
                  {idx + 1}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="font-mono text-lg leading-none"
                    style={{ color: theme.palette.primary.main }}
                  >
                    &lt;{pv.tag_type || inst.output?.key || "node"}&gt;
                  </span>

                  {/* Static location text */}
                  <span
                    className="text-sm px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    }}
                  >
                    {currentLocation}
                  </span>
                </div>
              </div>

              {/* Controls row: wraps below on small widths */}
              <div className="flex flex-wrap items-end gap-4 w-full md:w-auto md:ml-auto">
                {/* Key input */}
                <div className="flex flex-col w-[11rem] shrink-0">
                  <label
                    className="text-xs uppercase tracking-wide mb-1"
                    style={{ color: alpha(theme.palette.text.secondary, 0.9) }}
                  >
                    Key
                  </label>
                  <input
                    type="text"
                    value={currentKey}
                    onChange={(e) => handleKeyChange(idx, e.target.value)}
                    placeholder="enter key..."
                    className="h-8 w-full px-2 rounded-md outline-none transition"
                    style={{
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.9
                      ),
                      color: theme.palette.text.primary,
                      border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.9
                      )}`;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${alpha(
                        theme.palette.primary.main,
                        0.25
                      )}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = `1px solid ${alpha(
                        theme.palette.divider,
                        0.7
                      )}`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Delete button */}
                <IconButton
                  onClick={() => deleteInstruction(idx)}
                  color="error"
                  className="ml-auto"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
