function loadSeedData() {
  fetch('./js/seed-data.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('loggedInUser', JSON.stringify(data.loggedInUser));
        localStorage.setItem('users', JSON.stringify(data.users));
        showMessage("Khởi tạo dữ liệu thành công! vui lòng load lại trang");
      })
      .catch(err => console.error("Lỗi khi nạp dữ liệu:", err));
  }
  