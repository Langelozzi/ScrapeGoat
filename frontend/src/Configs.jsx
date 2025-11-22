import { useConfigs } from "./context/ConfigContext";

function Configs() {
  const { health } = useConfigs();

  return (
    <div style={{ padding: "20px" }}>
      <p>{health}</p>
    </div>
  );
}

export default Configs;
