import "react-native-gesture-handler"
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/Routes.js'

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
