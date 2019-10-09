import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import { SCREENS } from "../constants";
// var bb = require('bestbuy')('BbIdkLycrVDxGQLeO7SQEiFf');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      userId: this.props.navigation.getParam("id", null),
      userEmail: this.props.navigation.getParam("email", null),
      gifts: [],
      clicked: false,
      emailForSearch: ""
    };

    // console.log('USERID', this.props.navigation.getParam("id", null));
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
        console.log( err);
        // alert(err);
      });
    AsyncStorage.setItem("user", "");
  }
  findUser(email){
    fetch(`http://192.168.1.229:8080/users/${email}/registry`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      redirect: "follow"
    })
    .then(response => response.json())
    .then(responseJson => {
      // console.log(responseJson)
      if(responseJson.error){
        return alert("User not found!");
      }
      // console.log("responseJson in find user for registry", responseJson);
      let registry = [];

      for(let i = 0; i < responseJson.data.length; i++){
        // eventNames.push(responseJson.data[i].event);
        // items.push(responseJson.data[i].items)

        registry = responseJson.data;
      }
      this.props.navigation.navigate(SCREENS.VIEWREGISTRY,{
          registry: registry,
          username: responseJson.username
        })
    })
    .catch(err => {
      console.log(err)
    });
  }

  static navigationOptions = props => ({
    title: "Home",
    headerRight: <Button title="Log Out" onPress={() => this.logOut(props)} />
  });

  componentDidMount() {
    AsyncStorage.getItem("user")
      .then(result => {
        // console.log("async storage getting user", result);
        if (result === null) {
          return;
        }
        var parsedResult = JSON.parse(result);
        // console.log("home async storage", parsedResult);
        var username = parsedResult.username;
        this.setState({ user: username });
        // Don't really need an else clause, we don't do anything in this case.
      })
      .catch(err => {
        alert(err);
      });

    // console.log(this.state.userId);

    fetch(`http://192.168.1.111:8080/users/${this.state.userId}/gifts`, {
      // fetch(`http://192.168.1.111:8080/users/userId/gifts`, {
      //how to get userId
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      redirect: "follow"
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log("responseJson in get gifts", responseJson);

        // let newGifts = [...this.state.gifts];
        let newGifts = [];
        for (let i = 0; i < responseJson.data.length; i++) {
          let name = responseJson.data[i].item
            .split("\\")
            .join("")
            .split(" - ");
          newGifts.push({
            imageUri: responseJson.data[i].imageUri,
            item: name[1],
            recipient: responseJson.data[i].recipient
          });
        }

        // console.log("new gifts", newGifts);

        this.setState({
          gifts: newGifts
        });
      })
      .catch(err => {
        // console.log("from fetch", err);
        alert(err);
      });
  }

  render() {
    // console.log(this.state.gifts);
    return (

        <View style={styles.container}>
          <Text></Text>
          <View style={{ flex: 3 }}>
            <Text style={styles.header}>
              {" "}
              Welcome {this.state.user}, below are people you have Giftd:{" "}
            </Text>
            <Text> </Text>
            <View
              style={{
                // backgroundColor: "#B37137"
                backgroundColor: "#DBA543",
                width: 400,
                height: "80%",
                borderRadius: 5,
                padding: 10
              }}
            >
              <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
                <View style={{ display: "flex" }}>
                  {this.state.gifts.length === 0 ? (
                    <Text style={styles.buttonText}> No one yet!</Text>
                  ) : (
                    this.state.gifts.map(gift => {
                      return (
                        <View
                          style={{
                            display: "flex",
                            alignContent: "center",
                            // justifyContent: "space-around",
                            flexDirection: "row",
                            borderBottomWidth: 1,
                            padding: 10,
                            borderBottomColor: "#29232A"
                          }}
                        >
                          <Image
                            source={{ uri: gift.imageUri }}
                            style={{ width: 100, height: 100 }}
                          />
                          <View
                            style={{
                              flex: 1,
                              flexWrap: "wrap",
                              alignSelf: "center"
                            }}
                          >
                            <Text style={styles.text}>
                              You picked ~{gift.item}~ for {gift.recipient}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={{ flex: 2 }}>
            <Text> </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(SCREENS.REGISTRY)}
              style={styles.button}
            >
              <Text style={styles.buttonText}> Create Registry </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ clicked: !this.state.clicked });
                // this.props.navigation.navigate(SCREENS.VIEWREGISTRY);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}> View a User's Registry </Text>
            </TouchableOpacity>
            {this.state.clicked === true && (
              <View style={{width: 200, textAlign: 'center', justifyContent: "center", alignContent: "center"}}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email to find that user's registry"
                  onChangeText={text => this.setState({ emailForSearch: text })}
                  value={this.state.emailForSearch}
                />
                <TouchableOpacity style = {{alignItems: "center"}} onPress = {() => this.findUser(this.state.emailForSearch)}>
                <Text style = {styles.info}> Search </Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(SCREENS.FORM)}
              style={styles.button}
            >
              <Text style={styles.buttonText}> Get Giftn! </Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#29232A",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 30,
    color: "#DBA543",
    textAlign: "center"
  },
  button: {
    alignSelf: "stretch",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#DBA543"
  },
  buttonText: {
    fontSize: 25,
    color: "#29232A",
    textAlign: "center",
    alignSelf: "center"
  },
  text: {
    fontSize: 20,
    color: "#29232A",
    textAlign: "center",
    alignSelf: "center",
    marginRight: 20,
    marginLeft: 20,
    flexWrap: "wrap"
  },
  input: {
    fontSize: 15,
    width: 270,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    marginLeft: 10
  },
  info: {
    color: "#DBA543",
    fontSize: 20,
    alignItems: "center",
    marginLeft: 100
  },
});
