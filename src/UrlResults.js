
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

function UrlResults({ created }) {
  // `created` is array of { code, original, createdAt, expiryMins }
  if (!created.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Shortening results</h3>
      {created.map((c) => {
        const expiryDate = new Date(new Date(c.createdAt).getTime() + c.expiryMins * 60000);
        return (
          <Card key={c.code} sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="subtitle1">
                Short: <a href={`http://localhost:3000/${c.code}`}>{`http://localhost:3000/${c.code}`}</a>
              </Typography>
              <Typography>Original: {c.original}</Typography>
              <Typography>Created: {new Date(c.createdAt).toLocaleString()}</Typography>
              <Typography>Expires: {expiryDate.toLocaleString()}</Typography>
              <Button
                size="small"
                onClick={() => navigator.clipboard?.writeText(`http://localhost:3000/${c.code}`)}
              >
                Copy link
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default UrlResults;
