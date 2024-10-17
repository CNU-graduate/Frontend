#include <iostream>
using namespace std;

class Circle {
    const double PI = 3.14;
    double radius;      // 반지름
    double cir, area;   // 둘레, 면적
    static int count;   // 정적 변수

public:
    Circle() : radius(0.0), cir(0.0), area(0.0) { //씨라이언으로 했더니 인식안돼서 중괄호를 괄호로 바꿈
        count++; //원 개수 세기
    }
    Circle(double r){
        radius = r; //반지름 설정
        cir = PI * 2 * r; //둘레 계산
        area = PI * r * r; //면적 계산
        count++; //원 개수 세기
    }
    void printCircle() const {
        cout << "원의 반지름 : " << radius << endl;
        cout << "원의 둘레 : " << cir << endl;
        cout << "원의 면적 : " << area << endl;
        cout << "지금까지 생성된 원의 개수 = " << Circle::count << endl << endl;
    }
};


int Circle::count = 0;

int main()
{
    Circle c1;
    c1.printCircle();

    Circle c2(3);
    c2.printCircle();

    Circle c3(5.5);
    c3.printCircle();

    return 0;
}
