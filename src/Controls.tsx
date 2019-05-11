import {makeStyles} from '@material-ui/styles';
import classnames from 'classnames';
import React from 'react';

import TSlider from './TSlider';

const useStyles = makeStyles({
  root: {
    // スライダ操作するとスクロールバーが表示されてしまうようなので、それを回避
    overflow: 'hidden',
  },
});

const Controls: React.FC<{className: string}> = ({className}) => {
  const classes = useStyles();
  
  return (
    <div className={classnames(className, classes.root)}>
      <TSlider />
    </div>
  );
};

export default Controls;
