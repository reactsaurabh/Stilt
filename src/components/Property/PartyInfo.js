import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ArrowIcon from '../UI/ArrowIcon';
import {BLACK, PRIMARY, GRAY_400, GRAY_300, WHITE} from '../../utils/colors';

const PartyInfo = ({
  onBack,
  member,
  onRemoveMember,
  party,
  partyMobileArray,
  assetID,
}) => {
  const onRemove = () => {
    const {index, mobile} = member;
    const updatedParty = party.filter((p, i) => index !== i);
    const updatedPartyMobileArray = partyMobileArray.filter(
      (p, i) => index !== i,
    );
    onRemoveMember({
      party: updatedParty,
      partyMobileArray: updatedPartyMobileArray,
      assetID,
      removedMemberMobile: mobile,
    });
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Party Info </Text>
      </View>
      <Text style={styles.fieldName}>Party Type</Text>
      <Text style={styles.fieldText}>{member.role}</Text>
      <Text style={styles.fieldName}>Name</Text>
      <Text style={styles.fieldText}>{member.name}</Text>
      <Text style={styles.fieldName}>Mobile No</Text>
      <Text style={styles.fieldText}>{member.mobile}</Text>
      <Text style={styles.fieldName}>Email</Text>
      <Text style={styles.fieldText}>{member.email}</Text>
      <TouchableOpacity
        onPress={onRemove}
        style={styles.removeBtn}
        activeOpacity={0.8}>
        <Text style={styles.btnText}>Remove</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {fontSize: 18, color: PRIMARY, marginLeft: 20},
  fieldName: {
    color: GRAY_400,
    fontWeight: 'bold',
    marginTop: 24,
    fontSize: 18,
  },
  fieldText: {
    fontSize: 18,
    marginVertical: 16,
  },
  removeBtn: {
    marginTop: 32,
    width: '100%',
    backgroundColor: GRAY_300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 30,
  },
  btnText: {
    color: WHITE,
    fontWeight: 'bold',
  },
});

export default PartyInfo;
