
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadDB, addClick } from "./storage";
import { isExpired, coarseFromCoords } from "./utils";
import logEvent from "./logger";
import { Container, Typography, Button } from "@mui/material";

function Redirector() {
  const { code } = useParams();
  const [status, setStatus] = useState("checking"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function run() {
      const db = loadDB();
      const entry = db[code];

      if (!entry) {
        setStatus("failed");
        setMessage("Unknown short link.");
        logEvent("redirect_fail", { code, reason: "not_found" });
        return;
      }

      if (isExpired(entry.createdAt, entry.expiryMins)) {
        setStatus("expired");
        setMessage("This short link has expired.");
        logEvent("redirect_fail", { code, reason: "expired" });
        return;
      }

      setStatus("redirecting");
      
      const click = { time: new Date().toISOString(), referrer: document.referrer || "direct", loc: "unknown" };

      try {
        const pos = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) return resolve(null);
          navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { timeout: 3000 });
        });

        if (pos && pos.coords) {
          click.loc = coarseFromCoords(pos.coords.latitude, pos.coords.longitude);
        }
      } catch (e) {

      }

      addClick(code, click);
      logEvent("redirect_success", { code, click });

      window.location.replace(entry.original);
    }

    run();
  }, [code]);

  if (status === "checking") {
    return <Container sx={{ py: 4 }}><Typography>Checking link…</Typography></Container>;
  }
  if (status === "failed" || status === "expired") {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6">{message}</Typography>
        <Button component={Link} to="/">Back to home</Button>
      </Container>
    );
  }
  return null; 
}

export default Redirector;
