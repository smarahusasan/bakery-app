import {getLogger} from "../core";
import React, {useCallback, useState} from "react";

const log=getLogger("AuthProvider");

type LoginFn = () => Promise<void>;

export interface AuthState {
    isAuthenticated: boolean,
    login?: LoginFn,
}

const initialState: AuthState = {
    isAuthenticated: false,
}

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children})=>{
    const [{isAuthenticated},setAuthenticated]=useState<AuthState>(initialState);
    const login=useCallback<LoginFn>(loginCallback,[]);
    const value={isAuthenticated,login};
    log('render');
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback():Promise<void>{
        log('login');
        setAuthenticated({isAuthenticated:true});
        return Promise.resolve();
    }
};