import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import React, { useCallback } from 'react';

import { useStore } from './store';
import { EditButtonType } from './type';

const EditButton: React.FC<{ type: EditButtonType }> = ({ type, children }) => {
  const { dispatch } = useStore();
  const dispatchAction = useCallback(() => dispatch({ type }), [
    dispatch,
    type,
  ]);

  return (
    <Button variant="outlined" color="primary" onClick={dispatchAction}>
      {children}
    </Button>
  );
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
    '@global': {
      sup: {
        // 読みにくいので微調整
        position: 'relative',
        top: -2,
        paddingRight: 1,
      },
    },
  },
});

const EditButtons: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <EditButton type="MAKE_G0">
        <i>G</i>
        <sup>0</sup>連続
      </EditButton>
      <EditButton type="MAKE_G1">
        <i>G</i>
        <sup>1</sup>連続
      </EditButton>
      <EditButton type="MAKE_G2">
        <i>G</i>
        <sup>2</sup>連続
      </EditButton>
    </div>
  );
};

export default EditButtons;
