import { useLocation } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const scrapeData = location.state?.scrapeData;

  if (!scrapeData) {
    return <div>No scrape data available. Please run a scrape first.</div>;
  }

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '14px' }}>
      {JSON.stringify(scrapeData.data || scrapeData, null, 2)}
    </pre>
  );
}

export default Results;