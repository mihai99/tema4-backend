import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
// import Login from "./components/Login";
import useToken from "./utils/useToken";
import UniqueBoard from "./components/UniqueBoard";

function App() {
  const { token, setToken } = useToken();

  // if (!token) {
  //   return <Login setToken={setToken} />;
  // }

  return (
    <div className="wrapper" style={{ height: "100%" }}>
      <BrowserRouter>
        <Switch>
          <Route path="/board/:id">
            <UniqueBoard />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
          {/* <Route path="/preferences">
            <Preferences />
          </Route> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
