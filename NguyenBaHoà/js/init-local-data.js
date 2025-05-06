fetch('seed-data.json')
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('loggedInUser', JSON.stringify(data.loggedInUser));
    localStorage.setItem('users', JSON.stringify(data.users));
    alert("Khởi tạo dữ liệu thành công!");
  })
  .catch(err => console.error("Lỗi khi nạp dữ liệu:", err));
