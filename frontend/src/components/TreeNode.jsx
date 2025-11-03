import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function TreeNode({ node, addToInstructions = () => {}, level = 0 }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!node) return null;

  // Build query string safely
  const buildNodeQuery = () =>
    typeof node?.retrieval_instructions === "string"
      ? node.retrieval_instructions
      : `SCRAPE 1 ${node.tag_type};`;

  // --- Handle add for BODY content ---
  const handleAddBody = (e) => {
    e.stopPropagation();
    addToInstructions({
      node_query: buildNodeQuery(),
      output: { location: "body", key: node.tag_type || `k_${node.id}` },
      flags: {},
      _preview: { id: node.id, tag_type: node.tag_type, raw: node.raw, level },
    });
  };

  // --- Handle add for ATTRIBUTE ---
  const handleAddAttr = (e, attrKey) => {
    e.stopPropagation();
    addToInstructions({
      node_query: buildNodeQuery(),
      output: { location: attrKey, key: node.tag_type },
      flags: {},
      _preview: {
        id: node.id,
        tag_type: node.tag_type,
        raw: node.raw,
        level,
        attribute: attrKey,
      },
    });
  };

  const attrs =
    node?.html_attributes && typeof node.html_attributes === "object"
      ? Object.entries(node.html_attributes)
      : [];

  return (
    <div style={{ minWidth: 0, overflow: "hidden", marginTop: level > 0 ? "8px" : "0" }}>
      <div
        className="flex flex-col px-6 py-4 rounded-lg shadow-md cursor-pointer transition-colors"
        style={{
          marginLeft: `${level * 40}px`,
          width: `calc(100% - ${level * 40}px)`,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minWidth: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* --- Header row --- */}
        <div className="flex items-center w-full min-w-0" style={{ overflow: "hidden" }}>
          <span
            style={{
              fontFamily: "monospace",
              color: theme.palette.primary.main,
              fontSize: "1.05rem",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            &lt;{node.tag_type}&gt;
          </span>

          <span
            className="ml-4 text-base"
            style={{
              color: theme.palette.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: "1 1 0%",
            }}
          >
            {node.raw}
          </span>

          {/* --- Buttons --- */}
          <div className="flex items-center space-x-2" style={{ flexShrink: 0, marginLeft: "auto" }}>
            {/* BIG + → adds body */}
            <IconButton
              size="small"
              title="Add body"
              onClick={handleAddBody}
              onMouseDown={(e) => e.stopPropagation()}
              sx={{
                color: theme.palette.success.main,
                "&:hover": { color: theme.palette.success.light, transform: "scale(1.1)" },
                transition: "all 0.15s ease",
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>

            {/* Expand/collapse */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              sx={{
                color: theme.palette.primary.main,
                "&:hover": { color: theme.palette.primary.light, transform: "scale(1.1)" },
                transition: "all 0.15s ease",
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>

        {/* --- Expanded section --- */}
        {expanded && (
          <div className="mt-3 pl-2 text-sm space-y-3" style={{ wordBreak: "break-word" }}>
            {/* Attributes list */}
            <div>
              <span style={{ fontWeight: 600, color: theme.palette.primary.light }}>
                Attributes:
              </span>
              {attrs.length === 0 ? (
                <div className="ml-4" style={{ color: theme.palette.text.secondary }}>
                  (no attributes)
                </div>
              ) : (
                <ul className="list-disc list-inside ml-4">
                  {attrs.map(([k, v]) => (
                    <li key={k} className="flex items-start gap-2">
                      <div className="flex-1">
                        <span style={{ color: theme.palette.primary.main }}>{k}</span>:{" "}
                        <span>{String(v)}</span>
                      </div>
                      <IconButton
                        size="small"
                        title={`Add ${k}`}
                        onClick={(e) => handleAddAttr(e, k)}
                        onMouseDown={(e) => e.stopPropagation()}
                        sx={{
                          color: theme.palette.success.main,
                          "&:hover": { color: theme.palette.success.light, transform: "scale(1.1)" },
                          transition: "all 0.15s ease",
                        }}
                      >
                        <AddCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- Recursively render children --- */}
      {node.children?.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              addToInstructions={addToInstructions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
