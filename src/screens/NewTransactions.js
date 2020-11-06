import React, {Component} from 'react';
import {
  Picker,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {makeTransactions} from '../actions';
import Payment from '../components/Property/Payment';
import Spinner from '../components/UI/Spinner';
import {
  GRAY_100,
  GRAY_300,
  PRIMARY,
  PRIMARY_DARK,
  WHITE,
} from '../utils/colors';
import {DEVICE_WIDTH, showSnackbar} from '../utils/helper';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      transactionType: '',
      name: '',
      mobile: '',
      amount: '',
      comment: '',
      paymentInfo: {},
    };
  }
  componentDidMount() {
    // no need to unregister navigation event on screen destroy. It will automatically unregistered at the runtime
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.generic.isSuccess &&
      prevProps.generic.isSuccess !== this.props.generic.isSuccess
    ) {
      this.setState({step: 2});
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
    }
  }
  onPayment = type => {
    const {transactionType, mobile, name, amount} = this.state;
    const errors = validateForm({name, mobile, amount});
    if (!errors) {
      const {
        firstName,
        lastName,
        mobile: userMobile,
        image,
        email,
      } = this.props.userInfo.data;
      const payee =
        type === 'Requested'
          ? {
              name: `${firstName} ${lastName}`,
              mobile: userMobile,
              image,
              email,
            }
          : {
              name: name,
              mobile: mobile,
              image: null,
              email: null,
            };
      const payer =
        type === 'Requested'
          ? {
              name: name,
              mobile: mobile,
              image: null,
              email: null,
            }
          : {
              name: `${firstName} ${lastName}`,
              mobile: userMobile,
              image,
              email,
            };
      const transactionInfo = {
        payment: amount,
        payee,
        payer,
        service: transactionType,
        members: [userMobile, mobile],
        paymentDate: new Date(),
        paymentStatus: 'Completed',
        ...(type === 'Requested' && {
          paymentStatus: 'In Progress',
          type: 'Request',
        }),
      };
      this.setState(
        {
          paymentInfo: {
            payerMobile: payer.mobile,
            payerName: payer.name,
            payeeMobile: payee.mobile,
            paymentIcon: type,
            payeeName: payee.name,
          },
        },
        () => this.props.makeTransactions(transactionInfo),
      );
    }
  };
  onChangeText = (name, val) => this.setState({[name]: val});
  render() {
    const {step, transactionType, amount, paymentInfo} = this.state;
    const {isLoading} = this.props.generic;
    console.log(paymentInfo, 'asd');
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.newTransaction}>
              <Text style={styles.heading}>New Transactions</Text>
              <Text style={styles.subHeading}>Transaction Type</Text>
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={transactionType}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({transactionType: itemValue})
                  }>
                  <Picker.Item label="Select Transaction Type" value="" />
                  <Picker.Item
                    label="Tenant – Rent Deposit"
                    value="Tenant - Rent-Deposit"
                  />
                  <Picker.Item
                    label="Tenant – Monthly Rent"
                    value="Tenant – Monthly Rent"
                  />
                  <Picker.Item
                    label="Property – Maintenance"
                    value="Property – Maintenance"
                  />
                  <Picker.Item
                    label="Property – Water Charges"
                    value="Property – Water Charges"
                  />
                  <Picker.Item
                    label="Property – Electricity"
                    value="Property – Electricity"
                  />
                  <Picker.Item
                    label="Property – Other"
                    value="Property – Other"
                  />
                  <Picker.Item
                    label="Owner – Deposit Refund"
                    value="Owner – Deposit Refund"
                  />
                  <Picker.Item
                    label="Owner – Agent Fees"
                    value="Owner – Agent Fees"
                  />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
              <Text style={styles.subHeading}>Name</Text>
              <TextInput
                style={[styles.input, styles.bottom]}
                placeholder="Enter Name"
                autoCorrect={false}
                keyboardType={'default'}
                onChangeText={val => this.onChangeText('name', val)}
                value={this.state.name}
              />
              <Text style={styles.subHeading}>Mobile Number</Text>
              <TextInput
                style={[styles.input, styles.bottom]}
                placeholder="Enter Mobile Number"
                autoCorrect={false}
                keyboardType={'phone-pad'}
                onChangeText={val => this.onChangeText('mobile', val)}
                value={this.state.mobile}
                maxLength={10}
              />
              <Text style={styles.subHeading}>Amount</Text>
              <TextInput
                style={[styles.input, styles.bottom]}
                placeholder="Enter Amount"
                autoCorrect={false}
                keyboardType={'numeric'}
                onChangeText={val => this.onChangeText('amount', val)}
                value={this.state.amount}
              />
              <Text style={styles.subHeading}>Comment</Text>

              <TextInput
                style={styles.input}
                placeholder="Add Comments for Recipients"
                autoCorrect={false}
                keyboardType={'default'}
                onChangeText={val => this.onChangeText('comment', val)}
                value={this.state.comment}
                multiline={true}
                numberOfLines={4}
              />
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.requestBtn}
                  onPress={() => this.onPayment('Requested')}>
                  <Text style={styles.requestText}>{'Request Payment'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.makeBtn}
                  onPress={() => this.onPayment('Make')}>
                  <Text style={styles.makeText}>{'Make Payment'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {step === 2 && (
            <Payment
              payerMobile={paymentInfo.payerMobile}
              payerName={paymentInfo.payerName}
              payeeMobile={paymentInfo.payeeMobile}
              paymentIcon={paymentInfo.paymentInfo}
              payeeName={paymentInfo.payeeName}
              onBack={() => {
                this.setState({step: 1});
              }}
              amount={amount}
              service={transactionType}
            />
          )}
          {isLoading && <Spinner color={PRIMARY} size="large" />}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({userInfo, generic}) => ({userInfo, generic});

export default connect(mapStateToProps, {makeTransactions})(Transactions);

const validateForm = data => {
  let error = '';
  if (!data.name) {
    error = 'Name is required';
  } else if (!data.mobile) {
    error = 'Mobile is required';
  } else if (!data.amount) {
    error = 'Amount is required';
  }

  if (error) {
    showSnackbar(error);
  }
  return error;
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: WHITE},
  newTransaction: {margin: 16},
  heading: {
    fontSize: 18,
    color: PRIMARY,
    marginTop: 16,
    marginBottom: 32,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerView: {
    borderRadius: 50,
    overflow: 'hidden',
    width: '100%',
    height: 50,
    marginBottom: 24,
    maxWidth: 500,
  },
  picker: {
    backgroundColor: GRAY_100,
    color: GRAY_300,
    height: 50,
    width: '100%',
  },
  input: {
    backgroundColor: GRAY_100,
    height: 50,
    paddingLeft: 20,
    borderRadius: 50,
    maxWidth: 500,
    width: '100%',
    marginBottom: 10,
  },
  textAreaContainer: {
    backgroundColor: GRAY_100,
    borderRadius: 10,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 48,
  },
  makeBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 25,
    width: DEVICE_WIDTH * 0.4,
  },
  requestBtn: {
    backgroundColor: WHITE,
    borderColor: PRIMARY_DARK,
    borderWidth: 1,
    borderRadius: 25,
    width: DEVICE_WIDTH * 0.4,
  },
  requestText: {
    textAlign: 'center',
    padding: 12,
    color: PRIMARY_DARK,
  },
  makeText: {
    textAlign: 'center',
    padding: 12,
    color: WHITE,
  },
  bottom: {
    marginBottom: 24,
  },
  background_img: {
    width: '100%',
    height: 200,
  },
  message: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  congrats: {
    color: PRIMARY,
    fontSize: 26,
  },
});
