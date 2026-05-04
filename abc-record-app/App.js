import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 방금 만든 화면 두 개를 불러옵니다.
import LoginScreen from './src/screens/LoginScreen';
import StudentListScreen from './src/screens/StudentListScreen';

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* 화면 이동 경로 설정 (initialRouteName="Login"이 첫 화면) */}
      <Stack.Navigator initialRouteName="Login">
        {/* 로그인 화면 */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // 로그인 화면은 위에 제목 바 숨김
        />
        {/* 학생 목록 화면 */}
        <Stack.Screen 
          name="StudentList" 
          component={StudentListScreen} 
          options={{ title: '학생 목록' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}