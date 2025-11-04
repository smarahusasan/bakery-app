import React, {useEffect, useState} from "react";
import {NetworkContext} from "./NetworkContext";

interface NetworkProviderProps {
    children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps>= ({ children }) => {
    const [online,setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateStatus = ()=>setOnline(navigator.onLine);
        window.addEventListener("online",updateStatus);
        window.addEventListener("offline",updateStatus);

        return ()=>{
            window.removeEventListener("online",updateStatus);
            window.removeEventListener("offline",updateStatus);
        };
    }, []);

    return(
        <NetworkContext.Provider value={{online}}>
            {children}
        </NetworkContext.Provider>
    )
}