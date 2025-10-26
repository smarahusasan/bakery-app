import {IonButton} from "@ionic/react";
import {AuthContext} from "../auth";
import {useContext} from "react";

export const LogoutButton=()=>{
    const {logout} = useContext(AuthContext);
    return <IonButton onClick={logout}>Logout</IonButton>
}