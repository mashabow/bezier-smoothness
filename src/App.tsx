import React from 'react';

import Bezier from './Bezier';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <svg width="500" height="500">
        <Bezier
          p0={[100, 100]}
          c0={[200, 200]}
          c1={[300, 200]}
          p1={[400, 100]}
        />
      </svg>
    </div>
  );
}

export default App;
