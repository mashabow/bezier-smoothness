import React, {useContext} from 'react';

import {Store, Provider} from './store';
import Bezier from './Bezier';
import styles from './App.module.scss';

const App: React.FC = () => {
  const {state} = useContext(Store);
  return (
    <Provider>
      <div className={styles.App}>
        <svg width="500" height="500">
          <Bezier
            p0={state.p0}
            c0={state.c0}
            c1={state.c1}
            p1={state.p1}
          />
        </svg>
      </div>
    </Provider>
  );
}

export default App;
