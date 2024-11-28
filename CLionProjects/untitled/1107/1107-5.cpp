#include <iostream>
#include <cassert>

using namespace std;

// rank1 클래스 작성
class CEO {
public:
    virtual ~CEO() = default;  // 가상 소멸자
};

// rank2 클래스 작성
class CPO {
public:
    virtual ~CPO() = default;  // 가상 소멸자
};

// rank3 클래스 작성
class Manager : public CEO, public CPO { // rank1,2 상속
};

// rank4 클래스 작성
class Staff : public CPO { // rank2 상속
};

int main() {
    // CPO* cpo 선언하고 하위 rank object 할당 (upcasting)
    CPO* cpo = new Manager();  // 업캐스팅

    // CEO* ceo 선언하고 하위 rank object 할당 (upcasting)
    CEO* ceo = new Manager();  // 업캐스팅

    // Staff* staff 선언하고 CPO downcasting (dynamic_cast)
    Staff* staff = dynamic_cast<Staff*>(cpo);  // 다운캐스팅

    // Staff* staff2 선언하고 CEO downcasting (dynamic_cast)
    Staff* staff2 = dynamic_cast<Staff*>(ceo);  // 다운캐스팅

    // Manager* manager 선언하고 downcasting (dynamic_cast)
    Manager* manager = dynamic_cast<Manager*>(cpo);  // 다운캐스팅

    // assert() 함수 사용하여 staff, staff2, manager 포인터 변수가 nullptr이 아닌지 확인
    assert(staff == nullptr);   // CPO 다운캐스팅 가능 여부 확인
    assert(staff2 == nullptr);  // CEO 다운캐스팅 가능 여부 확인
    assert(manager != nullptr); // CPO 다운캐스팅 가능 여부 확인

    return 0;
}
