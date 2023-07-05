import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const MyOrderPage = ({route}) => {
  const {neworder} = route.params;
  const [timeRemaining, setTimeRemaining] = useState('');
  const [orders, setOrders] = useState([]);
  const getTotalPrice = items => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrdersRef = firestore()
          .collection('shops')
          .doc(neworder.shopId)
          .collection('orders')
          .where('userID', '==', neworder.userID);

        const querySnapshot = await userOrdersRef.get();
        const fetchedOrders = [];
        querySnapshot.forEach(doc => {
          const fetchedOrder = {
            id: doc.id,
            ...doc.data(),
          };
          fetchedOrders.push(fetchedOrder);
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
    // Add any additional dependencies to re-fetch orders if needed
  }, [neworder.shopId, neworder.userID]);
  const calculateTimeRemaining = () => {
    const now = new Date();
    const nextDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      12,
      30,
      0,
    );
    const time = nextDay.getTime() - now.getTime();

    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    return {hours, minutes, seconds};
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(
        `Time remaining until next day at 12:30 PM: ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.map((order, index) => (
        <View
          key={order.id}
          style={[styles.cardContainer, index !== 0 && styles.cardMargin]}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={styles.orderDate}>Date: {order.date}</Text>
          <Text style={styles.totalText}>
            Total: {'\u20A8'} {getTotalPrice(order.items)}
          </Text>
          <Text style={styles.itemHeading}>Ordered Items:</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.orderScheme}>Scheme: {item.scheme}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {'\u20A8'} {item.price} x {item.quantity}
              </Text>
            </View>
          ))}
        </View>
      ))}
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{timeRemaining}</Text>
      </View>
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
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  cardMargin: {
    marginTop: 20,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderScheme: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default MyOrderPage;
