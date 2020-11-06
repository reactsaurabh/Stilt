import React, {useState} from 'react';
import {Image, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import AddAccountModal from '../Home/AddAccountModal';
const TitleProfileImage = () => {
  const userInfo = useSelector(state => state.userInfo);
  const [openModal, setModal] = useState(false);
  const toggleModal = () => setModal(open => !open);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.imageView}>
          {userInfo.isSuccess && userInfo.data && userInfo.data.image ? (
            <Image source={{uri: userInfo.data.image}} style={styles.profile} />
          ) : (
            <Image
              source={require('../../assets/images/avatar.png')}
              style={styles.profile}
            />
          )}
        </View>
      </TouchableOpacity>
      <AddAccountModal
        open={openModal}
        toggleModal={toggleModal}
        userInfo={userInfo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {overflow: 'hidden'},
  imageView: {},
  profile: {width: 30, height: 30, borderRadius: 15, overflow: 'hidden'},
});

export default TitleProfileImage;
