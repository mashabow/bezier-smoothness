import React from 'react';

import { Point, BezierPoints } from './type';
import styles from './Bezier.module.scss';

// 端点 p から制御点 c へと伸びるハンドル。両点も描画する
const Handle: React.FC<{p: Point, c: Point}> = ({p, c}) => {
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
      />
      <circle
        cx={c[0]} cy={c[1]}
        r={3}
      />
    </g>
  );
};

// 始点 p0, 制御点 c0, c1, 終点 p1 によって定義される 3 次ベジエ曲線
const Bezier: React.FC<BezierPoints> = ({p0, c0, c1, p1}) => {
  return (
    <g className={styles.Bezier}>
      <path
        d={`M ${p0} C ${c0} ${c1} ${p1}`}
      />
      <Handle p={p0} c={c0}/>
      <Handle p={p1} c={c1}/>
    </g>
  );
}

export default Bezier;
