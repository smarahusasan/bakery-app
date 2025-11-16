import {IonButton} from "@ionic/react";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

export const LogoutButton=()=>{
    const {logout} = useContext(AuthContext);
    return <IonButton onClick={logout}>Logout</IonButton>
}