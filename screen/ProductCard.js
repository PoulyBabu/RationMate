import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
const PriceInfo = ({scheme}) => {
  const getQuantity = () => {
    switch (scheme) {
      case 'AAY':
      case 'NPNS':
        return 'Based on card';
      case 'NPS':
      case 'PHH':
        return 'Per unit';
      default:
        return '';
    }
  };

  return <Text style={styles.quantity}>{`Quantity: ${getQuantity()}`}</Text>;
};

const ProductCard = ({
  product,
  navigation,
  onAddToCart,
  notificationsEnabled,
  onNotification,
}) => {
  const {name, price, scheme, id} = product;

  const getColor = () => {
    switch (scheme) {
      case 'AAY':
        return 'yellow';
      case 'NPNS':
        return '#F5F5F5';
      case 'NPS':
        return '#0CAFFF';
      case 'PHH':
        return '#FF69B4';
      default:
        return 'transparent';
    }
  };
  const getImageSource = () => {
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
  const handleAddToCart = () => {
    onAddToCart(product);
    // onNotification(product); // Call the onNotification function with the product
  };
  return (
    <View style={styles.container}>
      <View style={styles.colorBox} backgroundColor={getColor()} />
      <View style={styles.imageContainer}>
        <Image source={getImageSource()} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.scheme}>{`Scheme: ${scheme}`}</Text>
        <Text style={styles.price}>{`Price: ${price}`}</Text>
        <PriceInfo scheme={scheme} />
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 5,
    marginVertical: 3,
    borderColor: '#18d7a4',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2,
  },

  colorBox: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 26,
    height: 26,
    borderRadius: 2,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheme: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 6,
    padding: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductCard;
