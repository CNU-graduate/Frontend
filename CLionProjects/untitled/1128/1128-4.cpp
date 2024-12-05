#include <iostream>

// Shape 인터페이스
class Shape {
public:
    virtual void draw() = 0; // 순수 가상 함수
    virtual ~Shape() {} // 가상 소멸자
};

// Rectangle 클래스
class Rectangle : public Shape { // Shape 구현
public:
    void draw() override { // draw 함수 구현
        std::cout << "Shape: Rectangle" << std::endl; // 출력
    }
};

// Circle 클래스
class Circle : public Shape { // Shape 구현
public:
    void draw() override { // draw 함수 구현
        std::cout << "Shape: Circle" << std::endl; // 출력
    }
};

// ShapeDecorator 클래스
class ShapeDecorator : public Shape {
protected:
    Shape* decoratedShape; // Shape 객체

public:
    ShapeDecorator(Shape* shape) : decoratedShape(shape) {} // 생성자
    void draw() override { // 기본 draw 구현
        decoratedShape->draw(); // decoratedShape의 draw 호출
    }
};

// RedShapeDecorator 클래스
class RedShapeDecorator : public ShapeDecorator { // ShapeDecorator 상속
public:
    RedShapeDecorator(Shape* shape) : ShapeDecorator(shape) {} // 생성자

    void draw() override { // draw 메서드 오버라이드
        decoratedShape->draw(); // decoratedShape의 draw 호출
        setRedBorder(decoratedShape); // 빨간 경계 설정
    }

private:
    void setRedBorder(Shape* shape) { // 빨간 경계 설정 함수
        std::cout << "Border Color: Red" << std::endl; // 출력
    }
};


int main() {
    Shape* circle = new Circle(); // 원 객체 생성
    Shape* redCircle = new RedShapeDecorator(new Circle()); // 빨간 경계 원 객체 생성
    Shape* redRectangle = new RedShapeDecorator(new Rectangle()); // 빨간 경계 사각형 객체 생성

    std::cout << "Circle with normal border" << std::endl; // 기본 원 출력
    circle->draw(); // 그리기

    std::cout << "\nCircle of red border" << std::endl; // 빨간 경계 원 출력
    redCircle->draw(); // 그리기

    std::cout << "\nRectangle of red border" << std::endl; // 빨간 경계 사각형 출력
    redRectangle->draw(); // 그리기

    // 메모리 해제
    delete circle;
    delete redCircle;
    delete redRectangle;

    return 0;
}
