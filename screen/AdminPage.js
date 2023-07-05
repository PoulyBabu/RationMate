import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Orders from './AdminOrder';
import ProfilePage from './Profile';
const Tab = createBottomTabNavigator();

const ItemCard = ({item, onCancel}) => {
  const {id, name, scheme, price, quantity} = item;

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

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.colorBox, {backgroundColor: getColor()}]} />
      <View style={styles.imageContainer}>
        <Image source={getImageSource()} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.scheme}>{`Scheme: ${scheme}`}</Text>
        <Text style={styles.price}>{`Price: ${price}`}</Text>
        <Text style={styles.quantity}>{`Quantity: ${getQuantity()}`}</Text>
        <TouchableOpacity
          onPress={() => onCancel(id)}
          style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomePage = () => {
  const [addedItems, setAddedItems] = useState([]);
  const navigation = useNavigation();

  const currentUser = auth().currentUser;
  const userID = currentUser.uid;

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  };

  const cancelItem = itemId => {
    const userRef = firestore().collection('users').doc(userID);
    userRef
      .get()
      .then(doc => {
        const adminData = doc.data()?.adminData;
        const shopNo = adminData ? Object.keys(adminData)[0] : null;
        console.log('Shop Number:', shopNo);
        userRef
          .collection('adminData')
          .doc(shopNo)
          .collection('products')
          .doc(itemId)
          .delete()
          .then(() => {
            console.log('Item deleted successfully!');
            // Remove the canceled item from the state
            setAddedItems(prevItems =>
              prevItems.filter(item => item.id !== itemId),
            );
          })
          .catch(error => {
            console.error('Error deleting item:', error);
          });
      })
      .catch(error => {
        console.log('Error retrieving shopNo:', error);
      });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const userRef = firestore().collection('users').doc(userID);
      userRef
        .get()
        .then(doc => {
          const adminData = doc.data()?.adminData;
          const shopNo = adminData ? Object.keys(adminData)[0] : null;
          console.log('Shop Number:', shopNo);
          userRef
            .collection('adminData')
            .doc(shopNo)
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
        })
        .catch(error => {
          console.log('Error retrieving shopNo:', error);
        });
    };

    fetchProducts();
  }, [userID]);

  return (
    <View style={styles.container}>
      {addedItems.length === 0 ? (
        <Text>No items added</Text>
      ) : (
        <FlatList
          data={addedItems}
          renderItem={({item}) => (
            <ItemCard item={item} onCancel={cancelItem} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
        <Text style={styles.addItemButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};
const HomePageWithTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={'#18d7a4'} />
          ),
          tabBarLabelStyle: {
            color: '#18d7a4', // Set the desired color for the tab text
          },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="basket-outline" size={size} color={'#18d7a4'} />
          ),
          tabBarLabelStyle: {
            color: '#18d7a4', // Set the desired color for the tab text
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={'#18d7a4'} />
          ),
          tabBarLabelStyle: {
            color: '#18d7a4', // Set the desired color for the tab text
          },
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FBF8',
    borderRadius: 8,
    borderColor: '#18d7a4',
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
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
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheme: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: 'red',
  },
  addItemButton: {
    backgroundColor: '#18d7a4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addItemButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// export default HomePage;
export default HomePageWithTabs;
