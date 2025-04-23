// HÀM PH? B? SUNG CHO HÀM CHÍNH
// Tìm sách sách theo mã

int findIdByBook(const char *findIdClass);

// Hàm ki?m tra xem mã sách có trùng hay không
bool checkIdExistBook(Book *bookList, int totalBooks, char *bookId);

// Hàm ki?m tra xem tên sách có trùng hay không
int checkTitleExistBook(const char *Title,int number,Book *book1);

// Tìm khách hàng theo mã
int findIdByCustomer(const char *findIdCustomer);

// Hàm ki?m tra xem mã khách có t?n t?i hay chua
int checkIdExistCustomer(Member *memberList, int totalMember, char *memberId);

// Hi?n th? b?ng thông tin sách
void showTableListBook();

// HÀM B? TR? CH?C CH? CHO CHUONG TRÌNH
// Sao chép file (ít dùng)
void copyBinaryFile(const char *mainFile, const char *secondaryFile);

// Hàm ki?m tra ngày tháng nam có h?p l? hay không
int checkDateValid(int day,int month,int year);

// Chuy?n d?i true/false thành ch?
char *convert(bool status);

// Hàm phân chuy?n ngày tháng nam sang d?nh d?ng dd/mm/yyyy
char *formatConversionDate(Date d);
