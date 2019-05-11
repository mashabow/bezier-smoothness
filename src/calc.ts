import Victor from 'victor';

import {BezierPoints, Point} from './type';

const v = Victor.fromArray;

// t に対応するベジエ曲線上の点
export const calcTPoint =
  ({p0, c0, c1, p1}: BezierPoints, t: number): Point =>
    v(p0).multiplyScalar((1 - t) ** 3)
      .add(v(c0).multiplyScalar(3 * (1 - t) ** 2 * t))
      .add(v(c1).multiplyScalar(3 * (1 - t) * t ** 2))
      .add(v(p1).multiplyScalar(t ** 3))
      .toArray() as Point;

// t における長さ length の接線ベクトル
export const calcUnitTangentVector =
  ({p0, c0, c1, p1}: BezierPoints, t: number, length: number): Point =>
    v(p0).multiplyScalar(-3 * t ** 2 + 6 * t - 3)
      .add(v(c0).multiplyScalar(9 * t ** 2 - 12 * t + 3))
      .add(v(c1).multiplyScalar(-9 * t ** 2 + 6 * t))
      .add(v(p1).multiplyScalar(3 * t ** 2))
      .normalize()
      .multiplyScalar(length)
      .toArray() as Point;
    