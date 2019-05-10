import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import React, {useContext, useCallback} from 'react';

import {Store} from './store';

const TSlider: React.FC = () => {
  const {state, dispatch} = useContext(Store);
  const dispatchSetT = useCallback(
    (_, value: number) => dispatch({type: 'SET_T', payload: value}),
    [dispatch],
  );

  return (
    <div>
      <Slider
        value={state.bezier.t}
        min={0}
        max={1}
        step={0.01}
        onChange={dispatchSetT}
      />
      <Typography variant="body1">
        t = {state.bezier.t.toFixed(2)}
      </Typography>
    </div>
  );
}

export default TSlider;
