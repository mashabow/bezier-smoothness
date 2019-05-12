import { Reducer } from 'use-immer';

import { Action, State } from './type';

export const initialState: State = {
  beziers: [
    {
      points: {
        p0: [30, 290],
        c0: [50, 120],
        c1: [250, 60],
        p1: [300, 140],
      },
      t: 0.3,
    },
    {
      points: {
        p0: [300, 210],
        c0: [370, 240],
        c1: [260, 440],
        p1: [460, 440],
      },
      t: 0.8,
    },
  ],
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
      const bezier = draft.beziers[draft.draggingPoint.index];
      bezier.points[draft.draggingPoint.name] = action.payload;
      return;
    case 'DRAG_END':
      draft.draggingPoint = null;
      return;
    case 'SET_T':
      draft.beziers[action.payload.index].t = action.payload.value;
      return;
    case 'SET_VISIBILITY':
      draft.visibilities[action.payload.key] = action.payload.value;
      return;
    default:
      return;
  }
};

export default reducer;
