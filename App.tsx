/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
// import startUDPReceive from './startUDP';
import DocumentPicker, { DocumentPickerResponse, DirectoryPickerResponse } from 'react-native-document-picker';
import startUDP from './startUDP';


const App: React.FC = () => {
  const [pcName, setPcName] = useState(''); 
  const [pcIP, setPcIP] = useState(''); 
  const [ButtonsDeneme, setScanButtons] = useState<ReactNode[]>([]);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [docResult, setResult] = React.useState<Array<DocumentPickerResponse>>();
  const [allDevices, setAllDevices] = useState<Array<{ pcName: string, pcIp: string }>>([]);
  const [displayText, setDisplayText] = useState('');
  const [displayTextSocket, setDisplayTextSocket] = useState('');
  const [displayTextData, setDisplayTextData] = useState('');
  const [displayTextButtons, setDisplayTextButtons] = useState('');

  // const handleScan = () => {
  //   setScanInProgress(true);
  //   startUDPReceive(setAllDevices);
  //   setScanInProgress(false);
  //   setScanButtons(allDevices.map(device => (
  //     <Button title={`Connect to ${device.pcName}`} onPress={() => console.log(`Connecting to ${device.pcName} at ${device.pcIp}`)} />
  //   )));

  // };

  const handleScan = async () => {
    setScanInProgress(true);
    setDisplayText("butona basıldı");
    setDisplayTextSocket("socket açıldı 8090a bağlı");

    const receivedMessage = await startUDP();
    const { pcName, pcIp } = receivedMessage;
    setAllDevices(receivedMessage);
    setDisplayTextData("veriler geldi")
    setPcName(pcName);
    setPcIP(pcIp);
    setScanInProgress(false);
    setScanButtons(allDevices.map(device => (
      <Button title={`Connect to ${device.pcName}`} onPress={() => console.log(`Connecting to ${device.pcName} at ${device.pcIp}`)} />
    )));
    setDisplayTextButtons("butonlar yaratıldı");
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
        <Text>{displayText}</Text>
        <Text>{displayTextSocket}</Text>
        <Text>{displayTextData}</Text>
        <Text>{displayTextButtons}</Text>
        <View>
          {ButtonsDeneme.map((button, index) => (
            <View key={index}>{button}</View>
          ))}
        </View>
        <Text>PC NAME ya da IP aldiysam benim altimda gözükür</Text>
        <Text>{pcName}{pcIP}</Text>
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