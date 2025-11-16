import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { ItemProvider } from './provider/ItemProvider';
import ItemEdit from './components/ItemEdit';
import {NetworkProvider} from "./provider/NetworkProvider";
import {NetworkStatus} from "./components/NetworkStatus";
import { ToastProvider } from './provider/NotifProvider';
import {AuthProvider, ItemList, Login, PrivateRoute} from "./core";

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                <NetworkProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <Route path="/login" component={Login} exact={true}/>
                            <ItemProvider>
                                <PrivateRoute component={ItemList} path="/items" exact={true}/>
                                <PrivateRoute component={ItemEdit} path="/item" exact={true}/>
                                <PrivateRoute component={ItemEdit} path="/item/:id" exact={true}/>
                            </ItemProvider>
                            <Route exact path={"/"} render={()=><Redirect to="/login"/>}/>
                        </AuthProvider>

                        <NetworkStatus/>
                    </ToastProvider>
                </NetworkProvider>
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
);

export default App;
