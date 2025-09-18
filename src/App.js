
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Statistics from "./Statistics";
import Redirector from "./Redirector";
import { AppBar, Toolbar, Button, Container } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Statistics />} />
        
          <Route path="/:code" element={<Redirector />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
