import React from 'react';
import TradeCalculator from '../components/TradeCalculator';

function Calculator() {
  return (
    <div className="calculator-page">
      <h1>Trade Calculator</h1>
      <p>Compare player values to evaluate trades.</p>
      <TradeCalculator />
    </div>
  );
}

export default Calculator;
