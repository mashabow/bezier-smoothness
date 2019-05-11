import {makeStyles} from '@material-ui/styles';
import React, {useContext, useCallback} from 'react';

import Handle from './Handle';
import {Store} from './store';
import {calcTPoint} from './calc';
import {BezierPoints, PointName} from './type';

const useStyles = makeStyles({
  root: {
    fill: 'none',
    stroke: 'black',
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
  const [tx, ty] = calcTPoint({p0, c0, c1, p1, t});
  
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
      <circle
        className={classes.tPoint}
        cx={tx}
        cy={ty}
        r={3}
      />
    </g>
  );
}

export default Bezier;
