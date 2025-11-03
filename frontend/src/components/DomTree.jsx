import { Paper, Typography, Box } from '@mui/material';
import TreeNode from './TreeNode.jsx';

function DomTree({ tree, placeholderRoot, addToInstructions }) {
  return (
    <Paper
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
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
          DOM Tree
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 3, pt: 2 }}>
        <TreeNode
          node={tree || placeholderRoot}
          addToInstructions={addToInstructions}
        />
      </Box>
    </Paper>
  );
}

export default DomTree;
