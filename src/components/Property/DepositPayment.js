import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  BLACK,
  GOLDEN,
  GRAY_200,
  GRAY_300,
  PRIMARY,
  PRIMARY_DARK,
  WHITE,
} from '../../utils/colors';
import {randomGenerator} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';
import cloneDeep from 'clone-deep';
import Checkout from '../../screens/Checkout';
import {showSnackbar} from '../../utils/helper';
import {useSelector, useDispatch} from 'react-redux';
import {cashFreePayout, getOtherUserBeneId, resetBeneId} from '../../actions';
export default function DepositPayment({
  onBack,
  showMessage,
  depositRefund,
  deposit,
  userRole,
  depositStatus,
  assetID,
  onPayment,
  party,
  transactionID,
  agreement,
  currentAgreementIndex,
  propertyName,
}) {
  const [checkout, setCheckout] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.userInfo);
  const cashFreeToken = useSelector(state => state.cashFreeToken);
  const [paymentType, setPaymentType] = useState('');
  const [generatedTxnId, setTxnId] = useState('');
  const otherUserBeneId = useSelector(state => state.otherUserBeneId);

  useEffect(() => {
    if (otherUserBeneId.isSuccess) {
      if (paymentType === 'Deposit') {
        onClickDepositPayment();
      } else {
        onClickDepositRefund();
      }
    }
    return () => dispatch(resetBeneId());
  }, [otherUserBeneId.isSuccess]);
  const renderBtnText = () => {
    let text = '';
    if (depositStatus === 'Requested') {
      text = 'Pending';
    } else {
      switch (userRole) {
        case 'Owner':
          text = 'Request';
          break;
        case 'Tenant':
          text = 'Pay';
          break;
      }
    }
    return text;
  };
  const renderRefundText = () => {
    let text = '';
    if (depositRefund === 'Requested') {
      text = 'Pending';
    } else {
      switch (userRole) {
        case 'Owner':
          text = 'Refund';
          break;
        case 'Tenant':
          text = 'Request';
          break;
      }
    }
    return text;
  };
  const owner = party.filter(p => p.role === 'Owner')[0];
  const tenant = party.filter(p => p.role === 'Tenant')[0];
  const payoutToUser = () => {
    const data = {
      beneId: otherUserBeneId.data,
      amount: Number(deposit).toFixed(2),
      remark: `${paymentType} payment`,
      token: cashFreeToken.data.data.token,
    };
    dispatch(cashFreePayout(data));
  };

  const updatingDepositAgreement = () => {
    const transactionInfo = {
      payment: deposit,
      payee: {...owner},
      payer: {...tenant},
      service: 'Deposit Payment',
      members: [owner.mobile, tenant.mobile],
      paymentDate: new Date(),
    };
    const updatedAgreement = cloneDeep(agreement);
    if (userRole === 'Tenant') {
      const depositStatusTransactionID =
        (transactionID && transactionID.depositStatus) || generatedTxnId;
      updatedAgreement.splice(currentAgreementIndex, 1, {
        ...agreement[currentAgreementIndex],
        depositStatus: 'Paid',
      });

      onPayment({
        assetID,
        agreement: updatedAgreement,
        transactionInfo: {
          ...transactionInfo,
          paymentStatus: 'Completed',
          transactionID: depositStatusTransactionID,
          ...(transactionID &&
            transactionID.depositStatus && {requested: true}),
        },
      });
    } else if (userRole === 'Owner' && depositStatus === undefined) {
      updatedAgreement.splice(currentAgreementIndex, 1, {
        ...agreement[currentAgreementIndex],
        depositStatus: 'Requested',
        transactionID: {
          depositStatus: generatedTxnId,
        },
      });

      onPayment({
        assetID,
        agreement: updatedAgreement,
        transactionInfo: {
          ...transactionInfo,
          transactionID: generatedTxnId,
          paymentStatus: 'In Progress',
          type: 'Request',
        },
      });
    }
  };
  const updateDepositRefundAgreement = () => {
    const transactionInfo = {
      payment: deposit,
      payer: {...owner},
      payee: {...tenant},
      service: 'Deposit Refund',
      members: [owner.mobile, tenant.mobile],
      paymentDate: new Date(),
    };
    const updatedAgreement = cloneDeep(agreement);

    if (userRole === 'Tenant' && depositRefund === undefined) {
      updatedAgreement.splice(currentAgreementIndex, 1, {
        ...agreement[currentAgreementIndex],
        depositRefund: 'Requested',
        transactionID: {
          ...transactionID,
          depositStatus: generatedTxnId,
        },
      });

      onPayment({
        assetID,
        agreement: updatedAgreement,
        transactionInfo: {
          ...transactionInfo,
          transactionID: generatedTxnId,
          paymentStatus: 'In Progress',
          type: 'Request',
        },
      });
    } else if (userRole === 'Owner') {
      const depositRefundTransactionID =
        (transactionID && transactionID.depositRefund) || generatedTxnId;

      updatedAgreement.splice(currentAgreementIndex, 1, {
        ...agreement[currentAgreementIndex],
        depositRefund: 'Paid',
      });

      onPayment({
        assetID,
        agreement: updatedAgreement,
        transactionInfo: {
          ...transactionInfo,
          paymentStatus: 'Completed',
          transactionID: depositRefundTransactionID,
          ...(transactionID &&
            transactionID.depositRefund && {requested: true}),
        },
      });
    }
  };
  const onClickDepositPayment = () => {
    if (userRole === 'Owner') {
      updatingDepositAgreement();
    } else {
      if (!userInfo.data.upi || !userInfo.data.email) {
        showSnackbar(
          'Please fill your bank information and email  in Settings',
        );
        return;
      }
      setTxnId(randomGenerator(16));
      // setPaymentType('Deposit');
      setCheckout(true);
    }
  };

  const onClickDepositRefund = () => {
    if (userRole === 'Tenant') {
      updateDepositRefundAgreement();
    } else {
      if (!userInfo.data.upi || !userInfo.data.email) {
        showSnackbar(
          'Please fill your bank information and email  in Settings',
        );
        return;
      }
      setTxnId(randomGenerator(16));
      // setPaymentType('Refund');
      setCheckout(true);
    }
  };

  const paymentCallback = paymentData => {
    const data = JSON.parse(paymentData);
    if (data.txStatus === 'SUCCESS') {
      showSnackbar(data.txMsg);
      if (paymentType === 'Deposit') {
        updatingDepositAgreement();
      } else if (paymentType === 'Refund') {
        updateDepositRefundAgreement();
      }
      payoutToUser();
    } else if (data.txStatus === 'FAILED' || data.txStatus === 'CANCELLED') {
      alert(data.txMsg);
    }
    setCheckout(false);
  };

  const checkOtherUserBeneId = paymentType => {
    const mobile = paymentType === 'Deposit' ? owner.mobile : tenant.mobile;
    setPaymentType(paymentType);
    dispatch(getOtherUserBeneId(mobile));
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Deposit Payment </Text>
      </View>
      {checkout && (
        <View>
          <Checkout
            orderAmount={deposit}
            callback={paymentCallback}
            orderNote={`${propertyName} - Deposit Payment of ₹${deposit}`}
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
          <View style={styles.listItem}>
            <Text style={styles.text}>1</Text>
            <View style={styles.infoView}>
              <Text style={styles.text}>Deposit Payment</Text>
              <Text style={styles.text}>₹ {deposit}</Text>
            </View>
            {depositStatus === 'Paid' ? (
              <Text style={[styles.text, styles.completed]}>Completed</Text>
            ) : (
              <TouchableOpacity
                style={[
                  styles.button,
                  depositStatus === 'Requested' && {backgroundColor: GOLDEN},
                ]}
                onPress={() => checkOtherUserBeneId('Deposit')}>
                <Text style={styles.btnText}>{renderBtnText()}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.listItem}>
            <Text style={styles.text}>2</Text>
            <View style={styles.infoView}>
              <Text style={styles.text}>Deposit Refund</Text>
              <Text style={styles.text}>₹ {deposit}</Text>
            </View>
            {depositRefund === 'Paid' ? (
              <Text style={[styles.text, styles.completed]}>Completed</Text>
            ) : (
              <TouchableOpacity
                disabled={
                  depositStatus !== 'Paid' ||
                  (userRole === 'Tenant' && depositRefund === 'Requested')
                }
                style={[
                  styles.button,
                  {backgroundColor: GRAY_300},
                  depositStatus === 'Paid' && {backgroundColor: PRIMARY_DARK},
                  depositRefund === 'Requested' && {backgroundColor: GOLDEN},
                ]}
                onPress={() => checkOtherUserBeneId('Rent')}>
                <Text style={styles.btnText}>{renderRefundText()}</Text>
              </TouchableOpacity>
            )}
          </View>
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
  message: {
    height: 120,
    justifyContent: 'space-between',
  },
  completed: {
    marginLeft: 'auto',
    color: PRIMARY,
    width: 100,
    textAlign: 'center',
  },
});
