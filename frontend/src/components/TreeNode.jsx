import { useState } from "react";

function TreeNode({ node, addToInstructions = () => {}, level = 0 }) {
  const [expanded, setExpanded] = useState(false);

  if (!node) return null;

  const nodeStyle = {
    marginLeft: `${level * 40}px`,
    width: `calc(100% - ${level * 40}px)`,
  };

  const handleAdd = (e) => {
    e.stopPropagation();

    const instruction = {
      node_query: `nq_${node.id}`,
      output: {
        location: `l${level}`,
        key: node.tag_type || `k_${node.id}`,
      },
      flags: {},
      _preview: {
        id: node.id,
        tag_type: node.tag_type,
        raw: node.raw,
        level
      }  
    };

    addToInstructions(instruction);
  };

  return (
    <div className="my-3">
      <div
        className="flex items-center px-6 py-4 rounded-lg bg-violet-950 hover:bg-purple-800 shadow-md w-full cursor-pointer"
        style={nodeStyle}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-mono text-emerald-300 text-lg">
          &lt;{node.tag_type}&gt;
        </span>
        <span className="ml-4 text-base text-gray-300 truncate">{node.raw}</span>

        <div className="ml-auto flex items-center space-x-3">
          <span
            className="text-green-400 hover:text-green-300 cursor-pointer"
            onClick={handleAdd}
            title="Add to query"
          >
            ➕
          </span>

          <span className="text-sm text-purple-300 cursor-pointer">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {expanded && (
        <div
          className="mt-2 p-4 rounded-lg bg-black/70 text-sm space-y-3 shadow-inner w-full"
          style={{
            marginLeft: `${level * 20 + 20}px`,
            width: `calc(100% - ${(level + 1) * 20}px)`,
          }}
        >
          {node.hasData && node.body && (
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

          {node.retrieval_instructions?.length > 0 && (
            <div>
              <span className="font-bold text-purple-200">Retrieval:</span>
              <ul className="list-disc list-inside ml-4 text-gray-200">
                {node.retrieval_instructions.map((inst, i) => (
                  <li key={i}>{inst.action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {node.children?.length > 0 && (
        <div className="mt-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              addToInstructions={addToInstructions} // keep forwarding
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
