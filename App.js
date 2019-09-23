import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { AppLoading } from "expo";
import { Appbar, Avatar, Button, Card } from "react-native-paper";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import MobileNet from "./src/components/MobileNet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { textAlign: "center" },
  cardActions: { justifyContent: "space-around" },
});

const sampleImage = require("./assets/images/sample.jpg");

export default class App extends Component {
  state = {
    isTfReady: false,
  };

  prepApp = async () => await tf.ready();

  setAppReady = () => this.setState({ isTfReady: true });

  render() {
    if (!this.state.isTfReady) {
      return (
        <AppLoading
          startAsync={this.prepApp}
          onFinish={this.setAppReady}
          onError={console.warn}
        />
      );
    }
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="MobileNet" titleStyle={styles.title} />
        </Appbar.Header>
        <KeyboardAwareScrollView>
          <Card>
            <Card.Title
              title="Predictions"
              left={props => <Avatar.Icon {...props} icon="computer" />}
            />
            <Card.Cover source={sampleImage} />
            <Card.Content>
              <MobileNet image={sampleImage} />
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                icon="camera"
                mode="outlined"
                onPress={() => console.log("Pressed")}
              >
                Select
              </Button>
            </Card.Actions>
          </Card>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
