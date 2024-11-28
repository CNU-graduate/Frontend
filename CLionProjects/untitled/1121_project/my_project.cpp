#include <iostream>
#include <string>

using namespace std;

class basic {
public:
    virtual string option() const {
        return "";
    }
    virtual int cost() const {
        return 500000;
    }
    virtual ~basic() {}
};

class add : public basic {
public:
    basic* computer;
    add(basic* c) : computer(c) {}

    virtual string option() const = 0;
    virtual int cost() const = 0;

    virtual ~add() {
        delete computer;
    }
};

class RAM : public add {
public:
    RAM(basic* c) : add(c) {}

    string option() const override {
        return computer->option() + "RAM";
    }

    int cost() const override {
        return computer->cost() + 50000;
    }
};

class SSD : public add {
public:
    SSD(basic* c) : add(c) {}

    string option() const override {
        return computer->option() + "SSD";
    }

    int cost() const override {
        return computer->cost() + 80000;
    }
};

class GPU : public add {
public:
    GPU(basic* c) : add(c) {}

    string option() const override {
        return  computer->option() + "GPU";
    }

    int cost() const override {
        return computer->cost() + 200000;
    }
};

int main() {
    basic* computer = new basic();

    char choice;
    cout << "Add RAM? (y/n) ";
    cin >> choice;
    if (choice == 'y' || choice == 'Y') {
        computer = new RAM(computer);
    }

    cout << "Add SSD? (y/n) ";
    cin >> choice;
    if (choice == 'y' || choice == 'Y') {
        computer = new SSD(computer);
    }

    cout << "Add GPU? (y/n) ";
    cin >> choice;
    if (choice == 'y' || choice == 'Y') {
        computer = new GPU(computer);
    }

    cout << computer->option() << "Computer, " << computer->cost() << endl;

    delete computer;
    return 0;
}
