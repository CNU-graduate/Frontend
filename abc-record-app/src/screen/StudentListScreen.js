import { StyleSheet, Text, View } from 'react-native';

const StudentListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>학생 목록 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' }
});

export default StudentListScreen;