import React, { useState, useEffect } from 'react';
import udp from 'react-native-udp';

export default function startUDP() {
  return new Promise((resolve) => {
    const socket = udp.createSocket('udp4');
    socket.bind(8090, "0.0.0.0");

    socket.on('message', (msg, rinfo) => {
      const [pcName, pcIp] = msg.toString().split(":");
      resolve({ pcName, pcIp });
      socket.close();
    });
  });
}