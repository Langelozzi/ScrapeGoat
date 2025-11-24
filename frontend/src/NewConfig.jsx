import { Box, Paper, Typography, Button, TextField, Stack, Divider } from '@mui/material';
import DomTree from './components/DomTree.jsx';
import NodeSelection from './components/NodeSelection.jsx';
import { useConfigs } from "./context/ConfigContext.jsx";
import { useState } from "react";

function NewConfig({ placeholderRoot }) {
  const { postConfig } = useConfigs();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const saveAndContinue = async () => {
    await postConfig(name, description);
  };

  const continueWithoutSaving = () => {
    // add navigation later
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100vh - 120px)', p: 2 }}>

      {/* Top: DomTree + Selection */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
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
          </Paper>
        </Box>
      </Box>

      {/* NEW FULL-WIDTH SPLIT ROW */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          
          {/* LEFT — Save section */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1.5}>
              <TextField
                label="Config Name"
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Description"
                size="small"
                fullWidth
                multiline
                minRows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button variant="outlined" onClick={saveAndContinue}>
                Save and Continue
              </Button>
            </Stack>
          </Box>

          {/* DIVIDER */}
          <Divider orientation="vertical" flexItem />

          {/* RIGHT — Skip section */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="text" onClick={continueWithoutSaving}>
              Continue without saving
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}

export default NewConfig;
