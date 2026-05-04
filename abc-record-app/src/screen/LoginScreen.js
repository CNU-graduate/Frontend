import { Button, StyleSheet, Text, View } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>특수교사 행동 기록 시스템</Text>
      {/* 임시 로그인 버튼: 누르면 학생 목록 화면으로 이동 */}
      <Button 
        title="로그인 테스트" 
        onPress={() => navigation.replace('StudentList')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' }
});

export default LoginScreen;