import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Calculator from './pages/Calculator';
import AddPlayer from './pages/AddPlayer';
// Import Game component when it's created
// import Game from './pages/Game';
import { anotherSharedFunction } from '../../src/sharedModule.js';

function App() {
  // Use anotherSharedFunction as needed
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/rankings" component={Rankings} />
            <Route path="/calculator" component={Calculator} />
            <Route path="/add-player" component={AddPlayer} />
            {/* Add Game route when component is created */}
            {/* <Route path="/game" component={Game} /> */}
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
