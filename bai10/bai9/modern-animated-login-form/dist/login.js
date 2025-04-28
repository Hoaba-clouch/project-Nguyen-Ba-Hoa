let users = JSON.parse(localStorage.getItem('users')) || [];

function toggleForm(id) {
    document.querySelectorAll('.loginBx').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showMessage(message, duration = 3000) {
    const notify = document.getElementById('notify');
    notify.textContent = message;
    notify.classList.add('show');
    clearTimeout(notify.hideTimeout);
    notify.hideTimeout = setTimeout(() => {
        notify.classList.remove('show');
    }, duration);
}

function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (!fullName || !username || !email || !password || !confirm) {
        showMessage("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage("Email không đúng định dạng.");
        return;
    }

    if (password.length < 8) {
        showMessage("Mật khẩu phải có ít nhất 8 ký tự.");
        return;
    }

    if (password !== confirm) {
        showMessage("Mật khẩu xác nhận không khớp.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra username hoặc email đã tồn tại chưa
    if (users.some(u => u.username === username || u.email === email)) {
        showMessage("Username hoặc Email đã tồn tại.");
        return;
    }

    const newUser = {
        id: Date.now(),
        fullName,
        username,
        email,
        password,
        created_at: new Date().toISOString(),
        boards: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showMessage("Đăng ký thành công! Bạn có thể đăng nhập.");
    document.getElementById('registerBox').reset();
    toggleForm('loginForm');
}


function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage("Vui lòng nhập tên đăng nhập và mật khẩu.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (!user) {
        showMessage("Sai tên đăng nhập hoặc mật khẩu.");
        return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    showMessage("Đăng nhập thành công! 🎉");
    document.getElementById('loginForm').reset();
    // Sau một chút delay thì chuyển trang
    setTimeout(() => {
        window.location.href = "./style.css";
    }, 1000);
}