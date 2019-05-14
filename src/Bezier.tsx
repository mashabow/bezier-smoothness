import { makeStyles } from '@material-ui/styles';
import React, { useCallback } from 'react';

import Handle from './Handle';
import { useStore } from './store';
import {
  calcTPoint,
  calcUnitTangentVector,
  calcCurvatureRadius,
  calcCurvatureComb,
} from './calc';
import { PointName } from './type';

const useStyles = makeStyles({
  root: {
    fill: 'none',
    stroke: 'black',
  },
  curvatureComb: {
    pointerEvents: 'none',
  },
  tangent: {
    stroke: 'blue',
  },
  normal: {
    stroke: 'red',
  },
  osculatingCircle: {
    stroke: 'teal',
  },
  tPoint: {
    fill: 'black',
    stroke: 'none',
    pointerEvents: 'none',
  },
});

const curvatureToColor = (curvature: number): string => {
  // 黄→赤 となるように適当に決めた関数
  const hue = Math.max(70 - Math.abs(curvature) * 2500, 0);
  return `hsl(${hue}, 100%, 50%)`;
};

// 始点 p0, 制御点 c0, c1, 終点 p1 によって定義される 3 次ベジエ曲線
const Bezier: React.FC<{ index: 0 | 1 }> = ({ index }) => {
  const classes = useStyles();
  const { state, dispatch } = useStore();
  const dispatchDragStart = useCallback(
    (name: PointName) => () =>
      dispatch({
        type: 'DRAG_START',
        payload: { index, name },
      }),
    [dispatch, index],
  );

  const { points, t } = state.beziers[index];
  const pt = calcTPoint(points, t);
  const tangent = calcUnitTangentVector(points, t);
  const curvatureRadius = calcCurvatureRadius(points, t);
  const normal = [-tangent[1], tangent[0]];
  const osculatingCircleCenter = [
    pt[0] + normal[0] * curvatureRadius,
    pt[1] + normal[1] * curvatureRadius,
  ];

  const frameLength = 75; // 接線・法線を表示するときの長さ
  const { p0, c0, c1, p1 } = points;

  return (
    <g className={classes.root}>
      {state.visibilities.curvatureComb && (
        <g className={classes.curvatureComb}>
          {calcCurvatureComb(points, 50, 2000).map(
            ({ start, end, curvature }, i) => (
              <line
                key={i}
                x1={start[0]}
                y1={start[1]}
                x2={end[0]}
                y2={end[1]}
                stroke={curvatureToColor(curvature)}
              />
            ),
          )}
        </g>
      )}
      <path d={`M ${p0} C ${c0} ${c1} ${p1}`} />
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
      {state.visibilities.tangent && (
        <line
          className={classes.tangent}
          x1={pt[0] - tangent[0] * frameLength}
          y1={pt[1] - tangent[1] * frameLength}
          x2={pt[0] + tangent[0] * frameLength}
          y2={pt[1] + tangent[1] * frameLength}
        />
      )}
      {state.visibilities.normal && (
        <line
          className={classes.normal}
          x1={pt[0]}
          y1={pt[1]}
          x2={pt[0] + normal[0] * frameLength}
          y2={pt[1] + normal[1] * frameLength}
        />
      )}
      {state.visibilities.osculatingCircle && (
        <g className={classes.osculatingCircle}>
          <circle
            cx={osculatingCircleCenter[0]}
            cy={osculatingCircleCenter[1]}
            r={Math.abs(curvatureRadius)}
          />
          <line
            x1={pt[0]}
            y1={pt[1]}
            x2={osculatingCircleCenter[0]}
            y2={osculatingCircleCenter[1]}
          />
        </g>
      )}
      <circle className={classes.tPoint} cx={pt[0]} cy={pt[1]} r={3} />
    </g>
  );
};

export default Bezier;
