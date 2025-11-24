import { Stack, Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabsLayout() {
  return 
  <Tabs screenOptions={{ tabBarActiveTintColor: "coral" }}>
    <AntDesign name="home" size={24} color="black" />
    <Tabs.Screen name="index" 
    options={{ 
      title: "Home", 
      tabBarIcon: ({color, focused}) => {
        return focused ?
          (<FontAwesome5 name="home" size={24} color="black" />) :
          (<AntDesign name="home" size={24} color={color} />)
      },
      }} />
    <Tabs.Screen name="login" options={{ title: "Login" }} />
  </Tabs>;
}
