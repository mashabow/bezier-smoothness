import Victor from 'victor';

import { BezierPoints, Point } from './type';

// Victor が immutable になっていなくて扱いが厄介なので、
// 引数や返り値には Point を使っておく

const v = Victor.fromArray;

// t に対応するベジエ曲線上の点
export const calcTPoint = (
  { p0, c0, c1, p1 }: BezierPoints,
  t: number,
): Point =>
  v(p0)
    .multiplyScalar((1 - t) ** 3)
    .add(v(c0).multiplyScalar(3 * (1 - t) ** 2 * t))
    .add(v(c1).multiplyScalar(3 * (1 - t) * t ** 2))
    .add(v(p1).multiplyScalar(t ** 3))
    .toArray() as Point;

// 1階微分
const calcFirstDerivative = (
  { p0, c0, c1, p1 }: BezierPoints,
  t: number,
): Point =>
  v(p0)
    .multiplyScalar(-3 * t ** 2 + 6 * t - 3)
    .add(v(c0).multiplyScalar(9 * t ** 2 - 12 * t + 3))
    .add(v(c1).multiplyScalar(-9 * t ** 2 + 6 * t))
    .add(v(p1).multiplyScalar(3 * t ** 2))
    .toArray() as Point;

// 2階微分
const calcSecondDerivative = (
  { p0, c0, c1, p1 }: BezierPoints,
  t: number,
): Point =>
  v(p0)
    .multiplyScalar(-6 * t + 6)
    .add(v(c0).multiplyScalar(18 * t - 12))
    .add(v(c1).multiplyScalar(-18 * t + 6))
    .add(v(p1).multiplyScalar(6 * t))
    .toArray() as Point;

// 単位接ベクトル
export const calcUnitTangentVector = (points: BezierPoints, t: number): Point =>
  v(calcFirstDerivative(points, t))
    .normalize()
    .toArray() as Point;

// 曲率半径
export const calcCurvatureRadius = (
  points: BezierPoints,
  t: number,
): number => {
  const d1 = v(calcFirstDerivative(points, t));
  const d2 = v(calcSecondDerivative(points, t));
  const numerator = d1.lengthSq() ** 1.5;
  const denominator = d1.cross(d2);
  return numerator / denominator;
};
