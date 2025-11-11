import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigSelection from './components/ConfigSelection.jsx';
import { Box, Paper, Stack, Typography, TextField, Button } from '@mui/material';
import { useScrapeConfig } from './context/RetrievalInstructionsContext.jsx';
import DomTree from './components/DomTree.jsx';
import NodeSelection from './components/NodeSelection.jsx';

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
  } = useScrapeConfig();
  const navigate = useNavigate();

  const placeholderRoot = {
    id: 1,
    tag_type: 'html',
    children: [
      { id: 2, tag_type: 'h1', body: 'No Data Currently Displayed', hasData: true },
      { id: 3, tag_type: 'p', body: 'Please enter a URL', hasData: true },
    ],
  }

  const buildTree = async (givenUrl) => {
    const targetUrl = givenUrl ?? url;
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + '/api/v1/scraper/dom-tree/build', {
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
  }

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
  }

  useEffect(() => {
    if (url === lastBuiltUrlRef.current) return;
    const t = setTimeout(() => buildTree(url), 700);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <Box sx={{ p: 1 }}>
      {/* Step 1: URL Input */}
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

      {/* Step 2: Config Selection */}
      <ConfigSelection placeholderTree={placeholderRoot} />

      {/* Step 3: DOM Tree + Node Selection (side by side) */}
      {flow === 'new' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            height: 'calc(100vh - 250px)',
          }}
        >
          {/* DOM Tree - 2/3 width */}
          <Box sx={{ flex: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <DomTree placeholderRoot={placeholderRoot} />
          </Box>

          {/* Node Selection - 1/3 width */}
          <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Paper
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  flexShrink: 0,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Your Selection
                </Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <NodeSelection />
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Floating scrape button */}
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
          onClick={scrapeHandler}
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
