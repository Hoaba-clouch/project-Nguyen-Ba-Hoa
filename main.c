#include <stdio.h>
#include <stdlib.h>
#include"include\mainFunction.h"

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main(int argc, char *argv[]) {

	
	// Ð?nh nghia bi?n toàn c?c
	int numBooks = 0;
	int numMember = 0;
	
	Book book[100];  
	Member member[100];
	
//    char mainFile[] = "C:\\Users\\HOANG DINH TUNG\\CLionProjects\\untitled4\\datas\\listBooks.dat";  // File ngu?n
//    char secondaryFile[] = "C:\\Users\\HOANG DINH TUNG\\CLionProjects\\untitled4\\datas\\listBooks.dat"; // File sao chép
//    copyBinaryFile(mainFile, secondaryFile);
    int choice;
    while (1) {
        showMenuMain();
        printf("\tEnter The Choice : ");
        scanf("%d", &choice);
        switch (choice) {
            case 1: {
                choiceMenuBook();
                break;
            }
            case 2: {
                choiceMenuCustomer();
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
            break;
        }
    }
	return 0;
}
