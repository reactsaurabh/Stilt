import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import CashfreePG from 'cashfreereactnativepg';
import {useSelector} from 'react-redux';
const APP_ID = __DEV__
  ? '1531917643cf61f3cac153cdf91351'
  : '47994f7cdaa605cc117ae400049974';
const TOKEN_URL = __DEV__
  ? 'https://test.cashfree.com/api/v2/cftoken/order'
  : 'https://api.cashfree.com/api/v2/cftoken/order';
const CLIENT_SECRET = __DEV__
  ? 'f4de762ada90e0de55a669f41a750bb322ad4de2'
  : '13d15eeab2262769121105171d249859c9c6bf30';
const Checkout = ({orderAmount, callback, orderNote}) => {
  console.log(orderNote, '==');
  const userInfo = useSelector(state => state.userInfo);
  const [state, setState] = useState({
    order: {
      appId: APP_ID,
      // appId: '1531917643cf61f3cac153cdf91351',
      orderId: `${Math.floor(Math.random() * 10000)}`,
      orderCurrency: 'INR',
      orderNote: 'This is an order note',
      source: 'reactsdk',
      customerName: 'John',
      customerEmail: 'abc@email.com',
      customerPhone: '1234561234',
      notifyUrl: '',
      paymentModes: '',
      env: 'TEST',
      tokenData: '',
    },
    urlCalled: null,
    urlResponse: {},
    testData: null,
    eventData: null,
    count: 0,
    modifyOrder: false,
  });
  useEffect(() => {
    getToken();
  }, []);
  const getToken = () => {
    try {
      const {orderId, orderCurrency} = state.order;
      const tokenUrl = 'https://api.cashfree.com/api/v2/cftoken/order';
      // const tokenUrl = 'https://test.cashfree.com/api/v2/cftoken/order';
      fetch(TOKEN_URL, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': APP_ID,
          'x-client-secret': CLIENT_SECRET,
          // 'x-client-id': '1531917643cf61f3cac153cdf91351',
          // 'x-client-secret': 'f4de762ada90e0de55a669f41a750bb322ad4de2',
        },
        body: JSON.stringify({
          orderId,
          orderAmount,
          orderCurrency,
        }),
      })
        .then(result => {
          console.log(result);
          return result.json();
        })
        .then(response => {
          // setState({urlCalled: true, urlResponse: response});
          return response;
        })
        .then(response => {
          console.log('response');
          console.log(response);
          if (
            response.status === 'OK' &&
            response.message === 'Token generated'
          ) {
            var order = {...state.order};
            order.tokenData = response.cftoken;
            setState({
              order,
              modifyOrder: false,
              urlCalled: true,
              urlResponse: response,
            });
            return;
          }
          throw {
            name: 'response not success',
            message: 'response was not successfull \n',
            response,
          };
        })
        .catch(err => {
          console.log('err caught');
          console.log(err);
        });
    } catch (err) {}
  };
  return (
    <View style={{flex: 1}}>
      <CashfreePG
        appId={state.order.appId}
        orderId={state.order.orderId}
        orderAmount={orderAmount}
        orderCurrency="INR"
        orderNote={orderNote}
        source="reactsdk"
        customerName={`${userInfo.data.firstName} ${userInfo.data.lastName}`}
        customerEmail={userInfo.data.email}
        customerPhone={userInfo.data.mobile}
        notifyUrl=""
        paymentModes="upi"
        env={__DEV__ ? 'test' : ''}
        tokenData={state.order.tokenData}
        callback={eventData => {
          console.log('event data in callback function');
          console.log(eventData);
          setState({...state, eventData});
          callback(eventData);
        }}
        paymentOption="upi" //nb,card,upi,wallet
        upi_vpa={userInfo.data.upi}
      />
    </View>
  );
};

export default Checkout;
