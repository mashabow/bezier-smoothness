import React, {useContext, useCallback} from 'react';

import {Store, Provider} from './store';
import Bezier from './Bezier';
import styles from './App.module.scss';

const App: React.FC = () => {
  const {state, dispatch} = useContext(Store);
  const dispatchDrag = useCallback(
    (e: React.MouseEvent) => dispatch({
      type: 'DRAG',
      payload: [e.clientX, e.clientY],
    }),
    [dispatch],
  );
  const dispatchDragEnd = useCallback(
    () => dispatch({type: 'DRAG_END'}),
    [dispatch],
  );
  
  return (
    <div 
      className={styles.App}
      onMouseMove={state.draggingPoint ? dispatchDrag : undefined}
      onMouseUp={state.draggingPoint ? dispatchDragEnd : undefined}
    >
      <svg
        width="500"
        height="500"
      >
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
