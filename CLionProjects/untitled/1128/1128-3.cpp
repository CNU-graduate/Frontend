#include <iostream>
#include <algorithm>
#include <forward_list>

// 버블소트 로직 구현
template <typename Fowarditerator, typename Compare>
void bubble_sort(Fowarditerator first, Fowarditerator last, Compare comp){
    bool change; // 원소 교환 변수
    do{
        change = false; // 교환 여부
        auto curr = first;
        while (std::next(curr) != last) {  // curr과 next(curr) 비교
            auto next = std::next(curr); // curr 다음 원소 next에 저장
            if (comp(*curr, *next)) {  // 비교 함수 사용
                std::iter_swap(curr, next);  // 원소 교환
                change = true; // 교환됨
            }
            ++curr;
        }
    }while(change);

}

// 오름차순 정렬
class compGreater{
public:
    template <typename T>
    bool operator()(const T& a, const T& b) const {
        return a > b;  // a가 b보다 크면 true 반환
    }

};

// 내림차순 정렬
class compLess{
public:
    template <typename T>
    bool operator()(const T& a, const T& b) const {
        return a < b;  // a가 b보다 작으면 true 반환
    }

};

int main(){
    std::forward_list<int> values; // c++11 이상에서 중괄호초기화리스트를 사용해서 초기화하는 것이 안되어서 다른 방식으로 바꿈
    values.push_front(3);
    values.push_front(4);
    values.push_front(2);
    values.push_front(5);
    values.push_front(1);
    values.push_front(6);
    values.push_front(0);
    values.push_front(7);


    std::cout << "오름차순 정렬" << std::endl; // 오름차순 출력
    bubble_sort(values.begin(), values.end(), compGreater()); // 정렬
    for (int num : values) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    std::cout << "내림차순 정렬" << std::endl; // 내림차순 출력
    bubble_sort(values.begin(), values.end(), compLess()); // 정렬
    for (int num : values) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}