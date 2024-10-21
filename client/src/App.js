import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Calculator from './pages/Calculator';
import AddPlayer from './pages/AddPlayer';
import { someFunction } from './sharedModule';
import { anotherSharedFunction } from './sharedModule';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/add-player" element={<AddPlayer />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;