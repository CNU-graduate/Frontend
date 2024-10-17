#include <iostream>
/*
refArray 배열을 참조로 받아 최대값을 구하고 해당 값을 반환하는 findMax 함수 작성
*/
int findMax(int(&arr)[5]){
    int maxVal = arr[0];
    for (int i = 1; i < 5; ++i) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}
int main() {
    int array[5] = {1, 3, 5, 7, 9};
/* array 배열을 참조(레퍼런스)하는 refArray 배열 정의 */
    int(&refArray)[5] = array;
    std::cout << "The maximum value is: " << findMax(refArray) << std::endl;
    return 0;
}
