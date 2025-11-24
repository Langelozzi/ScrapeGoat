import React from 'react';
import { Paper, Stack, Typography, ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ImportConfig from '../ImportConfig.jsx';
import { useRetrievalInstructions } from '../../context/RetrievalInstructionContext.jsx';
import { useNavigate } from 'react-router-dom';

function ConfigSource({ placeholderTree }) {
  const { flow, setFlow } = useRetrievalInstructions();
  const [importedFile, setImportedFile] = React.useState(null);
  const navigate = useNavigate();

  const handleFlowChange = (_, val) => {
    if (!val) return;

    setFlow(val);

    // 🔹 Auto-redirect when user selects "New Config"
    if (val === "new") {
      navigate('/configs/new', {
        state: { placeholderRoot: placeholderTree }
      });
    }
  };

  return (
    <Paper sx={{ p: 2.5, pb: 3, mb: 2 }}>
      <Stack spacing={1.8}>
        <Stack alignItems="center" textAlign="center" spacing={0.5}>
          <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.7 }}>
            Step 2
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Choose Configuration Source
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="center">
          <ToggleButtonGroup
            value={flow}
            exclusive
            onChange={handleFlowChange}
            size="small"
          >
            <ToggleButton value="new">
              <AddCircleIcon sx={{ mr: 1 }} />
              New Config
            </ToggleButton>
            <ToggleButton value="saved">
              <LibraryBooksIcon sx={{ mr: 1 }} />
              Saved Config
            </ToggleButton>
            <ToggleButton value="import">
              <UploadIcon sx={{ mr: 1 }} />
              Import .GOAT
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {flow === 'saved' && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              fontSize: '0.85rem',
              width: '100%',
              mx: 'auto',
              textAlign: 'center'
            }}
          >
            Log in to see your saved configurations!
          </Typography>
        )}

        {flow === 'import' && (
          <ImportConfig
            file={importedFile}
            onChange={setImportedFile}
            hint="Import an existing configuration file."
          />
        )}
      </Stack>
    </Paper>
  );
}

export default ConfigSource;
