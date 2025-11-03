import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import {NetworkStatus} from "../components/NetworkStatus";
import {LogoutButton} from "../components/LogoutButton";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  log('render');
  log('Log si mai nou:',items);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bakery App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {items && (
            <IonList>
              {items.map(item => {
                const {
                  id,
                  name,
                  price,
                  dateOfProduction,
                  isGlutenFree
                } = item;

                return (
                    <Item
                        key={id}
                        id={id}
                        name={name}
                        price={price}
                        dateOfProduction={dateOfProduction}
                        isGlutenFree={isGlutenFree}
                        onEdit={id => history.push(`/item/${id}`)}
                    />
                );
              })}
            </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <LogoutButton/>
        <NetworkStatus/>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
