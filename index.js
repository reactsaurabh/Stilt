/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens/screens';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'stilt.initializing',
            },
        },
    });
});