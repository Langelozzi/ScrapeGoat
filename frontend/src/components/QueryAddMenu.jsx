import React from "react";
import {
  Menu,
  MenuItem,
  ListItemText,
  Divider
} from "@mui/material";

export default function QueryAddMenu({
  anchorEl,
  onClose,
  node,
  onStartCustomQuery,
  onAddAttribute,
  onQuickQuery
}) {
  const open = Boolean(anchorEl);

  const attrs = node?.html_attributes
    ? Object.keys(node.html_attributes)
    : [];

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
          onQuickQuery("SCRAPE_THIS_NODE");
          onClose();
        }}
      >
        <ListItemText primary={`Scrape this <${node.tag_type}>`} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          onQuickQuery("SCRAPE_ALL_OF_TAG");
          onClose();
        }}
      >
        <ListItemText primary={`Scrape all <${node.tag_type}> tags`} />
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          onStartCustomQuery();
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
            onAddAttribute(attr);
            onClose();
          }}
        >
          <ListItemText primary={`Add attribute: ${attr}`} />
        </MenuItem>
      ))}
    </Menu>
  );
}
