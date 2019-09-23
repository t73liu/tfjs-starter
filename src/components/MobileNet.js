import React, { Component } from "react";
import { Image, View } from "react-native";
import * as tf from "@tensorflow/tfjs";
import { fetch as tfFetch } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { DataTable } from "react-native-paper";
import { base64ImageToTensor, imageToTensor } from "../utils/image-utils";
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
    // Load and warm-up MobileNet
    this.model = await mobilenet.load();
    await this.model.classify(tf.zeros([1, 224, 224, 3]));
    const predictions = await this.updatePredictions();
    this.setState({ predictions });
  }

  componentDidUpdate(prevProps) {
    if (this.props.source !== prevProps.source) {
      this.updatePredictions().then(predictions => {
        this.setState({ predictions });
      });
    }
  }

  updatePredictions = async () => {
    const { source } = this.props;
    if (this.model) {
      let imageTensor = null;
      if (Number.isInteger(source)) {
        const imageAssetPath = Image.resolveAssetSource(source);
        const response = await tfFetch(
          imageAssetPath.uri,
          {},
          { isBinary: true }
        );
        const rawImageData = await response.arrayBuffer();
        imageTensor = imageToTensor(rawImageData);
      } else {
        imageTensor = base64ImageToTensor(source);
      }
      const predictions = await this.model.classify(imageTensor);
      tf.dispose([imageTensor]);
      return predictions;
    }
  };

  render() {
    const { predictions } = this.state;
    const isEmpty = predictions.length === 0;
    return (
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Class</DataTable.Title>
            <DataTable.Title numeric>Probability</DataTable.Title>
          </DataTable.Header>
          {isEmpty && <EmptyRow />}
          {predictions.map(({ className, probability }) => (
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