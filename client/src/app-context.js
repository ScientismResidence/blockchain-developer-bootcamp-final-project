import React, { createContext, useReducer } from 'react';
import { status } from "./consts";

const GLOBAL_ERROR_TYPE = 'GlobalError';
const USER_TYPE = "User";
const CURRENT_GROUP_TYPE = "CurrentGroup";

const initialContext = {
    user: {
        state: status.NoConnection,
        balance: 0,
        address: undefined
    },
    setUser: () => {},
    globalError: {
        context: undefined,
        error: undefined,
        isActive: false
    },
    setGlobalError: () => {},
    currentGroup: undefined,
    setCurrentGroup: () => {}
}

const appReducer = (state, {type, payload}) => {
    switch (type) {
        case GLOBAL_ERROR_TYPE:
            return {
                ...state,
                globalError: payload
            };
        case USER_TYPE:
            return {
                ...state,
                user: payload
            }
        case CURRENT_GROUP_TYPE:
            return {
                ...state,
                currentGroup: payload
            }
        default:
            return false;
    }
};

const AppContext = createContext(initialContext);

export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
    const [store, dispatch] = useReducer(appReducer, initialContext);

    const context = {
        globalError: store.globalError,
        setGlobalError: (globalError) => {
            dispatch({ type: GLOBAL_ERROR_TYPE, payload: globalError });
        },
        user: store.user,
        setUser: (user) => {
            dispatch( {type: USER_TYPE, payload: user });
        },
        currentGroup: store.currentGroup,
        setCurrentGroup: (value) => {
            dispatch( {type: CURRENT_GROUP_TYPE, payload: value} );
        }
    };

    return <AppContext.Provider value={context}>{children}</AppContext.Provider>
};