import React, { useState, useEffect } from 'react';
import udp from 'react-native-udp';

export default function startUDPReceive() {
  const allDevices = [
    {
      pcName:"",
      pcIp:""
    }
  ];
  const socket = udp.createSocket('udp4');
  socket.bind(8090);

  setTimeout(() => {
    socket.close();
  }, 10000);

  socket.on('message', (msg, rinfo) => {
    const [pcName, pcIp] = msg.toString().split(":");
    const connectedDevice = ({ pcName, pcIp });

    let found = false;
    for (let index = 0; index < allDevices.length; index++) {
      if (allDevices[index].pcIp == connectedDevice.pcIp) {
        found = true;
        break;
      }
    }

    if (!found) {
      allDevices.push(connectedDevice);
    }
  });
  console.log("gönderiyorum")
  return allDevices;
}