import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from "react-native";
import { SCREENS } from "../constants";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  static navigationOptions = {
     title: 'Log In',
   };

login(username, password) {
  if (!username || !password) {
    alert("Please enter your username and password!");
    return;
  }
  // console.log(process.env)

  fetch("http://192.168.1.229:8080" + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    redirect: "follow",
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(response => response.json())
    .then(responseJson => {
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
      // console.log("json in login", responseJson);
      if (responseJson.success) {
        AsyncStorage.setItem(
          "user",
          JSON.stringify({
            username: username,
            password: password
          }),
        (err) => {
          if (err) return console.log(err);
          // console.log('yea saved');
        }
        );
        // console.log("please work")
        this.props.navigation.navigate(SCREENS.HOME, {
          id: responseJson.id,
          email: responseJson.email
        });
      }
      else if (!responseJson.success) {
            alert("Incorrect username or password!");
           }
    })
    .catch(err => {
      // alert(err);
      console.log("error", err)
    });
}

// handleChange = e => {
//   e.preventDefault();
//   const { name, value } = e.target;
//   this.setState({ [name]: value }, () => console.log(this.state));
// };

componentDidMount() {
  // console.log('tryna get this user...');
  AsyncStorage.getItem("user")
    .then(result => {
      if (result === null) {
        return;
      }
      // console.log('in async:', result);
      var parsedResult = JSON.parse(result);
      // console.log("async user", parsedResult)
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        return this.login(username, password);
      }
      // Don't really need an else clause, we don't do anything in this case.
    })
    .catch(err => {
      console.log(err);
    });
}

  render() {
    return (
        <View style={styles.container}>
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

          <TouchableOpacity
            onPress={() => this.login(this.state.username, this.state.password)}
            style={styles.button}
          >
            <Text style={styles.buttonText}> Log In </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(SCREENS.SIGNUP)}
            style={styles.button}
          >
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
    backgroundColor: "#29232A",
    alignItems: 'center',
    justifyContent: 'center',
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
