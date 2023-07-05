import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpOwner = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [shopno, setShopNo] = useState('');
  const [address, setAddress] = useState('');
  const [shopname, setShopName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    if (
      email === '' ||
      password === '' ||
      shopno === '' ||
      address === '' ||
      phoneno === '' ||
      shopname === '' ||
      name === ''
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        const userID = user.uid;
        firestore()
          .collection('shops')
          .doc(shopno)
          .set({
            shopid: userID,
            shopName: shopname,
            address: address,
            mobileno: phoneno,
          })
          .then(() => {
            console.log('shop data created successfully.');
          })
          .catch(error => {
            console.error('Error creating shop data:', error);
          });
        firestore()
          .collection('users')
          .doc(userID)
          .set({
            email: email,
            password: password,
            role: 'admin',
            adminData: {
              [shopno]: {
                name: name,
                mobileno: phoneno,
                shopNo: shopno,
                shopName: shopname,
                address: address,
              },
            },
          })
          .then(() => {
            console.log('Admin data created successfully.');
            navigation.navigate('HomePage');
          })
          .catch(error => {
            console.error('Error creating admin data:', error);
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeToggle}>
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#18d7a4"
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneno}
        onChangeText={setPhoneno}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Shop Number"
        value={shopno}
        onChangeText={setShopNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={shopname}
        onChangeText={setShopName}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin}>
        <Text>
          Already have an account?
          <Text style={styles.link}> Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#18d7a4',
  },
  input: {
    width: '80%',
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#18d7a4',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#18d7a4',
    padding: 16,
    width: '80%',
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#18d7a4',
    marginBottom: 16,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

export default SignUpOwner;
