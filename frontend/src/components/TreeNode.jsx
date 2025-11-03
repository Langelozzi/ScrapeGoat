import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function TreeNode({ node, addToInstructions=() => {}, level = 0 }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!node) return null;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToInstructions({
      node_query: node.retrieval_instructions || `SCRAPE 1 ${node.tag_type};`,
      output: { 
        location: `body`, 
        key: node.tag_type || `k_${node.id}` 
      },
      flags: {},
      _preview: { id: node.id, tag_type: node.tag_type, raw: node.raw, level },
    });
  };

  return (
    <div style={{ minWidth: 0, overflow: 'hidden', marginTop: level > 0 ? '8px' : '0' }}>
      <div
        className="flex flex-col px-6 py-4 rounded-lg shadow-md cursor-pointer transition-colors"
        style={{
          marginLeft: `${level * 40}px`,
          width: `calc(100% - ${level * 40}px)`,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center w-full min-w-0" style={{ overflow: 'hidden' }}>
          <span
            style={{
              fontFamily: "monospace",
              color: theme.palette.primary.main,
              fontSize: "1.05rem",
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            &lt;{node.tag_type}&gt;
          </span>

          <span
            className="ml-4 text-base"
            style={{
              color: theme.palette.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: '1 1 0%',
            }}
          >
            {node.raw}
          </span>

          <div className="flex items-center space-x-2" style={{ flexShrink: 0, marginLeft: 'auto' }}>
            <IconButton
              size="small"
              onClick={handleAdd}
              onMouseDown={(e) => e.stopPropagation()}
              sx={{
                color: theme.palette.success.main,
                "&:hover": {
                  color: theme.palette.success.light,
                  transform: "scale(1.1)",
                },
                transition: "all 0.15s ease",
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  color: theme.palette.primary.light,
                  transform: "scale(1.1)",
                },
                transition: "all 0.15s ease",
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>


        {expanded && (
          <div className="mt-3 pl-2 text-sm space-y-2" style={{ wordBreak: 'break-word' }}>
            {node.hasData && node.body && (
              <div style={{ wordBreak: 'break-word' }}>
                <span style={{ fontWeight: 600, color: theme.palette.primary.light }}>
                  Body:
                </span>{" "}
                <span style={{ color: theme.palette.text.secondary }}>{node.body}</span>
              </div>
            )}

            {Object.keys(node.htmlAttributes || {}).length > 0 && (
              <div style={{ wordBreak: 'break-word' }}>
                <span style={{ fontWeight: 600, color: theme.palette.primary.light }}>
                  Attributes:
                </span>
                <ul className="list-disc list-inside ml-4">
                  {Object.entries(node.htmlAttributes).map(([k, v]) => (
                    <li key={k} style={{ wordBreak: 'break-word' }}>
                      <span style={{ color: theme.palette.primary.main }}>{k}</span>: <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {node.retrieval_instructions?.length > 0 && (
              <div>
                <span style={{ fontWeight: 600, color: theme.palette.primary.light }}>
                  Retrieval:
                </span>
                <ul className="list-disc list-inside ml-4">
                  {node.retrieval_instructions.map((inst, i) => (
                    <li key={i}>{inst.action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

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
