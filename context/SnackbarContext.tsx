import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar } from "react-native-paper";
import { Colors } from "../theme";

type SnackbarType = 'error' | 'success' | 'info';

type SnackbarContextProps = {
    showMessage: (message: string, type?: SnackbarType) => void;
};

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within a SnackbarProvider');
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<SnackbarType>('info');

    const showMessage = (msg: string, msgType: SnackbarType = 'info') => {
        setMessage(msg);
        setType(msgType);
        setVisible(true);
    };

    return (
        <SnackbarContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={Snackbar.DURATION_SHORT}
                style={{
                    backgroundColor: type === 'error' ? Colors.red[600] : type === 'success' ? Colors.green[600] : Colors.blue[600]
                }}
                action={{
                    label: 'OK',
                    onPress: () => setVisible(false),
                }}
            >
                {message}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
