import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import ArticleList from './ArticleList';

function App() {
  return (
    <Router>
      <div className="app">
        {/* <nav>
          <ul>
            <li>
              <Link to="/">List</Link>
            </li>
          </ul>
        </nav> */}
        <h1 className="page-title padding-double">The New York Times</h1>
        <Route path="/" exact component={ArticleList} />
        {/* <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} /> */}
      </div>
    </Router>
  );
}

export default App;
