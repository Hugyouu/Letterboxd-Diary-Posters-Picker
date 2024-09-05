import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PosterSelector from "./components/PosterSelector";
import PosterGallery from "./components/PosterGallery";
import UploadDiary from "./components/UploadDiary";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<UploadDiary />} />
          <Route path="/PosterSelector" element={<PosterSelector />} />
          <Route
            path="/posters/:movieName/:movieYear"
            element={<PosterGallery />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
