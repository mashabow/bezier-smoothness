import React, {useContext, useReducer} from 'react';

import reducer, {initialState} from './reducer';
import {Action} from './type';

const Store = React.createContext({
  state: initialState,
  dispatch: (() => {}) as React.Dispatch<Action>,
});

export const Provider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{state, dispatch}}>
      {children}
    </Store.Provider>
  );
}

export const useStore = () => useContext(Store);
