import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { buildQuery } from "../utils/buildQuery.js";
import QueryAddMenu from "./QueryAddMenu.jsx";
import QueryBuilder from "./QueryBuilder.jsx";



function TreeNode({ node, addToInstructions = () => {}, level = 0, virtualized = false }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openBuilder, setOpenBuilder] = useState(false);
  const [outputType, setOutputType] = useState("body");

  if (!node) return null;

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
            {/* Body */}
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: theme.palette.primary.light,
                  marginBottom: 4,
                }}
              >
                Body:
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  wordBreak: "break-word",
                }}
              >
                <div
                  style={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    color:
                      node.body?.length === 0
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {node.body?.length === 0 ? "(no body)" : node.body}
                </div>

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAnchor(e.currentTarget);
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </div>

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
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- Recursively render children --- */}
      {!virtualized && node.children?.length > 0 && (
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


      <QueryAddMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        node={node}
        onStartCustomQuery={() => setOpenBuilder(true)}
        onSelectOutputType={setOutputType}

        onAddAttribute={(attr) => {
          const value = node.html_attributes?.[attr];
          const cleanAttr = attr.startsWith("@") ? attr.slice(1) : attr;

          const query = buildQuery({
            action: "SCRAPE",
            amount: "",
            tag: node.tag_type,
            conditionals: [
              { type: "IF", key: cleanAttr, value }
            ]
          });

          addToInstructions({
            node_query: query,
            output: { location: outputType, key: node.tag_type },
            flags: {},
            _preview: { id: node.id, attribute: cleanAttr, value }
          });
        }}

        onQuickQuery={(type) => {
          let query = "";
          if (type === "SCRAPE_THIS_NODE") {
            query = buildQuery({
              action: "SCRAPE",
              amount: "1",
              tag: node.tag_type,
              conditionals: [
                { type: "POSITION", value: node.position }
              ]
            });
          }

          if (type === "SCRAPE_ALL_OF_TAG") {
            query = buildQuery({ action: "SCRAPE", amount: "", tag: node.tag_type });
          }

          addToInstructions({
            node_query: query,
            output: { location: outputType, key: node.tag_type },
            flags: {}
          });
        }}
      />

      <QueryBuilder
        open={openBuilder}
        onClose={() => setOpenBuilder(false)}
        initialTag={node.tag_type}
        outputType={outputType}
        setOutputType={setOutputType}
        onSubmit={(queryObj) => {const q = buildQuery(queryObj);

        addToInstructions({
          node_query: q,
          output: { location: outputType, key: node.tag_type },
          flags: {},
        });
        }}

      />
    </div>
  );
}

export default TreeNode;