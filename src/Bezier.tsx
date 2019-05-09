import React, {useContext, useCallback} from 'react';

import {Store} from './store';
import {Point, BezierPoints, PointName} from './type';
import styles from './Bezier.module.scss';

// 端点 p から制御点 c へと伸びるハンドル。両点も描画する
const Handle: React.FC<{
  p: Point,
  c: Point,
  dispatchDragStartP: () => void,
  dispatchDragStartC: () => void,
}> = ({p, c, dispatchDragStartP, dispatchDragStartC}) => {
  const rectSize = 5;
  return (
    <g className={styles.Handle}>
      <line
        x1={p[0]} y1={p[1]}
        x2={c[0]} y2={c[1]}
      />
      <rect
        x={p[0] - rectSize/2} y={p[1] - rectSize/2}
        width={rectSize} height={rectSize}
        onMouseDown={dispatchDragStartP}
      />
      <circle
        cx={c[0]} cy={c[1]}
        r={3}
        onMouseDown={dispatchDragStartC}
      />
    </g>
  );
};

// 始点 p0, 制御点 c0, c1, 終点 p1 によって定義される 3 次ベジエ曲線
const Bezier: React.FC<BezierPoints> = ({p0, c0, c1, p1}) => {
  const {dispatch} = useContext(Store);
  const dispatchDragStart = useCallback(
    (name: PointName) => () => dispatch({type: 'DRAG_START', payload: name}),
    [dispatch],
  );
  
  return (
    <g className={styles.Bezier}>
      <path
        d={`M ${p0} C ${c0} ${c1} ${p1}`}
      />
      <Handle
        p={p0}
        c={c0}
        dispatchDragStartP={dispatchDragStart('p0')}
        dispatchDragStartC={dispatchDragStart('c0')}
      />
      <Handle
        p={p1}
        c={c1}
        dispatchDragStartP={dispatchDragStart('p1')}
        dispatchDragStartC={dispatchDragStart('c1')}
      />
    </g>
  );
}

export default Bezier;
