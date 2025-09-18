// src/components/UrlForm.js
import React, { useState } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import logEvent from "./logger";
import { isValidUrl } from "./utils";

function UrlForm({ onSubmitBatch }) {
  // rows: up to 5 entries
  const [rows, setRows] = useState([{ original: "", expiry: "", custom: "" }]);
  const maxRows = 5;

  function changeRow(i, field, value) {
    const copy = rows.slice();
    copy[i][field] = value;
    setRows(copy);
  }

  function addRow() {
    if (rows.length >= maxRows) return;
    setRows([...rows, { original: "", expiry: "", custom: "" }]);
  }

  function removeRow(i) {
    if (rows.length === 1) return;
    setRows(rows.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // basic client validation per row
    const cleaned = rows.map((r) => ({
      original: r.original.trim(),
      expiry: r.expiry ? parseInt(r.expiry, 10) : 30, // default 30
      custom: r.custom.trim(),
    }));

    // validate entries
    for (let i = 0; i < cleaned.length; i++) {
      const r = cleaned[i];
      if (!isValidUrl(r.original)) {
        alert(`Row ${i + 1}: invalid URL`);
        logEvent("validation_error", { reason: "invalid_url", row: i + 1, value: r.original });
        return;
      }
      if (!Number.isInteger(r.expiry) || r.expiry <= 0) {
        alert(`Row ${i + 1}: expiry must be a positive integer`);
        logEvent("validation_error", { reason: "invalid_expiry", row: i + 1, value: r.expiry });
        return;
      }
      if (r.custom && !/^[A-Za-z0-9]{3,12}$/.test(r.custom)) {
        alert(`Row ${i + 1}: custom code must be alphanumeric (3-12 chars)`);
        logEvent("validation_error", { reason: "invalid_custom", row: i + 1, value: r.custom });
        return;
      }
    }

    onSubmitBatch(cleaned);
    // reset to single row
    setRows([{ original: "", expiry: "", custom: "" }]);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {rows.map((r, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <TextField
            label={`Original URL ${i + 1}`}
            value={r.original}
            onChange={(e) => changeRow(i, "original", e.target.value)}
            fullWidth
            required
          />
          <TextField
            sx={{ width: 140 }}
            label="Validity (mins)"
            type="number"
            value={r.expiry}
            onChange={(e) => changeRow(i, "expiry", e.target.value)}
          />
          <TextField
            sx={{ width: 160 }}
            label="Preferred shortcode (optional)"
            value={r.custom}
            onChange={(e) => changeRow(i, "custom", e.target.value)}
          />
          <IconButton onClick={() => removeRow(i)} size="large" aria-label="remove">
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button type="submit" variant="contained">Create short links</Button>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={addRow}
          disabled={rows.length >= maxRows}
          variant="outlined"
        >
          Add another
        </Button>
      </Box>
    </Box>
  );
}

export default UrlForm;
