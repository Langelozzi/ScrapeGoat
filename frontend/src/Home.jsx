import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigSelection from './components/ConfigSelection.jsx';
import { Box, Paper, Stack, Typography, TextField, Button } from '@mui/material';

function Home() {
  const [url, setUrl] = useState('');
  const [flow, setFlow] = useState('new');
  const [tree, setTree] = useState(null);
  const [retrieval_instructions, setInstructions] = useState([]);
  const lastBuiltUrlRef = useRef('');
  const navigate = useNavigate();

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
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: targetUrl }),
        }
      );
      const json = await res.json();
      setTree(json.root);
      lastBuiltUrlRef.current = targetUrl;
    } catch (err) {
      console.error('buildTree error:', err);
    }
  };

  const addToInstructions = (instruction) => {
    setInstructions((prev) => [...prev, instruction]);
  };

  const handleSetKey = (index, value) => {
    setInstructions((prev) =>
      prev.map((inst, i) =>
        i === index ? { ...inst, output: { ...(inst.output || {}), key: value } } : inst
      )
    );
  };

  const handleFlowChange = (_, val) => {
    if (val) setFlow(val);
  };

  useEffect(() => {
    if (url === lastBuiltUrlRef.current) return;
    const t = setTimeout(() => buildTree(url), 700);
    return () => clearTimeout(t);
  }, [url]);

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
              InputProps={{
                sx: {
                  fontSize: 16,
                  height: 52,
                  '& .MuiInputBase-input': { py: 1, lineHeight: 1.5 },
                },
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <ConfigSelection
        flow={flow}
        onFlowChange={handleFlowChange}
        tree={tree}
        placeholderTree={placeholderRoot}
        instructions={retrieval_instructions}
        onAddInstruction={addToInstructions}
        onSetKey={handleSetKey}
      />

      <Box
        sx={(theme) => ({
          position: 'fixed',
          right: `max(24px, env(safe-area-inset-right))`,
          bottom: `max(24px, env(safe-area-inset-bottom))`,
          zIndex: theme.zIndex.tooltip + 1,
        })}
      >
        <Button
          variant="contained"
          onClick={() => {navigate('/results')}}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: 9999,
            fontSize: '1rem',
            boxShadow: 6,
          }}
        >
          Scrape ➔
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
