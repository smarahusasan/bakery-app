import React, {useCallback, useEffect, useState} from 'react';
import {login as loginApi} from '../api/authApi';
import {AuthContext as AuthContext1, initialState} from "../context/AuthContext";
import {getLogger} from "../core/logger";

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = ()=>void;

export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    logout?: LogoutFn;
    pendingAuthentication?: boolean;
    username?: string;
    password?: string;
    token: string;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;

    const login = useCallback<LoginFn>(loginCallback, []);
    const logout = useCallback<LogoutFn>(logoutCallback,[]);

    useEffect(checkStoredTokenEffect, []);
    useEffect(authenticationEffect, [pendingAuthentication]);

    const value = { isAuthenticated, login,logout, isAuthenticating, authenticationError, token };
    log('render');

    return (
        <AuthContext1 value={value}>
            {children}
        </AuthContext1>
    );

    function loginCallback(username?: string, password?: string): void {
        log('login');
        setState(prev => ({
            ...prev,
            pendingAuthentication: true,
            username,
            password
        }));
    }

    function logoutCallback(): void {
        log('logout');
        localStorage.removeItem('token');
        setState(initialState);
    }

    function authenticationEffect() {
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate() {
            if (!pendingAuthentication) {
                log('authenticate, !pendingAuthentication, return');
                return;
            }
            try {
                log('authenticate...');
                setState(prev => ({
                    ...prev,
                    isAuthenticating: true,
                }));
                const { username, password } = state;
                const { token } = await loginApi(username, password);
                if (canceled) {
                    return;
                }
                log('authenticate succeeded');
                localStorage.setItem('token', token);
                setState(prev => ({
                    ...prev,
                    token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false,
                    authenticationError: null,
                }));
            } catch (error) {
                if (canceled) {
                    return;
                }
                log('authenticate failed');
                setState(prev => ({
                    ...prev,
                    authenticationError: error as Error,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                }));
            }
        }
    }

    function checkStoredTokenEffect() {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            log('Found token in localStorage, auto login');
            setState({
                ...state,
                token: savedToken,
                isAuthenticated: true,
            })
        }
    }
};
