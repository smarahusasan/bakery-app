import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthState } from './AuthProvider';
import { getLogger } from '../core';
import {RouteComponentProps} from "react-router";
import {AuthContext} from "./AuthContext";

const log = getLogger('Login');

export interface PrivateRouteProps<T = object> {
    component: React.ComponentType<T & RouteComponentProps>;
    path: string;
    exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useContext<AuthState>(AuthContext);
    log('render, isAuthenticated', isAuthenticated);
    return (
        <Route {...rest} render={props => {
            if (isAuthenticated) {
                return <Component {...props} />;
            }
            return <Redirect to={{ pathname: '/login' }}/>
        }}/>
    );
}
