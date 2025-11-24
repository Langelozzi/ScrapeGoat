import { useState, useMemo } from 'react';
import { Paper, Typography, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  const { addInstruction, tree } = useRetrievalInstructions();
  const [filter, setFilter] = useState('');

  const flatNodes = useMemo(
    () => flattenTree(tree || placeholderRoot),
    [tree, placeholderRoot]
  );

  const filteredNodes = useMemo(() => {
    if (!filter) return flatNodes;

    const lowerFilter = filter.toLowerCase();

    return flatNodes.filter((node) => {
      const matchesTag = node.tag_type?.toLowerCase().includes(lowerFilter);

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
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {/* Header row: Title + Search */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
            DOM Tree
          </Typography>

          {/* Push search to the right */}
          <Box sx={{ flexGrow: 1 }} />

          <TextField
            placeholder="Search..."
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Virtualized list */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: 3,
            pt: 2,
            minWidth: 0,
          }}
        >
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
    </Box>
  );
}

export default DomTree;
