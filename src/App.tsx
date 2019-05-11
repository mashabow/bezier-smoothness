import {makeStyles} from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, {useContext, useCallback, useRef} from 'react';

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
  const svgRef = useRef<SVGSVGElement>(null);
  const {state, dispatch} = useContext(Store);
  const dispatchDrag = useCallback(
    (e: React.MouseEvent) => {
      // オフセット分を差し引いて SVG 座標系に変換する
      // getScreenCTM() を使って座標変換した方が汎用的だが、手を抜いている
      const rect = svgRef.current!.getBoundingClientRect();
      dispatch({
        type: 'DRAG',
        payload: [e.clientX - rect.left, e.clientY - rect.top],
      });
    },
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
        ref={svgRef}
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
