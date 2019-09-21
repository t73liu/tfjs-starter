import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppLoading} from 'expo';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export default class App extends Component {
    state = {
        isTfReady: false,
    };

    prepApp = async () => await tf.ready();

    setAppReady = () => this.setState({isTfReady: true});

    render() {
        if (!this.state.isTfReady) {
            return (
                <AppLoading startAsync={this.prepApp}
                            onFinish={this.setAppReady}
                            onError={console.warn}
                />
            );
        }
        return (
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
