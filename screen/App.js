import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import ProductList from './ProductList';
import Header from './Header';
import CartScreen from './CartPage';
import MyOrderPage from './MyOrders';
import Login from './LoginScreen';
import SignUpCustomer from './SignUpCustomer';
import SignUpOwner from './SignUpOwner';
import AccountType from './AccountType';
import AddItem from './AddItem';
import OrdersPage from './AdminOrder';
import HomePage from './AdminPage';
import SearchBar from './SearchBar';
import ProfilePage from './Profile';
import ProfileUser from './ProfileUser';
import NotificationsScreen from './Notification';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <>
      <Header navigation={navigation} />
      <SearchBar />
      <ProductList navigation={navigation} />
    </>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AccountType"
        component={AccountType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpCustomer"
        component={SignUpCustomer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpOwner"
        component={SignUpOwner}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Profile" component={ProfileUser} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="MyOrder" component={MyOrderPage} />
      <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="Orders" component={OrdersPage} />
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={MainStackNavigator}
          options={{headerShown: false}}
        />
        <Drawer.Screen name="Cart" component={CartScreen} />
        <Drawer.Screen name="Orders" component={MyOrderPage} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Profile" component={ProfileUser} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
