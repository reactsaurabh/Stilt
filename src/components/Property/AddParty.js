import React, {useState} from 'react';
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BLACK,
  GRAY_100,
  GRAY_300,
  PRIMARY,
  PRIMARY_DARK,
} from '../../utils/colors';
import {showSnackbar, validateEmail} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';
import {OWNER_TENANT} from '../../utils/constants';

const AddParty = ({onBack, addParty, party, assetID, partyMobileArray}) => {
  const [userInfo, setInfo] = useState({name: '', mobile: '', email: ''});
  const [role, setRole] = useState('');
  const onChangeText = (name, val) => setInfo({...userInfo, [name]: val});
  const validateForm = data => {
    let error;
    if (!data.role) {
      error = 'Select party type';
    } else if (!data.name) {
      error = ' Name is required';
    } else if (!data.email) {
      error = 'Email is required';
    } else if (!data.mobile) {
      error = 'Mobile is required';
    } else if (!validateEmail(data.email)) {
      error = 'Invalid Email';
    } else if (partyMobileArray.includes(data.mobile)) {
      error = 'There is already a party member with this mobile number';
    }

    if (error) {
      showSnackbar(error);
    }
    return error;
  };
  const onAddParty = () => {
    const error = validateForm({...userInfo, role});
    if (!error) {
      const updatedPartyMobile = [...partyMobileArray, userInfo.mobile];
      addParty({
        party,
        assetID,
        partyMobileArray: updatedPartyMobile,
        addedUser: {
          ...userInfo,
          role,
          accountType:
            role === 'Owner' || role === 'Tenant' ? OWNER_TENANT : role,
        },
      });
    }
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Add Party </Text>
      </View>
      <Text style={styles.subHeading}>Party Type</Text>
      <View style={styles.pickerView}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={itemValue => setRole(itemValue)}>
          <Picker.Item label="Select Party Type" value="" />
          <Picker.Item label="Owner" value="Owner" />
          <Picker.Item label="Tenant" value="Tenant" />
          <Picker.Item label="Real Estate Agent" value="Real Estate Agent" />
          <Picker.Item label="Property Manager" value="Property Manager" />
        </Picker>
      </View>
      <Text style={styles.subHeading}>Name</Text>
      <TextInput
        style={[styles.input]}
        placeholder="Enter Name"
        autoCorrect={false}
        keyboardType={'default'}
        onChangeText={val => onChangeText('name', val)}
        value={userInfo.name}
      />
      <Text style={styles.subHeading}>Mobile No</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile"
        autoCorrect={false}
        keyboardType={'phone-pad'}
        onChangeText={val => onChangeText('mobile', val)}
        value={userInfo.mobile}
        maxLength={10}
      />
      <Text style={styles.subHeading}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        autoCorrect={false}
        keyboardType={'email-address'}
        onChangeText={val => onChangeText('email', val)}
        value={userInfo.email}
      />
      <View style={styles.arrow}>
        <TouchableOpacity onPress={onAddParty}>
          <ArrowIcon backgroundColor={PRIMARY_DARK} type="forward" />
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  heading: {fontSize: 18, color: PRIMARY, marginLeft: 20},
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
    marginBottom: 16,
  },
  arrow: {
    marginTop: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default AddParty;
