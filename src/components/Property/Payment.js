import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  BLACK,
  GOLDEN,
  GRAY_100,
  GRAY_300,
  PRIMARY_DARK,
  WHITE,
} from '../../utils/colors';
import {capitalize, randomGenerator} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';
const Payment = ({
  payerMobile,
  payerName,
  payeeName,
  payeeMobile,
  onBack,
  amount,
  service,
  paymentIcon: icon,
}) => {
  const paymentIcon = () =>
    icon === 'Requested' || icon === 'In Progress' ? (
      <Icon name="ios-alert" color={GOLDEN} size={40} />
    ) : (
      <Icon name="ios-checkmark-circle" color="#69ed21" size={40} />
    );
  return (
    <View style={styles.successBlock}>
      <View style={styles.paymentDetailsBlock}>
        <TouchableOpacity onPress={onBack} style={styles.arrow}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>

        <Text
          style={[
            styles.heading,
            {
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 24,
              marginBottom: 16,
            },
          ]}>
          {capitalize(service)}
        </Text>
        <View style={styles.amountView}>
          <Text style={styles.amount}>{`₹${amount}`}</Text>
          {paymentIcon()}
        </View>
        <Text style={styles.date}>{new Date().toLocaleString()}</Text>
      </View>
      <View style={styles.paymentInfoBlock}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>TO</Text>
          <Text style={styles.nameText}>{payeeName}</Text>
          <Text style={styles.subText}>{payeeMobile}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoText}>FROM</Text>
          <Text style={styles.nameText}>{payerName}</Text>
          <Text style={styles.subText}>{payerMobile}</Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.subText}>UPI Reference ID -</Text>
          <View style={{marginVertical: 8}} />
          <Text style={styles.subText}>
            Transaction ID {randomGenerator(12)}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  paymentDetailsBlock: {
    padding: 16,
    backgroundColor: GRAY_100,
    paddingBottom: 32,
  },
  date: {
    fontSize: 18,
    marginVertical: 16,
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  amount: {
    color: PRIMARY_DARK,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  arrow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  paymentInfoBlock: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  infoBlock: {
    height: 90,
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  infoText: {
    fontSize: 18,
    color: GRAY_300,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
  },
  transactionDetails: {
    marginTop: 16,
  },
});
export default Payment;
