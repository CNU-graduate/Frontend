#include <iostream>
#include <string>

// DrawAPI 클래스
class DrawAPI {
public:
    virtual void drawCircle(int radius, int x, int y) = 0; // 순수 가상 함수
    virtual ~DrawAPI() {} // 가상 소멸자
};
 // RedCircle 클래스
class RedCircle : public DrawAPI { // DrawAPI 구현
public:
    void drawCircle(int radius, int x, int y) override {
        std::cout << "Drawing Circle[ color: red, radius: " << radius // 출력
                  << ", x: " << x << ", " << y << "]" << std::endl; // 출력
    }
};

// GreenCircle 클래스
class GreenCircle : public DrawAPI { // DrawAPI 구현
public:
    void drawCircle(int radius, int x, int y) override {
        std::cout << "Drawing Circle[ color: green, radius: " << radius // 출력
                  << ", x: " << x << ", " << y << "]" << std::endl; // 출력
    }
};

// Shape 클래스
class Shape { // 추상 클래스
protected:
    DrawAPI* drawAPI; // drawapi 참조

public:
    Shape(DrawAPI* drawAPI) : drawAPI(drawAPI) {} // 생성자
    virtual void draw() = 0; // 순수 가상 함수
    virtual ~Shape() {} // 가상 소멸자
};

// Circle 클래스
class Circle : public Shape { // Shape 상속
private:
    int x, y, radius; // 매개변수

public:
    // 생성자
    Circle(int x, int y, int radius, DrawAPI* drawAPI)
            : Shape(drawAPI), x(x), y(y), radius(radius) {}

    void draw() override { // draw 메서드
        drawAPI->drawCircle(radius, x, y); // drawAPI의 drawCircle 호출
    }
};


int main() {
    // 객체 생성
    Shape* redCircle = new Circle(100, 100, 10, new RedCircle());
    Shape* greenCircle = new Circle(100, 100, 10, new GreenCircle());

    redCircle->draw(); //draw 호출
    greenCircle->draw(); // draw 호출

    delete redCircle; // 메모리 해제
    delete greenCircle; // 메모리 해제

    return 0;
}
