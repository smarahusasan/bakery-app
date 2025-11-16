import axios from 'axios';
import { config, withLogs } from '../core';
import {baseUrl} from "../core/constants";

const authUrl = `http://${baseUrl}/api/auth/login`;

export interface AuthProps {
    token: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    return withLogs(axios.post(authUrl, { username, password }, config), 'login');
}
