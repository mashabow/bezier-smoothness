import {makeStyles} from '@material-ui/styles';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import React, {useContext, useCallback} from 'react';

import {Store} from './store';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 'none',
    paddingLeft: 10,
  },
});

const TSlider: React.FC = () => {
  const classes = useStyles();
  const {state, dispatch} = useContext(Store);
  const dispatchSetT = useCallback(
    (_, value: number) => dispatch({type: 'SET_T', payload: value}),
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <Slider
        value={state.bezier.t}
        min={0}
        max={1}
        step={0.01}
        onChange={dispatchSetT}
      />
      <Typography
        variant="body1"
        className={classes.label}
      >
        t = {state.bezier.t.toFixed(2)}
      </Typography>
    </div>
  );
}

export default TSlider;
