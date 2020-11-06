import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BLACK, GRAY_200, GRAY_400, PRIMARY} from '../../utils/colors';
import {dateFormatter} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';

const PreviousAgreement = ({
  previousAgreement,
  onBack,
  onShowAgreementInfo,
  showAgreementInfo,
}) => {
  return (
    <>
      {!showAgreementInfo && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <ArrowIcon color={BLACK} arrowSize={30} type="back" />
            </TouchableOpacity>
            <Text style={styles.heading}> Previous Agreement </Text>
          </View>
          {previousAgreement
            .filter(agr => !agr.currentAgreement)
            .map((agreement, index) => (
              <TouchableOpacity
                onPress={() => onShowAgreementInfo({index, ...agreement})}
                key={agreement.depositAgreementNo}
                style={styles.agreementView}>
                <View style={[styles.listView, styles.top]}>
                  <View style={styles.listInfo}>
                    <Text style={styles.infoText}>
                      Deposit (Smart Contract)
                    </Text>
                    <Text style={styles.infoSubText}>
                      No. {agreement.depositAgreementNo} Created:{' '}
                      {
                        dateFormatter(agreement.createdAt.seconds * 1000)
                          .fullDate
                      }
                    </Text>
                  </View>
                  <Text>₹{agreement.deposit}</Text>
                </View>
                <View style={{marginVertical: 10}} />
                <View style={styles.listView}>
                  <View style={styles.listInfo}>
                    <Text style={styles.infoText}>Rent (Smart Contract)</Text>
                    <Text style={styles.infoSubText}>
                      No. {agreement.rentAgreementNo} Created:{' '}
                      {
                        dateFormatter(agreement.createdAt.seconds * 1000)
                          .fullDate
                      }
                    </Text>
                  </View>

                  <Text>₹{agreement.rent}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {fontSize: 18, color: PRIMARY, marginLeft: 20},
  top: {
    marginTop: 32,
  },
  agreementView: {
    borderBottomWidth: 1,
    borderBottomColor: GRAY_200,
    paddingBottom: 16,
  },
  listView: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listInfo: {
    height: '100%',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 16,
  },
  infoSubText: {
    fontSize: 14,
    color: GRAY_400,
  },
});

export default PreviousAgreement;
