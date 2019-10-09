import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView
} from "react-native";
import { SCREENS } from "../../constants";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import MultiSelect from "react-native-multiple-select";

export default class Sibling extends Component {
  onSelectedPriceRange = selectedItems => {
    this.props.setAnswers({ priceRange: selectedItems });
  };
  onSelectedCuisine = selectedItems => {
    this.props.setAnswers({ food: selectedItems });
  };
  render() {
    var polar_props = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }];
    var gender_props = [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" }
    ];
    var occasion_props = [
      { label: "Anniversary", value: "Anniversary" },
      { label: "Baby Shower", value: "Baby Shower"},
      { label: "Birthday", value: "Birthday" },
      { label: "Christmas", value: "Christmas" },
      { label: "Thanksgiving", value: "Thanksgiving" },
      { label: "Wedding", value: "Wedding" },
      { label: "Other", value: "Other" },
      { label: "No Special Occasion", value: "No" }
    ];
    var prices = [
      { id: 50, name: "$" },
      { id: 100, name: "$$" },
      { id: 200, name: "$$$" },
      { id: 10000, name: "$$$$" }
    ];

    let cuisines = [
      { id: 55, name: "Italian" },
      { id: 25, name: "Chinese" },
      { id: 168, name: "American" },
      { id: 159, name: "Brazilian" },
      { id: 152, name: "African" },
      { id: 193, name: "BBQ" },
      { id: 182, name: "Breakfast" },
      { id: 158, name: "Caribbean" },
      { id: 100, name: "Desserts" },
      { id: 67, name: "Korean" },
      { id: 136, name: "Latin American" },
      { id: 70, name: "Mediterranean" },
      { id: 73, name: "Mexican" },
      { id: 60, name: "Japanese" },
      { id: 143, name: "Healthy Food" },
      { id: 45, name: "French" },
      { id: 82, name: "Pizza" },
      { id: 320, name: "Ramen" },
      { id: 83, name: "Seafood" },
      { id: 177, name: "Sushi" }
    ];
    let sortedCuisines = cuisines.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    return (
      <ScrollView style={styles.container} contentContainerStyle= {{justifyContent: "center"}}>

        <View >
          <Text> </Text>
          <TextInput
            style={styles.input}
            placeholder="Who is this gift for?"
            onChangeText={text => this.props.setAnswers({ who: text })}
            value={(this.props.answers.who === "") ? "" : this.props.answers.who}
          />
          <Text> </Text>
          <Text style={styles.info}> What kind of food does {this.props.answers.who || "Sibling"} like? </Text>
          <MultiSelect
            style={{ flex: 1 }}
            items={sortedCuisines}
            uniqueKey="name"
            onSelectedItemsChange={this.onSelectedCuisine}
            selectedItems={this.props.setAnswers.food}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            bgColor={"white"}
            tintColor={"#666666"}
            activityTintColor={"green"}
          />
          <Text> </Text>
          <TextInput
            style={styles.input}
            placeholder="What are their hobbies?"
            onChangeText={text => this.props.setAnswers({ hobbies: text })}
            value={this.props.answers.hobbies}
          />
          <Text> </Text>
          <TextInput
            style={styles.input}
            placeholder="Are there any special memories you share?"
            onChangeText={text => this.props.setAnswers({ memories: text })}
            value={this.props.answers.memories}
          />
          <Text> </Text>
          <TextInput
            style={styles.input}
            placeholder="How old are they?"
            onChangeText={text => this.props.setAnswers({ age: text })}
            value={this.props.answers.age}
          />
          <Text> </Text>
          <Text style={styles.info}> Do they wear accessories? </Text>
          <RadioForm
            radio_props={polar_props}
            initial={null}
            labelColor="white"
            buttonColor="white"
            selectedButtonColor="white"
            selectedLabelColor="white"
            onPress={value => {
              this.props.setAnswers({ accessories: value });
            }}
          />
          <Text style={styles.info}> Do they listen to music? </Text>
          <RadioForm
            radio_props={polar_props}
            initial={null}
            labelColor="white"
            buttonColor="white"
            selectedButtonColor="white"
            selectedLabelColor="white"
            onPress={value => {
              this.props.setAnswers({ music: value });
            }}
          />
          <Text style={styles.info}> Is it a special occasion? </Text>
          <RadioForm
            radio_props={occasion_props}
            initial={null}
            labelColor="white"
            buttonColor="white"
            selectedButtonColor="white"
            selectedLabelColor="white"
            onPress={value => {
              this.props.setAnswers({ occasion: value });
            }}
          />

          <Text style={styles.info}> What gender is your sibling? </Text>
          <RadioForm
            radio_props={gender_props}
            initial={null}
            labelColor="white"
            buttonColor="white"
            selectedButtonColor="white"
            selectedLabelColor="white"
            onPress={value => {
              this.props.setAnswers({ gender: value });
            }}
          />
          <Text> </Text>
          <Text style={styles.info}> What is your price range? </Text>
          <MultiSelect
            style={{ flex: 1 }}
            items={prices}
            uniqueKey="id"
            onSelectedItemsChange={this.onSelectedPriceRange}
            selectedItems={this.props.answers.priceRange}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            bgColor={"white"}
            tintColor={"#666666"}
            activityTintColor={"green"}
          />
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
    margin: "auto"
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
    color: "white",
    fontSize: 20,
    alignSelf: "center"
  }
});
