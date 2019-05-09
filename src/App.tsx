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
          <Bezier {...state.bezier} />
        </svg>
      </div>
    </Provider>
  );
}

export default App;
