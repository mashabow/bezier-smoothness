import { Point } from './Bezier';

export interface State {
  p0: Point;
  c0: Point;
  c1: Point;
  p1: Point;
}

export const initialState: State = {
  p0: [100, 100],
  c0: [200, 200],
  c1: [300, 200],
  p1: [400, 100],
};

export type Action = {
  type: string,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    default:
      return state
  }
}

export default reducer;
