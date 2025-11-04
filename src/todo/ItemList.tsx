import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage, IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import {NetworkStatus} from "../network/NetworkStatus";
import {LogoutButton} from "../components/LogoutButton";
import {ItemContext} from "./ItemContext";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { visibleItems,page,totalPages,setPage, fetching, fetchingError,searchTerm, setSearchTerm, filterGlutenFree, setFilterGlutenFree } = useContext(ItemContext);
  log('render');
  //log('Log si mai nou:',items);
  log('Current items:',visibleItems)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bakery App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchTerm} onIonInput={e => setSearchTerm ? setSearchTerm(e.detail.value!) : null} />

        <IonSelect value={filterGlutenFree} onIonChange={e =>setFilterGlutenFree ? setFilterGlutenFree(e.detail.value) : null}>
          <IonSelectOption value="all">All</IonSelectOption>
          <IonSelectOption value="yes">Gluten Free</IonSelectOption>
          <IonSelectOption value="no">Not Gluten Free</IonSelectOption>
        </IonSelect>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {visibleItems && (
            <IonList>
              {visibleItems?.map(item => {
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
        <div style={{marginTop: 16}}>
          <button disabled={page<=1} onClick={() => setPage ? setPage(page - 1) : null}>Prev</button>
          <span style={{margin:' 0 8px'}}>Page {page} of {totalPages}</span>
          <button disabled={page>=totalPages} onClick={() => setPage ? setPage(page+1) : null}>Next</button>
        </div>
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
