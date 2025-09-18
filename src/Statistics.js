
import React from "react";
import { loadDB } from "./storage";
import { Container, Card, CardContent, Typography } from "@mui/material";

function Statistics() {
  const db = loadDB();
  const codes = Object.keys(db).sort((a, b) => (db[b].createdAt > db[a].createdAt ? 1 : -1));

  if (!codes.length) {
    return <Container sx={{ py: 4 }}><Typography>No short links created yet.</Typography></Container>;
  }

  return (
    <Container sx={{ py: 3 }}>
      <h2>URL Shortener — Statistics</h2>
      {codes.map((code) => {
        const e = db[code];
        return (
          <Card key={code} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Short: http://localhost:3000/{code}</Typography>
              <Typography>Original: {e.original}</Typography>
              <Typography>Created: {new Date(e.createdAt).toLocaleString()}</Typography>
              <Typography>Expiry (mins): {e.expiryMins}</Typography>
              <Typography>Total clicks: { (e.clicks || []).length }</Typography>

              <div style={{ marginTop: 8 }}>
                <strong>Clicks (latest first):</strong>
                { (e.clicks || []).slice().reverse().map((c, idx) => (
                  <div key={idx} style={{ paddingTop: 6 }}>
                    <div><small>{new Date(c.time).toLocaleString()}</small></div>
                    <div>Source: {c.referrer}</div>
                    <div>Coarse location: {c.loc}</div>
                    <hr />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}

export default Statistics;
