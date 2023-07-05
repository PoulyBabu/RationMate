import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // createChannels();
  }, []);
  // const createChannels = () => {
  //   PushNotification.createChanne1({
  //     channelId: 'test-channel',
  //     channelName: 'Test Channel',
  //   });
  // };
  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      console.log('login ');
      const userID = userCredential.user.uid;

      const userDoc = await firestore().collection('users').doc(userID).get();

      const userData = userDoc.data();
      const role = userData.role;

      if (role === 'admin') {
        navigation.navigate('HomePage');
        console.log('button pressed');
      } else if (role === 'user') {
        navigation.navigate('Main');
        console.log('button pressed');
      }
    } catch (error) {
      console.log('Login error:', error);
    }
  };
  const handleSignUp = () => {
    navigation.navigate('AccountType');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/login.png')} />
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.link}>Sign Up</Text>
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
  image: {
    resizeMode: 'contain',
    height: 200,
    width: 200,
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

export default Login;
