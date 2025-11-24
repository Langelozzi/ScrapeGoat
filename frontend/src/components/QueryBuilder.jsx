import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function QueryBuilder({ open, onClose, onSubmit, initialTag, outputType, setOutputType }) {
  const [action, setAction] = useState("SCRAPE");
  const [amount, setAmount] = useState("1");
  const [tag, setTag] = useState(initialTag || "");

  const [conditionals, setConditionals] = useState([]);
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    setTag(initialTag);
  }, [initialTag]);

  const addConditional = () => {
    setConditionals([...conditionals, { type: "IF", key: "", value: "" }]);
  };

  const updateConditional = (i, field, value) => {
    const next = [...conditionals];
    next[i][field] = value;
    setConditionals(next);
  };

  const removeConditional = (i) => {
    const next = [...conditionals];
    next.splice(i, 1);
    setConditionals(next);
  };

  const addFlag = () => {
    setFlags([...flags, "exclude-children"]);
  };

  const updateFlag = (i, value) => {
    const next = [...flags];
    next[i] = value;
    setFlags(next);
  };

  const removeFlag = (i) => {
    const next = [...flags];
    next.splice(i, 1);
    setFlags(next);
  };

  const handleSubmit = () => {
    // Build Goatspeak query
    const condStr = conditionals
      .map((c) => {
        switch (c.type) {
          case "IF":
            return `IF ${c.key}="${c.value}"`;
          case "NOT IF":
            return `NOT IF ${c.key}="${c.value}"`;
          case "IN":
            return `IN ${c.key}`; // key is a tag
          case "POSITION":
            return `IN POSITION=${c.value}`;
          case "NOT IN":
            return `NOT IN ${c.key}`;
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(" ");

    const query = `${action} ${amount || ""} ${tag} ${condStr};`;

    onSubmit({
      action,
      amount,
      tag,
      conditionals,
      flags,
      rawQuery: query,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Build Custom Query</DialogTitle>

      <DialogContent dividers>
        {/* Action + Amount + Tag */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select
              value={action}
              label="Action"
              onChange={(e) => setAction(e.target.value)}
            >
              <MenuItem value="SCRAPE">SCRAPE</MenuItem>
              <MenuItem value="SELECT">SELECT</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount (number or 'ALL')"
            value={amount}
            onChange={(e) => {
              const v = e.target.value.toUpperCase();

              // allow ALL
              if (v === "ALL") {
                setAmount("");
                return;
              }

              // allow only numbers
              if (/^\d+$/.test(v)) {
                setAmount(v);
              }
            }}
            fullWidth
          />

          <TextField
            label="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Conditionals */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Conditionals
        </Typography>

        {conditionals.map((c, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              alignItems: "center",
            }}
          >
            <FormControl sx={{ width: 180 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={c.type}
                label="Type"
                onChange={(e) => updateConditional(i, "type", e.target.value)}
              >
                <MenuItem value="IF">IF</MenuItem>
                <MenuItem value="NOT IF">NOT IF</MenuItem>
                <MenuItem value="IN">IN</MenuItem>
                <MenuItem value="POSITION">POSITION</MenuItem>
                <MenuItem value="NOT IN">NOT IN</MenuItem>
              </Select>
            </FormControl>

            {(c.type === "IF" || c.type === "NOT IF") && (
              <>
                <TextField
                  label="Key"
                  sx={{ width: 180 }}
                  value={c.key}
                  onChange={(e) => updateConditional(i, "key", e.target.value)}
                />
                <TextField
                  label="Value"
                  sx={{ width: 180 }}
                  value={c.value}
                  onChange={(e) => updateConditional(i, "value", e.target.value)}
                />
              </>
            )}

            {c.type === "IN" || c.type === "NOT IN" ? (
              <TextField
                label="Tag"
                sx={{ width: 180 }}
                value={c.key}
                onChange={(e) => updateConditional(i, "key", e.target.value)}
              />
            ) : null}

            {c.type === "POSITION" && (
              <TextField
                label="Position"
                sx={{ width: 180 }}
                value={c.value}
                onChange={(e) => updateConditional(i, "value", e.target.value)}
              />
            )}

            <IconButton onClick={() => removeConditional(i)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button variant="outlined" onClick={addConditional}>
          + Add Conditional
        </Button>

        <Box sx={{ height: 30 }} />

        {/* Flags */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Flags
        </Typography>

        {flags.map((f, i) => (
          <Box
            key={i}
            sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
          >
            <TextField
              label="Flag name"
              value={f}
              onChange={(e) => updateFlag(i, e.target.value)}
              sx={{ width: 250 }}
            />
            <IconButton onClick={() => removeFlag(i)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button variant="outlined" onClick={addFlag}>
          + Add Flag
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Output Type
          </Typography>

          <FormControl>
            <RadioGroup
              row
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
            >
              <FormControlLabel value="body" control={<Radio />} label="Body" />
              <FormControlLabel value="raw" control={<Radio />} label="Raw" />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Build Query
        </Button>
      </DialogActions>
    </Dialog>
  );
}