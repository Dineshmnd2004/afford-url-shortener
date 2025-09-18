// src/pages/Home.js
import React, { useState } from "react";
import Container from "@mui/material/Container";
import UrlForm from "./UrlForm";
import UrlResults from "./UrlResults";
import { simpleCode } from "./utils";
import { existsCode, addShort } from "./storage";
import logEvent from "./logger";

function Home() {
  const [created, setCreated] = useState([]);

  // takes the cleaned rows from form
  function handleBatch(rows) {
    const newCreated = [];

    for (const r of rows) {
      // determine code (validate uniqueness)
      let code = r.custom || simpleCode();

      // if custom provided, fail if exists
      if (r.custom) {
        if (existsCode(code)) {
          alert(`Shortcode "${code}" is already taken. Choose another.`);
          logEvent("short_create_fail", { reason: "custom_taken", code });
          continue; // skip this row
        }
      } else {
        // auto-generate until unique (small loop)
        let attempts = 0;
        while (existsCode(code) && attempts < 8) {
          code = simpleCode();
          attempts += 1;
        }
        if (existsCode(code)) {
          alert("Could not generate a unique code. Try again.");
          logEvent("short_create_fail", { reason: "gen_collision" });
          continue;
        }
      }

      const record = {
        original: r.original,
        createdAt: new Date().toISOString(),
        expiryMins: r.expiry,
      };

      const ok = addShort(code, record);
      if (ok) {
        newCreated.push({ code, ...record });
      } else {
        // extremely unlikely, but log
        logEvent("short_create_fail", { reason: "add_failed", code });
      }
    }

    if (newCreated.length) {
      setCreated((prev) => [...newCreated, ...prev]);
    }
  }

  return (
    <Container sx={{ py: 3 }}>
      <h2>URL Shortener</h2>
      <UrlForm onSubmitBatch={handleBatch} />
      <UrlResults created={created} />
    </Container>
  );
}

export default Home;
