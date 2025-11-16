import React, { memo } from 'react';
import {IonImg, IonItem, IonLabel} from '@ionic/react';
import { ItemProps } from '../types/ItemProps';
import {getLogger} from "../core/logger";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const log = getLogger('Item');

const Item: React.FC<ItemPropsExt> = ({ id, name,price,dateOfProduction,isGlutenFree,photo,photoPath, location, onEdit }) => {
    log('Current item: ',id,name,price,dateOfProduction,isGlutenFree,photo,photoPath,location);
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{id}</IonLabel>
            <IonLabel>{name}</IonLabel>
            <IonLabel>{price}</IonLabel>
            <IonLabel>{new Date(dateOfProduction).toDateString()}</IonLabel>
            <IonLabel>{isGlutenFree ? 'Gluten Free' : 'Not gluten free'}</IonLabel>
            {(photo || photoPath) && (
                <IonImg src={photo || photoPath} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, margin: 6 }} />
            )}
            {location && (
                <IonLabel>
                    Location: {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
                </IonLabel>
            )}
        </IonItem>
    );
};

export default memo(Item);
