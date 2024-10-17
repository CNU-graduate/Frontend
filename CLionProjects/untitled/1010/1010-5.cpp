#include <iostream>
#include <string>
#include <iomanip>

class Employee {
private:
    std::string emp_ID; // 사번 변수
    std::string name; // 이름 변수
    int age; // 나이 변수
    std::string address; // 주소 변수
    float salary; // 급여 변수

public:
    // 생성자
    Employee(std::string id, std::string n, int a, std::string addr, float sal)
            : emp_ID(id), name(n), age(a), address(addr), salary(sal) {}

    // 사번 반환하는 메서드
    std::string getEmp_ID() const {
        return emp_ID;
    }

    // 이름 반환하는 메서드
    std::string getName() const {
        return name;
    }

    // 나이 반환하는 메서드
    int getAge() const {
        return age;
    }

    // 주소 반환하는 메서드
    std::string getAddress() const {
        return address;
    }

    // 급여 반환한느 메서드
    float getSalary() const {
        return salary;
    }
};

class Manager : public Employee { // 상속받음
private:
    int teamSize; // 팀사이즈 변수

public:
    // 생성자
    Manager(std::string id, std::string n, int a, std::string addr, float sal, int size)
            : Employee(id, n, a, addr, sal), teamSize(size) {}

    // teamSize 반환하는 메서드
    int getTeamSize() const {
        return teamSize;
    }
};

int main() {
    // 객체 생성
    Manager manager("EMP001", "Manager 이름", 35, "seoul", 5000.00, 10);

    // 출력
    std::cout << "Manager Information" << std::endl;
    std::cout << "Employee ID : " << manager.getEmp_ID() << std::endl;
    std::cout << "Name : " << manager.getName() << std::endl;
    std::cout << "Age : " << manager.getAge() << std::endl;
    std::cout << "Address : " << manager.getAddress() << std::endl;
    std::cout << "Salary : $" << std::fixed << std::setprecision(2) << manager.getSalary() << std::endl;
    std::cout << "Team Size : " << manager.getTeamSize() << std::endl;

    return 0;
}
