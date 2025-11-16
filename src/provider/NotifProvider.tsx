import React, { createContext, useContext, useState } from 'react';
import { IonToast } from '@ionic/react';

interface NotifContextProps {
    showToast: (message: string, duration?: number) => void;
}

const NotifContext = createContext<NotifContextProps>({
    showToast: () => {}
});

export const useToast = () => useContext(NotifContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string>('');
    const [show, setShow] = useState(false);
    const [duration, setDuration] = useState(2000);

    const showToast = (message: string, durationMs = 2000) => {
        setToastMessage(message);
        setDuration(durationMs);
        setShow(true);
    };

    return (
        <NotifContext.Provider value={{ showToast }}>
            {children}
            <IonToast
                isOpen={show}
                message={toastMessage}
                duration={duration}
                onDidDismiss={() => setShow(false)}
                position="top"
                color="primary"
            />
        </NotifContext.Provider>
    );
};