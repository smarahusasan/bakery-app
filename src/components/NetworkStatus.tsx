import {useEffect, useState} from "react";
import {IonToast} from "@ionic/react";

export const NetworkStatus =()=>{
    const [online, setOnline]=useState(navigator.onLine);

    useEffect(()=>{
        const updateStatus = () =>setOnline(navigator.onLine);
        window.addEventListener('online',updateStatus);
        window.addEventListener('offline',updateStatus);
        return ()=>{
            window.removeEventListener('online',updateStatus);
            window.removeEventListener('offline',updateStatus);
        };
    },[]);

    return (
        <IonToast
            isOpen={true}
            message={online ? 'You are online.' : 'You are offline.'}
            color={online ? 'green' : 'red'}
        />
    )
}