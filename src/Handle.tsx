import {makeStyles} from '@material-ui/styles';
import React from 'react';

import {Point} from './type';

const useStyles = makeStyles({
  handleLine: {
    stroke: 'black',
    opacity: 0.3,
  },
  anchorPoint: {
    fill: 'white',
    stroke: 'black',
  },
  controlPoint: {
    fill: 'white',
    stroke: '#999',
  },
});

// 端点 p から制御点 c へと伸びるハンドル。両点も描画する
const Handle: React.FC<{
  p: Point,
  c: Point,
  dispatchDragStartP: () => void,
  dispatchDragStartC: () => void,
}> = ({p, c, dispatchDragStartP, dispatchDragStartC}) => {
  const classes = useStyles();
  const rectSize = 5;
  return (
    <g>
      <line
        className={classes.handleLine}
        x1={p[0]} y1={p[1]}
        x2={c[0]} y2={c[1]}
      />
      <rect
        className={classes.anchorPoint}
        x={p[0] - rectSize/2} y={p[1] - rectSize/2}
        width={rectSize} height={rectSize}
        onMouseDown={dispatchDragStartP}
      />
      <circle
        className={classes.controlPoint}
        cx={c[0]} cy={c[1]}
        r={3}
        onMouseDown={dispatchDragStartC}
      />
    </g>
  );
};

export default Handle;
