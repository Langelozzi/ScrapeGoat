import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigSelection from './components/ConfigSelection.jsx';
import { Box, Paper, Stack, Typography, TextField, Button } from '@mui/material';
import { useRetrievalInstructions } from './context/RetrievalInstructionContext.jsx';
import { useConfigs } from "./context/ConfigContext.jsx";

function Home() {
  const {
    url,
    setUrl,
    tree,
    setTree,
    flow,
    setFlow,
    retrievalInstructions,
    lastBuiltUrlRef
  } = useRetrievalInstructions();

  const navigate = useNavigate();
  const { postConfig } = useConfigs();

  const placeholderRoot = {
    id: 1,
    tag_type: 'html',
    children: [
      { id: 2, tag_type: 'h1', body: 'No Data Currently Displayed', hasData: true },
      { id: 3, tag_type: 'p', body: 'Please enter a URL', hasData: true },
    ],
  };

  const buildTree = async (givenUrl) => {
    const targetUrl = givenUrl ?? url;
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + '/api/v1/scraper/dom-tree/build',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: targetUrl })
        }
      );

      const json = await res.json();
      setTree(json.root);
      lastBuiltUrlRef.current = targetUrl;
    } catch (err) {
      console.error('buildTree error:', err);
    }
  };

  const scrapeHandler = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + '/api/v1/scraper/scrape',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            retrieval_instructions: retrievalInstructions,
          }),
        }
      );

      const json = await res.json();
      console.log(json);
      navigate('/results', { state: { scrapeData: json } });
    } catch (err) {
      console.error('scrapeHandler error:', err);
    }
  };

  const saveConfigHandler = async () => {
    await postConfig("My first config");
  };

  useEffect(() => {
    if (url === lastBuiltUrlRef.current) return;
    const t = setTimeout(() => buildTree(url), 700);
    return () => clearTimeout(t);
  }, [url]);

  useEffect(() => {
    if (flow === "new") {
      setFlow("saved");
    }
  }, []); 

  return (
    <Box sx={{ p: 1 }}>
      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 2.5 }}>
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.7, lineHeight: 1.2 }}>
            Step 1
          </Typography>
          <Typography variant="h6">Enter Website URL</Typography>

          <Box sx={{ width: '100%', maxWidth: 760, mx: 'auto' }}>
            <TextField
              fullWidth
              label="Website URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              slotProps={{
                input: {
                  sx: {
                    fontSize: 16,
                    height: 52,
                    '& .MuiInputBase-input': { py: 1, lineHeight: 1.5 },
                  }
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <ConfigSelection placeholderTree={placeholderRoot} />

      <Paper sx={{ p: { xs: 2.5, md: 3 }, mt: 3 }}>
        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Typography
            variant="overline"
            sx={{ letterSpacing: 1.2, opacity: 0.7, lineHeight: 1.2 }}
          >
            Step 3
          </Typography>

          <Typography variant="h6">Run Scrape</Typography>

          <Button
            variant="contained"
            onClick={scrapeHandler}
            sx={{
              mt: 1,
              px: 3,
              py: 1.2,
              borderRadius: 9999,
              fontSize: '1rem',
              boxShadow: 6,
            }}
          >
            Scrape ➔
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Home;
