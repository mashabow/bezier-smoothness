import React from 'react';

type Point = [number, number];

const Bezier: React.FC<{p0: Point, c0: Point, c1: Point, p1: Point}> = ({p0, c0, c1, p1}) => {
  return (
    <path
      d={`M ${p0} C ${c0} ${c1} ${p1}`}
      fill="none"
      stroke="black"
    />
  );
}

export default Bezier;
