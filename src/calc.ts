import Victor from 'victor';

import {BezierPoints, Point} from './type';

const v = Victor.fromArray;

export const calcTPoint = 
  ({p0, c0, c1, p1, t}: BezierPoints & {t: number}): Point =>
    v(p0).multiplyScalar((1 - t) ** 3)
      .add(v(c0).multiplyScalar(3 * (1 - t) ** 2 * t))
      .add(v(c1).multiplyScalar(3 * (1 - t) * t ** 2))
      .add(v(p1).multiplyScalar(t ** 3))
      .toArray() as Point;
