import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ImportConfig from './components/ImportConfig.jsx';
import { useRetrievalInstructions } from './context/RetrievalInstructionContext.jsx';
import { useConfigs } from "./context/ConfigContext.jsx";
import { useTheme } from "@mui/material/styles";

function Home() {
  const theme = useTheme();
  const {
    url,
    flow,
    setFlow,
    retrievalInstructions,
  } = useRetrievalInstructions();

  const navigate = useNavigate();
  const { postConfig } = useConfigs();
  const [importedFile, setImportedFile] = useState(null);

  const placeholderRoot = {
    id: 1,
    tag_type: 'html',
    children: [
      { id: 2, tag_type: 'h1', body: 'No Data Currently Displayed', hasData: true },
      { id: 3, tag_type: 'p', body: 'Please enter a URL', hasData: true },
    ],
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

  const handleFlowChange = (_, val) => {
    if (!val) return;

    setFlow(val);

    if (val === "new") {
      navigate('/configs/new', {
        state: { placeholderRoot: placeholderRoot }
      });
    }
  };

  useEffect(() => {
    if (flow === "new") {
      setFlow("saved");
    }
  }, []);

  return (
    <Box
      sx={{
        p: 1,
        minHeight: "calc(100vh - 250px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: theme.palette.text.primary,
          margin: 0,
          paddingBottom: "1rem",
          letterSpacing: "0.5px",
        }}
      >
        ScrapeGoat
      </h1>

      <Paper
        sx={{
          p: 2.5,
          pb: 3,
          mb: 2,
          width: "100%",
          maxWidth: 700,
          borderRadius: 3
        }}
      >
        <Stack spacing={1.8}>
          <Stack alignItems="center" textAlign="center" spacing={0.5}>
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

      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={scrapeHandler}
          sx={{
            mt: 0.5,
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
    </Box>
  );
}

export default Home;
