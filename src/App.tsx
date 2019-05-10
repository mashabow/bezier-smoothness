import {makeStyles} from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, {useContext, useCallback} from 'react';

import {Store, Provider} from './store';
import Bezier from './Bezier';
import TSlider from './TSlider';

const svgSize = 500;

const useStyles = makeStyles({
  root: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    // 上下中央に
    alignItems: 'center',
    height: '100vh',
  },
  svg: {
    flex: 'none',
    backgroundColor: 'white',
  },
  controls: {
    width: 300,
    height: svgSize,
    padding: 20,
    // スライダ操作するとスクロールバーが表示されてしまうようなので、それを回避
    overflow: 'hidden',
  },
});

const App: React.FC = () => {
  const classes = useStyles();
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
      className={classes.root}
      onMouseMove={state.draggingPoint ? dispatchDrag : undefined}
      onMouseUp={state.draggingPoint ? dispatchDragEnd : undefined}
    >
      <svg
        className={classes.svg}
        width={svgSize}
        height={svgSize}
      >
        <Bezier {...state.bezier} />
      </svg>
      <div className={classes.controls}>
        <TSlider />
      </div>
    </div>
  );
}

// Provider は、useContext を使う FC より外側にある必要がある
export default () => (
  <Provider>
    <CssBaseline />
    <App />
  </Provider>
);
