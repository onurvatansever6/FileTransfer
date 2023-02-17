import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScanPage, SendFilePage } from './Pages';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Scan') {
                        iconName = focused ? 'scan-sharp' : 'scan-outline';
                    } else if (route.name === 'Send File') {
                        iconName = focused ? 'send-sharp' : 'send-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Scan" component={ScanPage} />
            <Tab.Screen name="Send File" component={SendFilePage} />
        </Tab.Navigator>
    );
}

export default TabNavigator;
