import "./App.css";
import LiveCast from "./components/LiveCast";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import Subscribe from "./components/Subscribe";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LiveCast} />
          <Route path="/subscribe" component={Subscribe} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
