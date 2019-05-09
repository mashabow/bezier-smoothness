import { Action, State } from './type';

export const initialState: State = {
  bezier: {
    p0: [100, 100],
    c0: [200, 200],
    c1: [300, 200],
    p1: [400, 100],
  },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    default:
      return state
  }
}

export default reducer;
