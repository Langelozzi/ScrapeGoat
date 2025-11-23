import { Box, Paper, Typography, Button } from '@mui/material';
import DomTree from './components/DomTree.jsx';
import NodeSelection from './components/NodeSelection.jsx';
import { useConfigs } from "./context/ConfigContext.jsx";

function NewConfig({ placeholderRoot }) {
  const { postConfig } = useConfigs();

  const saveConfig = async () => {
    await postConfig("My first config");
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 120px)', p: 2 }}>
      <Box sx={{ flex: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <DomTree placeholderRoot={placeholderRoot} />
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Selection
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <NodeSelection />
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button variant="outlined" fullWidth onClick={saveConfig}>
              Save Config
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default NewConfig;
