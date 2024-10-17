#include <iostream>
#include <string>

class Person {
private:
    std::string name; // 이름 변수
    int age; // 나이 변수
    std::string address; // 주소 변수

public:
    // 생성자
    Person(std::string n, int a, std::string addr) : name(n), age(a), address(addr) {}

    // 이름 반환하는 메서드
    std::string getName() const {
        return name;
    }

    // 나이 반환하는 메서드
    int getAge() const {
        return age;
    }

    //주소 반환하는 메서드
    std::string getAddress() const {
        return address;
    }
};

class Student : public Person { // Person 클래스 상속
private:
    std::string studentID; // 학번 변수

public:
    // 생성자
    Student(std::string n, int a, std::string addr, std::string id) : Person(n, a, addr), studentID(id) {}

    // 학번 반환하는 메서드
    std::string getStudentID() const {
        return studentID;
    }
};

int main() {
    // 객체 생성
    Student student("최은서", 10, "daejeon", "202301779");

    // 출력
    std::cout << "Student Information" << std::endl;
    std::cout << "Name : " << student.getName() << std::endl;
    std::cout << "Age : " << student.getAge() << std::endl;
    std::cout << "Address : " << student.getAddress() << std::endl;
    std::cout << "Student ID : " << student.getStudentID() << std::endl;

    return 0;
}
