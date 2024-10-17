#include <iostream>

class a { // 클래스 a 정의
private:
    int num; // 캡슐화 위해 프라이빗으로

public:
    a(int v) : num(v) {} // 생성자

    // postfix unary
    a operator++(int) { // 포스트픽스라 매개변수 int 넣음
        a temp = *this; // 현재 값 저장
        num++; // 값 증가
        return temp; // 증가 전의 값 반환
    }

    // prefix unary
    a& operator++() { // 객체의 참조를 반환하기 위해 a&로
        num++; // 값 증가
        return *this; // 증가된 객체 반환
    }

    // 값을 반환하는 메서드
    int getValue() const {
        return num; // 값 반환
    }
};

int main() {
    a v(5); // 초기값 5
    std::cout << v.getValue() << " "; // 출력

    v++; // postfix increment
    std::cout << v.getValue() << " "; // 출력

    ++v; // prefix increment
    std::cout << v.getValue() << std::endl; // 출력

    return 0;
}

