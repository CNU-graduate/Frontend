#include <iostream>
#include <string>
#include <algorithm>

template<typename T>
double min_value(T x){ // 베이스 함수
    return x;
}

template<typename T, typename... Args>
double min_value(T x, Args...args){ // 가변 인자 받는 함수
    return std::min(static_cast<double>(x), min_value(args...)); // 최솟값 재귀적으로 구하기

}

int main(){
    auto x = min_value(42,3.14,11.1f,-2); // 최솟값 계산
    std::cout << x; // 출력

    getchar();
    return 0;
}