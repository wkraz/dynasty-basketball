import React from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './Home.css';

function Home() {
  const [aboutRef, isAboutVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <div className="home">
      <h1>Dynasty Hoops</h1>
      <div className="main-buttons">
        <Link to="/rankings" className="big-button">Rankings</Link>
        <Link to="/trade-calculator" className="big-button">Trade Calculator</Link>
      </div>
      <section ref={aboutRef} className={`about fade-in ${isAboutVisible ? 'visible' : ''}`}>
        <h2>About Fantasy Basketball Helper</h2>
        <p>
          Fantasy Basketball Helper is your ultimate tool for dominating your fantasy basketball league. 
          Our advanced algorithms and up-to-date player data help you make informed decisions about 
          drafting, trading, and managing your team throughout the season.
        </p>
        <p>
          Whether you're a seasoned fantasy veteran or a newcomer to the game, our tools will give you 
          the edge you need to outsmart your opponents and climb to the top of your league standings.
        </p>
      </section>
    </div>
  );
}

export default Home;
