import React, { memo } from 'react';
import {IonImg, IonItem, IonLabel, IonThumbnail} from '@ionic/react';
import { ItemProps } from './ItemProps';
import {getLogger} from "../core";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const log = getLogger('Item');

const Item: React.FC<ItemPropsExt> = ({ id, name,price,dateOfProduction,isGlutenFree, photoUrl,onEdit }) => {
    log('Current item: ',id,name,price,dateOfProduction,isGlutenFree, photoUrl);
    return (
        <IonItem button onClick={() => onEdit(id)}>
            {photoUrl && (
                <IonThumbnail slot="start">
                    <IonImg src={photoUrl} />
                </IonThumbnail>
            )}

            <IonLabel>
                <h2>{name}</h2>
                <p>ID: {id}</p>
                <p>Price: {price}</p>
                <p>{new Date(dateOfProduction).toDateString()}</p>
                <p>{isGlutenFree ? 'Gluten Free' : 'Not gluten free'}</p>
            </IonLabel>
        </IonItem>
    );
};

export default memo(Item);
