#include <iostream>
#include <string>
class Animal {
private:
    std::string name;
public:
    Animal() {};
    Animal(std::string name) : name(name) {};
    void showName() {
        std::cout << "Name is " << name << std::endl;
    }
// operator+ 구현
    Animal operator+ (const Animal & v1){
        Animal temp; //새로운 객체 생성하기
        temp.name = v1.name + name; //합쳐서 저장
        return temp; //반환
    }
};
int main() {
    Animal cat("Nabi");
    cat.showName();
    Animal dog("Jindo");
    dog.showName();
    Animal catDog = dog + cat;
    catDog.showName();
    dog.showName();
    getchar();
    return 0;
}