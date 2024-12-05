#include <iostream>

template <typename T>
T sum(T x){ // 베이스 역할을 하는 기본 함수
    return x;
}

template <typename T, typename... Args>
T sum(T x, Args...args){ // 가변 인자 처리하는 더하기 함수
    return x + sum(args...); // 재귀적으로 처리
}

template <typename T, typename... Args>
T average(T x, Args...args){ // average 함수
    return sum(x, args...) / (sizeof...(args)+1); // 평균 계산하여 반환
}

int main(){
    std::cout << average(1,2,3,4,10,10) << std::endl; // 평균 출력

    return 0;
}