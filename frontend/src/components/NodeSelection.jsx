import { useTheme, alpha } from "@mui/material/styles";

export default function NodeSelection({ instructions = [], onSetKey }) {
  const theme = useTheme();

  if (!instructions?.length) {
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
            Click the{" "}
            <span
              style={{
                color: theme.palette.primary.main,
                fontWeight: 700,
              }}
            >
              ╋
            </span>{" "}
            icon on any node to add it here.
          </p>
        </div>
      </div>
    );
  }

  const handleKeyChange = (idx, val) => onSetKey?.(idx, val);

  return (
    <div
      className="w-full max-w-[1400px] mx-auto mt-6 space-y-4"
      style={{ paddingInline: theme.spacing(3) }}
    >
      {instructions.map((inst, idx) => {
        const pv = inst._preview || {};
        const leftPad = Math.min(5, pv.level ?? 0);
        const currentKey = inst?.output?.key ?? "";

        return (
          <div
            key={idx}
            className="relative flex items-center gap-5 px-6 py-5 rounded-xl border transition-all duration-200"
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
            {/* Index badge */}
            <div
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
              style={{ backgroundColor: theme.palette.primary.main }}
            >
              {idx + 1}
            </div>

            {/* Key input */}
            <div className="flex flex-col w-44 shrink-0">
              <label
                className="text-xs uppercase tracking-wide mb-1"
                style={{
                  color: alpha(theme.palette.text.secondary, 0.9),
                }}
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
                  backgroundColor: alpha(theme.palette.background.default, 0.9),
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

            {/* Node info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-mono text-lg"
                  style={{ color: theme.palette.primary.main }}
                >
                  &lt;{pv.tag_type || inst.output?.key || "node"}&gt;
                </span>
                <span
                  className="text-sm truncate"
                  style={{ color: theme.palette.text.secondary }}
                >
                  {pv.raw || "(no preview available)"}
                </span>
              </div>

              <div
                className="text-xs mt-1 space-x-3"
                style={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                }}
              >
                {inst.node_query && <span>query: {inst.node_query}</span>}
                {inst.output?.location && (
                  <span>location: {inst.output.location}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
