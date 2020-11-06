import cloneDeep from 'clone-deep';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Checkout from '../../screens/Checkout';
import {
  BLACK,
  GOLDEN,
  GRAY_200,
  PRIMARY,
  PRIMARY_DARK,
  WHITE,
} from '../../utils/colors';
import {
  randomGenerator,
  showSnackbar,
  getRentMonthTime,
} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';
import {useSelector, useDispatch} from 'react-redux';
import {cashFreePayout, getOtherUserBeneId, resetBeneId} from '../../actions';
export default function RentPayment({
  onBack,
  showMessage,
  rent,
  userRole,
  rentPayment,
  onRent,
  assetID,
  party,
  agreement,
  currentAgreementIndex,
  propertyName,
  rentStartDate,
}) {
  const dispatch = useDispatch();
  const cashFreeToken = useSelector(state => state.cashFreeToken);
  const userInfo = useSelector(state => state.userInfo);
  const owner = party.filter(p => p.role === 'Owner')[0];
  const tenant = party.filter(p => p.role === 'Tenant')[0];
  const [checkout, setCheckout] = useState(false);
  const [rentIndex, setRentIndex] = useState(0);
  const [rentMonthInfo, setRentMonthInfo] = useState('');
  const [generatedTxnId, setTxnId] = useState('');
  const otherUserBeneId = useSelector(state => state.otherUserBeneId);
  useEffect(() => {
    if (otherUserBeneId.isSuccess) {
      onPayment();
    }
    return () => dispatch(resetBeneId());
  }, [otherUserBeneId.isSuccess]);
  const renderBtnText = () => {
    let text = '';
    switch (userRole) {
      case 'Owner':
        text = 'Request';
        break;
      case 'Tenant':
        text = 'Pay';
        break;
    }
    return text;
  };

  const onRentPayment = paymentData => {
    const data = JSON.parse(paymentData);
    setCheckout(false);

    if (data.txStatus === 'SUCCESS') {
      showSnackbar(data.txMsg);
      updatingRentPayment();
      payoutToOwner();
    } else if (data.txStatus === 'FAILED' || data.txStatus === 'CANCELLED') {
      alert(data.txMsg);
    }
  };

  const onPayment = index => {
    if (userRole === 'Owner') {
      updatingRentPayment();
    } else {
      if (!userInfo.data.upi || !userInfo.data.email) {
        showSnackbar(
          'Please fill your bank information and email  in Settings',
        );
        return;
      }
      const startDate = new Date(rentStartDate.seconds * 1000);
      const rentTimeInfo = getRentMonthTime(startDate, rentIndex);
      setRentMonthInfo(rentTimeInfo);
      setTxnId(randomGenerator(16));
      // updatingRentPayment() without loading paymentStatus In Process
      setCheckout(true);
    }
  };

  const updatingRentPayment = () => {
    const updatedAgreement = cloneDeep(agreement);
    let paymentStatus = userRole === 'Owner' ? 'Requested' : 'Paid';
    const updatedRentPayment = cloneDeep(rentPayment);
    const transactionID = updatedRentPayment[rentIndex].transactionID;
    updatedRentPayment.splice(rentIndex, 1, {
      paymentStatus,
      transactionID: transactionID || generatedTxnId,
    });
    updatedAgreement.splice(currentAgreementIndex, 1, {
      ...agreement[currentAgreementIndex],
      rentPayment: updatedRentPayment,
    });
    onRent({
      agreement: updatedAgreement,
      assetID,
      transactionInfo: {
        transactionID: transactionID || generatedTxnId,
        ...(transactionID && {requested: true}),
        payment: rent,
        payee: {...owner},
        payer: {...tenant},
        service: 'Rent Payment',
        members: [owner.mobile, tenant.mobile],
        paymentDate: new Date(),
        paymentStatus: 'Completed',
        ...(userRole === 'Owner' && {
          paymentStatus: 'In Progress',
          type: 'Request',
        }),
      },
    });
  };

  const payoutToOwner = () => {
    const data = {
      beneId: otherUserBeneId.data,
      amount: Number(rent).toFixed(2),
      remark: 'Rent payment',
      token: cashFreeToken.data.data.token,
    };

    dispatch(cashFreePayout(data));
  };

  const checkOtherUserBeneId = index => {
    setRentIndex(index);
    dispatch(getOtherUserBeneId(owner.mobile));
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Rent Payment </Text>
      </View>
      {checkout && (
        <View>
          <Checkout
            orderAmount={rent}
            callback={onRentPayment}
            orderNote={`${propertyName} - Rent payment of ₹${rent} for ${rentMonthInfo} `}
            orderId={`${assetID}-${generatedTxnId}`}
          />
        </View>
      )}
      {showMessage ? (
        <View style={styles.message}>
          <Text style={styles.text}>For Payments</Text>
          <Text style={styles.text}>
            Add Parties – Owner and Tenant under the property
          </Text>
          <Text style={styles.text}>Create Deposit and Rent Agreement</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {rentPayment.map((c, index) => (
            <View style={styles.listItem} key={index}>
              <Text style={styles.text}>{index + 1}</Text>
              <View style={styles.infoView}>
                <Text style={styles.text}>Rent Payment</Text>
                <Text style={styles.text}>{`₹ ${rent}`}</Text>
              </View>
              {c.paymentStatus === 'Paid' ? (
                <Text style={[styles.text, styles.completed]}>Completed</Text>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.button,
                    c.paymentStatus === 'Requested' && {
                      backgroundColor: GOLDEN,
                    },
                  ]}
                  onPress={() => onPayment(index)}
                  disabled={
                    (index > 0 &&
                      rentPayment[index - 1].paymentStatus !== 'Paid') ||
                    (c.paymentStatus === 'Requested' && userRole === 'Owner')
                  }>
                  <Text style={styles.btnText}>
                    {c.paymentStatus === 'Requested'
                      ? 'Pending'
                      : renderBtnText()}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  heading: {fontSize: 18, color: PRIMARY, marginLeft: 20},
  listItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoView: {
    height: 60,
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  button: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 25,
    width: 100,
    height: 35,
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: WHITE,
    fontSize: 14,
  },
  text: {
    fontSize: 16,
  },
  completed: {
    marginLeft: 'auto',
    color: PRIMARY,
    width: 100,
    textAlign: 'center',
  },
  message: {
    height: 120,
    justifyContent: 'space-between',
  },
});
