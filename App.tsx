/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import startUDPReceive from './startUDP';
import DocumentPicker, { DocumentPickerResponse, DirectoryPickerResponse } from 'react-native-document-picker';


const App: React.FC = () => {
  const [pcName, setPcName] = useState(''); 
  const [pcIP, setPcIP] = useState(''); 
  const [ButtonsDeneme, setScanButtons] = useState<ReactNode[]>([]);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [docResult, setResult] = React.useState<Array<DocumentPickerResponse>>();

  const handleScan = async () => {
    setScanInProgress(true);
    const allDevices = await startUDPReceive();
    allDevices.forEach(element => {
      setPcName(element.pcName)
      setPcIP(element.pcIp)
    });
    setScanInProgress(false);
    setScanButtons(allDevices.map(device => (
      <Button title={`Connect to ${device.pcName}`} onPress={() => console.log(`Connecting to ${device.pcName} at ${device.pcIp}`)} />
    )));
  };

  const openDocumentFile = async () => {
    try{
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
      setResult(res);
    }
    catch (err) {
      if (DocumentPicker.isCancel(err)){
        
      } else {
        throw err; 
      }
    }
  }; 

  return (
    <View style={styles.container}>
      <View >
        <Button onPress={handleScan} title="deneme"></Button>
        <Text>-------------------------------------------</Text>
        <View>
          {ButtonsDeneme.map((button, index) => (
            <View key={index}>{button}</View>
          ))}
        </View>
      </View>
      
      {scanInProgress ? (
        <View style={[styles.scanningIndicator, { backgroundColor: "red" }]} />
      ) : (
        pcName && pcIP ? (
          <View style={[styles.scanningIndicator, { backgroundColor: "green" }]} />
        ) : (
          <View style={[styles.scanningIndicator, { backgroundColor: "red" }]} />
        )
      )}
      <Text style={styles.connectionText}>
        {pcName && pcIP ? "Connected" : "Disconnected"}
      </Text>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scanningIndicator: {
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  resultContainer: {
    padding: 10,
  },
  resultText: {
    fontWeight: 'bold',
  },
  connectionText: {
    position: 'absolute',
    top: 5,
    right: 25,
  },
  denemeButton: {
    position: 'absolute',
    top: 5,
    right: 40,
  }
});

export default App;