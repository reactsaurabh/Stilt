/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {resetGeneric, updateUserInfo} from '../actions';
import SettingsInfoOption from '../components/Settings/SettingsInfoOption';
import SettingsUserRelatedOptions from '../components/Settings/SettingsUserRelatedOptions';
import Spinner from '../components/UI/Spinner';
import {BLACK, GRAY_100, GRAY_300, PRIMARY, WHITE} from '../utils/colors';
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      switch: {
        accountStatus: false,
        allowSearchByName: false,
        allowSearchByMobile: false,
        allowSearchByEmail: false,
      },
    };
  }

  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({buttonId}) {
    // handling toggleMenu click
    if (buttonId === 'ham_btn') {
      this.isSideDrawerVisible
        ? (this.isSideDrawerVisible = false)
        : (this.isSideDrawerVisible = true);
      Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.props.generic.isSuccess) {
      this.props.resetGeneric();
    }
  }

  signOut = () => {
    firebase.auth().signOut();
  };

  handleSwitchChange = (value, name) => {
    const switches = {...this.state.switch};
    switches[name] = value;
    this.setState({switch: switches});
  };

  render() {
    const {data, isLoading} = this.props.userInfo;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: WHITE}}>
        <View style={styles.container}>
          <View style={styles.rowView}>
            <View style={{justifyContent: 'space-between'}}>
              {data && (
                <>
                  <Text
                    style={{
                      fontSize: hp('3.5%'),
                      color: BLACK,
                      fontWeight: 'bold',
                    }}>
                    {`${data.firstName} ${data.lastName}`}
                  </Text>
                  <Text>{data.currentAccountType} Account</Text>
                </>
              )}
            </View>
            {data && data.image ? (
              <Image source={{uri: data.image}} style={styles.profilePic} />
            ) : (
              <View style={[styles.profilePic, styles.grayBg]} />
            )}
          </View>

          <View style={styles.btn_container}>
            {data && <Text>+91 {data.mobile}</Text>}

            <View style={styles.checkMark}>
              <Icon name="md-checkmark" size={12} color={'#8AD46A'} />
            </View>
          </View>

          <View style={styles.btn_container}>
            <Text>{(data && data.email) || 'No Email'}</Text>
          </View>
          <View style={{marginTop: hp('10%')}} />
          <SettingsUserRelatedOptions />
          <SettingsInfoOption />
        </View>
        {(isLoading || this.props.generic.isLoading) && (
          <Spinner color={PRIMARY} size="large" />
        )}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({userInfo, generic}) => ({userInfo, generic});

export default connect(
  mapStateToProps,
  {updateUserInfo, resetGeneric},
)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp('8.5%'),
  },

  profilePic: {
    width: hp('8.5%'),
    height: hp('8.5%'),
    borderRadius: hp('8.5%') / 2,
  },
  grayBg: {
    backgroundColor: GRAY_100,
  },
  btn_container: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  emailText: {
    textAlign: 'center',
    color: GRAY_300,
    fontSize: 18,
  },

  checkMark: {
    height: hp('2.8%'),
    width: hp('2.8%'),
    borderRadius: hp('2.8%') / 2,
    borderWidth: 1.5,
    borderColor: '#8AD46A',
    justifyContent: 'center',
    alignItems: 'center',
    //half of image width - half of checkmark width - double the border width of check mark
    marginRight: hp('8.5%') / 2 - hp('2.8%') / 2 - 3,
  },
  arrow: {marginRight: 15},
});
