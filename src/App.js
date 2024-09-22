import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./services/store";
import PosterSelector from "./components/PosterSelector";
import PosterGallery from "./components/PosterGallery";
import UploadDiary from "./components/UploadDiary";
import GlobalDownloadButton from "./components/DownloadButton";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {
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
        }
        <GlobalDownloadButton />
      </PersistGate>
    </Provider>
  );
}

export default App;
