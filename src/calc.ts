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

// 曲率の櫛。numTheeth 本の歯を持つように、t を等間隔にサンプリングして求める
export const calcCurvatureComb = (
  points: BezierPoints,
  numTheeth: number,
  scale: number,
): Array<{ start: Point; end: Point; curvature: number }> =>
  [...Array(numTheeth)].map((_, i) => {
    const t = i / (numTheeth - 1); // 両端（0, 1）にも割り当てる
    const tPoint = calcTPoint(points, t);
    const tangent = calcUnitTangentVector(points, t);
    const curvature = 1 / calcCurvatureRadius(points, t);
    return {
      start: tPoint,
      end: v([-tangent[1], tangent[0]]) // 単位法線ベクトル
        .multiplyScalar(-curvature * scale)
        .add(v(tPoint))
        .toArray() as Point,
      curvature,
    };
  });

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

// reference と target が G2 連続になるように target を調整した場合の BezierPoints を求める
// G1 連続にした上で、reference.p1, target.p0 それぞれにおける曲率が一致するように
// target.c0 もしくは target.c1 を移動すればよい
export const satisfyG2 = (
  reference: BezierPoints,
  target: BezierPoints,
): BezierPoints => {
  target = satisfyG1(reference, target);

  const referenceR = calcCurvatureRadius(reference, 1);
  const handle0 = v(target.c0).subtract(v(target.p0)); // p0 側のハンドル
  // 計算を簡単にするため、target を回転・平行移動し、
  // p0 が原点 (0, 0)、c0 が x 軸上 (l0, 0) に来るようにしておく（ただし l0 >= 0 とする）。
  const rotatedC1 = v(target.c1)
    .subtract(v(target.p0))
    .rotate(-handle0.angle());
  // このとき、c1 の y 座標を cy とすると、p0 における曲率半径 R との関係は R = (3 l0^2) / (2 cy) となる
  const cy = rotatedC1.y;
  if (cy * referenceR >= 0) {
    // cy と R が同符号のとき、上述の関係式を満たす l0 を求めることができる
    const newL0 = Math.sqrt((2 / 3) * cy * referenceR); // p0 側のハンドルの（調整後の）長さ
    const newC0 = handle0
      .normalize()
      .multiplyScalar(newL0)
      .add(v(target.p0));
    return {
      ...target,
      c0: newC0.toArray() as Point,
    };
  } else {
    // cy と R の符号が異なるとき、上述の関係式を満たす正の実数 l0 は存在しない
    // そこで、p1 側のハンドルの長さを変えることによって、G2 連続となるように調整することを考える
    const l0 = handle0.length();
    const newCy = ((3 / 2) * l0 ** 2) / referenceR;
    // c1 の y 座標 cy が newCy に一致するよう、c1 を動かせば（ハンドルを伸ばせば）よい
    const rotatedP1 = v(target.p1)
      .subtract(v(target.p0))
      .rotate(-handle0.angle());
    const ratio = (newCy - rotatedP1.y) / (cy - rotatedP1.y);
    const newC1 = v(target.c1)
      .subtract(v(target.p1))
      .multiplyScalar(ratio)
      .add(v(target.p1));
    return {
      ...target,
      c1: newC1.toArray() as Point,
    };
  }
};
