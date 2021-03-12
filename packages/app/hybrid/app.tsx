import 'react-native-gesture-handler';
import React, { FC } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './screens/home-screen';
import CreateGameScreen from './screens/create-game-screen';
import { QueryClient, QueryClientProvider } from 'react-query';
import GameScreen from './screens/game-screen';

const Stack = createStackNavigator();

const queryClient = new QueryClient();

const App: FC = () => {
  return <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateGame" component={CreateGameScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </QueryClientProvider>
}

export default App;
