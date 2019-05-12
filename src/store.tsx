import React, { useContext } from 'react';
import { useImmerReducer } from 'use-immer';

import reducer, { initialState } from './reducer';
import { Action } from './type';

const Store = React.createContext({
  state: initialState,
  dispatch: (() => {}) as React.Dispatch<Action>,
});

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

export const useStore = () => useContext(Store);
