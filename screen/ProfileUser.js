import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileUser = () => {
  const [emailid, setEmail] = useState('');
  const [schemeval, setscheme] = useState('');
  const [rationcardno, setrationcardnumber] = useState('');
  const [mobileNo, setMobileno] = useState('');
  const [username, setName] = useState('');
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const currentUser = auth().currentUser;
        const userID = currentUser.uid;
        const customerRef = firestore().collection('users').doc(userID);

        const doc = await customerRef.get();
        if (doc.exists) {
          const customerData = doc.data();
          const {email, name, mobileno, rationcardnumber, scheme} =
            customerData;
          setEmail(email);
          setName(name);
          setMobileno(mobileno);
          setrationcardnumber(rationcardnumber);
          setscheme(scheme);
        }
      } catch (error) {
        console.log('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, []);

  const generateInitials = name => {
    const nameArray = name.split(' ');
    const initials = nameArray.map(name => username.charAt(0)).join('');
    return initials;
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{generateInitials(username)}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email ID:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{emailid}</Text>
        </View>

        <Text style={styles.label}>Mobile No:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{mobileNo}</Text>
        </View>

        <Text style={styles.label}>RationCardNumber:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{rationcardno}</Text>
        </View>
        <Text style={styles.label}>Scheme:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{schemeval}</Text>
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

export default ProfileUser;
