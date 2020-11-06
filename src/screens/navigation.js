/* eslint-disable prettier/prettier */
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {Platform, StatusBar} from 'react-native';
import {hasNotch} from 'react-native-device-info';
// console.log(StatusBar.currentHeight, '====', hasNotch());
Navigation.setDefaultOptions({
  layout: {
    orientation: ['portrait'],
  },
});
export const goToAuth = () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: 'Login',
        children: [
          {
            component: {
              name: 'stilt.introScreen',
              options: {
                topBar: {
                  visible: false,
                },
              },
            },
          },
        ],
      },
    },
  });

export const goTo = (component, props = null) => {
  Promise.all([
    Icon.getImageSource('ios-menu', 30),
    Icon.getImageSource('ios-contact', 30),
  ]).then(sources => {
    Navigation.setRoot({
      root: {
        sideMenu: {
          left: {
            component: {
              name: 'stilt.sidemenu',
              id: 'sidemenu',
            },
          },
          center: {
            stack: {
              id: 'App',
              children: [
                {
                  component: {
                    name: `stilt.${component}`,
                    passProps: {
                      ...props,
                    },
                    options: {
                      topBar: {
                        visible: true,
                        height: 0,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });
  });
};
