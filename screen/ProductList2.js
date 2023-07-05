// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import ProductList from './ProductList';
// import Header from './Header';
// import CartScreen from './CartPage';
// import MyOrderPage from './MyOrders';
// import Login from './LoginScreen';
// import SignUpCustomer from './SignUpCustomer';
// import SignUpOwner from './SignUpOwner';
// import AccountType from './AccountType';
// import AddItem from './AddItem';
// import HomePage from './AdminPage';
// import SearchBar from './SearchBar';
// import ProfilePage from './Profile';
// import NotificationsScreen from './Notification';

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();

// const HomeScreen = ({navigation}) => {
//   return (
//     <>
//       <Header navigation={navigation} />
//       <SearchBar />
//       <ProductList />
//     </>
//   );
// };

// const MainStackNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Login"
//         component={Login}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="AccountType"
//         component={AccountType}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="SignUpCustomer"
//         component={SignUpCustomer}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="SignUpOwner"
//         component={SignUpOwner}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           headerShown: false,
//         }}
//       />

//       <Stack.Screen name="Notifications" component={NotificationsScreen} />
//       <Stack.Screen name="Cart" component={CartScreen} />
//       <Stack.Screen name="MyOrder" component={MyOrderPage} />
//       <Stack.Screen name="AddItem" component={AddItem} />
//       <Stack.Screen name="HomePage" component={HomePage} />
//     </Stack.Navigator>
//   );
// };

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator useLegacyImplementation>
//         <Drawer.Screen
//           name="Home"
//           component={MainStackNavigator}
//           options={{headerShown: false}}
//         />
//         <Drawer.Screen name="Cart" component={CartScreen} />
//         <Drawer.Screen name="Orders" component={MyOrderPage} />
//         <Drawer.Screen name="Notifications" component={NotificationsScreen} />
//         <Drawer.Screen name="Profile" component={ProfilePage} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;



// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import HomeScreen from './ProductList';
// import CartScreen from './CartPage';
// import MyOrderPage from './MyOrders';
// import Login from './LoginScreen';
// import SignUpCustomer from './SignUpCustomer';
// import SignUpOwner from './SignUpOwner';
// import AccountType from './AccountType';
// import AddItem from './AddItem';
// import HomePage from './AdminPage';
// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="AccountType"
//           component={AccountType}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="SignUpCustomer"
//           component={SignUpCustomer}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="SignUpOwner"
//           component={SignUpOwner}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen name="Cart" component={CartScreen} />
//         <Stack.Screen name="MyOrder" component={MyOrderPage} />
//         <Stack.Screen name="AddItem" component={AddItem} />
//         <Stack.Screen name="HomePage" component={HomePage} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

