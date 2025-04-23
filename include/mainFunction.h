#ifndef MAIN_FUNCTION_H
#define MAIN_FUNCTION_H
extern int numBooks;
extern int numMember;
#endif
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"datatype.h"
#include"D:\project\include\secondaryFunction.h"
#define MAX 1000
// mainFunction.h
extern int numBooks;
extern int numMember;

const char *FILE_NAME = "C:\\Users\\HOANG DINH TUNG\\CLionProjects\\untitled14\\datas\\listBook.dat";
const char *FILE_NAME1 = "C:\\Users\\HOANG DINH TUNG\\CLionProjects\\untitled14\\datas\\listCustomer.dat";
Book book[MAX];
Member member[MAX];
int numBooks=0;// S? lu?ng sách
int numMember=0;// S? lu?ng khách hàng
// DANH SÁCH THU VI?N
// Hi?n hi?n menu chính
void showMenuMain();

// Hi?n th? menu sách
void showMenuBook();

// Luu sách vào file nh? phân
void saveBookToBinaryFile(Book *book1);

// Ð?c thông tin c?a sách t? file
void readBookFromBinaryFile(int mode);

// Nh?p vào các thông tin c?a l?p h?c
void inputInfoBook(Book *book1,const int *i,int index,int mode);

// Ch?nh s?a thông tin l?p h?c
void editInforBook();

// Xóa Sách
void deleteBook();

//Tìm ki?m sách theo tên
void searchTitleBook();

// S?p x?p sách theo giá ti?n
void sortBooksByPrice();

// L?a ch?n tính nang trong Menu qu?n lý sách
void choiceMenuBook();

//DANH SÁCH KHÁCH HÀNG
// Hi?n th? menu khách hàng
void showMenuCustomer();

// Luu khách vào file nh? phân
void saveCustomerToBinaryFile(Member *member1);

// Ð?c thông tin c?a Khách t? file
void readCustomerFromBinaryFile(int mode);

// Thêm khách và nh?p vào thông tin khách
void inputInfoCustomer(Member *member1,const int *i,int index,int mode);

// Ch?nh s?a thông tin khách hàng
void editInforCustomer();

// Khóa (M?) thông tin khách hàng
void toggleMemberStatus();

//Tìm ki?m khách theo tên
void searchNameCustomer();

// Cho mu?n sách (sách mu?n t?i da là 5 quy?n)
void addBookByCustomer();

// L?a ch?n tính nang trong Menu qu?n lý khách hàng
void choiceMenuCustomer();
