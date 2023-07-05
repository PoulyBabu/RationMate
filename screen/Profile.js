import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [shopNo, setShopNo] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        const userID = currentUser.uid;
        const userRef = firestore().collection('users').doc(userID);
        userRef
          .get()
          .then(doc => {
            if (doc.exists) {
              const userData = doc.data();
              const {email} = userData;
              const adminData = userData.adminData;

              if (adminData) {
                const shopKeys = Object.keys(adminData);
                if (shopKeys.length > 0) {
                  const shopNo = shopKeys[0];
                  const {shopName, address, mobileno, name} = adminData[shopNo];
                  setEmail(email);
                  setShopNo(shopNo);
                  setShopName(shopName);
                  setAddress(address);
                  setMobileno(mobileno);
                  setName(name);
                }
              }
            }
          })
          .catch(error => {
            console.log('Error fetching user data:', error);
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const generateInitials = name => {
    const nameArray = name.split(' ');
    const initials = nameArray.map(name => name.charAt(0)).join('');
    return initials;
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{generateInitials(name)}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Shop ID:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{shopNo}</Text>
        </View>

        <Text style={styles.label}>Shop Name:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{shopName}</Text>
        </View>

        <Text style={styles.label}>Email ID:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{email}</Text>
        </View>
        <Text style={styles.label}>Name:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{name}</Text>
        </View>
        <Text style={styles.label}>Mobile No:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{mobileno}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  infoContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  valueContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: 'stretch',
  },
  value: {
    fontSize: 16,
  },
  editableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default ProfilePage;
