import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AccountType = () => {
  const navigation = useNavigation();
  const navigateToCustomerPage = () => {
    navigation.navigate('SignUpCustomer');
  };

  const navigateToShopOwnerPage = () => {
    navigation.navigate('SignUpOwner');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Type</Text>
      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.box} onPress={navigateToCustomerPage}>
          <Text style={styles.boxText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={navigateToShopOwnerPage}>
          <Text style={styles.boxText}>Shop Owner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: 'row',
  },
  box: {
    flex: 1,
    height: 150,
    margin: 10,
    backgroundColor: '#18d7a4',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f5f5f5',
  },
});

export default AccountType;
