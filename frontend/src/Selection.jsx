export default function Selection({ instructions = [], onSetKey }) {
  if (!instructions || instructions.length === 0) {
    return (
      <div className="w-[60rem] mt-4 p-6 rounded-2xl bg-black/40 text-gray-200">
        <div className="text-lg text-purple-200 font-semibold mb-2">Nothing selected yet</div>
        <p className="text-sm opacity-80">
          Click the <span className="text-green-400">➕</span> icon on any node to add it here.
        </p>
      </div>
    );
  }

  const handleKeyChange = (idx, val) => {
    if (typeof onSetKey === "function") onSetKey(idx, val);
  };

  return (
    <div className="w-[60rem] mt-4 space-y-3">
      {instructions.map((inst, idx) => {
        const pv = inst._preview || {};
        const leftPad = Math.min(5, pv.level ?? 0);
        const currentKey = inst?.output?.key ?? "";

        return (
          <div
            key={idx}
            className="flex items-center px-6 py-4 rounded-lg bg-violet-950/90 shadow-md w-full gap-4"
            style={{ marginLeft: `${leftPad * 12}px` }}
          >
            {/* Inline key editor - moved to left */}
            <label className="flex flex-col items-start gap-1 shrink-0 w-40">
              <span className="text-xs text-purple-200/80">key</span>
              <input
                type="text"
                value={currentKey}
                onChange={(e) => handleKeyChange(idx, e.target.value)}
                onBlur={(e) => handleKeyChange(idx, e.target.value)}
                placeholder="enter key"
                className="h-8 w-full px-2 rounded-md bg-violet-900/70 text-gray-100 placeholder-white/40 outline-none border border-white/10 focus:border-emerald-400/60"
              />
            </label>

            <span className="text-xs text-white/60 select-none w-8 text-right">#{idx + 1}</span>

            <span className="font-mono text-emerald-300 text-lg whitespace-nowrap">
              &lt;{pv.tag_type || inst.output?.key || "node"}&gt;
            </span>

            <span className="ml-1 text-base text-gray-200 truncate flex-1 min-w-0">
              {pv.raw || "(no raw preview available)"}
            </span>

            {/* Right-side mini metadata */}
            <div className="ml-1 text-xs text-purple-200/80 shrink-0">
              {inst.node_query && <span className="mr-3">query: {inst.node_query}</span>}
              {inst.output?.location && <span>slot: {inst.output.location}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
