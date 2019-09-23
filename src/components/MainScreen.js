import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Avatar, Button, Card } from "react-native-paper";
import MobileNet from "./MobileNet";

const styles = StyleSheet.create({
  cardActions: { justifyContent: "space-around" },
});

const sampleImage = require("../../assets/images/sample.jpg");

export default class MainScreen extends Component {
  state = {
    imageURI: null,
    data: null,
  };

  async componentDidMount() {
    await this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.cancelled) {
      this.setState({
        imageURI: result.uri,
        imageBase64: result.base64,
      });
    }
  };

  render() {
    const { imageURI, imageBase64 } = this.state;
    return (
      <Card>
        <Card.Title
          title="Predictions"
          left={props => <Avatar.Icon {...props} icon="computer" />}
        />
        <Card.Cover source={imageURI ? { uri: imageURI } : sampleImage} />
        <Card.Content>
          <MobileNet source={imageBase64 || sampleImage} />
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button icon="camera" mode="outlined" onPress={this.pickImage}>
            Select
          </Button>
        </Card.Actions>
      </Card>
    );
  }
}
