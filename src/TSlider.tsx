import { makeStyles } from '@material-ui/styles';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import React, { useCallback } from 'react';

import { useStore } from './store';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    flex: 'none',
    paddingLeft: 10,
  },
});

const TSlider: React.FC<{ index: 0 | 1 }> = ({ index }) => {
  const classes = useStyles();
  const { state, dispatch } = useStore();
  const dispatchSetT = useCallback(
    (_, value: number) =>
      dispatch({
        type: 'SET_T',
        payload: { index, value },
      }),
    [dispatch, index],
  );

  const t = state.beziers[index].t;

  return (
    <div className={classes.root}>
      <Slider value={t} min={0} max={1} step={0.01} onChange={dispatchSetT} />
      <Typography variant="body1" className={classes.label}>
        {'AB'[index]}: <i>t</i> = {t.toFixed(2)}
      </Typography>
    </div>
  );
};

export default TSlider;
