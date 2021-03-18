import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import TopBar from './components/TopBar';

import WidgetsComponent from './components/Widgets/Widgets';
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";

function App() {
    return (
      <div className="App">
        <Router>
          <TopBar/>
          <Switch>

            <Route path="/login">
              <Login/>
            </Route>

            <Route path="/signin">
              <Register/>
            </Route>

            <Route path="/">
                <WidgetsComponent/>
            </Route>

          </Switch>
        </Router>
      </div>
    );
}

export default App;
