import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  Picker,
  PixelRatio,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {
  addNewEvent,
  getNotifications,
  addNewVendor,
  setNavigationTitle,
  addBeneficiary,
} from '../actions';
import {
  removeAndroidBackButtonHandler,
  handleAndroidBackButton,
} from '../components/BackButton/androidBackButton';
import CButton from '../components/UI/CButton';
import Spinner from '../components/UI/Spinner';
import {BLACK, GRAY_300, PRIMARY, PRIMARY_DARK, WHITE} from '../utils/colors';
import {goTo} from './navigation';
import ImagePicker from 'react-native-image-picker';
import {showSnackbar} from '../utils/helper';
import firebase from 'react-native-firebase';
import {VENDOR} from '../utils/constants';
const {width} = Dimensions.get('window');

class CreateVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      monthAmount: '',
      category: 'Select',
      mobileNo: '',
      addToMyService: false,
      vendorAvtar: '',
      email: '',
      address: '',
      accountNo: '',
      ifsc: '',
    };
  }

  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
    handleAndroidBackButton(() => {
      goTo('myservices');
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  componentDidUpdate = prevProps => {
    const {isSuccess} = this.props.service;
    if (isSuccess && isSuccess != prevProps.service.isSuccess) {
      this.props.setNavigationTitle('Confirmation');
      goTo('vendorconfirm');
    }

    if (
      this.props.generic.isSuccess &&
      prevProps.generic.isSuccess !== this.props.generic.isSuccess
    ) {
      const {
        firstName,
        lastName,
        monthAmount,
        category,
        mobileNo,
        addToMyService,
        address,
        ifsc,
        accountNo,
        email,
      } = this.state;

      const vendorInfo = {
        firstName: firstName,
        lastName: lastName,
        mobile: mobileNo,
        vendorCategory: category,
        monthAmount: monthAmount,
        address,
        ifsc,
        accountNo,
        email,
        mobileVerified: false,
        mobileVerifiedTimestamp: new Date(),
        createdTimestamp: new Date(),
        isVerified: false,
        verifiedTimeStamp: new Date(),
        verifiedBy: '',
        addedBy: {
          mobile: this.props.userInfo.data.mobile,
          uid: firebase.auth().currentUser.uid,
          myVendors: this.props.userInfo.data.myVendors,
        },
        customers: [this.props.userInfo.data.mobile],
        beneId: this.props.generic.data.beneId,
        accountTypes: [VENDOR],
        currentAccountType: VENDOR,
      };
      this.props.addNewVendor(vendorInfo);
    }
  };

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
    } else {
      goTo('myservices');
    }
  }

  changeCategory = category => {
    this.setState({category});
  };

  onSelectVendorPic = () => {
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

        this.setState({vendorAvtar: image});
      }
    });
  };

  addVendors = () => {
    const {
      firstName,
      lastName,
      mobileNo,
      address,
      ifsc,
      accountNo,
      email,
    } = this.state;
    // alert(JSON.stringify(vendorInfo))
    this.props.addBeneficiary({
      custName: `${firstName} ${lastName}`,
      email: email,
      phone: mobileNo,
      accno: accountNo,
      ifsc: ifsc,
      address: address,
      token: this.props.cashFreeToken.data.data.token,
    });
  };

  render() {
    return (
      <View style={styles.safeAreaView}>
        <KeyboardAvoidingView
          style={{flex: 1, flexDirection: 'column'}}
          enabled
          keyboardVerticalOffset={200}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <View
                style={[
                  styles.viewContainer,
                  {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <View style={{width: '86%', flexDirection: 'column'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: width * 0.04,
                    }}>{`First Name`}</Text>
                  <TextInput
                    style={{
                      fontSize: width * 0.04,
                      fontWeight: '400',
                      color: GRAY_300,
                      textAlign: 'left',
                      //marginLeft: 10,
                      marginRight: 10,
                      marginTop: -10,
                      marginLeft: -2,
                    }}
                    keyboardType={'name-phone-pad'}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    placeholder={'Enter First Name'}
                    onChangeText={firstName => this.setState({firstName})}
                    value={this.state.firstName}
                  />
                </View>
                <TouchableOpacity onPress={this.onSelectVendorPic}>
                  <Image
                    style={{width: 40, height: 40, borderRadius: 20}}
                    source={
                      this.state.vendorAvtar == ''
                        ? require('../assets/images/plus.png')
                        : {uri: this.state.vendorAvtar.image}
                    }
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text>{`Last Name`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: GRAY_300,
                    marginRight: 10,
                    marginTop: -10,
                    textAlign: 'left',
                    marginLeft: -2,
                  }}
                  keyboardType={'default'}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'Last Name'}
                  onChangeText={lastName => this.setState({lastName})}
                  value={this.state.lastName}
                />
              </View>
              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text>{`Email`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: GRAY_300,
                    marginRight: 10,
                    marginTop: -10,
                    textAlign: 'left',
                    marginLeft: -2,
                  }}
                  keyboardType={'email-address'}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'Email'}
                  onChangeText={email => this.setState({email})}
                  value={this.state.email}
                />
              </View>
              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text>{`Address`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: GRAY_300,
                    marginRight: 10,
                    marginTop: -10,
                    textAlign: 'left',
                    marginLeft: -2,
                  }}
                  keyboardType={'default'}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'Address'}
                  onChangeText={address => this.setState({address})}
                  value={this.state.address}
                />
              </View>
              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text>{`Account Number`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: GRAY_300,
                    marginRight: 10,
                    marginTop: -10,
                    textAlign: 'left',
                    marginLeft: -2,
                  }}
                  keyboardType={'numeric'}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'Account Number'}
                  onChangeText={accountNo => this.setState({accountNo})}
                  value={this.state.accountNo}
                />
              </View>
              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text>{`IFSC Code`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: GRAY_300,
                    marginRight: 10,
                    marginTop: -10,
                    textAlign: 'left',
                    marginLeft: -2,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'IFSC Code'}
                  onChangeText={ifsc => this.setState({ifsc})}
                  value={this.state.ifsc}
                />
              </View>
              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: width * 0.04,
                  }}>{`Mobile Number`}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    marginTop: -10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontSize: width * 0.04,
                      marginLeft: 2,
                    }}>{`+91`}</Text>
                  <TextInput
                    style={{
                      fontSize: width * 0.04,
                      fontWeight: '400',
                      color: GRAY_300,
                      marginLeft: 10,
                      textAlign: 'left',
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                    maxLength={10}
                    keyboardType={'phone-pad'}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    placeholder={'Mobile No'}
                    onChangeText={mobileNo => this.setState({mobileNo})}
                    value={this.state.mobileNo}
                  />
                </View>
              </View>

              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: width * 0.04,
                  }}>{`Category`}</Text>
                <Picker
                  selectedValue={this.state.category}
                  style={{height: 50, flex: 1, marginLeft: -5, marginTop: -10}}
                  itemStyle={{color: GRAY_300, fontSize: width * 0.04}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({category: itemValue})
                  }>
                  <Picker.Item
                    label="Select"
                    value="Select"
                    style={{fontSize: width * 0.04}}
                  />
                  <Picker.Item label="Milk" value="milk" />
                  <Picker.Item label="Grocery" value="grocery" />
                  <Picker.Item label="Bakery" value="bakery" />
                  <Picker.Item label="Flowers" value="flowers" />
                  <Picker.Item label="NewsPaper" value="newsPaper" />
                  <Picker.Item label="Carpenter" value="carpenter" />
                  <Picker.Item label="Maid" value="maid" />
                  <Picker.Item label="Driver" value="driver" />
                  <Picker.Item label="Plumber" value="plumber" />
                  <Picker.Item label="Mechanic" value="mechanic" />
                </Picker>
              </View>

              <View style={[styles.viewContainer, {flexDirection: 'column'}]}>
                <Text>{`Monthly Payment`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: GRAY_300,
                    marginRight: 10,
                    marginTop: -10,
                    textAlign: 'left',
                    marginLeft: -2,
                  }}
                  keyboardType={'numeric'}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'0.0'}
                  onChangeText={monthAmount => this.setState({monthAmount})}
                  value={this.state.monthAmount}
                />
              </View>

              <View
                style={[
                  styles.viewContainer,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontSize: width * 0.04,
                    marginLeft: 2,
                    alignSelf: 'flex-start',
                  }}>{`Add to My Services`}</Text>
                <Switch
                  value={this.state.addToMyService}
                  onValueChange={() => {
                    this.setState({
                      addToMyService: !this.state.addToMyService,
                    });
                  }}
                  style={{alignSelf: 'flex-end'}}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <CButton
          onPress={this.addVendors}
          text={'Add Vendor'}
          borderColor={PRIMARY_DARK}
          color={'white'}
          backgroundColor={PRIMARY_DARK}
          width={'90%'}
          style={{margin: 24}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: WHITE},
  container: {
    flex: 1,
    margin: 15,
  },
  viewContainer: {
    margin: 5,
  },
  heading: {
    color: PRIMARY,
    fontSize: 16 * PixelRatio.getFontScale(),
    marginBottom: 16,
  },
  label: {fontSize: 18 * PixelRatio.getFontScale(), color: BLACK},
  textinput: {fontSize: 18 * PixelRatio.getFontScale(), color: GRAY_300},
  picker: {
    marginLeft: 12,
    fontSize: 14 * PixelRatio.getFontScale(),
    color: GRAY_300,
  },
});

const mapStateToProps = ({
  notifications,
  userInfo,
  service,
  cashFreeToken,
  generic,
}) => ({
  notifications,
  userInfo,
  service,
  cashFreeToken,
  generic,
});

export default connect(
  mapStateToProps,
  {
    getNotifications,
    addNewEvent,
    addNewVendor,
    setNavigationTitle,
    addBeneficiary,
  },
)(CreateVendor);
