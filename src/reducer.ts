import { Action, State } from './type';

export const initialState: State = {
  bezier: {
    p0: [100, 100],
    c0: [200, 200],
    c1: [300, 200],
    p1: [400, 100],
    t: 0.5,
  },
  draggingPoint: null,
  visibilities: {
    tangent: false,
    normal: false,
    osculatingCircle: false,
  },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'DRAG_START':
      return {
        ...state,
        draggingPoint: action.payload,
      };
    case 'DRAG':
      if (!state.draggingPoint) break;
      return {
        ...state,
        bezier: {
          ...state.bezier,
          [state.draggingPoint]: action.payload,
        },
      };
    case 'DRAG_END':
      return {
        ...state,
        draggingPoint: null,
      };
    case 'SET_T':
      return {
        ...state,
        bezier: {
          ...state.bezier,
          t: action.payload,
        },
      };
    case 'SET_VISIBILITY':
      return {
        ...state,
        visibilities: {
          ...state.visibilities,
          [action.payload.key]: action.payload.value,
        }
      };
    default: break;
  }
  return state;
}

export default reducer;
