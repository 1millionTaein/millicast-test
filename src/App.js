import "./App.css";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import LiveCast from "./components/LiveCast";
import Subscribe from "./components/Subscribe";
import Main from "./components/Main";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/master" component={LiveCast} />
          <Route path="/subscribe" component={Subscribe} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
