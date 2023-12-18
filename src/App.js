// import "antd/dist/antd.css";

import logo from "./logo.svg";
import "./App.css";
import { Button } from "antd";
import HomePage from "./view/HomePage";
import { store } from "./redux/Store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store} className="App">
      <HomePage />
    </Provider>
  );
}

export default App;
