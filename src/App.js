// import "antd/dist/antd.css";

import logo from "./logo.svg";
import "./App.css";
import { Button } from "antd";
import HomePage from "./view/HomePage";
import { store } from "./redux/Store";
import { Provider } from "react-redux";
import { useAuth, AuthProvider } from "./AuthContext.js/AuthContext";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./view/Login/Login";
import NotFound from "./view/NotFound/NotFound";

function App() {
  return (
    <Provider store={store} className="App">
      <Router>
        <Routes>
          {/* ???? */}
          <Route path="/manager/*" element={<HomePage />} />
          <Route path="/login/" element={<LoginPage />} />
          {/* <HomePage /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* <HomePage /> */}
      </Router>
    </Provider>
  );
}

export default App;
