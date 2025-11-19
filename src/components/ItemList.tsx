import '../theme/variables.css';
import React, {useContext, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  createAnimation,
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading, IonModal,
  IonPage, IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import {NetworkStatus} from "./NetworkStatus";
import {LogoutButton} from "./LogoutButton";
import {ItemContext} from "../context/ItemContext";
import {getLogger} from "../core/logger";
import {ResourceMapPicker} from "./ResourceMapPicker";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items,visibleItems,page,totalPages,setPage, fetching, fetchingError,searchTerm, setSearchTerm, filterGlutenFree, setFilterGlutenFree } = useContext(ItemContext);

  const [showMap, setShowMap] = useState(false);

  log('render');
  //log('Log si mai nou:',items);
  //log('Current items:',visibleItems)

  const spinInModal = (baseEl) => {
    return createAnimation()
        .addElement(baseEl)
        .duration(600)
        .fromTo('transform', 'rotateY(-180deg) scale(0.6)', 'rotateY(0deg) scale(1)');
  };

  const spinOutModal = (baseEl) => {
    return createAnimation()
        .addElement(baseEl)
        .duration(600)
        .fromTo('transform', 'rotateY(0deg) scale(1)', 'rotateY(180deg) scale(0.6)');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bakery App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton expand="block" onClick={() => setShowMap(true)}>
          Open map
        </IonButton>
        <IonModal
            isOpen={showMap}
            swipeToClose
            onDidDismiss={() => setShowMap(false)}
            enterAnimation={spinInModal}
            leaveAnimation={spinOutModal}
        >
          <div style={{padding: 20, textAlign:'center'}}>
            <h4>Select resource by location</h4>
            <ResourceMapPicker
                resources={items}
                onSelect={item => {
                  setShowMap(false);
                  history.push(`/item/${item.id}`);
                }}
            />
            <IonButton onClick={() => setShowMap(false)}>Cancel</IonButton>
          </div>
        </IonModal>

        <IonSearchbar value={searchTerm} onIonInput={e => setSearchTerm ? setSearchTerm(e.detail.value!) : null} />

        <IonSelect value={filterGlutenFree} onIonChange={e =>setFilterGlutenFree ? setFilterGlutenFree(e.detail.value) : null}>
          <IonSelectOption value="all">All</IonSelectOption>
          <IonSelectOption value="yes">Gluten Free</IonSelectOption>
          <IonSelectOption value="no">Not Gluten Free</IonSelectOption>
        </IonSelect>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {visibleItems && (
            <IonList>
              {visibleItems.map(item => (
                  <Item
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      dateOfProduction={item.dateOfProduction}
                      isGlutenFree={item.isGlutenFree}
                      photo={item.photo}
                      photoPath={item.photoPath}
                      location={item.location}
                      onEdit={id => history.push(`/item/${id}`)}
                  />
              ))}
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
