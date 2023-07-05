// components/SearchBar.js
import React from 'react';
import {View, TextInput} from 'react-native';

const SearchBar = () => {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
      }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#18d7a4',
          borderRadius: 5,
          paddingLeft: 10,
          height: 40,
        }}
        placeholder="Search shop"
      />
    </View>
  );
};

export default SearchBar;
