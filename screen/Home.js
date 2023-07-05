import React from 'react';
import {View} from 'react-native';
import Header from './Header';
import ProductList from './ProductList';

const Home = () => {
  return (
    <View>
      <Header />
      <ProductList />
    </View>
  );
};

export default Home;
