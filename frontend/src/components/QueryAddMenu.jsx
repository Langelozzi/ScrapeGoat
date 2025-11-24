import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography
} from "@mui/material";

export default function QueryAddMenu({
  anchorEl,
  onClose,
  node,
  onStartCustomQuery,
  onAddAttribute,
  onQuickQuery,
  onSelectOutputType = () => {}
}) {
  const open = Boolean(anchorEl);
  const [outputType, setOutputType] = useState("body");

  const attrs = node?.html_attributes
    ? Object.keys(node.html_attributes)
    : [];

  const handleSelectOutputType = (e) => {
    const value = e.target.value;
    setOutputType(value);
    onSelectOutputType(value);
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem
        onClick={() => {
          onQuickQuery("SCRAPE_THIS_NODE", outputType);
          onClose();
        }}
      >
        <ListItemText primary={`Scrape this <${node.tag_type}>`} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          onQuickQuery("SCRAPE_ALL_OF_TAG", outputType);
          onClose();
        }}
      >
        <ListItemText primary={`Scrape all <${node.tag_type}> tags`} />
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          onStartCustomQuery(outputType);
          onClose();
        }}
      >
        <ListItemText primary="Build custom query..." />
      </MenuItem>

      <Divider />

      {attrs.map((attr) => (
        <MenuItem
          key={attr}
          onClick={() => {
            onAddAttribute(attr, outputType);
            onClose();
          }}
        >
          <ListItemText primary={`Add attribute: ${attr}`} />
        </MenuItem>
      ))}

      {/* RADIO SECTION */}
      <Divider />

      <Box px={2} py={1}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Output field:
        </Typography>

        <RadioGroup
          value={outputType}
          onChange={handleSelectOutputType}
        >
          <FormControlLabel value="body" control={<Radio size="small" />} label="Body" />
          <FormControlLabel value="raw" control={<Radio size="small" />} label="Raw HTML" />
        </RadioGroup>
      </Box>
    </Menu>
  );
}
