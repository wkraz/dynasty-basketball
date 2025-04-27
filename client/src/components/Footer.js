import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rankings">Rankings</Link></li>
            <li><Link to="/calculator">Trade Calculator</Link></li>
            <li><Link to="/game">Keep/Trade/Cut</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your go-to source for fantasy basketball player rankings and trade analysis.</p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: wkrzastek05@gmail.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Fantasy Basketball Helper. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
