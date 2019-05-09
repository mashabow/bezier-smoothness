import { Action, State } from './type';

export const initialState: State = {
  bezier: {
    p0: [100, 100],
    c0: [200, 200],
    c1: [300, 200],
    p1: [400, 100],
  },
  draggingPoint: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'DRAG_START':
      return {
        ...state,
        draggingPoint: action.payload,
      };
    default:
      return state
  }
}

export default reducer;
