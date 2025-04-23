/* 
- Khởi tạo danh sách người dùng rỗng
*/
let userList = [
    {
        email: "admin@gmail.com",
        name: "Nguyễn Phước",
        password: "123",
        role: "ADMIN" 
    }
]

/*
ADMIN: quản trị cao nhất hệ thống
MEMEMBER: thuộc quản trị nhưng yếu hơn ADMIN
USER: người dùng thuông thường
*/


/* 
- Nếu trên local storage có danh sách userList thì ta lấy về và gán đè lại cho userList
- Nếu trên local storage không có thì ta khởi tạo lên
*/
if(localStorage.getItem("userList")) {
    userList = JSON.parse(localStorage.getItem("userList"))
}else {
    localStorage.setItem("userList", JSON.stringify(userList))
}


/* Khởi tạo danh mục */
let categories = [
    {
        id: Date.now(),
        title: "Laptop",
        icon: `<i class="fa-solid fa-laptop"></i>`
    }
]

if(localStorage.getItem("categories")) {
    categories = JSON.parse(localStorage.getItem("categories"))
}else {
    localStorage.setItem("categories", JSON.stringify(categories))
}

/* Khởi tạo sản phẩm */
let products = [
    {
        id: Date.now(),
        name: "Sản phẩm 1",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL2eWYFAuDi53m5kSgO9Jwh5wy0LILUwOUyg&s",
        price: 5000000,
        categoryName: "Laptop"
    }
]

if(localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"))
}else {
    localStorage.setItem("products", JSON.stringify(products))
}


/* Util */
function getFormData(formEL) {
    /*
    - Nhận vào 1 form element sau đó trả về các trường dữ liệu của các ô input có name
    */

    /* Tạo ra 1 object có tên biến là data và chưa có trường nào */
    let data = {}

    for(element of formEL.elements) {
        if(element.name != "") {
            data[element.name] = element.value
        }
    }

    return data;
}


/* Lib validate */
function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


/* local */
function saveUserListToLocal(userList) {
    localStorage.setItem("userList", JSON.stringify(userList))
}


/* authen account */
function getUserLoginData() {
    let userData = JSON.parse(localStorage.getItem("userLogin"))
    return userData
}