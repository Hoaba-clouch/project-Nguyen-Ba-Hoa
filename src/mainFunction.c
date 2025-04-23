#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
// Created by HOANG DINH TUNG on 2/12/2025.
//
// Tri?n khai hàm
#include "D:\project\include\mainFunction.h"
//DANH SÁCH THU VI?N
// Hi?n th? menu chính
//#include "D:\project\include\datatype.h" 
// mainFunction.c


void showMenuMain(){
    printf("%-42s\n","***STUDENT MANAGEMENT SYSTEM USING C***");
    printf("\t\tCHOOSE YOUR ROLE\n");
    printf("\t|===============================|\n");
    printf("%-33s|\n","\t| [1] Management Book");
    printf("%-33s|\n","\t| [2] Management Customer");
    printf("%-33s|\n","\t| [0] Exit the Program");
    printf("\t|===============================|\n");
}

// Hi?n th? menu sách
void showMenuBook(){
    printf("\t\tMENU BOOK\n");
    printf("\t|==============================|\n");
    printf("%-32s|\n","\t| [1] Show All Books");
    printf("%-32s|\n","\t| [2] Add New the Books");
    printf("%-32s|\n","\t| [3] Edit the Books");
    printf("%-32s|\n","\t| [4] Delete the Books");
    printf("%-32s|\n","\t| [5] Find the Books by name");
    printf("%-32s|\n","\t| [6] Sort the Books by price");
    printf("%-32s|\n","\t| [0] Exit the Program");
    printf("\t|==============================|\n");
}

// Luu sách vào file nh? phân
void saveBookToBinaryFile(Book *book1){
    // T?o và m? file vi?t
    FILE *f=fopen(FILE_NAME, "ab");
    if(f==NULL){
        printf("\tCannot open file %s write!!!\n",FILE_NAME);
        return;
    }
    // Ghi s? lu?ng l?p vào file
    fwrite(book1,sizeof(Book),1,f);
    printf("\tSave file success!!!!\n");
    // Ðóng file
    fclose(f);
}

// Ð?c thông tin c?a sách t? file
void readBookFromBinaryFile(int mode){
    FILE *f=fopen(FILE_NAME,"rb");
    if(f==NULL){
        printf("\tFile %s no exist or no datas!!!\n",FILE_NAME);
        return;
    }
    numBooks=0;
    Book book1;
    if(mode==1){
        printf("$==========$===================INFORMATION BOOK================$==========$==========$====================$\n");
        printf("|%-10s|%-30s|%-20s|%-10s|%-10s|%-20s|\n","ID","TITLE","AUTHOR","QUANLITY","PRICE(VND)","DATE PUBLICATION");
        printf("$==========$==============================$====================$==========$==========$====================$\n");
    }
    while(fread(&book1,sizeof(Book),1,f)){
        book[numBooks++] = book1; // Luu l?p vào m?ng và tang s? lu?ng l?p
        if(mode==1){
            printf("|%-10s|%-30s|%-20s|%-10d|%-10d|%-20s|\n" ,
                   book1.bookId,
                   book1.title,
                   book1.author,
                   book1.quantity,
                   book1.price,
                   formatConversionDate(book1.publication));
            printf("$----------$------------------------------$--------------------$----------$----------$--------------------$\n");
        }
    }
    // Ðóng file
    fclose(f);
}

// Nh?p vào các thông tin c?a sách
void inputInfoBook(Book *book1,const int *i,int index,int mode) {
    if(mode==0){
        printf("\tPlease enter the number of Books want to add : ");
        scanf("%d",i);
        getchar();
    }
    // Nh?p t?ng thông tin c?a sách
    for(int j=0;j<*i;j++){
        if(mode==1){
            j=index;
        }
        // NH?P ID SÁCH
        if(mode==0){
            while(1){
                fflush(stdin);
                char input[50];
                printf("\tPlease enter the book ID (Vd: B001) : ");
                fgets(input,sizeof(input),stdin);
                // Xóa kí t? xu?ng dòng
                input[strcspn(input,"\n")]='\0';
                // Ki?m tra d? dài và kí t? r?ng
                if (strlen(input) == 0 || strlen(input) > 10) {
                    printf("\tError: Book ID must be between 1 and 10 characters!!!\n");
                    continue;
                }
                // Ki?m tra Id có t?n t?i hay chua
                if(checkIdExistBook(book1,numBooks,input)){
                    printf("\tError: Book ID already exists, Please enter a different one!!!\n");
                    continue;
                }
                // H?p l? luu vào danh sách
                strcpy(book1[j].bookId, input);
                printf("\tBook ID has been added successfully!\n");
                break;
            }
        }
        // NH?P TIÊU Ð? CHO SÁCH
        while (1){
            fflush(stdin);
            char input[50];
            printf("\tPlease enter the book Title : ");
            fgets(input,sizeof(input),stdin);
            input[strcspn(input,"\n")]='\0';
            // Ki?m tra tên sách có t?n t?i hay chua
            if(checkTitleExistBook(input,numBooks,book1)){
                printf("\tError: Book Title already exists, Please enter a different one!!!\n");
                continue;
            }
            strcpy(book1[j].title, input);
            printf("\tBook Title has been added successfully!\n");
            break;
        }
        // NH?P TÊN TÁC GI?
        while (1){
            fflush(stdin);
            char input[50];
            printf("\tPlease enter the author's name : ");
            fgets(input,sizeof(input),stdin);
            input[strcspn(input,"\n")]='\0';
            // Ki?m tra kí t? r?ng
            if (strlen(input) == 0) {
                printf("\tError: Book ID must be between 1 and 10 characters!!!\n");
                continue;
            }
            strcpy(book1[j].author, input);
            printf("\tBook Author has been added successfully!\n");
            break;
        }
        // M?I NH?P S? LU?NG SÁCH CÙNG LO?I
        while (1){
            fflush(stdin);
            printf("\tPlease enter the quantity of this book : ");
            scanf("%d",&book1[j].quantity);
            // Ki?m tra s? lu?ng
            if (book1[j].quantity<=0) {
                printf("\tError: The number of books must be greater than Zero!!!\n");
                continue;
            }
            printf("\tBook Quanlity has been added successfully!\n");
            break;
        }
        // NH?P GIÁ BÁN CHO SÁCH
        while(1){
            fflush(stdin);
            printf("\tPlease enter the price : ");
            scanf("%d",&book1[j].price);
            // Ki?m tra giá
            if (book1[j].price<1000) {
                printf("\tError: The price of a book must be greater than 1000!!!\n");
                continue;
            }
            printf("\tBook Price has been added successfully!\n");
            break;
        }
        // NH?P NGÀY XU?T B?N
        do{
            fflush(stdin);
            printf("\tPlease enter the day : ");
            scanf("%d",&book1[j].publication.day);
            printf("\tPlease enter the month : ");
            scanf("%d",&book1[j].publication.month);
            printf("\tPlease enter the year : ");
            scanf("%d",&book1[j].publication.year);
            if(!checkDateValid(book1[j].publication.day,
                               book1[j].publication.month,
                               book1[j].publication.year)){
                // Nh?p ko thành công
                printf("\tInvalid, please again enter!!!\n");
            }
            else{
                printf("\tEnter successfully!!!\n");
                break;
            }
        }while(1);
        if(mode==0){
            saveBookToBinaryFile(&book1[j]);// luu thông tin vào file nh? phân
        }
    }
}

// Ch?nh s?a thông tin l?p h?c
void editInforBook(){
    readBookFromBinaryFile(1);
    int n=1;
    fflush(stdin);
    char ma[10];
    printf("\tPlease enter Book Id want to edit : ");
    fgets(ma, sizeof(ma), stdin);
    ma[strcspn(ma, "\n")] = '\0';
    // L?y ch? s? c?a ID trong mang danh sách l?p
    int index = findIdByBook(ma);
    if (index == -1) {
        printf("\tNo find Book ID!!!!\n");
        return;
    }
    // Hi?n th? thông tin cu tru?c khi s?a
    printf("\tShow old Information Book: \n");
    printf("\tID : %s\n", book[index].bookId);
    printf("\tTitle : %s\n", book[index].title);
    printf("\tAuthor : %s\n", book[index].author);
    printf("\tQuanlity : %d\n", book[index].quantity);
    printf("\tPrice : %d\n",book[index].price);
    printf("\tDate Publication : %s\n", formatConversionDate(book[index].publication));
    // C?p nh?t l?i thông tin
    inputInfoBook(book,&n , index, 1);
    // Ghi l?i thông tin vào file
    FILE *f=fopen(FILE_NAME, "wb");
    if(f==NULL){
        printf("\nFile %s no exsit or no datas!!!\n",FILE_NAME);
        return;
    }
    // Ðóng file
    fwrite(book, sizeof(Book), numBooks, f);
    fclose(f);
    printf("\tUpdated information Book successfully!!!\n");
}

// Xóa Sách
void deleteBook(){
    // Ð?c file và luu vào book
    readBookFromBinaryFile(1);
    // Nh?p ID
    char ma[10];
    fflush(stdin);
    printf("\tPlease enter Book Id to Delete : ");
    fgets(ma,sizeof(ma),stdin);
    ma[strcspn(ma,"\n")]='\0';
    // Tìm sách b?ng mã
    int index = findIdByBook(ma);
    if(index==-1){
        printf("\tNo find Book ID!!!!\n");
        return;
    }
    else{
        int choice;
        printf("\tAre you sure you want to delete?\n");
        printf("\t1.YES\n");
        printf("\t0.NO\n");
        printf("\tEnter The Choice : ");
        scanf("%d",&choice);
        if(choice){
            for(int i=index;i<numBooks-1;i++){
                *(book + i) = *(book + i + 1);
            }
            --(numBooks);
            // Ghi l?i thông tin vao file
            FILE *f=fopen(FILE_NAME, "wb");
            if(f==NULL){
                printf("\nFile %s no exsit or no datas!!!\n",FILE_NAME);
                return;
            }
            // Ðóng file
            fwrite(book, sizeof(Book), numBooks, f);
            fclose(f);
            printf("\tDelete Book successfully!!!\n");
            return;
        }
        else{
            return;
        }
    }
}

//Tìm ki?m sách theo tên
void searchTitleBook(){
    int numResults=0;
    char keyWords[30];
    fflush(stdin);
    Book results[numBooks]; // C?u trúc luu thông tin
    printf("\tPlease enter keywords to find books : ");
    fgets(keyWords, sizeof(keyWords), stdin);
    keyWords[strcspn(keyWords, "\n")] = 0;
    for(int i=0;i<numBooks;i++){
        if (strstr(book[i].title, keyWords) != NULL) {
            results[numResults++] = book[i];
        }
    }
    if(numResults>0){
        printf("\tSearch results:\n");
        printf("#**********#******************************#********************#********#**********#********************#\n");
        printf("$%-10s$%-30s$%-20s$%-8s$%-10s$%-20s$\n","ID","TITLE","AUTHOR","QUANLITY","PRICE(VND)","DATE PUBLICATION");
        printf("#**********#******************************#********************#********#**********#********************#\n");
        for(int i=0;i<numResults;i++){
            printf("$%-10s$%-30s$%-20s$%-8d$%-10d$%-20s$\n" ,
                   results[i].bookId,
                   results[i].title,
                   results[i].author,
                   results[i].quantity,
                   results[i].price,
                   formatConversionDate(results[i].publication));
            printf("#**********#******************************#********************#********#**********#********************#\n");
        }
    }
    else{
        printf("\tNo books found!!!\n");
    }
}

// S?p x?p sách theo giá ti?n
void sortBooksByPrice(){
    int choice;
    printf("\t1.Sort Increase\n");
    printf("\t2.Sort Decrease\n");
    while(1){
        printf("\tEnter The Choice : ");
        scanf("%d",&choice);
        if(choice==1){
            //insertion sort
            for(int i=1;i<numBooks;i++){
                int key=book[i].price;
                int j=i-1;
                while(j>=0&&key<book[j].price) {
                    book[j+1].price=book[j].price;
                    j--;
                }
                book[j+1].price=key;
            }
            showTableListBook();
            break;
        }
        else if(choice==2){
            //selection sort
            for(int i=0;i<numBooks;i++){
                int max=book[i].price;
                for(int j=i+1;j<numBooks;j++){
                    if(book[j].price>max){
                        max=book[j].price;
                        book[j].price=book[i].price;
                        book[i].price=max;
                    }
                }
            }
            showTableListBook();
            break;
        }
        else{
            printf("\tYour selection is not!!!!\n");
        }
    }
}

// L?a ch?n tính nang trong Menu qu?n lý sách
void choiceMenuBook() {
    while (1) {
        readCustomerFromBinaryFile(0);
        readBookFromBinaryFile(0);
        showMenuBook();
        int choice,newCount;
        printf("\tEnter The Choice : ");
        scanf("%d", &choice);
        switch (choice) {
            // Hi?n th? t?t c? thông tin c?a sách
            case 1: {
                if(numBooks==0){
                    printf("\tNo books added yet!!!\n");
                    break;
                }
                readBookFromBinaryFile(1);
                break;
            }
                // Thêm sách vào thu vi?n
            case 2: {
                if(numBooks==100) {
                    printf("\tThe total number of books is full, cannot be added!!!\n");
                    break;
                }
                inputInfoBook(book,&newCount,1,0);
                printf("\tAdd success!!!!\n");
                break;
            }
                // Ch?nh s?a thông tin c?a sách
            case 3: {
                if(numBooks==0){
                    printf("\tThere are no books to edit!!!\n");
                    break;
                }
                editInforBook();
                break;
            }
                // Xóa 1 quy?n sách
            case 4:{
                if(numBooks==0){
                    printf("\tThere are no books to delete!!!\n");
                    break;
                }
                deleteBook();
                break;
            }
                // Tìm sách b?ng tên sách
            case 5:{
                if(numBooks==0){
                    printf("\tThere are no books to search!!!\n");
                    break;
                }
                searchTitleBook();
                break;
            }
            case 6:{
                if(numBooks==0){
                    printf("\tThere are no books to sort!!!\n");
                    break;
                }
                sortBooksByPrice();
                break;
            }
            case 0: {
                break;
            }
            default:
                printf("\tYour selection is not on the menu!!!!\n");
                break;
        }
        if (choice == 0) {
            printf("\tReturn menu!!!\n");
            break;
        }
    }
}

//DANH SÁCH KHÁCH HÀNG
// Hi?n th? menu khách hàng
void showMenuCustomer(){
    printf("\t\tMENU CUSTOMER\n");
    printf("\t|============================|\n");
    printf("%-30s|\n","\t| [1] Show All Customers");
    printf("%-30s|\n","\t| [2] Add New Customers");
    printf("%-30s|\n","\t| [3] Edit Customers");
    printf("%-30s|\n","\t| [4] Account lock (unlock)");
    printf("%-30s|\n","\t| [5] Find client by name");
    printf("%-30s|\n","\t| [6] Lend Books");
    printf("%-30s|\n","\t| [7] Return Books");
    printf("%-30s|\n","\t| [0] Exit the Program");
    printf("\t|============================|\n");
}

// Luu khách hàng vào file nh? phân
void saveCustomerToBinaryFile(Member *member1){
    // T?o và m? file vi?t
    FILE *f=fopen(FILE_NAME1, "ab");
    if(f==NULL){
        printf("\tCannot open file %s write!!!\n",FILE_NAME1);
        return;
    }
    // Ghi s? lu?ng l?p vào file
    fwrite(member1,sizeof(Member),1,f);
    printf("\tSave file success!!!!\n");
    // Ðóng file
    fclose(f);
}

// Ð?c thông tin c?a Khách hàng t? file
void readCustomerFromBinaryFile(int mode){
    FILE *f=fopen(FILE_NAME1,"rb");
    if(f==NULL){
        printf("\tFile %s no exist or no datas!!!\n",FILE_NAME1);
        return;
    }
    numMember=0;
    Member member1;
    if(mode==1){
        printf("$==========$=========================$===INFORMATION BOOK=======$===============$\n");
        printf("|%-10s|%-25s|%-15s|%-10s|%-15s|\n","ID","NAME","PHONE","STATUS","BORROWEDBOOKS");
        printf("$==========$=========================$===============$==========$===============$\n");
    }
    while(fread(&member1,sizeof(Member),1,f)){
        member[numMember++] = member1; // Luu l?p vào m?ng và tang s? lu?ng l?p
        if(mode==1){
            printf("|%-10s|%-25s|%-15s|%-10s|%-15d|\n" ,
                   member1.memberId,
                   member1.name,
                   member1.phone,
                   convert(member1.status),
                   member1.bookCount);
            printf("$----------$-------------------------$---------------$----------$---------------$\n");
        }
    }
    // Ðóng file
    fclose(f);
}

//Thêm khách và nh?p vào thông tin khách
void inputInfoCustomer(Member *member1,const int *i,int index,int mode) {
    if(mode==0){
        printf("\tPlease enter the number of Customers want to add : ");
        scanf("%d",i);
        getchar();
    }
    // Nh?p t?ng thông tin c?a khách
    for(int j=0;j<*i;j++){
        if(mode==1){
            j=index;
        }
        if(mode==0){
            // Nh?p ID cho khách
            while(1){
                fflush(stdin);
                char input[50];
                printf("\tPlease enter the Costumer ID (Vd: KH001) : ");
                fgets(input,sizeof(input),stdin);
                // Xóa kí t? xu?ng dòng
                input[strcspn(input,"\n")]='\0';
                // Ki?m tra d? dài và kí t? r?ng
                if (strlen(input) == 0 || (int)strlen(input) > 10) {
                    printf("\tError: Customers ID must be between 1 and 10 characters!!!\n");
                    continue;
                }
                if(checkIdExistCustomer(member1,numMember,input)){
                    printf("\tError: Customers ID already exists, Please enter a different one!!!\n");
                    continue;
                }
                // H?p l? luu vào danh sách
                strcpy(member1[j].memberId, input);
                printf("\tCustomers ID %s has been added successfully!\n", member1[j].memberId);
                break;
            }
        }
        // Nh?p tên
        fflush(stdin);
        printf("\tPlease enter the Customer's name : ");
        fgets(member1[j].name,sizeof(member1[j].name),stdin);
        member1[j].name[strcspn(member1[j].name,"\n")]='\0';
        // Nh?p s? di?n tho?i khách hàng
        fflush(stdin);
        printf("\tPlease enter the phone Number : ");
        fgets(member1[j].phone,sizeof(member1[j].phone),stdin);
        member1[j].phone[strcspn(member1[j].phone,"\n")]='\0';
        // M?i nh?p tr?ng thái khách hàng
        if(mode==0){
            while(1){
                fflush(stdin);
                char input[10];
                printf("\tPlease enter the status Customer (true : Unlock/false : Lock) : ");
                fgets(input, sizeof(input), stdin);
                input[strcspn(input,"\n")]='\0';
                if (strcmp(input, "true") == 0) {
                    member1[j].status = true;
                    break;
                } else if (strcmp(input, "false") == 0) {
                    member1[j].status = false;
                    break;
                } else {
                    printf("\tError, can enter 'true' or 'false'!!!\n");
                }
            }
        }
        // Nh?p s? lu?ng sách mu?n (t?i da 5 quy?n)
        if(member1[j].status==false){
            printf("\tThe customer is status of not borrowing books!!!\n");
        }
        else{
            member[j].bookCount=0;
        }
        // luu thông tin vào file nh? phân
        if(mode==0){
            saveCustomerToBinaryFile(&member1[j]);
        }
    }
}

// Ch?nh s?a thông tin khách hàng
void editInforCustomer(){
    readCustomerFromBinaryFile(1);
    int n=1;
    fflush(stdin);
    char ma[10];
    printf("\tPlease enter Customer Id want to edit : ");
    fgets(ma, sizeof(ma), stdin);
    ma[strcspn(ma, "\n")] = '\0';
    // L?y ch? s? c?a ID trong mang danh khách hàng
    int index = findIdByCustomer(ma);
    if (index == -1) {
        printf("\tNo find Customer ID!!!!\n");
        return;
    }
    // Hi?n th? thông tin cu tru?c khi s?a
    printf("\tShow old Information Customer: \n");
    printf("\tID : %s\n", member[index].memberId);
    printf("\tName : %s\n", member[index].name);
    printf("\tPhoneNumber : %s\n", member[index].phone);
    printf("\tStatus : %s\n", convert(member[index].status));
    printf("\tBorrowedBooks : %d\n",member[index].bookCount);
    // C?p nh?t l?i thông tin
    inputInfoCustomer(member,&n , index, 1);
    // Ghi l?i thông tin vào file
    FILE *f=fopen(FILE_NAME1, "wb");
    if(f==NULL){
        printf("\nFile %s no exist or no datas!!!\n",FILE_NAME1);
        return;
    }
    // Ðóng file
    fwrite(member, sizeof(Member), numMember, f);
    fclose(f);
    printf("\tUpdated information Customer successfully!!!\n");
}

// Khóa (M?) thông tin khách hàng
void toggleMemberStatus() {
    char Id[10];
    printf("\tInput Customer Id need Lock/Unlock : ");
    scanf("%s", Id);
    // L?y ch? s? c?a ID trong mang danh khách hàng
    int index = findIdByCustomer(Id);
    if (index == -1) {
        printf("\tNo find Customer ID!!!!\n");
        return;
    }
    // N?u khách hàng t?n t?i, ki?m tra tr?ng thái hi?n t?i
    if (member[index].status) {
        printf("Client %s is open. Do you want to block this customer? (yes/no): ", member[index].name);
    } else {
        printf("Client %s is close. Do you want to unblock this customer? (yes/no): ", member[index].name);
    }
    // Nh?p l?a ch?n
    char choice[5];
    fflush(stdin);
    fgets(choice, sizeof(choice), stdin);
    choice[strcspn(choice, "\n")] = '\0';
    if (strcpy(choice,"yes")==0 || strcpy(choice,"Yes")==0) {
        //Ð?o tr?ng thái (khóa-m?)
        member[index].status = !member[index].status;
        printf("\tClient %s has been %s successfully!!!\n",member[index].name,member[index].status ? "unlocked" : "locked");
    }
    else {
        printf("\tCanceled\n");
    }
}

//Tìm ki?m khách theo tên
void searchNameCustomer(){
    int numResults=0;
    char name[30];
    fflush(stdin);
    Member results[numMember]; // C?u trúc luu thông tin khách
    printf("\tPlease enter keywords name to find Client : ");
    fgets(name, sizeof(name), stdin);
    name[strcspn(name, "\n")] = 0;
    for(int i=0;i<numMember;i++){
        if (strstr(member[i].name, name) != NULL) {
            results[numResults++] = member[i];
        }
    }
    if(numResults>0){
        printf("\tSearch results:\n");
        printf("#***********#**************************#****************#***********#****************#\n");
        printf("$%-10s$%-25s$%-15s$%-10s$%-15s$\n","ID","NAME","PHONE","STATUS","BORROWED BOOKS");
        printf("#***********#**************************#****************#***********#****************#\n");
        for(int i=0;i<numResults;i++){
            printf("$ %-10s$ %-25s$ %-15s$ %-10s$ %-15d$\n" ,
                   results[i].memberId,
                   results[i].name,
                   results[i].phone,
                   convert(results[i].status),
                   results[i].bookCount);
            printf("#***********#**************************#****************#***********#****************#\n");
        }
    }
    else{
        printf("\tNo customers found!!!\n");
    }
}

// Cho mu?n sách (sách mu?n t?i da là 5 quy?n)
void addBookByCustomer(){
    // Nh?p id khách hàng
    char customerId[10];
    fflush(stdin);
    printf("\tPlease enter Id to find Client : ");
    fgets(customerId, sizeof(customerId), stdin);
    customerId[strcspn(customerId,"\n")]='\0';
    int n, index= findIdByCustomer(customerId);
    // Id khách hàng không t?n t?i
    if(index == -1) {
        printf("\tNo find Customer ID!!!!\n");
        return;
    }
    // Khách hàng dang b? khóa
    if(!member[index].status){
        printf("\tCustomer is locked!!!\n");
        return;
    }
    // Ki?m tra n?u khách dã mu?n d? 5 sách
    if (member[index].bookCount >= 5) {
        printf("\tCustomer has already borrowed the maximum number of books (5)!\n");
        return;
    }
    // Hi?n th? sách dã có trong thu vi?n
    printf("\tBooks are available in the library :\n");
    for(int i=0;i<numBooks;i++){
        printf("\t| %-10s| %-30s|\n",book[i].bookId,book[i].title);
    }
    // Nh?p s? lu?ng sách mu?n mu?n
    do{
        printf("\tEnter number of books to borrow (max 5): ");
        scanf("%d",&n);
    }while(n<=0||n>(5- member[index].bookCount));
    fflush(stdin);
    // Nh?p tên sách cho khách
    for(int i=member[index].bookCount;i<(n+member[index].bookCount);i++){
        printf("\tEnter book title for book %d: ", i + 1);
        fgets(member[index].BorrowedBooks[i].title, sizeof(member[index].BorrowedBooks[i].title), stdin);
        member[index].BorrowedBooks[i].title[strcspn(member[index].BorrowedBooks[i].title, "\n")] = '\0';
        // Luu vào file khách hàng
        saveCustomerToBinaryFile((Member *) &member[index].BorrowedBooks[member[i].bookCount]);
    }
    printf("\tSuccessfully borrowed %d books!\n", n);
}

// Tr? l?i sách dã mu?n
void returnBookByLibrary(){
    // Nh?p id khách hàng
    char customerId[10];
    fflush(stdin);
    printf("\tPlease enter Id to find Client : ");
    fgets(customerId, sizeof(customerId), stdin);
    customerId[strcspn(customerId,"\n")]='\0';
    int n, index= findIdByCustomer(customerId);
    // Id khách hàng không t?n t?i
    if(index == -1) {
        printf("\tNo find Customer ID!!!!\n");
        return;
    }
    // Khách hàng ko có sách
    if(!member[index].bookCount){
        printf("\tCustomer has no book to return!!!\n");
        return;
    }
    // Hi?n th? nh?ng sách khách dã mu?n
    for(int i=0;i<member[index].bookCount;i++){
        printf("\tDisplays borrowed books\n");

    }

}
// L?a ch?n tính nang trong Menu qu?n lý khách hàng
void choiceMenuCustomer() {
    while (1) {
        readBookFromBinaryFile(0);
        readCustomerFromBinaryFile(0);
        showMenuCustomer();
        int choice,newCount;
        printf("\tEnter The Choice : ");
        scanf("%d", &choice);
        switch (choice) {
            // Hi?n th? t?t c? thông tin c?a khách
            case 1: {
                if(numMember==0){
                    printf("\tNo Customer added yet!!!\n");
                    break;
                }
                readCustomerFromBinaryFile(1);
                break;
            }
                // Thêm thông tin khách hàng vào file
            case 2: {
                if(numMember==100) {
                    printf("\tThe total number of Customer is full, cannot be added!!!\n");
                    break;
                }
                inputInfoCustomer(member,&newCount,1,0);
                printf("\tAdd successfully!!!!\n");
                break;
            }
                // Ch?nh s?a thông tin c?a khách
            case 3: {
                if(numMember==0){
                    printf("\tThere are no Customers to edit!!!\n");
                    break;
                }
                editInforCustomer();
                break;
            }
                // Khóa tài kho?n khách
            case 4:{
                if(numMember==0){
                    printf("\tThere are no Customers to lock/unlock!!!\n");
                    break;
                }
                toggleMemberStatus();
                break;
            }
                // Tìm khách hàng b?ng tên
            case 5:{
                if(numMember==0){
                    printf("\tThere are no Customer to search!!!\n");
                    break;
                }
                searchNameCustomer();
                break;
            }
                // Cho mu?n sách
            case 6:{
                if(numMember==0){
                    printf("\tThere are no customer to sort!!!\n");
                    break;
                }
                if(numBooks==0){
                    printf("\tThere are no book to sort!!!\n");
                    break;
                }
                addBookByCustomer();
                break;
            }
                // Tr? l?i sách dã mu?n
            case 7:{

                break;
            }
            case 0: {
                break;
            }
            default:
                printf("\tYour selection is not on the menu!!!!\n");
                break;
        }
        if (choice == 0) {
            printf("\tReturn menu!!!\n");
            break;
        }
    }
}
