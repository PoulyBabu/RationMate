import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CartPage = () => {
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  const navigation = useNavigation();
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
      setCartItems(fetchedCartItems); // Update the state with fetched cart items
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
    });

  const decreaseQuantity = async cartItemId => {
    const cartItemRef = cartRef.doc(cartItemId);

    try {
      await cartItemRef.update({
        quantity: firestore.FieldValue.increment(-1),
      });
      console.log('Quantity decreased successfully');
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };
  const increaseQuantity = async cartItemId => {
    const cartItemRef = cartRef.doc(cartItemId);

    try {
      await cartItemRef.update({
        quantity: firestore.FieldValue.increment(1),
      });
      console.log('Quantity increased successfully');
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const removeItem = async cartItemId => {
    const cartItemRef = cartRef.doc(cartItemId);

    try {
      await cartItemRef.delete();
      console.log('Cart item canceled successfully');
    } catch (error) {
      console.error('Error canceling cart item:', error);
    }
  };
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };
  const clearCart = async () => {
    try {
      const querySnapshot = await cartRef.get(); // Get all the documents in the cart collection

      const deletePromises = querySnapshot.docs.map(doc => {
        return doc.ref.delete();
      });

      await Promise.all(deletePromises); // Delete all the documents concurrently

      console.log('Cart cleared successfully');
      setCartItems([]); // Clear the cart items in the state
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const placeOrder = () => {
    const orderRef = firestore()
      .collection('shops')
      .doc(cartItems[0].shopId)
      .collection('orders')
      .doc();
    const orderId = orderRef.id;
    const newOrderItems = cartItems.map(item => {
      const {cartItemId, ownerid, shopId, ...newItem} = item;
      return newItem;
    });

    const newOrder = {
      orderId: orderId,
      userID: userID,
      shopId: cartItems[0].shopId,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      items: newOrderItems,
    };
    orderRef
      .set(newOrder)
      .then(() => {
        console.log('Order created successfully!');
        clearCart();
      })
      .catch(error => {
        console.error('Error creating order:', error);
      });

    navigation.navigate('MyOrder', {neworder: newOrder});
  };
  const getImageSource = name => {
    switch (name) {
      case 'Atta':
        return require('../assets/atta.jpeg');
      case 'Rice':
        return require('../assets/brownrice.jpeg');
      case 'White rice':
        return require('../assets/rice.jpg');
      case 'Kerosene':
        return require('../assets/kerosene.jpeg');
      case 'Wheat':
        return require('../assets/wheat.jpg');
      case 'Free Kit':
        return require('../assets/freekit.jpeg');
      default:
        return null;
    }
  };
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={getImageSource(item.name)} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemScheme}>Scheme: {item.scheme}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {'\u20A8'} {item.price}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.cartItemId)}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.cartItemId)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => removeItem(item.cartItemId)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.cartContainer}>
          <Image
            source={require('../assets/emptycart.png')}
            style={styles.image}
          />
          <Text style={styles.text}>Your cart is empty</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.productid}
        />
      )}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: {'\u20A8'} {getTotalPrice()}{' '}
        </Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={placeOrder}>
          <Text style={styles.checkoutButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    padding: 4,
  },
  cartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontWeight: 'bold',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  cancelButton: {
    marginLeft: 'auto',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  totalContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  checkoutButton: {
    backgroundColor: '#18d7a4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 36,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 10,
  },
  itemScheme: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default CartPage;
