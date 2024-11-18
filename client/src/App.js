import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import PlayerRanking from './components/PlayerRanking';
import TradeCalculator from './components/TradeCalculator';
import KeepTradeCut from './components/KeepTradeCut';
import './App.css';

// Custom hook to track page views - google analytics
function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-CQNZF6JBEK', {
      page_path: location.pathname,
    });
  }, [location]);
}

function App() {
  usePageViews(); // Call the custom hook to track page views

  return (
    <Router>
      <div className="app">
        <header>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rankings">Rankings</Link></li>
              <li><Link to="/trade-calculator">Trade Calculator</Link></li>
              <li><Link to="/keep-trade-cut">Keep Trade Cut</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/rankings" component={PlayerRanking} />
            <Route path="/trade-calculator" component={TradeCalculator} />
            <Route path="/keep-trade-cut" component={KeepTradeCut} />
          </Switch>
        </main>
        <footer>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rankings">Rankings</Link></li>
              <li><Link to="/trade-calculator">Trade Calculator</Link></li>
              <li><Link to="/keep-trade-cut">Keep Trade Cut</Link></li>
            </ul>
          </nav>
          <div className="social-links">
            <a href="https://twitter.com/willkraz" target="_blank" rel="noopener noreferrer">Twitter: @willkraz</a>
            <a href="mailto:wkrzastek05@gmail.com.com">Email: wkrzastek05@gmail.com</a>
          </div>
          <p>&copy; 2024 Choose Your Hooper. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
