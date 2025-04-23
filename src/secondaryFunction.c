//
// Created by HOANG DINH TUNG on 2/12/2025.
//
// Trien khai ham SecondaryFunction.
#include "D:\project\include\mainFunction.h"
// HÀM PH? B? SUNG CHO HÀM CHÍNH
// Ki?m tra sách h?c theo mã
int findIdByBook(const char *findIdBook){
    for(int i=0;i<numBooks;i++){
        if(strcmp(book[i].bookId,findIdBook)==0){
            return i;
        }
    }
    return -1;
}

// Hàm ki?m tra xem mã sách có trùng hay không
bool checkIdExistBook(Book *bookList, int totalBooks, char *bookId){
    for(int i=0;i<totalBooks;i++){
        if(strcmp(bookList[i].bookId,bookId) == 0){
            return true;
            // Mã s? sách t?n t?i
        }
    }
    return false;
    // Mã s? sách không t?n t?i
}

// Hàm ki?m tra xem tên sách có trùng hay không
int checkTitleExistBook(const char *Title,int number,Book *book1){
    for(int i=0;i<number;i++){
        if(strcmp(Title,book1[i].title)==0){
            return 1;
            // Tên sách t?n t?i
        }
    }
    return 0;
    // Tên sách không t?n t?i
}

// Ki?m tra khách hàng theo mã
int findIdByCustomer(const char *findIdCustomer){
    for(int i=0;i<numMember;i++){
        if(strcmp(member[i].memberId,findIdCustomer)==0){
            return i;
        }
    }
    return -1;
}

// Hàm ki?m tra xem mã khách có t?n t?i hay chua
int checkIdExistCustomer(Member *memberList, int totalMember, char *memberId){
    for(int i=0;i<totalMember;i++){
        if(strcmp(memberId,memberList[i].memberId)==0){
            return 1;
            // Mã s? khách hàng t?n t?i
        }
    }
    return 0;
    // Mã s? khách hàng không t?n t?i
}

// Hi?n th? b?ng thông tin sách
void showTableListBook() {
    printf("$==========$===================INFORMATION BOOK================$========$==========$====================$\n");
    printf("|%-10s|%-30s|%-20s|%-8s|%-10s|%-20s|\n", "ID", "TITLE", "AUTHOR", "QUANLITY", "PRICE", "DATE PUBLICATION");
    printf("$==========$==============================$====================$========$==========$====================$\n");
    for (int i = 0; i < numBooks; i++) {
        printf("|%-10s|%-30s|%-20s|%-8d|%-10d|%-20s|\n",
               book[i].bookId,
               book[i].title,
               book[i].author,
               book[i].quantity,
               book[i].price,
               formatConversionDate(book[i].publication));
        printf("$----------$------------------------------$--------------------$--------$----------$--------------------$\n");
    }
}

// HÀM B? TR? CH?C CH? CHO CHUONG TRÌNH
// Sao chép file
void copyBinaryFile(const char *sourceFile, const char *destinationFile) {
    FILE *source, *dest;
    char buffer[1024];  // B? nh? t?m d? d?c ghi d? li?u
    size_t bytesRead;

    // M? file ngu?n d? d?c nh? phân
    source = fopen(sourceFile, "rb");
    if (source == NULL) {
        printf("Unable to open the source file!\n");
        return;
    }

    // M? file dích d? ghi nh? phân
    dest = fopen(destinationFile, "wb");
    if (dest == NULL) {
        printf("Unable to create the destination file!\n");
        fclose(source);
        return;
    }

    // Ð?c t? file ngu?n và ghi vào file dích
    while ((bytesRead = fread(buffer, 1, sizeof(buffer), source)) > 0) {
        fwrite(buffer, 1, bytesRead, dest);
    }

    // Ðóng c? hai file
    fclose(source);
    fclose(dest);

    printf("File copied successfully from '%s' to '%s'!\n", sourceFile, destinationFile);
}

// Hàm ki?m tra ngày tháng nam có h?p l? hay không
int checkDateValid(int day,int month,int year){
    if(year>0){
        // Tru?ng h?p nam nhu?n
        if(year%4==0&&year%100!=0||year%400==0){
            if(month==2){
                if(day<1||day>29){
                    return 0;
                }
            }
            else if(month==4||month==6||month==9||month==11){
                if(day<1||day>30){
                    return 0;
                }
            }
            else if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
                if(day<1||day>31){
                    return 0;
                }
            }
            else{
                return 0;
            }
        }
            // Tru?ng h?p nam không nhu?n
        else{
            if(month==2){
                if(day<1||day>28){
                    return 0;
                }
            }
            else if(month==4||month==6||month==9||month==11){
                if(day<1||day>30){
                    return 0;
                }
            }
            else if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
                if(day<1||day>31){
                    return 0;
                }
            }
            else{
                return 0;
            }
        }
    }
    else{
        return 0;
    }
    return 1;
}

// Chuy?n d?i true/false thành ch?
char *convert(bool status){
    if(status==false){
        return "Lock";// Khóa
    }
    else if(status==true){
        return "Unlock";// M? khóa
    }
    return "Undetermined";// Không xác d?nh
}

// Hàm chuy?n d?i d?nh d?ng thành dd/mm/yyyy
char *formatConversionDate(Date d){
    // C?p phát vùng nh?
    char *formattedDate = (char *)malloc(11 * sizeof(char));
    sprintf(formattedDate, "%02d/%02d/%04d",d.day, d.month, d.year);
    return formattedDate;
}

//// Hàm thêm m?t ph?n t? vào danh sách liên k?t
//Node* insert(Node* head, int id) {
//    Node* newNode = (Node*)malloc(sizeof(Node));
//    newNode->id = id;
//    newNode->next = head;
//    return newNode;
//}
//
//// Gi?i phóng b? nh? c?a danh sách liên k?t
//void free_list(Node* head) {
//    Node* temp;
//    while (head != NULL) {
//        temp = head;
//        head = head->next;
//        free(temp);
//    }
//}



#pragma clang diagnostic pop
