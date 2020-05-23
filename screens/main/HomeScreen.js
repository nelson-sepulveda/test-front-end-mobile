import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  SafeAreaView,
  AsyncStorage
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { addHeaderLeftNavigator } from '../../helpers';
import $t from 'i18n';
import { logout } from '../../store/actions/UserActions';
import { userSelector } from '../../store/selectors/UserSelector';
import { FlatList } from 'react-native-gesture-handler';

const HomeScreen = () => {
  const dispatch = useDispatch();
  loaderBooks();

  const handleLogout = () => dispatch(logout());
  const [books, setBooks] = useState([]);

  const user = useSelector(userSelector());

  const [modalVisible, setModalVisible] = useState(false);

  const _signOutAsync = async () => {
    handleLogout();
  };

  async function loaderBooks() {
    const data = await AsyncStorage.getItem('user');
    const userJson = JSON.parse(data);
    var url = 'https://dev.tuten.cl:443/TutenREST/rest/user/contacto@tuten.cl/bookings?current=true';
    var headers_ = {
      'app'        :'APP_BCK',
      'adminemail' : userJson.email,
      'token'      : userJson.sessionTokenBck,
      'Accept'     : 'application/json'
    };
    let response = await axios({
      method: 'GET',
      url: url,
      headers: headers_
    });

    converterFecha(response.data);
    setBooks(response.data);
  }

  function converterFecha(books){
    books.forEach(book => {
      if (book.parentBooking && book.parentBooking.bookingCreatedTime) {
        book.parentBooking.bookingCreatedTime = moment(book.parentBooking.bookingCreatedTime).format('MMM-DD-YYYY')
      }
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Text style={{fontSize:20}}>Listado de Libros</Text>
        </View>
        <View style={{marginBottom:25}}>
          <View style={{borderWidth:1}}></View>
          <FlatList
            data={books}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text> BookingId : {item.bookingId} </Text>
                  <Text> Cliente : {item.tutenUserClient.firstName} {item.tutenUserClient.lastName} </Text>
                  <Text> Creación : {item.parentBooking ? item.parentBooking.bookingCreatedTime ? item.parentBooking.bookingCreatedTime : 'Fecha no registra' : 'Fecha no registra'} </Text>
                  <Text> Direccíon : {item.locationId.streetAddress} </Text>
                  <Text> Preció : {item.cost} </Text>
                  <View style={{borderWidth:1}}></View>
                </View>
              );
            }}
            keyExtractor={item => item.bookingId}
          />
        </View>

        <Button title="Cerrar Sesion" style={{marginTop:5}} onPress={_signOutAsync} />

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => alert('Modal has been closed.')}
        >
          <SafeAreaView style={styles.container}>
            <View>
              <Text>{$t('helloWorld')}</Text>

              <Button
                onPress={() => setModalVisible(!modalVisible)}
                title="Hide Modal"
              />
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>

      <View style={styles.tabBarInfoContainer} />
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => {
  const headerLeftNav = addHeaderLeftNavigator(navigation);
  return { ...headerLeftNav, title: 'Home' };
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  contentContainer: {
    paddingTop: 30
  },

  tabBarInfoContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  welcomeImage: {
    height: 80,
    marginLeft: -10,
    marginTop: 3,
    resizeMode: 'contain',
    width: 100,
    marginBottom:20
  }
});
