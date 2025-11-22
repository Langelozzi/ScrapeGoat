import { useConfigs } from "./context/ConfigContext";

function Configs() {
  const { configs } = useConfigs();

  return (
    <div style={{ padding: "20px" }}>
      <p>{configs}</p>
    </div>
  );
}

export default Configs;
