import cloneDeep from 'clone-deep';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  BLACK,
  GRAY_300,
  GRAY_400,
  PRIMARY,
  WHITE,
  PRIMARY_DARK,
} from '../../utils/colors';
import {dateFormatter, showSnackbar} from '../../utils/helper';
import ArrowIcon from '../UI/ArrowIcon';
import firebase from 'react-native-firebase';
import RNFetchBlob from 'rn-fetch-blob';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const AgreementInfo = ({
  onBack,
  clickedAgreement,
  agreement,
  cancelAgreement,
  assetID,
  currentAgreementIndex,
  propertyDetails,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  useEffect(() => {
    const ref = firebase
      .storage()
      .ref(`agreement/${propertyDetails.assetID}${currentAgreementIndex}.pdf`);
    ref
      .getDownloadURL()
      .then(res => {
        setPdfUrl(res);
      })
      .catch(err => console.log(err));
  }, []);
  const onCancelAgreement = () => {
    const updateAgreement = cloneDeep(agreement);
    updateAgreement[currentAgreementIndex].currentAgreement = false;
    cancelAgreement({
      agreement: updateAgreement,
      assetID,
    });
  };
  const download = () => {
    const {config, fs} = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${DownloadDir}/agreement-${
          propertyDetails.assetID
        }${currentAgreementIndex}.pdf`,
        description: 'Agreement Pdf',
      },
    };
    config(options)
      .fetch('GET', pdfUrl)
      .then(res => {
        showSnackbar('File Downloaded successfully');
      });
  };

  const requestDownloadPermission = () => {
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
      if (result === 'granted') {
        download();
      }
    });
  };

  const checkDownloadPermission = async () => {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            showSnackbar('Feature not available on your phone');
            break;
          case RESULTS.DENIED:
            requestDownloadPermission();
            break;
          case RESULTS.GRANTED:
            download();
            break;
          case RESULTS.BLOCKED:
            showSnackbar(
              'You have blocked the permission to write to the storage',
            );
            break;
        }
      })
      .catch(error => {
        showSnackbar(error);
      });
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowIcon color={BLACK} arrowSize={30} type="back" />
        </TouchableOpacity>
        <Text style={styles.heading}> Agreement Info </Text>
      </View>
      <Text style={styles.fieldName}>Start Date</Text>
      <Text style={styles.fieldText}>
        {dateFormatter(clickedAgreement.startDate.seconds * 1000).fullDate}
      </Text>
      <Text style={styles.fieldName}>End Date</Text>
      <Text style={styles.fieldText}>
        {dateFormatter(clickedAgreement.endDate.seconds * 1000).fullDate}
      </Text>
      <Text style={styles.fieldName}>Deposit</Text>
      <Text style={styles.fieldText}>{clickedAgreement.deposit}</Text>
      <Text style={styles.fieldName}>Deposit Agreement Number</Text>
      <Text style={styles.fieldText}>
        {clickedAgreement.depositAgreementNo}
      </Text>
      <Text style={styles.fieldName}>Rent</Text>
      <Text style={styles.fieldText}>{clickedAgreement.rent}</Text>
      <Text style={styles.fieldName}>Rent Agreement Number</Text>
      <Text style={styles.fieldText}>{clickedAgreement.rentAgreementNo}</Text>
      <Text style={styles.fieldName}>Notice Period</Text>
      <Text style={styles.fieldText}>{clickedAgreement.noticePeriod}</Text>
      <TouchableOpacity
        onPress={checkDownloadPermission}
        disabled={!pdfUrl}
        style={[styles.btn, styles.downloadBtn]}>
        <Text style={styles.btnText}>
          {pdfUrl ? 'Download Agreement' : ' Loading...'}
        </Text>
      </TouchableOpacity>
      {clickedAgreement.currentAgreement && (
        <TouchableOpacity
          onPress={onCancelAgreement}
          style={[styles.btn, styles.removeBtn]}
          activeOpacity={0.8}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
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
  btn: {
    marginTop: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 30,
  },

  removeBtn: {
    backgroundColor: GRAY_300,
  },
  downloadBtn: {
    backgroundColor: PRIMARY_DARK,
  },
  btnText: {
    color: WHITE,
    fontWeight: 'bold',
  },
});

export default AgreementInfo;
