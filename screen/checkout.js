import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CheckOut = ({route}) => {
  const {order} = route.params;
  const [timeRemaining, setTimeRemaining] = useState('');
  const getTotalPrice = () => {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

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
    const timeRemaining = nextDay.getTime() - now.getTime();

    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

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
    <View style={styles.container}>
      <Text style={styles.title}>My Order</Text>
      <View style={styles.cardContainer}>
        <Text style={styles.orderId}>Order ID: {order.id}</Text>

        <Text style={styles.orderDate}>Date: {order.date}</Text>
        <Text style={styles.totalText}>
          Total: {'\u20A8'} {getTotalPrice()}
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
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{timeRemaining}</Text>
      </View>
    </View>
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
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default CheckOut;
