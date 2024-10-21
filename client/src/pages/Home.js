import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Fantasy Basketball Helper</h1>
      <p>Your one-stop shop for fantasy basketball analysis and tools.</p>
      <div className="feature-links">
        <Link to="/rankings">Player Rankings</Link>
        <Link to="/calculator">Trade Calculator</Link>
        <Link to="/game">Keep/Trade/Cut Game</Link>
      </div>
      <section className="about-section">
        <h2>About Us</h2>
        <p>Fantasy Basketball Helper provides cutting-edge analysis and tools to help you dominate your fantasy basketball league. Whether you're a seasoned veteran or a newcomer to the game, our resources will give you the edge you need to succeed.</p>
      </section>
    </div>
  );
}

export default Home;
