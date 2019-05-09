import React, {useContext, useCallback} from 'react';

import {Store, Provider} from './store';
import Bezier from './Bezier';
import styles from './App.module.scss';

const App: React.FC = () => {
  const {state, dispatch} = useContext(Store);
  const dispatchDragEnd = useCallback(
    () => state.draggingPoint && dispatch({type: 'DRAG_END'}),
    [dispatch, state.draggingPoint],
  );
  
  return (
    <div 
      className={styles.App}
      onMouseUp={dispatchDragEnd}
    >
      <svg width="500" height="500">
        <Bezier {...state.bezier} />
      </svg>
    </div>
  );
}

// Provider は、useContext を使う FC より外側にある必要がある
export default () => (
  <Provider>
    <App />
  </Provider>
);
