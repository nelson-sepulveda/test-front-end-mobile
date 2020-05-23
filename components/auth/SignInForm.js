import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Formik, Field } from 'formik';
import PropTypes from 'prop-types';

import { TextInputField } from '../shared/FormFields';
import { signInValidationRules } from '../../validation/auth';
import $t from 'i18n';
import ErrorText from '../shared/Text/ErrorText';

export const SignInForm = ({ onSubmit, signInError }) => (
  <Formik
    initialValues={{ email: '', password: '' }}
    onSubmit={onSubmit}
    validationSchema={signInValidationRules}
  >
    {({ handleSubmit }) => (
      <View style={styles.container}>
        <Field name="email" component={TextInputField} placeholder="Ingresa tu email" />
        <Field
          name="password"
          component={TextInputField}
          secureTextEntry
          placeholder="Ingresa tu contraseña"
        />
        <ErrorText error={!!signInError} message="Credenciales invalidas" />
        <View style={styles.cont}>
          <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
            <Text >Ingresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </Formik>
);

SignInForm.propTypes = {
  onSubmit: PropTypes.func,
  signInError: PropTypes.bool
};

const styles = StyleSheet.create(
  {
    container:{
      flex:1,
      flexDirection:'column',
      marginTop:45
    },
    submit:{
      alignSelf:'center',
      borderRadius:9
    },
    cont:{
      flexDirection:'row',
      marginHorizontal:10,
      borderWidth:1,
      justifyContent:'center',
      height:50,
      marginTop:50
    }
  }
);
