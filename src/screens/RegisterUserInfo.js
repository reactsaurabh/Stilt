import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  ScrollView,
} from 'react-native';
import ArrowIcon from '../components/UI/ArrowIcon';
import {goTo} from './navigation';
import {
  PRIMARY_DARK,
  WHITE,
  GRAY_100,
  GRAY_300,
  GRAY_200,
  PRIMARY,
  PURPLE,
} from '../utils/colors';
import ImagePicker from 'react-native-image-picker';
import firebase from 'react-native-firebase';
import {showSnackbar, isStringEmpty, uploadPhotoFile} from '../utils/helper';
import Spinner from '../components/UI/Spinner';
import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import {
  OWNER_TENANT,
  AGENT,
  PROPERTY_MANAGER,
  VENDOR,
} from '../utils/constants';

const RegisterUserInfo = props => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    accountTypes: [],
    currentAccountType: '',
  });
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const onChangeText = (name, val) => {
    setUserInfo({...userInfo, [name]: val});
  };
  const onForwardPress = async () => {
    if (uploadPhoto) {
      if (profilePic) {
        showLoading();
        uploadPhotoFile(profilePic).then(() => {
          hideLoading();
          goTo('home');
        });
      } else {
        showSnackbar('Please select a photo');
      }
    } else {
      const errors = validateUserInfo(userInfo);
      const deviceInfo = {
        os: `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`,
        app: DeviceInfo.getBundleId(),
      };

      try {
        const res = await DeviceInfo.getCarrier();
        deviceInfo.carrier = res;
      } catch (e) {
        deviceInfo.carrier = 'No Information';
      }

      await Geolocation.getCurrentPosition(
        position => {
          deviceInfo.geocode = `${position.coords.latitude} ${
            position.coords.longitude
          }`;
        },
        error => {
          console.log(error);
          deviceInfo.geocode = 'No information';
        },
      );
      const IMEI = require('react-native-imei');

      try {
        const imei = await IMEI.getImei();
        deviceInfo.imei = imei;
      } catch (e) {
        deviceInfo.imei = 'No information';
      }

      if (errors) {
        showSnackbar(errors);
      } else {
        //TODO - to use redux
        showLoading();
        const user = firebase.auth().currentUser;
        firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .set({...userInfo, ...deviceInfo}, {merge: true})
          .then(() => {
            hideLoading();
            setUploadPhoto(true);
          })
          .catch(error => {
            showSnackbar(error.message);
          });
      }
    }
  };

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const validateUserInfo = data => {
    let errors = '';
    const {firstName, lastName, accountTypes} = data;
    if (isStringEmpty(firstName) && isStringEmpty(lastName)) {
      errors = 'First Name and Last Name are required';
    } else if (isStringEmpty(firstName)) {
      errors = 'First Name is required';
    } else if (isStringEmpty(lastName)) {
      errors = 'Last Name is required';
    } else if (!accountTypes.length) {
      errors = 'Select an account type';
    }
    return errors;
  };

  const onSelectProfilePic = () => {
    ImagePicker.showImagePicker(response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        showSnackbar(response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let path = '';
        if (Platform.OS === 'ios') path = response.uri.toString();
        else {
          path = response.path.toString();
        }
        const image = {
          image: response.uri.toString(),
          path: path,
        };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setProfilePic(image);
      }
    });
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.horizontalLine} />
        {uploadPhoto ? (
          <View style={{alignItems: 'center'}}>
            {profilePic ? (
              <Image
                source={{uri: profilePic.image}}
                style={styles.profilePic}
              />
            ) : (
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={onSelectProfilePic}>
                <Text style={styles.photoText}>Profile Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              autoCorrect={false}
              keyboardType={'default'}
              onChangeText={val => onChangeText('firstName', val)}
              value={userInfo.firstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              autoCorrect={false}
              keyboardType={'default'}
              onChangeText={val => onChangeText('middleName', val)}
              val={userInfo.middleName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              autoCorrect={false}
              keyboardType={'default'}
              onChangeText={val => onChangeText('lastName', val)}
              value={userInfo.lastName}
            />
            <RNPickerSelect
              onValueChange={value =>
                setUserInfo({
                  ...userInfo,
                  accountTypes: [value],
                  currentAccountType: value,
                })
              }
              items={[
                {label: OWNER_TENANT, value: OWNER_TENANT},
                {label: AGENT, value: AGENT},
                {label: PROPERTY_MANAGER, value: PROPERTY_MANAGER},
                {label: VENDOR, value: VENDOR},
              ]}
              useNativeAndroidPickerStyle={false}
              style={pickerSelectStyles}
              placeholder={{label: 'Select Account Type'}}
            />
          </>
        )}
        <View
          style={[
            styles.btnContainer,
            uploadPhoto
              ? {justifyContent: 'space-between'}
              : {justifyContent: 'flex-end'},
          ]}>
          {uploadPhoto && (
            <TouchableOpacity onPress={() => goTo('home')}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onForwardPress}
            style={uploadPhoto ? {} : styles.button}>
            {uploadPhoto ? (
              <ArrowIcon
                color={WHITE}
                backgroundColor={PRIMARY_DARK}
                type="forward"
              />
            ) : (
              <Text style={{color: WHITE}}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading && <Spinner color={PRIMARY} size="large" />}
    </>
  );
};

export default RegisterUserInfo;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    fontSize: hp('2.5%'),
    paddingLeft: wp('5%'),
    marginBottom: hp('5%'),
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: WHITE,
  },
  headerText: {fontSize: hp('2.4%')},
  button: {
    width: '100%',
    height: hp('8%'),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PURPLE,
  },
  horizontalLine: {
    borderTopWidth: 1,
    borderColor: GRAY_200,
    marginTop: hp('2.5%'),
    marginBottom: hp('4.5%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    fontSize: hp('2.5%'),
    width: '100%',
    paddingLeft: wp('5%'),
    marginBottom: hp('5%'),
  },
  btnContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
  photoContainer: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  skipText: {
    color: GRAY_300,
  },
  photoText: {
    color: GRAY_300,
  },
});
