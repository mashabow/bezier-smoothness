import {makeStyles} from '@material-ui/styles';
import React, {useContext, useCallback} from 'react';

import Handle from './Handle';
import {Store} from './store';
import {calcTPoint, calcUnitTangentVector} from './calc';
import {BezierPoints, PointName} from './type';

const useStyles = makeStyles({
  root: {
    fill: 'none',
    stroke: 'black',
  },
  tangent: {
    stroke: 'blue',
  },
  normal: {
    stroke: 'red',
  },
  tPoint: {
    fill: 'black',
    stroke: 'none',
  },
});

type Props = BezierPoints & {t: number};

// 始点 p0, 制御点 c0, c1, 終点 p1 によって定義される 3 次ベジエ曲線
const Bezier: React.FC<Props> = ({p0, c0, c1, p1, t}) => {
  const classes = useStyles();
  const {dispatch} = useContext(Store);
  const dispatchDragStart = useCallback(
    (name: PointName) => () => dispatch({type: 'DRAG_START', payload: name}),
    [dispatch],
  );
  
  const pt = calcTPoint({p0, c0, c1, p1}, t);
  const tangent = calcUnitTangentVector({p0, c0, c1, p1}, t, 75);
  const normal = [-tangent[1], tangent[0]];
  
  return (
    <g className={classes.root}>
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
      <line
        className={classes.tangent}
        x1={pt[0] - tangent[0]}
        y1={pt[1] - tangent[1]}
        x2={pt[0] + tangent[0]}
        y2={pt[1] + tangent[1]}
      />
      <line
        className={classes.normal}
        x1={pt[0]}
        y1={pt[1]}
        x2={pt[0] + normal[0]}
        y2={pt[1] + normal[1]}
      />
      <circle
        className={classes.tPoint}
        cx={pt[0]}
        cy={pt[1]}
        r={3}
      />
    </g>
  );
}

export default Bezier;
