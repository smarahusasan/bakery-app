import React from "react";

export interface NetworkState{
    online: boolean;
}

export const NetworkContext = React.createContext<NetworkState>({online: navigator.onLine});