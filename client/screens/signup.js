import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { SCREENS } from "../constants";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: ""
    };
  }
  static navigationOptions = {
   title: 'Sign Up',
 };
  register() {
    if (!this.state.username || !this.state.password) {
      alert("Please enter a username and password!");
      return;
    }
    fetch("http://192.168.1.111:8080" + "/signup", {
      method: "POST",
      credentials: "include",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        email: this.state.email
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        /* do something with responseJson and go to the Login view but
         * make sure to check for responseJson.success! */
        // console.log("json in signup", responseJson);

        if (responseJson.success && responseJson.user) {
          AsyncStorage.setItem(
            "user",
            JSON.stringify({
              username: this.state.username,
              password: this.state.password,
              email: this.state.email
            })
          );
          this.props.navigation.navigate(SCREENS.LOGIN);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    // console.log(this.state)
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
        />
        <Text> </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />
        <Text> </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => this.register()} style={styles.button}>
          <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor:  "#29232A",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    fontSize: 15,
    width: 400,
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
    fontSize: 30,
    color: "#29232A"
  }
});
