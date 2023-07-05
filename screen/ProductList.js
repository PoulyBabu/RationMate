import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Switch,
} from 'react-native';
import ProductCard from './ProductCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PushNotification from 'react-native-push-notification';
const ProductList = ({navigation}) => {
  const shopId = '123452';
  const [adminId, setAdminId] = useState('');
  const [addedItems, setAddedItems] = useState([]);
  const [shopName, setShopName] = useState('');
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems);
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  const shopRef = firestore().collection('shops').doc(shopId);
  shopRef
    .get()
    .then(shopDoc => {
      if (shopDoc.exists) {
        const shopData = shopDoc.data();
        setShopName(shopData.shopName);
        setAdminId(shopData.shopid);
      } else {
        console.log('no shop data');
      }
    })
    .catch(error => {
      console.error('Error fetching shop:', error);
    });

  // const handleNotification = item => {
  //   PushNotification.localNotification({
  //     channelId: 'test-channel',
  //     title: 'item added ',
  //     message: item.name + 'is added to the cart',
  //   });
  // };

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortedProducts, setSortedProducts] = useState(addedItems.products);
  const [selectedScheme, setSelectedScheme] = useState('All');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const onAddToCart = async product => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      setCartItems([...cartItems]);
    } else {
      const newItem = {...product, quantity: 1};
      setCartItems([...cartItems, newItem]);
    }

    try {
      const userRef = firestore().collection('users').doc(userID);
      const cartRef = userRef.collection('cart');
      const existingCartItem = await cartRef
        .where('id', '==', product.id)
        .get();

      if (!existingCartItem.empty) {
        const existingDoc = existingCartItem.docs[0];
        const existingQuantity = existingDoc.data().quantity;
        const updatedQuantity = existingQuantity + 1;

        await existingDoc.ref.update({quantity: updatedQuantity});
        console.log('exitiing product added');
      } else {
        await cartRef.add({
          id: product.id,
          itemName: product.name,
          scheme: product.scheme,
          price: product.price,
          quantity: 1,
          shopId: shopId,
          ownerid: adminId,
        });
        console.log('new product added');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
    navigation.navigate('Cart');
  };

  const toggleSortModal = () => {
    setSortModalVisible(!sortModalVisible);
  };

  const sortProductsByScheme = scheme => {
    if (scheme === 'All') {
      setSortedProducts(addedItems);
    } else {
      const filteredProducts = addedItems.filter(
        product => product.scheme === scheme,
      );
      setSortedProducts(filteredProducts);
    }
    setSelectedScheme(scheme);
    toggleSortModal();
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    const db = firestore();
    if (notificationsEnabled) {
      // Remove the shop ID from the FollowedShops collection
      db.collection('FollowedShops')
        .doc(userID)
        .update({
          [shopId]: firestore.FieldValue.delete(),
        });
    } else {
      // Add the shop ID to the FollowedShops collection
      const shopID = shopId; // Replace with the actual shop ID
      db.collection('FollowedShops')
        .doc(userID)
        .set({[shopID]: true}, {merge: true});
    }
  };
  const openSortModal = () => {
    setSortModalVisible(true);
  };

  const closeSortModal = () => {
    setSortModalVisible(false);
  };
  const sortProducts = scheme => {
    setSelectedScheme(scheme);
    closeSortModal();

    if (scheme === 'All') {
      setSortedProducts(addedItems);
    } else {
      const filteredProducts = addedItems.filter(
        product => product.scheme === scheme,
      );
      setSortedProducts(filteredProducts);
    }
  };

  const renderSortModal = () => (
    <Modal animationType="slide" transparent={true} visible={sortModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort By Scheme</Text>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => sortProducts('All')}>
            <Text style={styles.modalItemText}>All</Text>
          </TouchableOpacity>
          {addedItems.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.modalItem}
              onPress={() => sortProducts(product.scheme)}>
              <Text style={styles.modalItemText}>{product.scheme}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalCancel} onPress={closeSortModal}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const userRef = firestore().collection('users').doc(adminId);
      userRef
        .collection('adminData')
        .doc(shopId)
        .collection('products')
        .get()
        .then(querySnapshot => {
          const fetchedProducts = [];
          querySnapshot.forEach(productDoc => {
            const productData = productDoc.data();
            fetchedProducts.push({
              id: productDoc.id,
              name: productData.itemName,
              scheme: productData.scheme,
              price: productData.price,
              quantity: productData.quantity,
            });
          });
          setAddedItems(fetchedProducts);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    };

    fetchProducts();
  }, [adminId]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.shopDetailsContainer}>
          <View>
            <Text style={styles.shopID}>{`Shop ID: ${shopId}`}</Text>
            <Text style={styles.shopName}>{`Shop Name: ${shopName}`}</Text>
          </View>
        </View>

        <View style={styles.iconAlign}>
          <TouchableOpacity onPress={toggleSortModal}>
            <MaterialIcons name="sort" size={22} color="#000000" />
          </TouchableOpacity>
          <View style={styles.notificationsContainer}>
            <Text style={styles.notificationsText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          </View>
        </View>
      </View>

      {renderSortModal()}
      <FlatList
        data={sortedProducts}
        renderItem={({item}) => (
          <ProductCard product={item} onAddToCart={onAddToCart} />
        )}
        keyExtractor={item => item.id.toString()}
      />

      <Modal visible={sortModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity
              style={
                selectedScheme === 'All'
                  ? styles.selectedSortOption
                  : styles.sortOption
              }
              onPress={() => sortProductsByScheme('All')}>
              <Text style={styles.sortOptionText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedScheme === 'AAY'
                  ? styles.selectedSortOption
                  : styles.sortOption
              }
              onPress={() => sortProductsByScheme('AAY')}>
              <Text style={styles.sortOptionText}>AAY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedScheme === 'NPNS'
                  ? styles.selectedSortOption
                  : styles.sortOption
              }
              onPress={() => sortProductsByScheme('NPNS')}>
              <Text style={styles.sortOptionText}>NPNS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedScheme === 'NPS'
                  ? styles.selectedSortOption
                  : styles.sortOption
              }
              onPress={() => sortProductsByScheme('NPS')}>
              <Text style={styles.sortOptionText}>NPS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedScheme === 'PHH'
                  ? styles.selectedSortOption
                  : styles.sortOption
              }
              onPress={() => sortProductsByScheme('PHH')}>
              <Text style={styles.sortOptionText}>PHH</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconAlign: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  notificationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -80,
  },

  shopID: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  shopName: {
    marginBottom: 4,
    fontSize: 15,
  },

  notificationsText: {
    marginRight: 4,
    fontSize: 14,
    color: '#888888',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sortOption: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  selectedSortOption: {
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#E6E6E6',
  },
  sortOptionText: {
    fontSize: 16,
    marginLeft: 18,
  },
  viewCartButton: {
    backgroundColor: '#18d7a4',
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  viewCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductList;
