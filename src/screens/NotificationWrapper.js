import React, {Component} from 'react';
import {Alert} from 'react-native';
import firebase from 'react-native-firebase';
export default WrappedComponent => {
  class NotificationWrapper extends Component {
    componentDidMount() {
      this.createNotificationListeners();
    }
    async createNotificationListeners() {
      /*
       * Triggered when a particular notification has been received in foreground
       * */
      this.notificationListener = firebase
        .notifications()
        .onNotification(notification => {
          const {title, body} = notification.data;
          console.log(notification, 'nl');
          const notificationToShow = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle(`${notification.title || title}`)
            .setBody(`${notification.body || body}`)
            .setData({
              ...notification.data,
            })
            .setSound('default');
          notificationToShow.android
            .setChannelId('stilt-channel')
            .android.setColor('#292077')
            .android.setSmallIcon('ic_notification');
          firebase.notifications().displayNotification(notificationToShow);
        });

      /*
       * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
       * */
      this.notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened(notificationOpen => {
          const {title, body} = notificationOpen.notification.data;
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
        const {title, body} = notificationOpen.notification.data;
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
      this.notificationListener();
      this.notificationOpenedListener();
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  return NotificationWrapper;
};
