import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [shopNo, setShopNo] = useState('');
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  const userRef = firestore().collection('users').doc(userID);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const doc = await userRef.get();
        const adminData = doc.data()?.adminData;
        setShopNo(adminData ? Object.keys(adminData)[0] : null);

        const ordersSnapshot = await firestore()
          .collection('shops')
          .doc(shopNo)
          .collection('orders')
          .get();

        const fetchedOrders = ordersSnapshot.docs.map(orderDoc =>
          orderDoc.data(),
        );
        setOrders(fetchedOrders);
      } catch (error) {
        console.log('Error retrieving shopNo:', error);
      }
    };

    fetchOrders();
  }, [shopNo, userRef]);

  const cancelOrder = orderId => {
    // Implement the cancel order functionality here
  };

  return (
    <View>
      <ScrollView>
        {orders.map(order => (
          <TouchableOpacity
            key={order.orderId}
            style={styles.orderCard}
            onPress={() => cancelOrder(order.orderId)}>
            <Text style={styles.orderId}>{order.orderId}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.customerName}>{order.userName}</Text>
            {order.products.map(product => (
              <View key={product.productId} style={styles.productItem}>
                <Text>{product.name}</Text>
                <Text>Quantity: {product.quantity}</Text>
                <Text>Price: {product.price}</Text>
              </View>
            ))}
            <Text style={styles.totalPrice}>
              Total Price: {order.totalPrice}
            </Text>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
            {order.packed && <Text style={styles.packedStatus}>Packed</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#F8FBF8',
    borderRadius: 8,
    borderColor: '#18d7a4',
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productItem: {
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: 'red',
  },
  packedStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 8,
  },
});

export default OrdersPage;
