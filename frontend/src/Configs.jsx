import { useConfigs } from "./context/ConfigContext";

function Configs() {
  const { configs } = useConfigs();

  let prettyConfigs = configs;

  if (typeof configs === "string") {
    try {
      const parsed = JSON.parse(configs);
      prettyConfigs = JSON.stringify(parsed, null, 2);
    } catch {
      // leave as-is if it's not valid JSON
    }
  }

  return (
    <div
      style={{
        padding: "20px",
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
      }}
    >
      <p>{prettyConfigs}</p>
    </div>
  );
}

export default Configs;
