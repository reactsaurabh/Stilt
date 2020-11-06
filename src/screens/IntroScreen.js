/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {PRIMARY, PURPLE, WHITE} from '../utils/colors';
export default class IntroScreen extends React.Component {
  onLoginClick = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'stilt.signIn',
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    });
  };

  async componentDidMount() {
    check(PERMISSIONS.ANDROID.READ_PHONE_STATE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            request(
              Platform.select({
                android: PERMISSIONS.ANDROID.READ_PHONE_STATE,
              }),
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
      });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: WHITE}}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/stilt-logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.title}>Smart hai, Sahi hai</Text>
          <Text style={styles.subTitle}>Building Communities</Text>
          <Text style={[styles.subTitle, {marginTop: hp('2%')}]}>
            Owners, Tenants, Agents
          </Text>

          <View style={styles.buttonView}>
            <TouchableOpacity
              style={[styles.btn, styles.registerBtn]}
              onPress={this.onLoginClick}>
              <Text style={[styles.btnText, styles.registerText]}>
                New Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.loginBtn]}
              onPress={this.onLoginClick}>
              <Text style={[styles.btnText, styles.loginText]}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>About</Text>
            <Text style={styles.footerText}>.</Text>
            <Text style={styles.footerText}>Terms of Use</Text>
            <Text style={styles.footerText}>.</Text>
            <Text style={styles.footerText}>Policy</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  logo: {
    marginTop: hp('10%'),
    width: wp('25%'),
    height: wp('25%'),
  },
  logoText: {
    width: wp('50%'),
    height: hp('15%'),
  },
  title: {
    marginTop: hp('10%'),
    fontSize: hp('4.5%'),
    color: PRIMARY,
  },
  subTitle: {
    marginTop: hp('7%'),
    fontSize: hp('3%'),
    color: '#657786',
    textAlign: 'center',
  },
  buttonView: {
    marginTop: hp('18%'),
    marginBottom: hp('5%'),
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('40%'),
    height: hp('7.8%'),
    borderRadius: 6,
  },
  btnText: {
    fontSize: hp('2%'),
  },
  registerBtn: {
    borderWidth: 1,
    borderColor: '#657786',
  },
  registerText: {
    color: '#657786',
  },
  loginBtn: {
    backgroundColor: PURPLE,
  },
  loginText: {color: 'white'},
  footer: {
    flexDirection: 'row',
    width: wp('55%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#657786',
  },
});
