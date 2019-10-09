import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView
} from "react-native";
import { SCREENS } from "../constants";

export default class ViewRegistry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eventName: this.props.navigation.getParam("eventName", null),
      // items: this.props.navigation.getParam("items", null),
      username: this.props.navigation.getParam("username", null),
      registry: this.props.navigation.getParam("registry", null)
    };
  }

  logOut(props) {
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
        // console.log("from fetch", err);
        console.log(err);
      });
    AsyncStorage.setItem("user", "");
  }

  static navigationOptions = props => ({
    title: `View Registry`,
    headerRight: <Button title="Log Out" onPress={() => this.logOut(props)} />
  });

  render() {
    // console.log("state in view registry", this.state);

    return (
      <ScrollView style = {{backgroundColor: "#29232A"}}>
      <View style={styles.container}>
        <Text></Text>
        <Text style={styles.header}> {this.state.username}'s Registry </Text>
        <Text></Text>
        <Text></Text>
        <Text style = {styles.buttonText}> Click each item to find out more!</Text>

        <Text></Text>
        <Text></Text>

        {this.state.registry.map(thing => {
          // console.log("in the map: ", thing);
          // console.log("in the map: ", thing.items);
          return (
            <View>
              <View style={styles.button}>
                <Text style={styles.boldButtonText}> {thing.event} </Text>
              </View>
              <View style = {{display: "flex", justifyContent: "space-around"}}>
                <TouchableOpacity onPress={()=>Linking.openURL(thing.items.map(item => {
                  console.log(item.url)
                  return(item.url)})
                )}>
                <Text style={styles.buttonText}> {'\u2022'} {thing.items.map(item => {
                  return(item.name)})} </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
      </ScrollView>
    );
  }
  // console.log("event", e, "event.target", e.target)
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#29232A"
  },
  header: {
    fontSize: 30,
    color: "#DBA543",
    textAlign: "center"
  },
  input: {
    fontSize: 15,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5
  },
  button: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#DBA543"
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#DBA543",

  },
  boldButtonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#29232A",
    fontWeight: "bold"
  }
});
