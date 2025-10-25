import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
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
    const item = items?.find(it => it.id === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setDateOfProduction(new Date(item.dateOfProduction));
      setIsGlutenFree(item.isGlutenFree);
    }
  }, [match.params.id, items]);
  const handleSave = useCallback(() => {
    const editedItem = item ? { ...item, name,price,dateOfProduction,isGlutenFree } : { name, price,dateOfProduction,isGlutenFree };
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
        <IonInput
            type="date"
            value={dateOfProduction ? dateOfProduction.toISOString().split('T')[0]: ''} // shows YYYY-MM-DD
            onIonChange={e => {
              const value = e.detail.value;
              if (value) setDateOfProduction(new Date(value));
            }}
        />
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
