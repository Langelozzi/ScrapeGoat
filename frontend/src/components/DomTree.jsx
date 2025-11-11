import { Paper, Typography, Box } from '@mui/material';
import TreeNode from './TreeNode.jsx';
import { Virtuoso } from 'react-virtuoso';
import { useRetrievalInstructions, useScrapeConfig } from '../context/RetrievalInstructionsContext.jsx';

function flattenTree(node, level = 0) {
  if (!node) return [];
  const current = [{ ...node, _level: level }];
  if (node.children?.length) {
    return current.concat(
      node.children.flatMap((child) => flattenTree(child, level + 1))
    );
  }
  return current;
}

function DomTree({ placeholderRoot }) {
  const { addInstruction } = useRetrievalInstructions();
  const { tree } = useScrapeConfig();

  const flatNodes = flattenTree(tree || placeholderRoot);

  return (
    <Paper
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
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
          DOM Tree
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 3, pt: 2, minWidth: 0 }}>
        <Virtuoso
          data={flatNodes}
          itemContent={(index, node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={node._level}
              addToInstructions={addInstruction}
              virtualized
            />
          )}
          style={{ height: '100%' }}
        />
      </Box>
    </Paper>
  );
}

export default DomTree;
