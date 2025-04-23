let userLogin = null;
function checkAuthen() {
    userLogin = JSON.parse(localStorage.getItem("userLogin"))
}


function renderHeader() {
    let userBoxEL = document.querySelector(".user_box")

    if (userLogin) {
        /* đã login */
        userBoxEL.innerHTML = `
                <div class="user_content">
                    <span>${userLogin.name}</span>
                    <button onclick="logout()">logout</button>
                </div>
                ${
                    userLogin.role == "ADMIN" ? `<button onclick="goToAdminPage()">go to admin page</button>` : ""
                }
        `
    } else {
        /* chưa login */
        userBoxEL.innerHTML = `
            <a href="authen">đăng ký</a>
                /
            <a href="authen">đăng nhập</a>
        `
    }
}

function logout() {
    if (!confirm("bạn thật sự muốn đăng xuất?")) false
    window.location.reload()
    window.localStorage.removeItem("userLogin")
}

function goToAdminPage() {
    window.location.href='/admin'
}

checkAuthen()
renderHeader()


function renderNav() {
    let navEL = document.querySelector("nav")
    navEL.innerHTML = categories.map((category) => {
        return `
            <a href="/categories/index.html?category=${category.title.toLocaleLowerCase()}">${category.title}</a>
        `
    })
}

renderNav()