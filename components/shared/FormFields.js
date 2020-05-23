import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { ErrorMessage } from 'formik';

export const TextInputField = ({ field, form, ...props }) => {
  return (
    <View>
      <View style={styles.container}>
        <TextInput
          value={field.value}
          onChangeText={form.handleChange(field.name)}
          onBlur={form.handleBlur(field.name)}
          {...props}
        />
      </View>
      <ErrorMessage style={{marginHorizontal:10}} name={field.name} component={Text} />
    </View>
  );
};

TextInputField.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object
};

const styles = StyleSheet.create(
  {
    container:{
      flexDirection:'row',
      height:45,
      marginHorizontal:10,
      borderWidth:1,
      borderRadius:9,
      marginTop:20
    }
  }
);
