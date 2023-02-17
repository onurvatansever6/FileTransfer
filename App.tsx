/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ReactNode, useState } from 'react';
import { View, Text, Button, Dimensions  } from 'react-native';
import dgram from 'react-native-udp';
import DocumentPicker from 'react-native-document-picker';
import fs from 'react-native-fs';

const percent5 = Dimensions.get('window').width / 20;
const Tab = createBottomTabNavigator();

function ScanScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Scan Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}


const App: React.FC = () => {
  const [pcName, setPcName] = useState<any>([]);
  const [statePcIP, setPcIP] = useState<any>([]); 
  const [ButtonsDeneme, setScanButtons] = useState<ReactNode[]>([]);
  const [scanInProgress, setScanInProgress] = useState(true);
  const [selectedFileUri, setSelectedFileUri] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState(Number);
  const [connectableDevice, setConnectableDevice] = useState<any>({});
  const [allDevices, setAllDevices] = useState<any>([]);
  const [debugString, setDebugString] = useState<any>([]);
   
  const CHUNK_SIZE = 1024;
  
  const remotePort = 5000;
  const remoteHost = '10.0.2.2';
  const socket = dgram.createSocket('udp4');

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (result[0].name && result[0].size && result[0].uri) {
        setSelectedFileUri(result[0].uri);
        setSelectedFileName(result[0].name);
        setSelectedFileSize(result[0].size);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Cancelled from picker');
      } else {
        throw err;
      }
    }
  };

  const showConnected = () => {
    setScanInProgress(false);
    socket.send('CONNECT', undefined, undefined, remotePort, remoteHost, function(err) {
      if (err) throw err
      setDebugString(prev => [...prev, "PC'ye mesaj gönderdim\n"])
      console.log('Message sent!')
    })
  }

  const sendFile = async () => {
    console.log("benim pc ip yazıyom connection açmadan önce: ", statePcIP[0]);
    setDebugString(prev => [...prev, "benim pc ip yazıyom connection açmadan önce: " + statePcIP[0] + "\n"]);
    const websocketHost = "ws://" + statePcIP[0] + ":3232";
    console.log("websockethost string: ", websocketHost);
    setDebugString(prev => [...prev, "websockethost string: " + websocketHost + "\n"])
    const socket = new WebSocket(websocketHost);
    console.log("socket: ", socket);

    socket.onopen = () => {
      console.log('Connected to the server');
      setDebugString(prev => [...prev, "Connected to the server\n"]);
    };

    socket.onerror = (error) => {
      console.log(error);
      setDebugString(prev => [...prev, "error connecting to server:" + error + "\n"]);
    };

    socket.onclose = () => {
      console.log('Disconnected from the server');
      setDebugString(prev => [...prev, "Disconnected from the server\n"]);
      debugString.join('');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    fs.readFile(selectedFileUri, 'base64')
      .then((content) => {
        socket.send("fileName:"+ selectedFileName);
        console.log("filename gönderdim pc ye");
        setDebugString(prev => [...prev, "filename gönderdim pc ye\n"]);
        const chunks = [];
        for (let i = 0; i < content.length; i += CHUNK_SIZE) {
          const chunk = content.slice(i, i + CHUNK_SIZE);
          chunks.push(chunk);
        };

        for (const chunk of chunks) {
          socket.send(chunk);
        };
        socket.close();
        console.log("chunk gönderme bitti");
        setDebugString(prev => [...prev, "chunk gönderme bitti\n"]);
        
      })
      .catch((err) => {
        console.log('error', err);
      })
  };
  
  const handleScan = () => {
    socket.bind(34542);
    socket.once('listening', function() {
      socket.send('WHO', undefined, undefined, remotePort, remoteHost, function(err) {
        if (err) throw err
        setDebugString(prev => [...prev, "PC'ye mesaj gönderdim\n"]);
        console.log('Message sent!');
      })
    })
    socket.on('message', function (msg, rinfo) {
      const [pcNameFromMsg, pcIpFromMsg] = msg.toString().split(":");

      setPcIP(prevIP => [...prevIP, pcIpFromMsg]);
      setPcName(prevName => [...prevName, pcNameFromMsg]);

      console.log('rinfo: ', rinfo);
      setDebugString(prev => [...prev, "rinfo:" + rinfo + "\n"]);
      console.log('pc den gelen mesajın içeriği:', pcNameFromMsg, pcIpFromMsg);
      setDebugString(prev => [...prev, "pcname:" + pcNameFromMsg + "pcip:" + pcIpFromMsg + "\n"]);

      setConnectableDevice(connectable => Object.assign(connectable, {deviceName: pcNameFromMsg, deviceIP: pcIpFromMsg}));
      setAllDevices(prevDevices => prevDevices.push(connectableDevice));
      setScanButtons(allDevices.map(device => (
            <Button title={`Connect to ${device.deviceName}`} onPress={showConnected} />
          )));
    });
  }

  

  return (
    <NavigationContainer>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#E0ECEA', marginRight: percent5, marginTop: percent5 }}>
        {scanInProgress ? (
          <Text style={{ marginRight: percent5 / 2, color: 'black' }}>Disconnected</Text>
        ) : (
          <Text style={{ marginRight: percent5 / 2, color: 'black' }}>{pcName[0]}</Text>
        )}
        {scanInProgress ? (
          <Text style={{ backgroundColor: '#C85348', width: 1.8 * percent5, height: 1.8 * percent5, borderRadius: 0.9 * percent5 }}></Text>
        ) : (
          <Text style={{ backgroundColor: 'green', width: 1.8 * percent5, height: 1.8 * percent5, borderRadius: 0.9 * percent5 }}></Text>
        )}
      </View>

      <View style={{ backgroundColor: '#E0ECEA', flex: 9, justifyContent: 'center', alignContent: 'center' }}>
        {debugString && (
          <Text style={{ color: 'black' }}>{debugString}</Text>
        )}
        {statePcIP[0] && (
          <Text style={{ color: 'black' }}>{statePcIP[0]}</Text>
        )}
        <Button onPress={handleScan} title="Scan"></Button>
        {scanInProgress && (
          <View style={{ marginTop: 10 }}>
            {ButtonsDeneme.map((button, index) => (
              <View key={index}>{button}</View>
            ))}
          </View>
        )}
      </View>

      <View>
        <Button title="Select Document" onPress={handleDocumentPicker} />
        {selectedFileName && (
          <Button title="Send Document" onPress={sendFile} />
        )}  
        {selectedFileName && (
          <Text>Selected document: {selectedFileName}</Text>
        )}
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={ScanScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

};

export default App;