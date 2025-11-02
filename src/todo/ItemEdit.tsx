import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent, IonDatetime,
  IonHeader,
  IonInput, IonItem, IonLabel,
  IonLoading,
  IonPage,
  IonTitle, IonToggle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemEdit');

type ItemEditProps = RouteComponentProps<{
  id?: string;
}>

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [dateOfProduction, setDateOfProduction] = useState<Date>(new Date());
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    if(!items)
      return;
    const item = items?.find(it => it.id == routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setDateOfProduction(new Date(item.date_of_production));
      console.log(dateOfProduction);
      setIsGlutenFree(item.is_gluten_free);
    }
  }, [match.params.id, items]);
  const handleSave = useCallback(() => {
    console.log("INAINTE DE SALVARE: ", dateOfProduction);
    const editedItem = item ? { ...item, name,price,date_of_production: dateOfProduction, is_gluten_free: isGlutenFree } : { name, price,date_of_production: dateOfProduction, is_gluten_free: isGlutenFree };
    if (saveItem) {
      saveItem(editedItem)
          .then(() => {
            history.goBack();
          })
          .catch(err => {
            log('save failed', err);
          });
    }
  }, [item, saveItem, name, price, dateOfProduction, isGlutenFree, history]);
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
            value={name}
            onIonChange={e => setName(e.detail.value || '')}
        />
        <IonInput
            type="number"
            value={price}
            onIonChange={e => setPrice(parseInt(e.detail.value ?? '0'))}
        />
        <IonItem>
          <IonLabel position="stacked">Data</IonLabel>
          <IonDatetime
              value={dateOfProduction.toISOString()}
              onIonChange={(e) => setDateOfProduction(new Date(e.detail.value as string))}
              presentation="date"
          />
        </IonItem>
        <IonToggle
            checked={isGlutenFree}
            onIonChange={e => setIsGlutenFree(e.detail.checked)}
        >
          Gluten Free
        </IonToggle>
        <IonLoading isOpen={saving} />
        {savingError && (
            <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
