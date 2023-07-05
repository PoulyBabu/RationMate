import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedShopNo, setSelectedShopNo] = useState('');
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  const userRef = firestore().collection('users').doc(userID);
  userRef
    .get()
    .then(doc => {
      const adminData = doc.data()?.adminData;
      const shopNo = adminData ? Object.keys(adminData)[0] : null;
      console.log('Shop Number:', shopNo);
      setSelectedShopNo(shopNo);
    })
    .catch(error => {
      console.log('Error retrieving shopNo:', error);
    });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await firestore()
          .collection('shops')
          .doc(selectedShopNo)
          .collection('orders')
          .get();

        const fetchedOrders = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userID: data.userID,
            date: data.date,
            items: data.items,
          };
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [selectedShopNo]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.map(order => (
        <View key={order.id} style={styles.orderContainer}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={styles.userID}>User ID: {order.userID}</Text>
          <Text style={styles.orderDate}>Date: {order.date}</Text>
          <Text style={styles.itemHeading}>Ordered Items:</Text>
          {order.items.map(item => (
            <View key={item.productid} style={styles.itemContainer}>
              <Text style={styles.itemScheme}>Scheme: {item.scheme}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {'\u20A8'} {item.price} x {item.quantity}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userID: {
    fontSize: 14,
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 20,
  },
  itemHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  itemScheme: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyOrderPage;
