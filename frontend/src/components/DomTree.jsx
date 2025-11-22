import { useState, useMemo } from 'react';
import { Paper, Typography, Box, TextField } from '@mui/material';
import TreeNode from './TreeNode.jsx';
import { Virtuoso } from 'react-virtuoso';
import { useRetrievalInstructions } from '../context/RetrievalInstructionContext.jsx';


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
  const { tree } = useRetrievalInstructions();
  const [filter, setFilter] = useState('');

  // Flatten the tree once
  const flatNodes = useMemo(() => flattenTree(tree || placeholderRoot), [tree, placeholderRoot]);

  // Filter nodes by tag_type, body, or attributes (case-insensitive)
  const filteredNodes = useMemo(() => {
    if (!filter) return flatNodes;

    const lowerFilter = filter.toLowerCase();

    return flatNodes.filter((node) => {
      const matchesTag = node.tag_type.toLowerCase().includes(lowerFilter);

      const matchesAttrs = node.html_attributes
        ? Object.entries(node.html_attributes).some(
            ([key, val]) =>
              key.toLowerCase().includes(lowerFilter) ||
              String(val).toLowerCase().includes(lowerFilter)
          )
        : false;

      return matchesTag || matchesAttrs;
    });
  }, [flatNodes, filter]);

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
      {/* Header + Search */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          DOM Tree
        </Typography>

        <TextField
          placeholder="Search by element or attribute..."
          size="small"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            input: { color: 'text.primary', px: 1 },
          }}
        />
      </Box>

      {/* Virtualized list */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 3, pt: 2, minWidth: 0 }}>
        <Virtuoso
          data={filteredNodes}
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