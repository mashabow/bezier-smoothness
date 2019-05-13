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

// reference と target が G0 連続になるように target を調整した場合の BezierPoints を求める
// reference.p1 と target.p0 が重なるように平行移動すればよい
export const satisfyG0 = (
  reference: BezierPoints,
  target: BezierPoints,
): BezierPoints => {
  const p0 = v(target.p0);
  const c0 = v(target.c0);
  const c1 = v(target.c1);
  const p1 = v(target.p1);

  const offset = p0.clone().subtract(v(reference.p1));
  return {
    p0: p0.subtract(offset).toArray() as Point,
    c0: c0.subtract(offset).toArray() as Point,
    c1: c1.subtract(offset).toArray() as Point,
    p1: p1.subtract(offset).toArray() as Point,
  };
};

// reference と target が G1 連続になるように target を調整した場合の BezierPoints を求める
// G0 連続にした上で、reference.c1, reference.p1 = target.p0, target.c0 の 3 点が
// 同一直線上に乗るように、target.c0 を移動すればよい
export const satisfyG1 = (
  reference: BezierPoints,
  target: BezierPoints,
): BezierPoints => {
  target = satisfyG0(reference, target);

  const referenceV = v(reference.p1).subtract(v(reference.c1));
  const targetV = v(target.c0).subtract(v(target.p0));
  // p0 を中心にして c0 を回転させる（ハンドルの長さを保つ）ことにする
  const newTargetV = targetV.rotate(referenceV.angle() - targetV.angle());
  const newC0 = newTargetV.add(v(target.p0));

  return {
    ...target,
    c0: newC0.toArray() as Point,
  };
};
