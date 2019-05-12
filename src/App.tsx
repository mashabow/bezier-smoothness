import { makeStyles } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import classnames from 'classnames';
import React, { useCallback, useRef } from 'react';

import { useStore, Provider } from './store';
import Bezier from './Bezier';
import Controls from './Controls';

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
  svgDragging: {
    // ドラッグしている点がカーソルに追いつかないこともあるので、
    // ドラッグ中は SVG 全体にも cursor: 'pointer' を指定して、ちらつきを防ぐ
    cursor: 'pointer',
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
  const { state, dispatch } = useStore();
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
  const dispatchDragEnd = useCallback(() => dispatch({ type: 'DRAG_END' }), [
    dispatch,
  ]);
  const dragging = Boolean(state.draggingPoint);

  return (
    <div
      className={classes.root}
      onMouseMove={dragging ? dispatchDrag : undefined}
      onMouseUp={dragging ? dispatchDragEnd : undefined}
    >
      <svg
        ref={svgRef}
        className={classnames(classes.svg, dragging && classes.svgDragging)}
        width={svgSize}
        height={svgSize}
      >
        <Bezier index={0} />
        <Bezier index={1} />
      </svg>
      <Controls className={classes.controls} />
    </div>
  );
};

// Provider は、useStore を使う FC より外側にある必要がある
export default () => (
  <Provider>
    <CssBaseline />
    <App />
  </Provider>
);
