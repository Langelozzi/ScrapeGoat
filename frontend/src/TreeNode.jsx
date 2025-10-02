import { useState } from "react";

function TreeNode({ node, level = 0 }) {
  const [expanded, setExpanded] = useState(false);

  // Each deeper level indents more and shrinks width
  const nodeStyle = {
    marginLeft: `${level * 40}px`,
    width: `calc(100% - ${level * 40}px)`, // full width minus indent
  };

  return (
    <div className="my-3">
      {/* Node summary */}
      <div
        className="flex items-center cursor-pointer px-6 py-4 rounded-lg bg-violet-950 hover:bg-purple-800 shadow-md w-full"
        style={nodeStyle}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-mono text-emerald-300 text-lg">
          &lt;{node.tag_type}&gt;
        </span>
        <span className="ml-4 text-base text-gray-300 truncate">{node.raw}</span>
        <span className="ml-auto text-sm text-purple-300">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="mt-2 p-4 rounded-lg bg-black/70 text-sm space-y-3 shadow-inner w-full"
          style={{
            marginLeft: `${level * 20 + 20}px`,
            width: `calc(100% - ${(level + 1) * 20}px)`,
          }}
        >
          {node.body && (
            <div>
              <span className="font-bold text-purple-200">Body:</span>{" "}
              <span className="text-gray-200">{node.body}</span>
            </div>
          )}

          {Object.keys(node.htmlAttributes || {}).length > 0 && (
            <div>
              <span className="font-bold text-purple-200">Attributes:</span>
              <ul className="list-disc list-inside ml-4 text-gray-200">
                {Object.entries(node.htmlAttributes).map(([k, v]) => (
                  <li key={k}>
                    <span className="text-emerald-300">{k}</span>: {v}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Children always visible, just indented */}
      {node.children && node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
