import React, { memo } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, name,price,dateOfProduction,isGlutenFree, onEdit }) => {
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>{id}</IonLabel>
            <IonLabel>{name}</IonLabel>
            <IonLabel>{price}</IonLabel>
            <IonLabel>{dateOfProduction.toString()}</IonLabel>
            <IonLabel>{isGlutenFree}</IonLabel>
        </IonItem>
    );
};

export default memo(Item);
