import logo from './logo.svg';
import './App.css';
import Home from './components/Home'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Books from './components/Books';
import Authors from './components/Authors';
import Book from './components/Book';
import Author from './components/Author';

function App() {
  return (
    <Router>
          <div className="App">
          <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/books/:id">
            <Book />
          </Route>
          <Route path="/books">
            <Books />
          </Route>
          <Route path="/authors/:id">
            <Author />
          </Route>
          <Route path="/authors">
            <Authors />
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
