import * as React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Profile from './Profile';
import Cart from './CartPage';
import Orders from './MyOrders';

function NotificationsScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const AppDrawerContent = () => {
  return (
    <View style={styles.drawerContent}>
      <Text style={styles.greeting}>Hello!</Text>
      <Text style={styles.name}>John Doe</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        useLegacyImplementation
        initialRouteName="Profile"
        screenOptions={{
          drawerActiveBackgroundColor: '#C5C5C5',
          drawerActiveTintColor: 'white',
        }}
        drawerContent={props => (
          <View style={{flex: 1}}>
            <AppDrawerContent />
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
            </DrawerContentScrollView>
          </View>
        )}>
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="My Cart" component={Cart} />
        <Drawer.Screen name="My Orders" component={Orders} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    padding: 10,
  },
  greeting: {
    paddingTop: 20,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#80ff80',
  },
});
