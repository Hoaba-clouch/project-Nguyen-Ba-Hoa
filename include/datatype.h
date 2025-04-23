
#include <stdbool.h>
typedef struct Date{
    int day;// Ngày
    int month;// Tháng
    int year;// Nam
} Date;
typedef struct{
    char bookId[10];// ID sách
    char title[30];// Tiêu d? sách
    char author[20];// Tác gi?
    int quantity;// s? lu?ng sách có s?n
    int price;// Giá ti?n trên 1 cu?n sách
    Date publication;// Ngày xu?t b?n
}Book;
typedef struct{
    char memberId[10];// ID khách
    char name[20];// Ten khách
    char phone[10];// S? di?n tho?i
    bool status;// Status
    Book BorrowedBooks[5];// li?t kê nh?ng sách dã mu?n
    int bookCount;// Ð?m S? lu?ng sách
}Member;
