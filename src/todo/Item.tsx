import React, { memo } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';
import {getLogger} from "../core";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const log = getLogger('Item');

const Item: React.FC<ItemPropsExt> = ({ id, name,price,dateOfProduction,isGlutenFree, onEdit }) => {
    log('Current item: ',id,name,price,dateOfProduction,isGlutenFree);
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{id}</IonLabel>
            <IonLabel>{name}</IonLabel>
            <IonLabel>{price}</IonLabel>
            <IonLabel>{new Date(dateOfProduction).toDateString()}</IonLabel>
            <IonLabel>{isGlutenFree ? 'Gluten Free' : 'Not gluten free'}</IonLabel>
        </IonItem>
    );
};

export default memo(Item);
