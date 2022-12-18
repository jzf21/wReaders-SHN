import React, { createContext, useContext } from "react";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useAuthReducer();
    
    return (
        <AuthStateContext.Provider value={state}>
        <AuthDispatchContext.Provider value={dispatch}>
            {children}
        </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
    }

const useAuthState = () => {
    const context = useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error('useAuthState must be used within a AuthProvider');
    }
    return context;
}

const useAuthDispatch = () => {
    const context = useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error('useAuthDispatch must be used within a AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuthState, useAuthDispatch };
