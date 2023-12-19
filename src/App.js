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

function App() {
  return (
    <Provider store={store} className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />

            {/* Add more routes for other content */}
          </Routes>
          <HomePage />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
