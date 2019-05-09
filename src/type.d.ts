export type Point = [number, number];
type PointName = 'p0' | 'c0' | 'c1' | 'p1';

type BezierPoints = {[name in PointName]: Point};

export type State = {
  bezier: BezierPoints;
  draggingPoint: PointName | null;
};

export type Action = {
  type: 'DRAG_START';
  payload: PointName;
} | {
  type: 'DRAG_END';
};
