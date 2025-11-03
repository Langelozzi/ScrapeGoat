import { useTheme, alpha } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useRetrievalInstructions } from "../context/RetrievalInstructionsContext.jsx";

export default function NodeSelection() {
  const theme = useTheme();
  const { retrievalInstructions, setKey, setLocation, deleteInstruction } =
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
  const handleLocationChange = (idx, val) => setLocation(idx, val);

  return (
    <div
      className="w-full max-w-[1400px] mx-auto mt-6 space-y-4"
      style={{ paddingInline: theme.spacing(3) }}
    >
      {retrievalInstructions.map((inst, idx) => {
        const pv = inst._preview || {};
        const leftPad = Math.min(5, pv.level ?? 0);
        const currentKey = inst?.output?.key ?? "";
        const currentLocation = inst?.output?.location ?? "body";
        const attrObj = pv.attributes || pv.attrs || {};
        const attrNames = Object.keys(attrObj);
        const options = ["body", ...attrNames];

        if (currentLocation && !options.includes(currentLocation)) {
          options.push(currentLocation);
        }

        return (
          <div
            key={idx}
            className="relative px-6 py-5 rounded-xl border transition-all duration-200"
            style={{
              marginLeft: `${leftPad * 12}px`,
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
            {/* Row container with wrapping and vertical centering */}
            <div className="flex flex-wrap items-center gap-5">
              {/* Index badge + tag name (perfectly centered vertically) */}
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full text-black text-xs font-bold flex items-center justify-center shadow-md"
                  style={{ backgroundColor: theme.palette.primary.main }}
                >
                  {idx + 1}
                </div>

                <span
                  className="font-mono text-lg leading-none"
                  style={{ color: theme.palette.primary.main }}
                >
                  &lt;{pv.tag_type || inst.output?.key || "node"}&gt;
                </span>
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

                {/* Location dropdown */}
                <div className="flex flex-col w-[11rem] shrink-0">
                  <label
                    className="text-xs uppercase tracking-wide mb-1"
                    style={{ color: alpha(theme.palette.text.secondary, 0.9) }}
                  >
                    Location
                  </label>
                  <select
                    value={currentLocation}
                    onChange={(e) => handleLocationChange(idx, e.target.value)}
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
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
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
