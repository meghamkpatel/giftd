import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  Picker,
  AsyncStorage
} from "react-native";
import { SCREENS } from "../constants";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: ["Friend"]
    };
  }
   static logOut(props) {
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
   static navigationOptions = props => ({
      headerRight: <Button title="Log Out" onPress={() => this.logOut(props)} />,
    });

  render() {

    let people = [
      { id: "1", name: "Friend" },
      { id: "2", name: "Parent" },
      { id: "3", name: "Grandparent" },
      { id: "4", name: "Sibling" },
      { id: "5", name: "Relative" },
      { id: "6", name: "Significant Other" },
      { id: "7", name: "Boss" },
      { id: "8", name: "Employee" }
    ];
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Who are you buying a gift for?</Text>
        <Picker
          style={styles.pickerStyle}
          onValueChange = {selectedItems => this.setState({ recipient: [selectedItems] })}
          selectedValue={this.state.recipient[0]}
        >
          {people.map(person => {
            return (
              <Picker.Item
                label={person.name}
                value={person.name}
                key={person.name}
                color = "#C6893C"
              />
            );
          })}
        </Picker>
        <TouchableOpacity
          onPress={() => {
            // console.log(this.state.recipient);
            return this.props.navigation.navigate(SCREENS.SURVEY, {
              recipient: this.state.recipient
            })
          }}
          style = {styles.button}
        >
        <Text></Text>
        <Text style={styles.info}> Submit </Text>
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
    justifyContent: "center"
  },
  input: {
    fontSize: 15,
    width: 400,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  button: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#29232A"
  },
  buttonText: {
    textAlign: "center",
    fontSize: 30,
    color: "white"
  },
  info: {
    color: "#DBA543",
    fontSize: 30,
    alignSelf: "center"
  },
  pickerStyle: {
    height: 150,
    color: "#ffffff",
    justifyContent: "center"
  }
});
