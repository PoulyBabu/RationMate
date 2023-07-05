import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
const AddItem = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigation = useNavigation();
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  const handleAddItem = () => {
    console.log('Item:', selectedItem);
    console.log('Scheme:', selectedScheme);
    console.log('Price:', price);
    console.log('Quantity:', quantity);
    const productId = uuid.v4();
    const userRef = firestore().collection('users').doc(userID);
    userRef
      .get()
      .then(doc => {
        const adminData = doc.data()?.adminData;
        const shopNo = adminData ? Object.keys(adminData)[0] : null;
        console.log('Shop Number:', shopNo);
        const productRef = userRef
          .collection('adminData')
          .doc(shopNo)
          .collection('products')
          .doc(productId);

        productRef
          .set({
            itemName: selectedItem,
            scheme: selectedScheme,
            price: price,
            quantity: quantity,
          })
          .then(() => {
            console.log('Product added successfully!');
          })
          .catch(error => {
            console.error('Error adding product: ', error);
          });
      })
      .catch(error => {
        console.log('Error retrieving shopNo:', error);
      });
    setSelectedItem(null);
    setSelectedScheme(null);
    setPrice('');
    setQuantity('');

    navigation.navigate('HomePage', {
      newItem: {
        id: Date.now(),
        name: selectedItem ? selectedItem : '',
        scheme: selectedScheme ? selectedScheme : '',
        price,
      },
    });
  };

  const itemList = [
    {name: 'Atta'},
    {name: 'Rice'},
    {name: 'Kerosene'},
    {name: 'Wheat'},
    {name: 'Free Kit'},
    {name: 'white rice'},
  ];

  const schemeList = [
    {name: 'NPS'},
    {name: 'NPNS'},
    {name: 'PHH'},
    {name: 'AAY'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Item:</Text>
      <SearchableDropdown
        style={styles.dropdown}
        onItemSelect={item => setSelectedItem(item.name)}
        containerStyle={styles.dropdownContainer}
        textInputStyle={styles.dropdownTextInput}
        itemStyle={styles.dropdownItem}
        itemTextStyle={styles.dropdownItemText}
        itemsContainerStyle={styles.dropdownItemsContainer}
        items={itemList}
        placeholder={selectedItem ? selectedItem : 'Select Item'}
        placeholderTextColor="#999"
        resetValue={false}
        underlineColorAndroid="transparent"
        textInputProps={{onTextChange: () => {}}}
      />

      <Text style={styles.label}>Select Scheme:</Text>
      <SearchableDropdown
        style={styles.dropdown}
        onItemSelect={item => setSelectedScheme(item.name)}
        containerStyle={styles.dropdownContainer}
        textInputStyle={styles.dropdownTextInput}
        itemStyle={styles.dropdownItem}
        itemTextStyle={styles.dropdownItemText}
        itemsContainerStyle={styles.dropdownItemsContainer}
        items={schemeList}
        placeholder={selectedScheme ? selectedScheme : 'Select Scheme'}
        placeholderTextColor="#999"
        resetValue={false}
        underlineColorAndroid="transparent"
        textInputProps={{onTextChange: () => {}}}
      />

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonLabel}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 16,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdownTextInput: {
    fontSize: 16,
    paddingHorizontal: 12,
    height: 40,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownItemsContainer: {
    maxHeight: '50%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 40,
  },
  addButton: {
    backgroundColor: '#18d7a4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonLabel: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddItem;
