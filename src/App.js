import "./App.css";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import LiveCast from "./components/LiveCast";
import Subscribe from "./components/Subscribe";
import Header from "./components/Header";
// import Fire from "./components/Fire";
import Main from "./components/Main";

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
