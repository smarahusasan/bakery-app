import React, { memo } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';
import {getLogger} from "../core";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const log = getLogger('Item');

const Item: React.FC<ItemPropsExt> = ({ id, name,price,date_of_production,is_gluten_free, onEdit }) => {
    log('Current item: ',id,name,price,date_of_production,is_gluten_free);
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{id}</IonLabel>
            <IonLabel>{name}</IonLabel>
            <IonLabel>{price}</IonLabel>
            <IonLabel>{new Date(date_of_production).toDateString()}</IonLabel>
            <IonLabel>{is_gluten_free ? 'Gluten Free' : 'Not gluten free'}</IonLabel>
        </IonItem>
    );
};

export default memo(Item);
