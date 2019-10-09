import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { SCREENS } from "../constants";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import Friend from "./surveys/friend.js";
import Parent from "./surveys/parent.js";
import Grandparent from "./surveys/grandparent.js";
import Sibling from "./surveys/sibling.js";
import Relative from "./surveys/relative.js";
import SignificantOther from "./surveys/sigoth.js";
import Employee from "./surveys/employee.js";
import Boss from "./surveys/boss.js";
var _ = require("lodash");

function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  });
}

async function throttle(fn, timeout) {
  const res = fn();
  await sleep(timeout);
  return res;
}

class ProductFetcher {
  //anyway to remove vinyl's unless asked for?
  constructor(apiKey, keywords) {
    this.apiKey = apiKey;
  }

  doSingleFetch(keyword, max) {
    return fetch(
      `https://api.bestbuy.com/v1/products((search=${keyword})&salePrice<${max})?apiKey=${this.apiKey}&sort=name.asc&show=addToCartUrl,image,salePrice,name,longDescription&format=json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        redirect: "follow"
      }
    ).then(res => res.json());
  }

  async fetch({ keywords, max }) {
    let products = [];
    // console.log("fetching products for", { keywords, max });
    for (let keyword of keywords) {
      const res = await throttle(() => this.doSingleFetch(keyword, max), 250);
      // console.log(Date.now() + " got result: ", res);
      if (res && typeof res === "object" && res.products) {
        //products is a key in the res object that is an array of all the product
        for (let i = 0; i < res.products.length; i++) {
          if (products.includes(res.products[i].name) === false && res.products[i].longDescription !== null) {
            console.log("these are the products: ", res.products);
            products.push(...res.products);
          }
        }
      }
    }

    console.log("got all products", products.length);
    return products;
  }
}

export default class Survey extends Component {
  constructor(props) {
    super(props);
    //make different fetches for related keywords?
    this.state = {
      recipient: this.props.navigation.getParam("recipient", null),
      //radio values that correspond to index of selection
      gender: null,
      movies: null,
      moviesYes: null,
      music: null,
      musicYes: null,
      occasion: null,
      occasionOther: null,
      cooking: null,
      cookingYes: null,
      shopping: null,
      traveling: null,
      //text input
      hobbies: "",
      memories: "",
      who: "",
      //integer input
      age: null,
      //multiselect
      priceRange: [],
      food: [],
      //best buy api key
      apiKey: "BbIdkLycrVDxGQLeO7SQEiFf",
      clicked:false
    };

    this.productFetcher = new ProductFetcher(this.state.apiKey);
  }
  static navigationOptions = {
    title: "Survey"
  };

  getKeywords() {
    //deal with memories and hobbies
    let keywords;
    if (this.state.gender === "Female") {
      keywords = [
        "clothes",
        "clothing",
        "outfit",
        "furniture",
        "homegood",
        "fashion",
        "boutique",
        "jewelry",
        "makeup",
        "women",
        "uber"
      ];
    } else if (this.state.gender === "Male") {
      keywords = [
        "petrol",
        "grill",
        "clothes",
        "clothing",
        "shell",
        "sony",
        "thinkgeek",
        "wwe",
        "speaker",
        "watch",
        "drone",
        "robot",
        "men",
        "uber"
      ];
    } else {
      keywords = [
        "petrol",
        "grill",
        "clothes",
        "clothing",
        "shell",
        "sony",
        "thinkgeek",
        "wwe",
        "speaker",
        "watch",
        "drone",
        "robot",
        "outfit",
        "furniture",
        "homegoods",
        "kohl's",
        "fashion",
        "sephora",
        "boutique",
        "jewelry",
        "makeup",
        "uber"
      ];
    }
    let allKeywords = keywords.concat(this.state.food);
    if (this.state.moviesYes) {
      allKeywords.push(
        this.state.moviesYes,
        "amc",
        "fandango",
        "hbo",
        "cbs",
        "hulu",
        "netflix",
        "showtime",
        "tv",
        "stubhub",
        "tv",
        "anime"
      );
    }
    if (this.state.musicYes) {
      allKeywords.push(this.state.musicYes, "spotify", "tidal");
    }
    if (this.state.cookingYes) {
      allKeywords.push(this.state.cookingYes, "kitchen");
    }
    if (this.state.shopping === "Yes") {
      allKeywords.push( "ae", "marshalls", "kohl's", "gap", "land's end","macy's", "nike", "nordstrom", "tjmaxx");
    }
    if (this.state.traveling === "Yes") {
      allKeywords.push("delta", "disney", "skype", "uber");
    }
    if (this.state.occasion !== "No") {
      allKeywords.push(this.state.occasion);
    }
    if (this.state.occasion === "Housewarming") {
      allKeywords.push(
        this.state.occasion,
        "homegoods",
        "furniture",
        "appliances"
      );
    }
    if (this.state.occasion === "Baby Shower") {
      allKeywords.push(
        this.state.occasion,
        "baby",
        "buybuy baby",
        "disney",
        "newborn"
      );
    }
    if (this.state.recipient === "Significant Other") {
      allKeywords.push("love", "romantic", "date");
    }

    allKeywords.push(this.state.occasionOther);

    for(let i = 0; i < this.state.food.length; i++){
      if(this.state.food[i] === "American"){
        allKeywords.push("cheesecake", "wings", "brinker", "steak", "garden", "darden", "ihop", "subway", "texas")
      }
      else if(this.state.food[i] === "Desserts"){
        allKeywords.push("cheesecake", "dairy", "wendy's", "ihop")
      }
      else if(this.state.food[i] === "Mexican"){
        allKeywords.push("chipotle", "taco", "brinker")
      }
      else if(this.state.food[i] === "Breakfast"){
        allKeywords.push("ihop", "panera", "starbucks", "dunkin")
      }
      else if(this.state.food[i] === "Chinese"){
        allKeywords.push("panda")
      }
      else if(this.state.food[i] === "Pizza"){
        allKeywords.push("dominos")
      }
      else if(this.state.food[i] === "Italian"){
        allKeywords.push("brinker")
      }
    }
    if (parseInt(this.state.age) < 10) {
      allKeywords.push(
        "disney",
        "child",
        "figure",
        "lego",
        "nerf",
        "pet",
        "walkie talkies",
        "plush",
        "toy"
      );
    } else if (parseInt(this.state.age) > 10 && parseInt(this.state.age) < 25) {
      allKeywords.push(
        "games",
        "xbox",
        "blizzard",
        "ncsoft",
        "nintendo",
        "camera",
        "ipad",
        "headphones",
        "alexa",
        "fitbit",
        "wine"
      );
    } else if (parseInt(this.state.age) > 10 && parseInt(this.state.age) < 25) {
      allKeywords.push(
        "amazon",
        "usb",
        "amplifier",
        "roomba",
        "waterproof",
        "charger",
        "remote",
        "home",
        "appliances"
      );
    } else if (parseInt(this.state.age) > 50) {
      allKeywords.push(
        "camcorder",
        "kindle",
        "echo",
        "light",
        "batteries",
        "dna",
        "clock",
        "hearing aid"
      );
    }


    // console.log("lets get these keywords", allKeywords);
    let shuffledKeywords = _.shuffle(allKeywords);
    let filteredKeywords = shuffledKeywords.splice(0,10)
    return filteredKeywords;
  }

  getProducts(keywords) {
    // console.log("getProducts", keywords);
    let max = 0;
    if (this.state.priceRange.length === 1) {
      max = this.state.priceRange[0];
    } else {
      for (let i = 0; i < this.state.priceRange.length; i++) {
        if (this.state.priceRange[i] > max) {
          max = this.state.priceRange[i];
        }
      }
    }

    return this.productFetcher.fetch({ keywords, max });

    // return new Promise((resolve, reject) => {
    //   let finishedFetches = 0;
    //   let allProducts = [];
    //
    //   for (let i = 0; i < keywords.length; i++) {
    //     console.log(keywords[i]);
    //     fetch(
    //       `https://api.bestbuy.com/v1/products((search=${keywords[i]})&salePrice<${max})?apiKey=${this.state.apiKey}&sort=name.asc&show=addToCartUrl,image,salePrice,name,longDescription&format=json`,
    //       {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json"
    //         },
    //         credentials: "include",
    //         redirect: "follow"
    //       }
    //     )
    //       .then(res => res.json())
    //       .then(res => {
    //         console.log(res);
    //         allProducts.push(...res);
    //         finishedFetches++;
    //         if (finishedFetches === keywords.length) {
    //           resolve(allProducts);
    //         }
    //         console.log("all products", allProducts);
    //       })
    //       .catch(err => {
    //         reject(err);
    //       });
    //   }
    // });
  }

  //fetch request to a route that posts info to backend
  render() {
    // console.log(this.state, "in survey.js");

    let options = [
      {
        name: "Friend",
        component: (
          <Friend
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Parent",
        component: (
          <Parent
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Grandparent",
        component: (
          <Grandparent
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Sibling",
        component: (
          <Sibling
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Relative",
        component: (
          <Relative
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Significant Other",
        component: (
          <SignificantOther
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Employee",
        component: (
          <Employee
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      },
      {
        name: "Boss",
        component: (
          <Boss
            answers={this.state}
            setAnswers={changes => this.setState(changes)}
          />
        )
      }
    ];

    let component = options
      .filter(recipient => recipient.name === this.state.recipient[0])
      .map(recipient => recipient.component);

    return (
      <View style={styles.container}>
        <Text style={styles.info}>
          {" "}
          What to get your {this.state.recipient[0]} Survey{" "}
        </Text>
        <View
          style={{
            // display: "flex",
            flex: 1
            // justifyContent: "center",
            // alignItems: "center",
            // width: "90%",
            // height: "100%",
            // margin: "auto"
          }}
        >
          <Text></Text>
          {component}

          <TouchableOpacity
            onPress={async () => {
              this.setState({clicked:true})
              let products = await this.getProducts(this.getKeywords());
              let shuffledProducts = _.shuffle(products);
              this.props.navigation.navigate(SCREENS.GIFT, {
                recipient: this.state.who || this.state.recipient[0],
                products: shuffledProducts.slice(0, 3)
              });
              // console.log("these are the products: ",products);
            }}
            style={styles.button}
          >

            {this.state.clicked ? <View style={styles.horizontal}><Text style={styles.buttonText}>

              Gift for {this.state.who || this.state.recipient[0]} Loading
            </Text>
            <ActivityIndicator size="large" color="#29232A" animating = "true"/></View>
            : <View><Text style={styles.buttonText}>

              Get Gift for {this.state.who || this.state.recipient[0]}
            </Text></View>}
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
    flex: 1
  },
  input: {
    fontSize: 15,
    // width: 400,
    height: 40,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "white"
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
  },
  info: {
    color: "#fff",
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 15
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
