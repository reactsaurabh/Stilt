import React, {Component} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Navigation} from 'react-native-navigation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {addBeneficiary, updateUserInfo} from '../actions';
import Spinner from '../components/UI/Spinner';
import {GRAY_100, PRIMARY, PRIMARY_DARK, WHITE} from '../utils/colors';
import {
  DEVICE_WIDTH,
  isStringEmpty,
  showSnackbar,
  validateEmail,
} from '../utils/helper';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.userInfo.data.firstName || '',
      middleName: props.userInfo.data.middleName || '',
      lastName: props.userInfo.data.lastName || '',
      mobile: props.userInfo.data.mobile || '',
      email: props.userInfo.data.email || '',
      image: props.userInfo.data.image || null,
      accountNo: props.userInfo.data.accountNo || '',
      ifsc: props.userInfo.data.ifsc || '',
      upi: props.userInfo.data.upi || '',
      address: props.userInfo.data.address || '',
    };
    this.baseState = this.state;
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
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.generic.isSuccess &&
      prevProps.generic.isSuccess !== this.props.generic.isSuccess
    ) {
      this.props.updateUserInfo({
        ...this.state,
        beneId: this.props.generic.data.beneId,
      });
    }

    if (
      this.props.userInfo.isSuccess &&
      prevProps.userInfo.isSuccess !== this.props.userInfo.isSuccess
    ) {
      this.setState({...this.state, ...this.props.userInfo.data}, () => {
        this.baseState = {...this.state};
      });
    }
  }
  onChangeText = (name, val) => {
    this.setState({[name]: val});
  };
  onSelectProfilePic = () => {
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

        this.setState({image});
      }
    });
  };
  onSave = () => {
    const {...data} = this.state;
    const errors = validateUserInfo(data);
    if (JSON.stringify(this.baseState) === JSON.stringify(this.state)) {
      showSnackbar('No changes were done.');
    } else if (!errors) {
      if (
        this.baseState.accountNo !== this.state.accountNo ||
        this.baseState.ifsc !== this.state.ifsc
      ) {
        const data = {
          custName: `${this.state.firstName} ${this.state.lastName}`,
          email: this.state.email,
          phone: this.state.mobile,
          accno: this.state.accountNo,
          ifsc: this.state.ifsc,
          address: this.state.address,
          token: this.props.cashFreeToken.data.data.token,
        };
        this.props.addBeneficiary(data);
      } else {
        this.props.updateUserInfo(data);
      }
    }
  };
  onCancel = () => this.setState(this.baseState);
  render() {
    const {isLoading} = this.props.userInfo;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Profile</Text>
          <View style={styles.profileBlock}>
            <Text style={styles.subHeading}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              autoCorrect={false}
              keyboardType={'default'}
              onChangeText={val => this.onChangeText('firstName', val)}
              value={this.state.firstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              autoCorrect={false}
              keyboardType={'default'}
              onChangeText={val => this.onChangeText('middleName', val)}
              value={this.state.middleName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              autoCorrect={false}
              keyboardType={'default'}
              onChangeText={val => this.onChangeText('lastName', val)}
              value={this.state.lastName}
            />
          </View>
          <View style={styles.profileBlock}>
            <Text style={styles.subHeading}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              autoCorrect={false}
              keyboardType={'phone-pad'}
              onChangeText={val => this.onChangeText('mobile', val)}
              value={this.state.mobile}
              editable={false}
              maxLength={10}
            />
          </View>
          <View style={styles.profileBlock}>
            <Text style={styles.subHeading}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCorrect={false}
              keyboardType={'email-address'}
              onChangeText={val => this.onChangeText('email', val)}
              value={this.state.email}
            />
          </View>

          <View style={styles.profileBlock}>
            <Text style={styles.subHeading}>Profile Photo</Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {this.state.image ? (
                <TouchableOpacity onPress={this.onSelectProfilePic}>
                  <Image
                    source={{
                      uri:
                        typeof this.state.image === 'object'
                          ? this.state.image.image
                          : this.state.image,
                    }}
                    style={styles.photo}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.photo, styles.grayBg]}
                  onPress={this.onSelectProfilePic}
                />
              )}
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={this.onCancel}>
              <Text style={styles.cancelText}>{'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={this.onSave}>
              <Text style={styles.saveText}>{'Save'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {isLoading && <Spinner color={PRIMARY} size="large" />}
      </SafeAreaView>
    );
  }
}

const validateUserInfo = data => {
  let errors = '';
  const {firstName, lastName, email} = data;
  if (isStringEmpty(firstName)) {
    errors = 'First Name is required';
  } else if (isStringEmpty(lastName)) {
    errors = 'Last Name is required';
  } else if (email && !validateEmail(email)) {
    errors = 'Invalid Email';
  }

  if (errors) {
    showSnackbar(errors);
  }
  return errors;
};

const mapStateToProps = ({userInfo, cashFreeToken, generic}) => ({
  userInfo,
  generic,
  cashFreeToken,
});

export default connect(
  mapStateToProps,
  {updateUserInfo, addBeneficiary},
)(Profile);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  scrollView: {
    margin: 16,
  },
  heading: {
    color: PRIMARY,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    fontSize: hp('2.5%'),
    width: '100%',
    paddingLeft: wp('5%'),
    marginVertical: hp('2%'),
  },
  profileBlock: {
    marginTop: hp('2%'),
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  photo: {
    height: 200,
    width: 200,
    borderRadius: 100,
    marginTop: 16,
  },
  grayBg: {
    backgroundColor: GRAY_100,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 48,
  },
  saveBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 5,
    width: DEVICE_WIDTH * 0.4,
  },
  cancelBtn: {
    backgroundColor: WHITE,
    borderColor: PRIMARY_DARK,
    borderWidth: 1,
    borderRadius: 5,
    width: DEVICE_WIDTH * 0.4,
  },
  cancelText: {
    textAlign: 'center',
    padding: 12,
    color: PRIMARY_DARK,
  },
  saveText: {
    textAlign: 'center',
    padding: 12,
    color: WHITE,
  },
});
