/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
import {Dimensions} from 'react-native';
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';
import {PRIMARY} from './colors';

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const showSnackbar = (msg, color = '#fff', actionBtnColor = PRIMARY) => {
  Snackbar.show({
    title: msg,
    duration: Snackbar.LENGTH_SHORT,
    color,
    action: {
      title: 'Close',
      color: actionBtnColor,
      onPress: () => {
        /* Do something. */
      },
    },
  });
};

export const isStringEmpty = text => {
  return (
    typeof text == 'undefined' ||
    text == null ||
    text == false || //same as: !x
    text.length == 0 ||
    text == '' ||
    text.replace(/\s/g, '') == '' ||
    !/[^\s]/.test(text) ||
    /^\s*$/.test(text)
  );
};

export const randomGenerator = len => {
  let p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
};

export const uploadPhotoFile = file => {
  let user = firebase.auth().currentUser.uid;
  let storageRef = firebase.storage().ref();
  let photoRef = storageRef.child(`${user}/image`);
  return photoRef.putFile(file.path);
};
export const uploadVendorPhotoFile = (file, docId) => {
  let storageRef = firebase.storage().ref('vendor_image');
  let photoRef = storageRef.child(`${docId}/image`);
  return photoRef.putFile(file.path);
};

export const userInfo = uid =>
  firebase
    .firestore()
    .collection('users')
    .doc(uid);

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const getRentMonthTime = (startRentDate, index) => {
  const startDate = new Date(startRentDate);
  const rentTimeInfo = new Date(
    startDate.setMonth(startDate.getMonth() + index),
  );
  return `${months[rentTimeInfo.getMonth()]} ${rentTimeInfo.getFullYear()}`;
};
export const dateFormatter = dateToBeFormat => {
  const currentDateISO = new Date(dateToBeFormat ? dateToBeFormat : new Date());
  const year = currentDateISO.getFullYear();
  const monthNumeric = currentDateISO.getMonth();
  const date = currentDateISO.getDate();
  const monthAlpha = months[monthNumeric];
  // eg: 09 oct 2019 formate
  const fullDate = `${date} ${months[monthNumeric]} ${year}`;
  const dateObject = {
    date,
    fullDate,
    monthNumeric,
    monthAlpha,
    months,
    year,
  };

  return dateObject;
};

export const calculateMonths = (end, start) => {
  let timeDiff = Math.abs(end.getTime() - start.getTime());
  return Math.round(timeDiff / (2e3 * 3600 * 365.25));
};

export const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1);

export const validateEmail = email => {
  const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regex.test(email);
};
