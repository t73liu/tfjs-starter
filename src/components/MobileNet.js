import React, { Component } from "react";
import { Image, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import { fetch as tfFetch } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { DataTable } from "react-native-paper";
import { imageToTensor } from "../utils/image-utils";
import { formatPercentage } from "../utils/number-utils";

const EmptyRow = () => (
  <DataTable.Row key="empty">
    <DataTable.Cell>N/A</DataTable.Cell>
    <DataTable.Cell numeric>-</DataTable.Cell>
  </DataTable.Row>
);

export default class MobileNet extends Component {
  state = {
    predictions: [],
  };

  async componentDidMount() {
    // Load mobilenet
    const model = await mobilenet.load();

    //warmup mobilenet
    await model.classify(tf.zeros([1, 224, 224, 3]));

    // Read the image into a tensor
    const imageAssetPath = Image.resolveAssetSource(this.props.image);
    const response = await tfFetch(imageAssetPath.uri, {}, { isBinary: true });
    const rawImageData = await response.arrayBuffer();
    const imageTensor = imageToTensor(rawImageData);

    // Classify the image.
    const predictions = await model.classify(imageTensor);

    this.setState({ predictions });
    tf.dispose([imageTensor]);
  }

  render() {
    const isEmpty = this.state.predictions.length === 0;
    return (
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Class</DataTable.Title>
            <DataTable.Title numeric>Probability</DataTable.Title>
          </DataTable.Header>
          {isEmpty && <EmptyRow />}
          {this.state.predictions.map(({ className, probability }) => (
            <DataTable.Row key={className}>
              <DataTable.Cell>{className}</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatPercentage(probability)}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    );
  }
}
