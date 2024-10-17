#include <iostream>
#include <exception>

// 새로운 Exception 클래스 정의
class NewException : public std::exception { // 상속 받음
public:
    const char* what() const _NOEXCEPT override { // 상속 받은 what() 메서드 오버라이드
        return "NewException"; // 반환
    }
};

int main() {
    try { // try catch문
        throw NewException(); // NewException 던지기
    } catch (const NewException& e) { // 예외 처리
        std::cout << "My exception is "; // 예외 메시지 출력
        std::cout << e.what() << std::endl; // what 메서드 호출
    }

    return 0;
}
