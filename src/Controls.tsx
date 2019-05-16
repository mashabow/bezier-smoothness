import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import React from 'react';

import EditButtons from './EditButtons';
import TSlider from './TSlider';
import Visibilities from './Visibilities';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // スライダ操作するとスクロールバーが表示されてしまうようなので、それを回避
    overflow: 'hidden',
  },
});

const Controls: React.FC<{ className: string }> = ({ className }) => {
  const classes = useStyles();

  return (
    <div className={classnames(className, classes.root)}>
      <TSlider index={0} />
      <TSlider index={1} />
      <Visibilities />
      <EditButtons />
    </div>
  );
};

export default Controls;
