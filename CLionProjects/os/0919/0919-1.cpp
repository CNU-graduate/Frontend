#include <iostream>
void increment(int x)
{
    ++x;
}
int main()
{
    int x=55;
    std::cout<<" Before increment: "<<x<< std::endl;
    increment( x );
    std::cout << " After increment: " << x << std::endl;
    getchar();
    return 0;
}
