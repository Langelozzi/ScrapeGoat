export default function Selection({ instructions = [], onSetKey }) {
  if (!instructions || instructions.length === 0) {
    return (
      <div className="w-[60rem] mt-6 p-10 rounded-2xl bg-gradient-to-br from-violet-900/60 to-indigo-950/60 text-gray-200 shadow-xl border border-white/10">
        <div className="text-xl text-purple-200 font-semibold mb-3">
          Nothing selected yet
        </div>
        <p className="text-sm opacity-80">
          Click the <span className="text-emerald-400 font-bold">➕</span> icon on any node to add it here.
        </p>
      </div>
    );
  }

  const handleKeyChange = (idx, val) => {
    if (typeof onSetKey === "function") onSetKey(idx, val);
  };

  return (
    <div className="w-[60rem] mt-6 space-y-4">
      {instructions.map((inst, idx) => {
        const pv = inst._preview || {};
        const leftPad = Math.min(5, pv.level ?? 0);
        const currentKey = inst?.output?.key ?? "";

        return (
          <div
            key={idx}
            className="relative flex items-center gap-5 px-6 py-5 rounded-xl bg-gradient-to-br from-violet-950/70 to-purple-900/60 border border-white/10 shadow-lg hover:shadow-purple-800/30 hover:border-purple-400/30 transition-all duration-200"
            style={{ marginLeft: `${leftPad * 12}px` }}
          >
            {/* Index Badge */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center shadow-md">
              {idx + 1}
            </div>

            {/* Key Input */}
            <div className="flex flex-col w-44 shrink-0">
              <label className="text-xs text-purple-300 uppercase tracking-wide mb-1">
                Key
              </label>
              <input
                type="text"
                value={currentKey}
                onChange={(e) => handleKeyChange(idx, e.target.value)}
                placeholder="enter key..."
                className="h-8 w-full px-2 rounded-md bg-violet-950/60 text-gray-100 placeholder-white/40 outline-none border border-white/10 focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/40 transition"
              />
            </div>

            {/* Node Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-emerald-300 text-lg">
                  &lt;{pv.tag_type || inst.output?.key || "node"}&gt;
                </span>
                <span className="text-sm text-gray-300 truncate">
                  {pv.raw || "(no preview available)"}
                </span>
              </div>

              {/* Metadata */}
              <div className="text-xs text-purple-200/80 mt-1 space-x-3">
                {inst.node_query && <span>query: {inst.node_query}</span>}
                {inst.output?.location && <span>location: {inst.output.location}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
