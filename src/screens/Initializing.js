/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import {goTo, goToAuth} from './navigation';
import {userInfo} from '../utils/helper';
import SplashScreen from 'react-native-splash-screen';

export default class Initialising extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
  }

  componentDidMount() {
    this.checkPermission();
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(async fcmToken => {
        // Process your token as required
        await AsyncStorage.setItem('fcmToken', fcmToken);
      });

    this.createAndroidChannel();

    this.createNotificationListeners();

    this.unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      SplashScreen.hide();
      if (user) {
        goTo('home');
      } else {
        goToAuth();
      }
    });
  }

  createAndroidChannel() {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
      'stilt-channel',
      'Stilt Channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('Stilt channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
  }
  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        console.log(notification, 'nl');

        // this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        console.log(notificationOpen, 'nOl');
        // this.showAlert(title, body);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      console.log(notificationOpen, 'no');

      // this.showAlert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.notificationListener();
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 28,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
