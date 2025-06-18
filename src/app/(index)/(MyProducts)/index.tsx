import { NativeModules, Text, View } from 'react-native';

export default function HomeScreen() {
  const { BatteryModule } = NativeModules;
  
    const checkBattery = async () => {
      try {
        const batteryLevel = await BatteryModule.getBatteryLevel();
        console.log(`Battery: ${batteryLevel}%`);
        return batteryLevel;
      } catch (error) {
        console.error("Battery error:", error);
        return -1;
      }
    };
  
    checkBattery();
  

  return (
    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
      <Text>MyProducts Screen</Text>
    </View>
  );
}