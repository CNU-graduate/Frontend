#include <iostream>


class A {
public:
    A() { // 생성자
        std::cout << "Constructor()" << std::endl; // 출력
    }

    ~A() { // 소멸자
        std::cout << "Destructor()" << std::endl; // 출력
    }
};

int main() {
    try { // try catch문
        A obj;  // 객체 생성
        throw 10;  // 예외 발생
    } catch (int e) { // 예외 처리
        std::cout << "Catch " << e << std::endl;  // 예외 출력
    }

    return 0;
}
