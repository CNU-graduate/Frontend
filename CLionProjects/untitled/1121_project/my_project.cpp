#include <iostream>
#include <string>

using namespace std;

// 인터페이스
class BasicComputer {
public:
    virtual string option() const = 0; // 옵션을 반환하는 순수 가상 함수
    virtual int cost() const = 0; // 가격을 반환하는 순수 가상 함수
    virtual ~BasicComputer() {} // 가상 소멸자
};
// 기본클래스
class basic : public BasicComputer {
public:
    string option() const {
        return ""; // 빈 문자열 반환
    }
    int cost() const {
        return 500000; // 기본 컴퓨터 가격 반환
    }
    virtual ~basic() {} // 가상 소멸자
};
// 데코레이터
class add : public BasicComputer {
protected:
    BasicComputer* computer; // 기본 컴퓨터 객체 포인터
public:
    add(BasicComputer* c) : computer(c) {}

    virtual string option() const = 0; // 옵션을 반환하는 순수 가상 함수
    virtual int cost() const = 0; // 가격을 반환하는 순수 가상 함수

    virtual ~add() { // 가상 소멸자
        delete computer;
    }
};
// RAM 옵션 추가 클래스
class RAM : public add {
public:
    RAM(BasicComputer* c) : add(c) {}

    string option() const override {
        return computer->option() + "RAM"; // RAM 더하기
    }

    int cost() const override {
        return computer->cost() + 50000; // 50000 더하기
    }
};
// SSD 옵션 추가 클래스
class SSD : public add {
public:
    SSD(BasicComputer* c) : add(c) {}

    string option() const override {
        return computer->option() + "SSD"; // SSD 더하기
    }

    int cost() const override {
        return computer->cost() + 80000; // 80000 더하기
    }
};
// GPU 옵션 추가 클래스
class GPU : public add {
public:
    GPU(BasicComputer* c) : add(c) {}

    string option() const override {
        return  computer->option() + "GPU"; //GPU 더하기
    }

    int cost() const override {
        return computer->cost() + 200000; // 200000 더하기
    }
};

int main() {
    BasicComputer* computer = new basic(); // 객체 생성

    char choice;
    cout << "Add RAM? (y/n) ";
    cin >> choice;
    if (choice == 'y' || choice == 'Y') {
        computer = new RAM(computer); // 옵션 추가
    }

    cout << "Add SSD? (y/n) ";
    cin >> choice;
    if (choice == 'y' || choice == 'Y') {
        computer = new SSD(computer); // 옵션 추가
    }

    cout << "Add GPU? (y/n) ";
    cin >> choice;
    if (choice == 'y' || choice == 'Y') {
        computer = new GPU(computer); // 옵션 추가
    }

    cout << computer->option() << "Computer, " << computer->cost() << endl; // 출력

    delete computer;
    return 0;
}
