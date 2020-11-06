/* eslint-disable consistent-this */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation';
import ArrowIcon from '../components/UI/ArrowIcon';
import Spinner from '../components/UI/Spinner';
import {
  BLACK,
  GRAY_300,
  PRIMARY,
  PRIMARY_DARK,
  WHITE,
  PURPLE,
  GRAY_200,
} from '../utils/colors';
import {isStringEmpty, showSnackbar} from '../utils/helper';
import {goTo} from './navigation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      otp: '',
      confirmResult: null,
      loading: false,
      checked: false,
    };
    this.unsubscribe = null;
  }
  onChangeText = (key, value) => {
    this.setState({[key]: value});
  };
  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          this.showLoading();
          const docRef = firebase
            .firestore()
            .collection('users')
            .doc(user._user.uid);

          const res = await docRef.get();

          if (res.exists) {
            this.hideLoading();
            goTo('home');
          } else {
            const notificationToken = await AsyncStorage.getItem('fcmToken');
            const checkForVendor = await firebase
              .firestore()
              .collection('users')
              .where('mobile', '==', this.state.mobile)
              .get();
            if (checkForVendor.empty) {
              firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .set(
                  {
                    mobile: this.state.mobile,
                    notificationToken,
                  },
                  {merge: true},
                )
                .then(() => {
                  this.hideLoading();
                  this.onOTPConfirm();
                })
                .catch(error => {
                  firebase.auth().signOut();
                  showSnackbar(error.message);
                });
            } else {
              try {
                await firebase
                  .firestore()
                  .collection('users')
                  .doc(user.uid)
                  .set(
                    {
                      mobile: this.state.mobile,
                      notificationToken,
                      ...checkForVendor.docs[0].data(),
                    },
                    {merge: true},
                  );
                await firebase
                  .firestore()
                  .collection('users')
                  .doc(checkForVendor.docs[0].id)
                  .delete();
                this.hideLoading();
                goTo('home');
              } catch (error) {
                firebase.auth().signOut();
                showSnackbar(error.message);
              }
            }
          }
        } catch (e) {
          showSnackbar(e.message);
          firebase.auth().signOut();
        }
      } else {
        // User has been signed out, reset the state
        console.log('user not logged in');
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  onOTPCLick() {
    if (this.state.confirmResult) {
      if (!isStringEmpty(this.state.otp)) {
        this.confirmCode();
      } else {
        showSnackbar("OTP can't be null.");
      }
    } else {
      if (!isStringEmpty(this.state.mobile)) {
        this.signIn();
      } else {
        showSnackbar('Please provide mobile number.');
      }
    }
  }

  onOTPConfirm = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'stilt.registerUserInfo',
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    });
  };

  onGoBack = () => this.setState({confirmResult: null});

  onResendOtp() {
    this.signIn();
  }

  showLoading() {
    this.setState({loading: true});
  }

  hideLoading() {
    this.setState({loading: false});
  }

  signIn() {
    this.showLoading();
    const {mobile} = this.state;
    firebase
      .auth()
      .signInWithPhoneNumber(`+91${mobile}`, true)
      .then(confirmResult => {
        this.hideLoading();
        this.setState({confirmResult, error: ''});
        showSnackbar('Code has been sent!');
      })
      .catch(error => {
        this.setState({error: error.message});
        console.log(error);
        this.hideLoading();
        showSnackbar(error.message);
      });
  }

  confirmCode() {
    this.showLoading();
    const {otp, confirmResult} = this.state;
    if (confirmResult && otp.length) {
      confirmResult
        .confirm(otp)
        .then(async user => {
          showSnackbar('Code Confirmed!');
        })
        .catch(error => {
          this.setState({error: error.message});
          console.log(error);
          this.hideLoading();
          showSnackbar(
            'Code is incorrect. please resend code or try with correct code.',
          );
        });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loginText}>Login</Text>
          <View style={styles.horizontalLine} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number (10 Digit)"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={'phone-pad'}
            onChangeText={val => this.onChangeText('mobile', val)}
            value={this.state.mobile}
            editable={!this.state.confirmResult}
            maxLength={10}
          />
          {this.state.confirmResult && (
            <TextInput
              style={styles.input}
              placeholder="OTP"
              autoCapitalize="none"
              keyboardType={'phone-pad'}
              onChangeText={val => this.onChangeText('otp', val)}
              value={this.state.otp}
            />
          )}
          {this.state.confirmResult && (
            <TouchableOpacity onPress={this.signIn}>
              <Text style={styles.txt_register}>{'Resend OTP'}</Text>
            </TouchableOpacity>
          )}

          <Text>{this.state.error}</Text>
          {!this.state.confirmResult && (
            <Text style={styles.termsText}>
              By proceeding, you agree to our Terms & Conditions & Privacy
              Policy. Operator Changes may apply for SMS and internal use
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              this.state.confirmResult && {marginTop: hp('5%')},
            ]}
            onPress={() => this.onOTPCLick()}>
            <Text style={styles.buttonText}>
              {this.state.confirmResult ? 'Login' : 'Next (OTP)'}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.loading && <Spinner color={PRIMARY} size={'large'} />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    margin: 16,
  },
  loginText: {
    fontSize: hp('2.4%'),
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
  termsText: {
    fontSize: hp('1.8%'),
    color: GRAY_300,
    marginBottom: hp('2%'),
    marginTop: hp('15%'),
  },
  button: {
    width: '100%',
    height: hp('8%'),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PURPLE,
  },
  btn_container: {
    width: '90%',
    flexDirection: 'row',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn_login: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 20,
    minWidth: 100,
    marginLeft: 10,
  },
  btn_register: {
    backgroundColor: WHITE,
    borderRadius: 20,
    minWidth: 100,
    marginRight: 10,
  },
  txt_register: {
    padding: 10,
    color: GRAY_300,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    textAlign: 'center',
    color: WHITE,
  },
});
