import {combineReducers} from 'redux';
import userReducer from './userReducer';
import genericReducer from './genericReducer';
import propertyReducer from './propertyReducer';
import transactionsReducer from './transactionReducer';
import notificationsReducer from './notificationsReducer';
import cashFreeTokenReducer from './cashFreeTokenReducer';
import serviceReducer from './serviceReducer';
import beneId from './beneReducer';

const appReducer = combineReducers({
  userInfo: userReducer,
  generic: genericReducer,
  propertyList: propertyReducer,
  transactions: transactionsReducer,
  notifications: notificationsReducer,
  cashFreeToken: cashFreeTokenReducer,
  service: serviceReducer,
  otherUserBeneId: beneId,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
