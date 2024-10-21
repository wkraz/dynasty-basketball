import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/rankings">Rankings</Link></li>
          <li><Link to="/calculator">Trade Calculator</Link></li>
          <li><Link to="/game">Keep/Trade/Cut</Link></li>
          <li><Link to="/add-player">Add Player</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

