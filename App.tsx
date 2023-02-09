/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Dimensions } from 'react-native';
import dgram from 'react-native-udp';
// import startUDPReceive from './startUDP';
// import DocumentPicker, { DocumentPickerResponse, DirectoryPickerResponse } from 'react-native-document-picker';
// import startUDP from './startUDP';

const percent5 = Dimensions.get('window').width / 20


const App: React.FC = () => {
  const [pcName, setPcName] = useState(''); 
  const [pcIP, setPcIP] = useState(''); 
  const [ButtonsDeneme, setScanButtons] = useState<ReactNode[]>([]);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [allDevices, setAllDevices] = useState<Array<{ pcName: any, pcIp: any}>>([]);
  const [displayText, setDisplayText] = useState('');
  const [displayTextSocket, setDisplayTextSocket] = useState('');
  const [displayTextData, setDisplayTextData] = useState('');
  const [displayTextButtons, setDisplayTextButtons] = useState('');


  // const openDocumentFile = async () => {
  //   try{
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles]
  //     })
  //     setResult(res);
  //   }
  //   catch (err) {
  //     if (DocumentPicker.isCancel(err)){
        
  //     } else {
  //       throw err; 
  //     }
  //   }
  // }; 

  
  const remotePort = 5000;
  const remoteHost = '10.0.2.2';
  const socket = dgram.createSocket('udp4')
  socket.bind(8081)
  
  // socket.once('listening', function () {
  //   socket.send('WHO', undefined, undefined, remotePort, remoteHost, function (err) {
  //     if (err) throw err

  //     console.log('Message sent!')
  //   })
  // })

  socket.on('message', function (msg,rinfo){
    console.log(msg.toString());
  })

  const sendMessage = () => {
    socket.send('WHO', undefined, undefined, remotePort, remoteHost, function (err) {
      if (err) throw err

      console.log('Message sent!')
    })
  }
  
  const handleScan = () => {
    socket.on('message', function (msg, rinfo) {
      let [pcName, pcIp] = msg.toString().split(":");
      console.log('rinfo: ', rinfo);
      console.log('Message received', pcName, pcIp);
      let connectedDevice = ({ pcName, pcIp });
      const addDevice = (connectedDevice: { pcName: any, pcIp: any}) => {
        setAllDevices([...allDevices, connectedDevice]);
      };
      addDevice(connectedDevice);
      setScanButtons(allDevices.map(device => (
            <Button title={`Connect to ${device.pcName}`} onPress={() => console.log(`Connecting to ${device.pcName} at ${device.pcIp}`)} />
          )));
      setPcIP(pcIp);
      setPcName(pcName);

      setTimeout(() => {
        socket.close();
        console.log('socket closed after 10 sec')
      }, 10000);
    });
  }

  

  return (
    <>
      <View style={{ backgroundColor: '#1C1321', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: percent5 }}>
        <Text style={{ backgroundColor: '#F6F8FA', width: 3 * percent5, textAlign: 'center', borderRadius: 0.2 * percent5 }}>HOME</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: percent5 / 2 , color: '#F6F8FA' }}>Disconnected</Text>
          <Text style={{ backgroundColor: '#C85348', width: 1.8 * percent5, height: 1.8 * percent5, borderRadius: 0.9 * percent5 }}></Text>
        </View>
      </View>


      <View style={{ backgroundColor: '#E0ECEA', flex: 9 , justifyContent: 'center', alignContent: 'center' }}>
        <Button title="send message" onPress={sendMessage}></Button>
        <Button onPress={handleScan} title="Scan"></Button>
        <View>
          {ButtonsDeneme.map((button, index) => (
            <View key={index}>{button}</View>
          ))}
        </View>
      </View>
    </>
    

    

    
    // <View style={styles.container}>
    //   <View >
    //     <Button onPress={handleScan} title="deneme"></Button>
    //     <Text>-------------------------------------------</Text>
    //     <Text>{displayText}</Text>
    //     <Text>{displayTextSocket}</Text>
    //     <Text>{displayTextData}</Text>
    //     <Text>{displayTextButtons}</Text>
    //     <View>
    //       {ButtonsDeneme.map((button, index) => (
    //         <View key={index}>{button}</View>
    //       ))}
    //     </View>
    //     <Text>PC NAME ya da IP aldiysam benim altimda gözükür</Text>
    //     <Text>{pcName}{pcIP}</Text>
    //   </View>
      
    //   {scanInProgress ? (
    //     <View style={[styles.scanningIndicator, { backgroundColor: "red" }]} />
    //   ) : (
    //     pcName && pcIP ? (
    //       <View style={[styles.scanningIndicator, { backgroundColor: "green" }]} />
    //     ) : (
    //       <View style={[styles.scanningIndicator, { backgroundColor: "red" }]} />
    //     )
    //   )}
    //   <Text style={styles.connectionText}>
    //     {pcName && pcIP ? "Connected" : "Disconnected"}
    //   </Text>
    // </View>
  );
  
};

export default App;