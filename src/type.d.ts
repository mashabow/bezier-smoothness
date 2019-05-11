export type Point = [number, number];
type PointName = 'p0' | 'c0' | 'c1' | 'p1';
type BezierPoints = {[name in PointName]: Point};

export type VisibilitiesKey = 'tangent' | 'normal';

export type State = {
  bezier: BezierPoints & {
    t: number;
  };
  draggingPoint: PointName | null;
  visibilities: Record<
    'tangent' | 'normal',
    boolean
  >;
};

export type Action = {
  type: 'DRAG_START';
  payload: PointName;
} | {
  type: 'DRAG',
  payload: Point,
} | {
  type: 'DRAG_END';
} | {
  type: 'SET_T';
  payload: number;
} | {
  type: 'SET_VISIBILITY';
  payload: {key: VisibilitiesKey, value: boolean};
}
