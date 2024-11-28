#include <iostream>
#include <string>

// Shape 클래스
class Shape { // Shape 상속
public:
    virtual void draw() = 0; // 순수 가상 함수
    virtual ~Shape() {} // 가상 소멸자
};

// Rectangle 클래스
class Rectangle : public Shape { // shape 상속
public:
    void draw() override {
        std::cout << "Inside Rectangle::draw() method." << std::endl; // 출력
    }
};

// Square 클래스
class Square : public Shape { // Shape 상속
public:
    void draw() override {
        std::cout << "Inside Square::draw() method." << std::endl; // 출력
    }
};

// RoundedRectangle 클래스
class RoundedRectangle : public Shape { // Shape 상속
public:
    void draw() override {
        std::cout << "Inside RoundedRectangle::draw() method." << std::endl; // 출력
    }
};

// RoundedSquare 클래스
class RoundedSquare : public Shape { // shape 상속
public:
    void draw() override {
        std::cout << "Inside RoundedSquare::draw() method." << std::endl; // 출력
    }
};

// AbstractFactory 클래스
class AbstractFactory {
public:
    virtual Shape* getShape(const std::string& shapeType) = 0; // 추상 메서드
    virtual ~AbstractFactory() {} // 가상 소멸자
};

// ShapeFactory 클래스
class ShapeFactory : public AbstractFactory { // abstractfactory 상속
public:
    Shape* getShape(const std::string& shapeType) override {
        if (shapeType == "RECTANGLE") {
            return new Rectangle(); // 객체 생성하여 반환
        } else if (shapeType == "SQUARE") {
            return new Square(); // 객체 생성하여 반환
        }
        return nullptr;
    }
};

// RoundedShapeFactory 클래스
class RoundedShapeFactory : public AbstractFactory { // abstractfactory 상속
public:
    Shape* getShape(const std::string& shapeType) override {
        if (shapeType == "RECTANGLE") {
            return new RoundedRectangle(); // 객체 생성하여 반환
        } else if (shapeType == "SQUARE") {
            return new RoundedSquare(); // 객체 생성하여 반환
        }
        return nullptr;
    }
};

// FactoryProducer 클래스
class FactoryProducer {
public:
    static AbstractFactory* getFactory(bool rounded) {
        if (rounded) {
            return new RoundedShapeFactory(); // 팩토리 반환
        } else {
            return new ShapeFactory(); // 팩토리 반환
        }
    }
};


int main() {

    AbstractFactory* shapeFactory = FactoryProducer::getFactory(false);

    // 객체 생성
    Shape* shape1 = shapeFactory->getShape("RECTANGLE");
    shape1->draw(); // draw 호출

    // 객체 생성
    Shape* shape2 = shapeFactory->getShape("SQUARE");
    shape2->draw(); // draw 호출

    // 메모리 해제
    delete shape1;
    delete shape2;
    delete shapeFactory;

    // 팩토리 생성
    AbstractFactory* shapeFactory1 = FactoryProducer::getFactory(true);

    // 객체 생성
    Shape* shape3 = shapeFactory1->getShape("RECTANGLE");
    shape3->draw(); // draw 호출

    // 객체 생성
    Shape* shape4 = shapeFactory1->getShape("SQUARE");
    shape4->draw(); // draw 호출

    // 메모리 해제
    delete shape3;
    delete shape4;
    delete shapeFactory1;

    return 0;
}
