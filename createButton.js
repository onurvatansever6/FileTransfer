import React, { useState } from 'react';
import { Button } from 'react-native';
import startUDPReceive from './startUDP';

export default createButton = async (pcName, pcIp) => {
    const allDevices = await startUDPReceive();
    const buttons = allDevices.map(device => (
      <Button key={device.pcName} title={`Connect to ${device.pcName}`} onPress={() => console.log(`Connecting to ${device.pcName} at ${device.pcIp}`)} />
    ));
    return buttons;
  };