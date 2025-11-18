import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent, IonDatetime,
  IonHeader, IonImg,
  IonInput,
  IonLoading, IonModal,
  IonPage,
  IonTitle, IonToggle,
  IonToolbar
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from '../types/ItemProps';
import {ItemContext} from "../context/ItemContext";
import {Camera} from "@capacitor/camera";
import { Filesystem, Directory } from '@capacitor/filesystem';
import Webcam from "react-webcam";
import {getLogger} from "../core/logger";
import {MapPicker} from "./MapPicker";

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
  const [photo, setPhoto] = useState<string>();
  const [location, setLocation] = useState<{lat:number,lng:number}>();

  const [showMap, setShowMap] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const [item, setItem] = useState<ItemProps>();

  const webcamRef=useRef(null);

  const handleWebcamCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhoto(imageSrc);
      setShowWebcam(false);
    }
  };

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: 'dataUrl'
    });
    setPhoto(photo.dataUrl);
    await Filesystem.writeFile({
      path: `photo_${Date.now()}.jpeg`,
      data: photo.dataUrl,
      directory: Directory.Data,
    });
  };

  const handleSelectLocation = (lat: number, lng: number) => {
    setLocation({lat, lng});
    setShowMap(false);
  };

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
      setDateOfProduction(new Date(item.dateOfProduction));
      setIsGlutenFree(item.isGlutenFree);
      if(item.photo) setPhoto(item.photo);
      if(item.location) setLocation(item.location);
    }
  }, [match.params.id, items]);
  const handleSave = useCallback(() => {
    //console.log("INAINTE DE SALVARE: ", dateOfProduction);
    const editedItem = item ? { ...item, name,price,dateOfProduction ,isGlutenFree, photo,location } : { name, price,dateOfProduction,isGlutenFree,photo,location };
    if (saveItem) {
      saveItem(editedItem)
          .then(() => {
            history.goBack();
          })
          .catch(err => {
            log('save failed', err);
          });
    }
  }, [item, saveItem, name, price, dateOfProduction, isGlutenFree,photo,location, history]);
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
        <IonDatetime
            value={dateOfProduction.toISOString()}
            onIonChange={(e) => setDateOfProduction(new Date(e.detail.value as string))}
            presentation="date"
        />
        <IonToggle
            checked={isGlutenFree}
            onIonChange={e => setIsGlutenFree(e.detail.checked)}
        >
          Gluten Free
        </IonToggle>
        <IonLoading isOpen={saving} />
        <IonButton expand="block" onClick={takePhoto}>Select Photo</IonButton>
        <IonButton expand="block" onClick={() => setShowWebcam(true)}>
          Take Photo
        </IonButton>

        <IonModal isOpen={showWebcam} onDidDismiss={() => setShowWebcam(false)}>
          <div style={{padding:20, textAlign:'center'}}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
            />
            <div style={{marginTop:16}}>
              <IonButton onClick={handleWebcamCapture}>Capture</IonButton>
              <IonButton color="medium" onClick={() => setShowWebcam(false)}>Cancel</IonButton>
            </div>
          </div>
        </IonModal>
        {photo &&
            <>
              <IonImg src={photo} />
              <IonButton
                  expand="block"
                  href={photo}
                  download={`poza_${Date.now()}.jpeg`}
              >
                Save photo on device
              </IonButton>
            </>
        }

        <IonButton expand="block" onClick={() => setShowMap(true)}>
          Select location
        </IonButton>
        {location &&
            <div>
              Location: lat {location.lat}, lng {location.lng}
            </div>
        }
        <IonModal isOpen={showMap} swipeToClose onDidDismiss={() => setShowMap(false)}>
          <div style={{padding: 20, textAlign:'center'}}>
            <h4>Select a location</h4>
            <MapPicker
                value={location}
                onSelect={loc => {
                  setLocation(loc);
                  setShowMap(false);
                }}
            />
            <IonButton onClick={() => setShowMap(false)}>Cancel</IonButton>
          </div>
        </IonModal>
        <IonLoading isOpen={saving} />
        {savingError && (
            <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
