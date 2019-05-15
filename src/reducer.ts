import { Reducer } from 'use-immer';

import { satisfyG0, satisfyG1, satisfyG2 } from './calc';
import { Action, State } from './type';

export const initialState: State = {
  beziers: [
    {
      points: {
        p0: [80, 320],
        c0: [100, 130],
        c1: [330, 90],
        p1: [350, 170],
      },
      t: 0.9,
    },
    {
      points: {
        p0: [350, 250],
        c0: [460, 320],
        c1: [270, 430],
        p1: [510, 480],
      },
      t: 0.2,
    },
  ],
  draggingPoint: null,
  visibilities: {
    bezierOnly: false,
    tangent: false,
    osculatingCircle: false,
    curvatureComb: false,
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
    case 'MAKE_G0':
      draft.beziers[1].points = satisfyG0(
        draft.beziers[0].points,
        draft.beziers[1].points,
      );
      return;
    case 'MAKE_G1':
      draft.beziers[1].points = satisfyG1(
        draft.beziers[0].points,
        draft.beziers[1].points,
      );
      return;
    case 'MAKE_G2':
      draft.beziers[1].points = satisfyG2(
        draft.beziers[0].points,
        draft.beziers[1].points,
      );
      return;
    case 'RESET_POINTS':
      draft.beziers[0].points = initialState.beziers[0].points;
      draft.beziers[1].points = initialState.beziers[1].points;
      return;
    default:
      return;
  }
};

export default reducer;
