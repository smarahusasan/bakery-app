import {useContext, useEffect, useState} from "react";
import {IonToast} from "@ionic/react";
import {NetworkContext} from "../context/NetworkContext";

export const NetworkStatus =()=>{
    const {online} = useContext(NetworkContext);
    const [showToast, setShowToast]=useState(false);

    useEffect(()=>{
        setShowToast(true);
    },[online]);

    return (
        <IonToast
            isOpen={showToast}
            message={online ? 'You are online.' : 'You are offline.'}
            color={online ? 'success' : 'danger'}
            duration={2000}
            onDidDismiss={() => setShowToast(false)}
        />
    )
}