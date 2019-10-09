import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity
} from "react-native";
import { SCREENS } from "../constants";

export default class Gift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: this.props.navigation.getParam("recipient", null),
      items: this.props.navigation.getParam("products", null)
    };
  }
  static navigationOptions = props => ({
    title: "Pick One"
  });

  //fetch request to get gift otpions yummmm, we need gift name and uri for image
  render() {
    //return 3 options to get from the recipient
    // console.log("items in gift.js",this.state.items);
    return (
      <ScrollView
        style={{
          display: "flex",
          flex: 1,
          backgroundColor: "#29232A",
          alignContent: "center"
        }}
        contentContainerStyle={{ justifyContent: "center" }}
      >
        <View style={styles.container}>
          <Text style={styles.header}>
            {" "}
            We thought {this.state.recipient} would like...
          </Text>
          <Text style={styles.input}>
            {" "}
            Click on an image to purchase that item!{" "}
          </Text>
          {this.state.items.map(item => {
            return (
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {Linking.openURL(item.addToCartUrl);
                     this.props.navigation.navigate(SCREENS.HOME)}}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: 400 }}
                  />

                  <Text style={styles.input}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          <Text></Text>
          <Button
            title={`Yikes! ${this.state.recipient} would not like any of these!`}
            color="#DBA543"
            style={styles.button}
            onPress={() => this.props.navigation.navigate(SCREENS.HOME)}
          />
          <Text></Text>
          <Text></Text>
        </View>
      </ScrollView>
    );
  }
}

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
    textAlign: "center",
    margin: 20
  },
  input: {
    fontSize: 20,
    textAlign: "center",
    alignSelf: "center",
    color: "#DBA543",
    marginTop: 15,
    marginBottom: 30
  },
  button: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#DBA543"
  }
});
