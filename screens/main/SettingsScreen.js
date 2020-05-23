import React from 'react';
import {View,StyleSheet, Image, Text} from 'react-native';


const Settings = () =>{
  return (
    <View style={styles.containerSettings}>
      <Image
        style={styles.welcomeImage}
      />
      <Text style={styles.textHelp}>Pagina </Text>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  containerSettings:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center'
  },
  welcomeImage: {
    height: 150,
    resizeMode: 'contain',
    width: 120,
    marginBottom: 5
  },
  textHelp:{
    textAlign:'center',
    fontFamily:'montserrat-regular'
  }
});
