/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Screen } from '@shoutem/ui';
import Camera from 'react-native-camera';

const digitLookUpEndpoint = 'https://t2umq4237b.execute-api.us-east-1.amazonaws.com/dev/classify';

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      photo: 0,
      result: 0
    };
  }

  render() {
    return (
      <Screen>
        {this.state.photo ?
          <Image 
            style={{width: '75%', height: '75%'}} 
            source={{uri: this.state.photo}}
          />
          : null}
        {this.state.result ? 
          <Text>{this.state.result}</Text> 
          : null}
        <Camera style={{flex: 1}}
                ref={cam => this.camera=cam}
                aspect={Camera.constants.Aspect.fill}
                captureTarget={Camera.constants.CaptureTarget.disk}
                style={styles.preview}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </Screen>
    );
  }

  classifyPicture(picture) {
    // Call out to our serverless endpoint which will return 
    return fetch(digitLookUpEndpoint)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((err) => {
        throw err;
      });
  }

  takePicture() {
    const options = {};
    this.setState({photo: 0, result: 0});

    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => {
        this.setState({photo: data.path});
        return this.classifyPicture(data.path);
      })
      .then((data) => {
        this.setState({result: data.class});
        console.log(data);
      })
      .catch((err) => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
