import firebase from 'react-native-firebase';
import {Navigation} from 'react-native-navigation';
import {
  showSnackbar,
  uploadPhotoFile,
  userInfo,
  uploadVendorPhotoFile,
} from '../utils/helper';
import * as actionType from './types';
import axios from 'axios';
import {VENDOR} from '../utils/constants';
const URL = 'https://ap.moneyorder.ws/';
const CASHFREE_SERVER_MODE = __DEV__ ? 'test' : 'prod';
export const getUserInformation = (
  componentId,
  notificationToken,
) => async dispatch => {
  dispatch({type: actionType.GET_USER_INFO_REQUEST});
  try {
    const uid = firebase.auth().currentUser.uid;
    const res = await userInfo(uid).get();
    if (!res.data().firstName) {
      Navigation.push(componentId, {
        component: {
          name: 'stilt.registerUserInfo',
          options: {
            topBar: {
              visible: false,
            },
          },
        },
      });
    } else {
      const ref = firebase.storage().ref(`${uid}/image`);
      if (res.data().notificationToken !== notificationToken) {
        await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .update({notificationToken});
      }
      ref
        .getDownloadURL()
        .then(image => {
          dispatch({
            type: actionType.GET_USER_INFO_SUCCESS,
            payload: {image: image, ...res.data()},
          });
        })
        .catch(err => {
          console.log(err.message);
          dispatch({
            type: actionType.GET_USER_INFO_SUCCESS,
            payload: {image: null, ...res.data()},
          });
        });
    }
  } catch (e) {
    showSnackbar(e.message);
    dispatch({
      type: actionType.GET_USER_INFO_ERROR,
      payload: {message: e.message},
    });
  }
};

export const updateUserInfo = data => async dispatch => {
  dispatch({type: actionType.UPDATE_USER_INFO_REQUEST});
  const {type = 'update', image, ...info} = data;
  const uid = firebase.auth().currentUser.uid;
  const newImage = typeof image === 'object' && image !== null;
  try {
    const user = await userInfo(uid).get();
    if (user.exists) {
      let url;
      if (newImage) {
        await uploadPhotoFile(image);
        const ref = firebase.storage().ref(`${uid}/image`);
        url = await ref.getDownloadURL();
      }
      type === 'update'
        ? await userInfo(uid).update({...info})
        : await userInfo(uid).set({...info}, {merge: true});

      const response = await userInfo(uid).get();
      dispatch({
        type: actionType.UPDATE_USER_INFO_SUCCESS,
        payload: {image: newImage ? url : image, ...response.data()},
      });
      showSnackbar('Your Information has been updated');
    }
  } catch (e) {
    showSnackbar(e.message);
    dispatch({
      type: actionType.UPDATE_USER_INFO_ERROR,
      payload: {message: e.message},
    });
  }
};

export const getPropertyList = (
  userMobile,
  currentAccountType,
) => async dispatch => {
  dispatch({type: actionType.GET_USER_PROPERTY_REQUEST});
  try {
    const res = await firebase
      .firestore()
      .collection('property')
      .where(userMobile, '==', currentAccountType)
      .get();
    dispatch({type: actionType.GET_USER_PROPERTY_SUCCESS, payload: res.docs});
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_USER_PROPERTY_ERROR, payload: e.message});
  }
};

export const updateProperty = data => async dispatch => {
  dispatch({type: actionType.UPDATE_PROPERTY_INFO_REQUEST});
  try {
    const {
      userMobile,
      getProperty = false,
      transactionInfo,
      ...propertyData
    } = data;
    const res = await firebase
      .firestore()
      .collection('property')
      .doc(propertyData.assetID)
      .set({...propertyData}, {merge: true});

    if (transactionInfo) {
      // Adding transaction for request
      const {requested, ...data} = transactionInfo;
      if (requested) {
        const res = await firebase
          .firestore()
          .collection('transactions')
          .doc(data.transactionID)
          .update({...data});
      } else {
        const res = await firebase
          .firestore()
          .collection('transactions')
          .doc(data.transactionID)
          .set({...data}, {merge: true});
      }
    }

    if (getProperty) {
      const response = await firebase
        .firestore()
        .collection('property')
        .where(userMobile, '==', propertyData[userMobile])
        .get();
      dispatch({type: actionType.UPDATE_PROPERTY_INFO_SUCCESS});
      dispatch({
        type: actionType.GET_USER_PROPERTY_SUCCESS,
        payload: response.docs,
      });
    } else {
      dispatch({type: actionType.UPDATE_PROPERTY_INFO_SUCCESS});
    }
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.UPDATE_PROPERTY_INFO_ERROR});
  }
};

export const updateParty = data => async dispatch => {
  dispatch({type: actionType.UPDATE_PARTY_REQUEST});
  try {
    const {
      addedUser = false,
      assetID,
      party,
      partyMobileArray,
      removedMemberMobile,
    } = data;
    if (addedUser) {
      const existingUser = await firebase
        .firestore()
        .collection('users')
        .where('mobile', '==', addedUser.mobile)
        .get();

      if (!existingUser.empty) {
        const user = existingUser.docs[0];
        // if (!user.data().beneId) {
        //   throw Error(
        //     'Cannot add this user, bank details are not added for this user',
        //   );
        // }
        const addedUserStoredInfo = {
          name: `${user.data().firstName}  ${user.data().lastName}`,
          mobile: user.data().mobile,
          email: user.data().email,
          // beneId: user.data().beneId,
        };
        const ref = firebase.storage().ref(`${user.id}/image`);
        ref
          .getDownloadURL()
          .then(async image => {
            await firebase
              .firestore()
              .collection('property')
              .doc(assetID)
              .set(
                {
                  party: [
                    ...party,
                    {...addedUserStoredInfo, image, role: addedUser.role},
                  ],
                  partyMobileArray,
                  [user.data().mobile]: addedUser.accountType,
                },
                {merge: true},
              );
            dispatch({type: actionType.UPDATE_PARTY_SUCCESS});
          })
          .catch(async err => {
            console.log(err);
            await firebase
              .firestore()
              .collection('property')
              .doc(assetID)
              .set(
                {
                  party: [
                    ...party,
                    {...addedUserStoredInfo, image: null, role: addedUser.role},
                  ],
                  partyMobileArray,
                  [addedUser.mobile]: addedUser.accountType,
                },
                {merge: true},
              );
            dispatch({type: actionType.UPDATE_PARTY_SUCCESS});
          });
      } else {
        throw Error('User does not exist');
        // await firebase
        //   .firestore()
        //   .collection('property')
        //   .doc(assetID)
        //   .set(
        //     {party: [...party, {...addedUser}], partyMobileArray},
        //     {merge: true},
        //   );
        // dispatch({type: actionType.UPDATE_PARTY_SUCCESS});
      }
    } else {
      await firebase
        .firestore()
        .collection('property')
        .doc(assetID)
        .update({
          party,
          partyMobileArray,
          [removedMemberMobile]: firebase.firestore.FieldValue.delete(),
        });
      dispatch({type: actionType.UPDATE_PARTY_SUCCESS});
    }
  } catch (e) {
    console.log(e.message, 'assa');
    showSnackbar(e.message);
    dispatch({type: actionType.UPDATE_PARTY_ERROR});
  }
};

export const resetBeneId = () => ({type: actionType.RESET_BENE_ID});

export const getOtherUserBeneId = userMobile => async dispatch => {
  try {
    dispatch({type: actionType.GET_BENE_ID_REQUEST});
    const res = await firebase.db
      .collection('users')
      .where('mobile', '==', userMobile)
      .get();
    if (res.empty) {
      throw Error('User does not exist');
    } else {
      const otherUser = res.docs[0];
      if (!otherUser.data().beneId) {
        throw Error(
          'Cannot pay this user, bank details are not added for this user',
        );
      } else {
        dispatch({
          type: actionType.GET_BENE_ID_SUCCESS,
          payload: otherUser.data().beneId,
        });
      }
    }
  } catch (error) {
    showSnackbar.error(error.message);
  }
};

export const getTransactions = userMobile => async dispatch => {
  try {
    dispatch({type: actionType.GET_ALL_TRANSACTION_DETAILS_REQUEST});
    const res = await firebase
      .firestore()
      .collection('transactions')
      .where('members', 'array-contains', userMobile)
      .orderBy('paymentDate', 'desc')
      .get();
    dispatch({
      type: actionType.GET_ALL_TRANSACTION_DETAILS_SUCCESS,
      payload: res.docs,
    });
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_ALL_TRANSACTION_DETAILS_ERROR});
  }
};

export const makeTransactions = transactionInfo => async dispatch => {
  try {
    dispatch({type: actionType.TRANSACTION_REQUEST});
    const res = await firebase
      .firestore()
      .collection('transactions')
      .doc()
      .set({...transactionInfo}, {merge: true});
    dispatch({type: actionType.TRANSACTION_SUCCESS});
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.TRANSACTION_ERROR});
  }
};

export const getNotifications = mobile => async dispatch => {
  try {
    dispatch({type: actionType.GET_NOTIFICATION_REQUEST});
    const res = await firebase
      .firestore()
      .collection('notifications')
      .where('members', 'array-contains', mobile)
      .orderBy('createdAt', 'desc')
      .get();
    dispatch({type: actionType.GET_NOTIFICATION_SUCCESS, payload: res.docs});
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_NOTIFICATION_ERROR, payload: e.message});
  }
};

export const getCashFreeToken = () => async dispatch => {
  try {
    dispatch({type: actionType.GET_CASHFREE_USER_TOKEN_REQUEST});

    const res = await axios(`${URL}api/v1/token/${CASHFREE_SERVER_MODE}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', token: 'ceobrtoen'},
    });
    dispatch({
      type: actionType.GET_CASHFREE_USER_TOKEN_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    showSnackbar(error.response.data.msg || error.message);

    dispatch({
      type: actionType.GET_CASHFREE_USER_TOKEN_ERROR,
      payload: error.message,
    });
  }
};

export const addBeneficiary = data => async dispatch => {
  try {
    dispatch({type: actionType.ADD_BENEFICIARY_REQUEST});
    const res = await axios({
      url: `${URL}api/v1/beneficiary/${CASHFREE_SERVER_MODE}`,
      method: 'POST',
      headers: {'Content-Type': 'application/json', token: 'ceobrtoen'},
      data: data,
    });
    dispatch({
      type: actionType.ADD_BENEFICIARY_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    showSnackbar(error.response.data.msg || error.message);

    dispatch({
      type: actionType.ADD_BENEFICIARY_ERROR,
      payload: error.message,
    });
  }
};

export const cashFreePayout = data => async dispatch => {
  try {
    dispatch({type: actionType.PAYOUT_REQUEST});
    const res = await axios({
      url: `${URL}api/v1/payout/${CASHFREE_SERVER_MODE}`,
      method: 'POST',
      headers: {'Content-Type': 'application/json', token: 'ceobrtoen'},
      data: data,
    });
    dispatch({type: actionType.PAYOUT_SUCCESS, payload: res});
  } catch (error) {
    showSnackbar(error.response.data.msg || error.message);
    dispatch({
      type: actionType.PAYOUT_ERROR,
      payload: error.message,
    });
  }
};

export const resetGeneric = () => ({type: actionType.RESET_GENERIC});

export const logout = () => ({type: 'USER_LOGOUT'});

export const addNewVendor = vendorInfo => async dispatch => {
  dispatch({type: actionType.ADD_VENDOR_REQUEST});
  try {
    const checkVendor = await firebase
      .firestore()
      .collection('users')
      .where('mobile', '==', vendorInfo.mobile)
      .get();

    if (!checkVendor.empty) {
      console.log(checkVendor);
      const userData = checkVendor.docs[0];
      if (!userData.data().accountTypes.includes(VENDOR)) {
        throw Error(
          'The number you have added is an existing user and not a vendor',
        );
      } else {
        const customers = userData.data().customers;
        //Add them in your list of vendors and user in vendor customer list
        await firebase
          .firestore()
          .doc(userData.id)
          .set(
            {
              customers: customers
                ? [...customers, vendorInfo.addedBy]
                : [vendorInfo.addedBy.mobile],
            },
            {merge: true},
          );
        await firebase
          .firestore()
          .doc(vendorInfo.addedBy.uid)
          .set({
            myVendors: vendorInfo.addedBy.myVendors
              ? [...vendorInfo.addedBy.myVendors, vendorInfo.mobile]
              : [vendorInfo.mobile],
          });
        showSnackbar('Vendor has been added');
      }
    } else {
      //create a vendor with the entered details
      const res = await firebase
        .firestore()
        .collection('users')
        .doc()
        .set(vendorInfo);
      dispatch({type: actionType.ADD_VENDOR_SUCCESS, payload: vendorInfo});
      showSnackbar('Vendor has been added');
    }
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.ADD_VENDOR_ERROR});
  }
};

export const getVendors = customerMobile => async dispatch => {
  try {
    dispatch({type: actionType.GET_VENDOR_REQUEST});

    const res = await firebase
      .firestore()
      .collection('users')
      .where('customers', 'array-contains', customerMobile)
      .get();

    dispatch({
      type: actionType.GET_VENDOR_SUCCESS,
      payload: res.docs,
    });
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_VENDOR_ERROR});
  }
};

export const getVendorsByCategory = category => async dispatch => {
  try {
    dispatch({type: actionType.GET_CATEGORY_VENDOR_REQUEST});

    firebase
      .firestore()
      .collection('vendors')
      .where('vendorCategory', '==', category)
      .onSnapshot(async function(res) {
        let vendorData = res.docs.map(doc => {
          let item = {
            docId: doc.id,
            data: doc.data(),
          };
          return item;
        });

        dispatch({
          type: actionType.GET_CATEGORY_VENDOR_SUCCESS,
          payload: vendorData,
        });
      });
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_CATEGORY_VENDOR_ERROR});
  }
};

export const addToMyService = (docId, vendorInfo) => async dispatch => {
  try {
    dispatch({type: actionType.ADD_TO_MYSERVICE_REQUEST});

    const res = await firebase
      .firestore()
      .collection('vendors')
      .doc(docId)
      .update(vendorInfo);

    dispatch({
      type: actionType.ADD_TO_MYSERVICE_SUCCESS,
    });
    showSnackbar('Your service has been updated');
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.ADD_TO_MYSERVICE_ERROR});
  }
};

export const setNavigationTitle = titleName => dispatch => {
  dispatch({type: actionType.SET_NAVIGATION_TITLE, payload: titleName});
};

export const getVendorsById = docid => async dispatch => {
  try {
    dispatch({type: actionType.GET_SELECTED_VENDOR_REQUEST});

    const res = await firebase
      .firestore()
      .collection('vendors')
      .doc(docid)
      .get();

    let vendorData = res.data();

    dispatch({
      type: actionType.GET_SELECTED_VENDOR_SUCCESS,
      payload: vendorData,
    });
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_SELECTED_VENDOR_ERROR});
  }
};

export const deleteVendor = docId => async dispatch => {
  try {
    dispatch({type: actionType.DELETE_VENDOR_REQUEST});

    await firebase
      .firestore()
      .collection('vendors')
      .doc(docId)
      .delete()
      .then(data => {
        dispatch({
          type: actionType.DELETE_VENDOR_SUCCESS,
        });
      })
      .catch(error => {
        showSnackbar(error.message);
        dispatch({type: actionType.DELETE_VENDOR_ERROR});
      });
  } catch (e) {
    showSnackbar(e.message);
    dispatch({type: actionType.GET_SELECTED_VENDOR_ERROR});
  }
};
