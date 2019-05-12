import { Reducer } from 'use-immer';

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

const reducer: Reducer<State, Action> = (draft, action) => {
  switch (action.type) {
    case 'DRAG_START':
      draft.draggingPoint = action.payload;
      return;
    case 'DRAG':
      if (!draft.draggingPoint) return;
      draft.bezier[draft.draggingPoint] = action.payload;
      return;
    case 'DRAG_END':
      draft.draggingPoint = null;
      return;
    case 'SET_T':
      draft.bezier.t = action.payload;
      return;
    case 'SET_VISIBILITY':
      draft.visibilities[action.payload.key] = action.payload.value;
      return;
    default:
      return;
  }
};

export default reducer;
