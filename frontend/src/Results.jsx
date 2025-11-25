import { Button, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";

function Results() {
  const location = useLocation();
  const scrapeData = location.state?.scrapeData;
  const navigate = useNavigate();

  if (!scrapeData) {
    return <div>No scrape data available. Please run a scrape first.</div>;
  }

  const dataset = scrapeData.data || scrapeData;

  const exportJSON = async () => {
    const res = await fetch("http://localhost:8000/api/v1/scraper/export/json?filename=data.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataset)
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportCSV = async () => {
    const res = await fetch("http://localhost:8000/api/v1/scraper/export/csv?filename=data.csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataset)
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Arrow */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Scrape Results
        </h2>
      </Box>

      
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Button variant="contained" onClick={exportJSON}>
          Export as JSON
        </Button>

        <Button variant="contained" onClick={exportCSV}>
          Export as CSV
        </Button>
      </div>

      <br/>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '14px' }}>
        {JSON.stringify(dataset, null, 2)}
      </pre>
    </div>
  );
}

export default Results;