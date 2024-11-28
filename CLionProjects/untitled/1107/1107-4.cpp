#include <iostream>
using namespace std;

// BaseClass 선언
class BaseClass {
public:
    virtual ~BaseClass() {}  // 다이나믹캐스트를 위해 가상 소멸자 사용
};

// DerivedClass 선언
class DerivedClass : public BaseClass { // BaseClass 상속
public:
    void print() { // 메서드 선언
        cout << "Everything is OKAY" << endl; // 출력 내용
    }
};

int main() {
    // BaseClass*(=BaseClass 타입의 포인터 변수) 선언(변수 이름은 base)과 DerivedClass 할당
    BaseClass* bas = new DerivedClass();

    // DerivedClass* 선언(이름은 derived) 및 downcasting(dynamic_cast)
    DerivedClass* der = dynamic_cast<DerivedClass*>(bas);

    // 객체 생성 유무를 확인하는 if/else문에서 [출력결과] 내용 출력하기
    if (der) { // 캐스팅 성공 시
        der->print();  // 출력
    } else {
    }

    delete bas; // 메모리 해제

    return 0;
}

