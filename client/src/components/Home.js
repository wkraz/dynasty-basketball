import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section with Buttons */}
      <section className="hero">
        <div className="hero-content">
          <h1>Choose Your Hooper</h1>
          <p>Community-driven rankings for dynasty basketball leagues</p>
          <div className="hero-buttons">
            <Link to="/rankings" className="hero-button">View Rankings</Link>
            <Link to="/calculator" className="hero-button">Trade Calculator</Link>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="info-section why-section">
        <h2>Why Choose Us?</h2>
        <div className="section-content">
          <p>Our rankings are truly democratic - powered by the dynasty basketball community. 
          We believe that collective wisdom produces the most accurate player valuations, 
          free from individual bias or manipulation.</p>
        </div>
      </section>

      {/* What You Do Section */}
      <section className="info-section what-you-do">
        <h2>What You Do</h2>
        <div className="section-content">
          <div className="step">
            <h3>1. Play Keep/Trade/Cut</h3>
            <p>Make simple choices between three players - which would you keep, trade, or cut?</p>
          </div>
          <div className="step">
            <h3>2. Let me know if you notice anything off</h3>
            <p>Please reach out to me via email or twitter if you notice any bugs or any player values that are super far off (like Lonzo Ball being rated 6700), or if a player simply is missing.</p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="info-section what-we-do">
        <h2>What We Do</h2>
        <div className="section-content">
          <p>Our sophisticated algorithm processes every keep/trade/cut decision to update player values. 
          When players are consistently "kept" over others, their value rises. When they're often "cut", 
          their value decreases. This creates a dynamic, responsive ranking system which reflects how the community values players as a whole.</p>
        </div>
      </section>

      {/* About Creator Section */}
      <section className="info-section about-creator">
        <h2>About the Creator</h2>
        <div className="section-content">
          <div className="creator-info">
            <h3>Will Krzastek</h3>
            <p>I am a sophomore at the University of Notre Dame who happens to be addicted to fantasy basketball. I also play dynasty football, and use the platform "Keep/Trade/Cut" every day. I noticed
                there is a severe lack of resources for dynasty basketball, and I wanted to create a platform to fix that. My goal is to provide the community 
            with rankings we can all trust because we all contribute to them. The more people who use this, the more accurate the rankings will be, so please play Keep/Trade/Cut!</p>
            <div className="my-team">
              <h4>My Dynasty Team (so you can judge my ball knowledge)</h4>
              <ul>
                <li>Lamelo Ball - PG</li>
                <li>Cade Cunningham - SG</li>
                <li>Brandon Miller - G</li>
                <li>Paul George- SF</li>
                <li>Khris Middleton - PF</li>
                <li>Chet Holmgren - F</li>
                <li>Nikola Vucevic - C</li>
                <li>Rui Hachimura - UTIL</li>
                <li>Isiah Hartenstein - UTIL</li>
                <li>Jalen Duren - UTIL</li>
                <li>Jaden Mcdaniels - BENCH</li>
                <li>Donovan Clingan - BENCH</li>
                <li>Nikola Topic - BENCH</li>
                <li>Moses Moody - BENCH</li>
                <li>Ochai Agbaji - BENCH</li>
                <li>Andre Drummond - BENCH</li>
                <li>Nick Richards - BENCH</li>
                <li>Aaron Gordon - BENCH</li>
                <li>Keyonte George - BENCH</li>
                <li>Jalen Wilson - BENCH</li>
                <li>Saddiq Bey - BENCH</li>
                <li>Terrence Shannon Jr. - BENCH</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
