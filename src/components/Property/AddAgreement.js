import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Picker,
  Platform,
} from 'react-native';
import {
  BLACK,
  PRIMARY,
  WHITE,
  GRAY_100,
  GRAY_300,
  PRIMARY_DARK,
} from '../../utils/colors';
import {
  showSnackbar,
  DEVICE_WIDTH,
  randomGenerator,
  dateFormatter,
  calculateMonths,
} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddAgreement = ({
  onBack,
  addAgreement,
  agreement,
  assetID,
  isBothPartyPresent,
}) => {
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    rent: '',
    deposit: '',
    noticePeriod: '',
    depositAgreementNo: randomGenerator(12),
    rentAgreementNo: randomGenerator(12),
  });
  const onChangeText = (name, val) => setState({...state, [name]: val});
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const onPress = () => {
    const error = validateForm({...state});
    if (!error) {
      setShowDetails(true);
    }
  };
  const onSave = () => {
    const createdAt = new Date();
    const noOfMonths = calculateMonths(state.endDate, state.startDate);
    const rentPayment = new Array(noOfMonths).fill({paymentStatus: null});
    const updatedAgreements = [
      ...agreement,
      {...state, createdAt, rentPayment, currentAgreement: true},
    ];
    addAgreement({agreement: updatedAgreements, assetID});
  };
  const onGoBack = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      onBack();
    }
  };
  const setStartDate = (event, date) => {
    date = date || state.startDate;

    setShowStartDate(Platform.OS === 'ios');
    setState({...state, startDate: date});
  };

  const setEndDate = (event, date) => {
    date = date || state.endDate;

    setShowEndDate(Platform.OS === 'ios');
    setState({...state, endDate: date});
  };

  if (!isBothPartyPresent) {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack}>
            <ArrowIcon color={BLACK} arrowSize={30} type="back" />
          </TouchableOpacity>
          <Text style={styles.heading}> Add Agreement </Text>
        </View>
        <View style={{marginTop: 16}}>
          <Text style={styles.text}>
            Please add Owner and Tenant as party members
          </Text>
        </View>
      </>
    );
  }
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Add Agreement </Text>
      </View>

      {showDetails ? (
        <>
          <Text style={styles.agreementType}>Deposit Agreement</Text>
          <View style={[styles.agreementWrapper, styles.agreementNo]}>
            <Text>Agreement No.</Text>
            <Text>{state.depositAgreementNo}</Text>
          </View>
          <View style={styles.agreementWrapper}>
            <Text>Status</Text>
            <Text>Pending</Text>
          </View>
          <Text style={styles.agreementType}>Rent Agreement</Text>
          <View style={[styles.agreementWrapper, styles.agreementNo]}>
            <Text>Agreement No.</Text>
            <Text>{state.rentAgreementNo}</Text>
          </View>
          <View style={styles.agreementWrapper}>
            <Text>Status</Text>
            <Text>Pending</Text>
          </View>
          <TouchableOpacity
            style={styles.makeBtn}
            activeOpacity={0.5}
            onPress={onSave}>
            <Text style={styles.makeText}>{'Save'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subHeading}>Agreement Terms</Text>
          <View style={styles.section}>
            <View style={styles.btnContainer}>
              <Text>Start Date</Text>
              <TouchableOpacity
                onPress={() => setShowStartDate(true)}
                style={styles.date}>
                <Text style={styles.dateText}>
                  {state.startDate
                    ? `${dateFormatter(state.startDate).fullDate}`
                    : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              {showStartDate && (
                <DateTimePicker
                  value={state.startDate || new Date()}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={setStartDate}
                />
              )}
            </View>
            <View style={[styles.btnContainer, styles.mt]}>
              <Text>End Date</Text>
              <TouchableOpacity
                onPress={() => setShowEndDate(true)}
                title="Select Date!"
                style={styles.date}
                disabled={!state.startDate}>
                <Text style={styles.dateText}>
                  {state.endDate
                    ? `${dateFormatter(state.endDate).fullDate}`
                    : 'Select End Date'}
                </Text>
              </TouchableOpacity>
              {showEndDate && (
                <DateTimePicker
                  value={state.endDate || new Date()}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={setEndDate}
                  minimumDate={new Date(state.startDate)}
                />
              )}
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.btnContainer}>
              <Text>Rent (per month)</Text>
              <TextInput
                style={styles.input}
                placeholder="₹ Enter Amount"
                autoCorrect={false}
                keyboardType={'numeric'}
                onChangeText={val => onChangeText('rent', val)}
                value={state.rent}
              />
            </View>
            <View style={styles.btnContainer}>
              <Text>Deposit</Text>
              <TextInput
                style={styles.input}
                placeholder="₹ Enter Amount"
                autoCorrect={false}
                keyboardType={'numeric'}
                onChangeText={val => onChangeText('deposit', val)}
                value={state.deposit}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.btnContainer}>
              <Text>Notice Period</Text>
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={state.noticePeriod}
                  style={styles.picker}
                  onValueChange={itemValue =>
                    setState({...state, noticePeriod: itemValue})
                  }>
                  <Picker.Item label="Select Notice Period" value="" />
                  <Picker.Item label="15 Days" value="15 Days" />
                  <Picker.Item label="30 Days" value="30 Days" />
                  <Picker.Item label="45 Days" value="45 Days" />
                  <Picker.Item label="60 Days" value="60 Days" />
                  <Picker.Item label="75 Days" value="75 Days" />
                  <Picker.Item label="90 Days" value="90 Days" />
                </Picker>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onPress} style={styles.arrow}>
            <ArrowIcon backgroundColor={PRIMARY_DARK} type="forward" />
          </TouchableOpacity>
        </>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 15,
  },
  heading: {fontSize: 18, color: PRIMARY, marginLeft: 20},
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 16,
  },
  section: {
    marginVertical: 24,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: GRAY_100,
    height: 50,
    paddingLeft: 20,
    borderRadius: 50,
    maxWidth: 500,
    width: '60%',
    marginBottom: 16,
  },
  date: {
    backgroundColor: GRAY_100,
    height: 50,
    paddingLeft: 20,
    borderRadius: 50,
    maxWidth: 500,
    width: '60%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dateText: {
    color: GRAY_300,
  },
  pickerView: {
    borderRadius: 50,
    overflow: 'hidden',
    width: '60%',
    height: 50,
    maxWidth: 500,
  },
  picker: {
    backgroundColor: GRAY_100,
    color: GRAY_300,
    height: 50,
    width: '100%',
  },
  arrow: {
    marginTop: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  agreementWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  agreementType: {
    marginBottom: 25,
    marginTop: 45,
    fontWeight: 'bold',
  },
  agreementNo: {
    marginBottom: 25,
  },
  mt: {
    marginTop: 5,
  },
  makeBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 25,
    width: DEVICE_WIDTH * 0.9,
    marginTop: DEVICE_WIDTH * 0.17,
  },
  makeText: {
    textAlign: 'center',
    padding: 12,
    color: WHITE,
  },
});

const validateForm = data => {
  let error = '';
  if (!data.startDate) {
    error = 'Start Date is required';
  } else if (!data.endDate) {
    error = ' End Date is required';
  } else if (!data.rent) {
    error = 'Rent amount is required';
  } else if (!data.deposit) {
    error = 'Deposit amount is required';
  } else if (!data.noticePeriod) {
    error = 'Notice Period is required';
  }

  if (error) {
    showSnackbar(error);
  }
  return error;
};

export default AddAgreement;
