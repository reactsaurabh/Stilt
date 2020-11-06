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
  TouchableOpacity,
  PixelRatio,
  FlatList,
  Keyboard,
  InteractionManager,
  Platform,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {makeTransactions, setNavigationTitle, cashFreePayout} from '../actions';
import {
  removeAndroidBackButtonHandler,
  handleAndroidBackButton,
} from '../components/BackButton/androidBackButton';
import CButton from '../components/UI/CButton';
import Spinner from '../components/UI/Spinner';
import {BLACK, GRAY_300, PRIMARY, PRIMARY_DARK, WHITE} from '../utils/colors';
import {goTo} from './navigation';
import {useSelector} from 'react-redux';
import {randomGenerator} from '../utils/helper';
import Checkout from './Checkout';

const {width} = Dimensions.get('window');

class VendorPayment extends Component {
  //selectedVendor
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      monthAmount: '',
      category: 'Select',
      mobileNo: '',
      addToMyService: true,
      paymentType: [
        {isSelected: false, title: 'SALARY'},
        {isSelected: false, title: 'BONUS'},
        {isSelected: false, title: 'SALE'},
        {isSelected: false, title: 'ADVANCE'},
      ],
      comments: '',
      showCheckout: false,
      transactionID: randomGenerator(12),
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
    Keyboard.dismiss();
    removeAndroidBackButtonHandler();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.generic.isSuccess &&
      prevProps.generic.isSuccess !== this.props.generic.isSuccess
    ) {
      this.props.setNavigationTitle('Confirmation');
      goTo('vendorpaymentconfirmation');
    }
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
    } else {
      goTo('myservices');
    }
  }

  makePayment = () => {
    const {firstName, lastName, mobile} = this.props.userInfo.data;
    const service = this.state.paymentType.find(
      data => data.isSelected === true,
    ); //this.state.paymentType.map(item =>{ if(item.isSelected === true) {return item.title} } )
    const {selectedVendor} = this.props;

    const transactionInfo = {
      payment: this.state.monthAmount,
      payee: {
        name: selectedVendor.firstName,
        mobile: selectedVendor.mobile,
        image: selectedVendor.avatarImage,
        email: null,
      },
      payer: {name: `${firstName} ${lastName}`, mobile},
      service: service != undefined ? service.title : '',
      members: [mobile, selectedVendor.mobile],
      paymentDate: new Date(),
      paymentStatus: 'Completed',
      comments: this.state.comments,
      transactionID: this.state.transactionID,
    };

    this.props.makeTransactions(transactionInfo);
  };

  paymentCallback = paymentData => {
    const data = JSON.parse(paymentData);
    this.setState({showCheckout: false});

    if (data.txStatus === 'SUCCESS') {
      this.makePayment();
    } else if (data.txStatus === 'FAILED' || data.txStatus === 'CANCELLED') {
      alert(data.txMsg);
    }
  };

  payoutTransfer = () => {
    const beneId = this.props.selectedVendor.beneId;
    const data = {
      beneId: beneId,
      amount: Number(this.state.monthAmount).toFixed(2),
      remark: `Payment to ${this.props.selectedVendor.firstName} of ₹${
        this.state.monthAmount
      }`,
      token: this.props.cashFreeToken.data.data.token,
    };
    this.props.cashFreePayout(data);
  };

  onPress = selindex => {
    const {paymentType} = this.state;
    paymentType.forEach((elem, index) => {
      elem.isSelected = false;
      if (selindex == index) {
        elem.isSelected = !paymentType[index].isSelected;
      }
    });
    this.setState({paymentType});
  };

  render() {
    const {selectedVendor} = this.props;
    const {showCheckout} = this.state;
    //alert(JSON.stringify(this.props.userInfo.data.firstName))
    return (
      <View style={styles.safeAreaView}>
        <KeyboardAvoidingView
          style={{flex: 1, flexDirection: 'column'}}
          enabled
          keyboardShouldPersistTaps={true}
          keyboardVerticalOffset={200}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Text style={[styles.subText, {marginTop: 12}]}>To</Text>
              {selectedVendor && selectedVendor != null ? (
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={styles.title}>{selectedVendor.first}</Text>
                    <Text style={styles.subText}>{selectedVendor.mobile}</Text>
                  </View>
                  <Image
                    style={styles.sericeMenImage}
                    source={
                      !selectedVendor.avatarImage
                        ? require('../assets/images/roles/stilt-tenant.png')
                        : {uri: selectedVendor.avatarImage}
                    }
                  />
                </View>
              ) : null}
              <View
                style={{width: '86%', flexDirection: 'column', marginTop: 18}}>
                <Text style={styles.subText}>{`Payment Amount`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: BLACK,
                    textAlign: 'left',
                    //marginLeft: 10,
                    marginRight: 10,
                    marginTop: -8,
                    marginLeft: -3,
                    height: 40,
                  }}
                  keyboardType={'numeric'}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  placeholder={'0.0'}
                  onChangeText={monthAmount => this.setState({monthAmount})}
                  value={this.state.monthAmount}
                />
              </View>

              <Text style={[styles.subText, {marginTop: 10}]}>
                Payment Type
              </Text>

              <FlatList
                contentContainerStyle={{width: '100%', marginTop: 12}}
                numColumns={4}
                keyExtractor={(item, index) => index}
                style={{flexGrow: 0}}
                showsVerticalScrollIndicator={false}
                data={this.state.paymentType}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      width: '22%',
                      marginRight: width * 0.02,
                      height: 40,
                      borderWidth: 1,
                      borderColor: item.isSelected ? PRIMARY : BLACK,
                      borderRadius: 10,
                      backgroundColor: item.isSelected ? PRIMARY : WHITE,
                    }}
                    onPress={() => this.onPress(index)}>
                    <Text
                      style={{
                        textAlign: 'center',
                        lineHeight: 40,
                        alignSelf: 'center',
                        fontSize: 10,
                        color: item.isSelected ? WHITE : BLACK,
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <View style={{flexDirection: 'column', marginTop: 20}}>
                <Text style={styles.subText}>{`Comments`}</Text>
                <TextInput
                  style={{
                    fontSize: width * 0.04,
                    fontWeight: '400',
                    color: BLACK,
                    textAlign: 'left',
                    //marginLeft: 10,
                    marginRight: 10,
                    marginTop: -8,
                    marginLeft: -3,
                    minHeight: 40,
                    maxHeight: 150,
                    marginBottom: 15,
                  }}
                  multiline={true}
                  adjustsFontSizeToFit
                  placeholder={'Demo'}
                  onChangeText={comments => this.setState({comments})}
                  value={this.state.comments}
                />
              </View>

              {/* <View style={{ marginTop: 18 }}>
                <Text style={styles.subText}>Comments</Text>
                <Text style={styles.title}>Demo</Text>
              </View> */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            bottom: 12,
            alignItems: 'center',
          }}>
          <CButton
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                goTo('myservices');
              }, 500);
            }}
            text={'Cancel'}
            borderColor={GRAY_300}
            color={PRIMARY_DARK}
            backgroundColor={WHITE}
            style={{width: '48%', marginRight: 12}}
          />
          <CButton
            onPress={() => {
              Keyboard.dismiss();
              this.setState({showCheckout: true});
            }}
            text={'Make Payment'}
            borderColor={PRIMARY_DARK}
            color={'white'}
            backgroundColor={PRIMARY_DARK}
            style={{width: '48%'}}
          />
        </View>
        {showCheckout && (
          <Checkout
            orderAmount={this.state.monthAmount}
            orderId={this.state.transactionID}
            orderNote={`Payment to ${selectedVendor.fullName} of ₹${
              this.state.monthAmount
            }`}
            callback={this.paymentCallback}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1, backgroundColor: WHITE, padding: 12},

  title: {
    color: BLACK,
    fontSize: 16,
  },
  subText: {
    color: GRAY_300,
    fontSize: 12,
  },
  sericeMenImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  heading: {
    color: PRIMARY,
    fontSize: 16 * PixelRatio.getFontScale(),
    marginBottom: 16,
  },
  label: {fontSize: 18 * PixelRatio.getFontScale(), color: BLACK},
  textinput: {fontSize: 18 * PixelRatio.getFontScale(), color: GRAY_300},
});

const mapStateToProps = ({userInfo, service, generic, cashFreeToken}) => ({
  userInfo,
  service,
  generic,
  cashFreeToken,
});

export default connect(
  mapStateToProps,
  {makeTransactions, setNavigationTitle, cashFreePayout},
)(VendorPayment);
