import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {updateUserInfo} from '../../actions';
import {GRAY_200, GRAY_400, PRIMARY} from '../../utils/colors';
import {
  AGENT,
  OWNER_TENANT,
  PROPERTY_MANAGER,
  VENDOR,
} from '../../utils/constants';
import {DEVICE_WIDTH} from '../../utils/helper';
const ACCOUNT = [
  {
    type: OWNER_TENANT,
    text: 'Add Owner-Tenant Account',
    subText: 'Owner-Tenant Account',
  },
  {type: VENDOR, text: 'Add Vendor Account', subText: 'Vendor Account'},
  {
    type: AGENT,
    text: 'Add Agency Account',
    subText: 'Real-Estate Agent Account',
  },
  {
    type: PROPERTY_MANAGER,
    text: 'Add Property Mgr Account',
    subText: 'Property Manager Account',
  },
];
const AddAccountModal = ({open, toggleModal, userInfo}) => {
  const dispatch = useDispatch();
  const {data} = userInfo;
  const switchAccount =
    (data && data.accountTypes.filter(a => a !== data.currentAccountType)) ||
    [];
  const addAccount =
    (data && ACCOUNT.filter(a => !data.accountTypes.includes(a.type))) || [];
  const onAddAccount = type => {
    const updatedData = {
      accountTypes: [...data.accountTypes, type],
      currentAccountType: type,
    };
    dispatch(updateUserInfo(updatedData));
    toggleModal();
  };
  const onSwitchAccount = type => {
    dispatch(updateUserInfo({currentAccountType: type}));
    toggleModal();
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        toggleModal();
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalBlock}>
          <View style={styles.listView}>
            {userInfo.data && data.image ? (
              <Image source={{uri: data.image}} style={styles.profile} />
            ) : (
              <Icon name="ios-contact" size={70} />
            )}
            <View style={styles.listInfo}>
              {userInfo.data && (
                <Text style={styles.infoText}>{`${data.firstName} ${
                  data.lastName
                }`}</Text>
              )}
              {userInfo.data && (
                <Text style={styles.infoSubtext}>
                  {data.currentAccountType} Account
                </Text>
              )}
            </View>
          </View>
          <View style={styles.separator} />
          {switchAccount.map((a, index) => (
            <TouchableOpacity
              key={a + index}
              style={styles.accountList}
              onPress={() => onSwitchAccount(a)}>
              <View style={styles.logoView}>
                <Image
                  source={require('../../assets/images/services.png')}
                  style={styles.logo}
                />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.addAccountText}>Switch to {a}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {addAccount.map(({type, text, subText}) => (
            <TouchableOpacity
              key={type + text}
              style={styles.accountList}
              onPress={() => onAddAccount(type)}>
              <View style={styles.logoView}>
                <Image
                  source={require('../../assets/images/services.png')}
                  style={styles.logo}
                />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.addAccountText}>{text}</Text>
                <Text style={styles.infoSubtext}>{subText}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modalBlock: {
    width: DEVICE_WIDTH * 0.95,
    // height: DEVICE_HEIGHT * 0.45,
    backgroundColor: 'white',
    marginTop: 100,
    borderRadius: 20,
    padding: 16,
  },
  separator: {
    borderTopColor: GRAY_200,
    width: '100%',
    borderTopWidth: 2,
    marginTop: 20,
    marginBottom: 20,
  },
  listView: {
    flexDirection: 'row',
    height: 70,
  },
  profile: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  listInfo: {
    marginLeft: 20,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-around',
  },
  infoText: {
    color: PRIMARY,
    fontSize: 20,
    fontWeight: '100',
  },
  infoSubtext: {
    color: GRAY_400,
    fontSize: 12,
  },
  accountList: {flexDirection: 'row', height: 60, marginBottom: 15},
  logoView: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY_200,
  },
  logo: {
    width: 20,
    height: 20,
  },
  addAccountText: {
    fontSize: 16,
  },
});

export default AddAccountModal;
