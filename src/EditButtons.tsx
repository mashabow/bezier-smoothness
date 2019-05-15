import { makeStyles } from '@material-ui/styles';
import { PropTypes } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useCallback } from 'react';

import { useStore } from './store';
import { EditButtonType } from './type';

const EditButton: React.FC<{
  type: EditButtonType;
  color?: PropTypes.Color;
}> = ({ type, color = 'primary', children }) => {
  const { dispatch } = useStore();
  const dispatchAction = useCallback(() => dispatch({ type }), [
    dispatch,
    type,
  ]);
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      variant="outlined"
      color={color}
      onClick={dispatchAction}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 35,
    '@global': {
      sup: {
        // 読みにくいので微調整
        position: 'relative',
        top: -2,
        paddingRight: 1,
      },
    },
  },
  button: {
    marginBottom: 20,
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
      <EditButton type="RESET_POINTS" color="secondary">
        位置をリセット
      </EditButton>
    </div>
  );
};

export default EditButtons;
