/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text, Button, Dimensions, TouchableOpacity, StyleSheet  } from 'react-native';
import dgram from 'react-native-udp';
import DocumentPicker from 'react-native-document-picker';
import fs from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

const percent5 = Dimensions.get('window').width / 20;

const App: React.FC = () => {
  const [pcName, setPcName] = useState<any>([]);
  const [statePcIP, setPcIP] = useState<any>([]); 
  const [ButtonsDeneme, setScanButtons] = useState<ReactNode[]>([]);
  const [scanInProgress, setScanInProgress] = useState(true);
  const [isSendFile, setIsSendFile] = useState(false);
  const [isReadySendFile, setReadyIsSendFile] = useState(false);
  const [selectedFileUri, setSelectedFileUri] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState(Number);
  const [connectableDevice, setConnectableDevice] = useState<any>({});
  const [allDevices, setAllDevices] = useState<any>([]);
  const [debugString, setDebugString] = useState<any>([]);
  const [chunksLength, setChunksLength] = useState(0);
  let [uploadProgress, setUploadProgress] = useState(0);
  
  const pause = () => {
    return new Promise(r => setTimeout(r, 0))
  }

  const CHUNK_SIZE = 1024;
  
  const remotePort = 5000;
  const remoteHost = '10.0.2.2';
  const socket = dgram.createSocket('udp4');

  const handleImages = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });
      if (result[0].name && result[0].size && result[0].uri) {
        setSelectedFileUri(result[0].uri);
        setSelectedFileName(result[0].name);
        setSelectedFileSize(result[0].size);
        setIsSendFile(false);
        setReadyIsSendFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Cancelled from picker');
      } else {
        throw err;
      }
    }
  };

  const handleDocuments = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: 
        [
          DocumentPicker.types.doc, 
          DocumentPicker.types.docx,
          DocumentPicker.types.pdf,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText
        ],
      });
      if (result[0].name && result[0].size && result[0].uri) {
        setSelectedFileUri(result[0].uri);
        setSelectedFileName(result[0].name);
        setSelectedFileSize(result[0].size);
        setIsSendFile(false);
        setReadyIsSendFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Cancelled from picker');
      } else {
        throw err;
      }
    }
  };

  const handleOther = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      });
      if (result[0].name && result[0].size && result[0].uri) {
        setSelectedFileUri(result[0].uri);
        setSelectedFileName(result[0].name);
        setSelectedFileSize(result[0].size);
        setIsSendFile(false);
        setReadyIsSendFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Cancelled from picker');
      } else {
        throw err;
      }
    }
  };

  const showIsSend = () => {
    if (isSendFile){
      setIsSendFile(false);
    }
    if (!isSendFile){
      setIsSendFile(true);
    }
  }

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
      .then(async (content) => {
        socket.send("fileName:"+ selectedFileName);
        console.log("filename gönderdim pc ye");
        setDebugString(prev => [...prev, "filename gönderdim pc ye\n"]);

        const chunkCount = Math.ceil(content.length / CHUNK_SIZE);
        let sentChunks = 0;

        for (let i = 0; i < content.length; i += CHUNK_SIZE) {
          const chunk = content.slice(i, i + CHUNK_SIZE);
          socket.send(chunk);
          sentChunks++;
          if (sentChunks % 100 === 0) {
            await pause()
            setUploadProgress(uploadProgress);

          }
          uploadProgress = (sentChunks / chunkCount);

        };
        setUploadProgress(1);

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
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#E0ECEA'}}>
        {scanInProgress ? (
          <Text style={{ marginRight: percent5 / 3, color: 'black', marginTop: percent5 / 2}}>Disconnected</Text>
        ) : (
          <Text style={{ marginRight: percent5 / 3, color: 'black', marginTop: percent5 / 2 }}>{pcName[0]}</Text>
        )}
        {scanInProgress ? (
          <Text style={{ backgroundColor: '#C85348', width: 1.8 * percent5, height: 1.8 * percent5, borderRadius: 0.9 * percent5, marginRight: percent5 / 2, marginTop: percent5 / 2 }}></Text>
        ) : (
          <Text style={{ backgroundColor: 'green', width: 1.8 * percent5, height: 1.8 * percent5, borderRadius: 0.9 * percent5, marginRight: percent5 / 2, marginTop: percent5 / 2 }}></Text>
        )}
      </View>

      <View style={{ backgroundColor: '#E0ECEA', flex: 9, justifyContent: 'center', alignContent: 'center' }}>
        {/* {debugString && (
          <Text style={{ color: 'black' }}>{debugString}</Text>
        )} */}
        {statePcIP[0] && (
          <Text style={{ color: 'black' }}>{statePcIP[0]}</Text>
        )}
        {scanInProgress && (
          <Button onPress={handleScan} title="Scan"></Button>
        )}
        {!scanInProgress && (
          <Progress.Bar progress={uploadProgress} width={200} />
        )}
        {scanInProgress && (
          <View style={{ marginTop: 10 }}>
            {ButtonsDeneme.map((button, index) => (
              <View key={index}>{button}</View>
            ))}
          </View>
        )}
      </View>
      
      {isReadySendFile && (
          <TouchableOpacity style={{
            position: 'absolute',
            bottom: percent5 / 1.3,
            left: percent5 / 2,
            backgroundColor: 'blue',
            width: 3.5 * percent5,
            height: 3.5 * percent5,
            borderRadius: 1.75 * percent5,
            justifyContent: 'center',
            alignItems: 'center',
          }} onPress={sendFile}>
            <Ionicons name="send" size={30} color="white" />
          </TouchableOpacity>
        )}
      

      <View style={{ backgroundColor: '#E0ECEA' }}>
        <TouchableOpacity style={{
          position: 'absolute',
          bottom: percent5 / 1.3,
          right: percent5 / 2,
          backgroundColor: 'blue',
          width: 3.5 * percent5,
          height: 3.5 * percent5,
          borderRadius: 1.75 * percent5,
          justifyContent: 'center',
          alignItems: 'center',
        }} onPress={showIsSend}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        {isSendFile && (
          <View>
            <TouchableOpacity style={{
              position: 'absolute',
              bottom: 5 * percent5,
              right: percent5,
              backgroundColor: 'blue',
              width: 3 * percent5,
              height: 3 * percent5,
              borderRadius: 1.5 * percent5,
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={handleOther}>
              <Ionicons name="ellipsis-horizontal-sharp" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={{
              position: 'absolute',
              bottom: 3.75 * percent5,
              right: 4 * percent5,
              backgroundColor: 'blue',
              width: 3 * percent5,
              height: 3 * percent5,
              borderRadius: 1.5 * percent5,
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={handleImages}>
              <Ionicons name="image" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={{
              position: 'absolute',
              bottom: percent5 / 2,
              right: 4.5 * percent5,
              backgroundColor: 'blue',
              width: 3 * percent5,
              height: 3 * percent5,
              borderRadius: 1.5 * percent5,
              justifyContent: 'center',
              alignItems: 'center',
            }} onPress={handleDocuments}>
              <Ionicons name="document" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );

};

export default App;