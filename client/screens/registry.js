import React, { Component } from "react";
import { StyleSheet, Text, View, Button, AsyncStorage } from "react-native";
import { SCREENS } from "../constants";

export default function Registry(props) {
  return (
    <View style={styles.container}>

        <Text style={styles.header}> Create a Registry Form </Text>

    </View>
  );
}

function logOut(props) {
  fetch("http://192.168.1.111:8080" + "/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    redirect: "follow"
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log("responseJson in logout in form", responseJson);
      if (responseJson.success) {
        props.navigation.navigate(SCREENS.LOGIN);
      }
    })
    .catch(err => {
      console.log(err);
      // alert(err);
    });
  AsyncStorage.setItem("user", "");
}

Registry.navigationOptions = props => ({
  title: "My Registry",
  headerRight: <Button title="Log Out" onPress={() => logOut(props)} />
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#29232A",
    justifyContent: "center",
    alignContent: "center"
  },
  header: {
    fontSize: 30,
    color: "#DBA543",
    textAlign: "center"
  }
});
