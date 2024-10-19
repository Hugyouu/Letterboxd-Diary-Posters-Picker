import React from "react";
import "./styles/App.scss";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./services/store";
import PosterSelector from "./components/PosterSelector";
import PosterGallery from "./components/PosterGallery";
import UploadDiary from "./components/UploadDiary";
import Cart from "./components/Cart";

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
                <Route path="/Cart" element={<Cart />} />
              </Routes>
            </div>
          </Router>
        }
      </PersistGate>
    </Provider>
  );
}

export default App;
