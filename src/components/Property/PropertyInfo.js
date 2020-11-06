import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import ArrowIcon from '../UI/ArrowIcon';
import {BLACK, PRIMARY, GRAY_400} from '../../utils/colors';

export default function PropertyInfo({
  property,
  onBack,
  assetID,
  assetStatus,
  assetType,
}) {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Property Info </Text>
      </View>
      <Text style={styles.fieldName}>Asset ID</Text>
      <Text style={styles.fieldText}>{assetID}</Text>
      <Text style={styles.fieldName}>Asset Status</Text>
      <Text style={styles.fieldText}>{assetStatus}</Text>
      <Text style={styles.fieldName}>Asset Type</Text>
      <Text style={styles.fieldText}>{assetType}</Text>
      <Text style={styles.fieldName}>Property Location</Text>
      <Text style={styles.fieldText}>{property.addLine1}</Text>
      <Text style={styles.fieldText}>{property.addLine2}</Text>
      {property.addLine3 && (
        <Text style={styles.fieldText}>{property.addLine3}</Text>
      )}
      <Text style={styles.fieldText}>{property.city}</Text>
      <Text style={styles.fieldText}>{property.state}</Text>
      <Text style={styles.fieldText}>{property.country}</Text>
      <Text style={styles.fieldText}>{property.pin}</Text>
    </>
  );
}

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
});
