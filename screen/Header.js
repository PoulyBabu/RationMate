import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Badge} from 'react-native-paper';
import {withNavigation} from '@react-navigation/compat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const Header = ({navigation}) => {
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  const [cartItems, setCartItems] = useState([]);

  const userRef = firestore().collection('users').doc(userID);
  const cartRef = userRef.collection('cart');
  cartRef
    .get()
    .then(querySnapshot => {
      const fetchedCartItems = [];
      querySnapshot.forEach(doc => {
        const cartItem = {
          cartItemId: doc.id,
          productid: doc.data().id,
          name: doc.data().itemName,
          scheme: doc.data().scheme,
          price: doc.data().price,
          quantity: doc.data().quantity,
          shopId: doc.data().shopId,
          ownerid: doc.data().ownerid,
        };
        fetchedCartItems.push(cartItem);
      });
      setCartItems(fetchedCartItems);
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
    });
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" size={30} color="#18d7a4" />
      </TouchableOpacity>
      <Text style={styles.title}>RationMate</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart" size={30} color="#18d7a4" />
          <Badge style={styles.badge}>{cartItems.length}</Badge>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon
            name="notifications"
            size={30}
            color="#18d7a4"
            style={{marginLeft: 10}}
          />
          <Badge style={styles.badge}>3</Badge>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 25,
    backgroundColor: 'white',
  },
  title: {fontSize: 20, color: '#18d7a4', fontWeight: 'bold'},
  badge: {
    position: 'absolute',
    top: -8,
    right: -9,
    backgroundColor: '#ff0000',
  },
});
export default Header;
