function openEditTaskModal(boardId, listId, taskId) {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = (user.boards || []).find(b => b.id === boardId);
    if (!board) return;
  
    const list = (board.lists || []).find(l => l.id === listId);
    if (!list) return;
  
    const task = (list.tasks || []).find(t => t.id === taskId);
    if (!task) return;
  
    // Hiển thị modal
    const modal = document.getElementById('editTaskModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  
    // Gán dữ liệu task vào modal
    modal.querySelector('.task-title').textContent = task.title || '';
    modal.querySelector('.editor-textarea').value = task.description || '';
    modal.querySelector('.status-select').value = task.status || 'TODO';
    modal.querySelector('.task-checkbox').checked = task.status === 'done';
  
    // Lưu lại task info vào biến toàn cục nếu cần dùng khi save
    window.currentEditingTask = { boardId, listId, taskId };
  }
  function closeEditTaskModal() {
    const modal = document.getElementById('editTaskModal');
    if (modal) {
      modal.style.display = 'none';
    }
  
    // Xoá nội dung cũ trong modal nếu cần
    modal.querySelector('.editor-textarea').value = '';
    modal.querySelector('.task-title').textContent = '';
    modal.querySelector('.status-select').value = 'TODO';
    modal.querySelector('.task-checkbox').checked = false;
  
    // Xoá biến tạm (nếu có)
    window.currentEditingTask = null;
  }
  
// ✅ 1. Validate nội dung mô tả không rỗng
function saveTaskChanges() {
    const modal = document.getElementById('editTaskModal');
const description = modal.querySelector('.editor-textarea').value.trim();

if (description === '') {
  showMessage("Nội dung chi tiết không được để trống!");
  return;
}
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const board = user.boards?.find(b => b.id === currentBoardId);
    if (!board) return;
  
    const listId = parseInt(document.querySelector('.status-select').dataset.listId);
    const list = board.lists?.find(l => l.id === listId);
    if (!list) return;
  
    const taskId = parseInt(document.querySelector(".edit-task-box").dataset.taskId);
    const task = list.tasks?.find(t => t.id === taskId);
    if (!task) return;
  
    const newDescription = document.querySelector(".editor-textarea").value.trim();
    if (!newDescription) {
      showMessage("Nội dung không được để trống!", 3000);
      return;
    }
  
    task.description = newDescription;
  
    // Cập nhật localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem("users", JSON.stringify(users));
    }
  
    closeEditTaskModal();
    renderBoardLists();
  }
  
  // ✅ 2. Xử lý phần Date Picker (giả lập lịch đơn giản)
  function toggleDatePicker() {
    alert("Hiện lịch chọn ngày (phần này sẽ dùng input[type='date'] hoặc custom calendar nếu cần)");
  }
  
  // ✅ 3. Chọn Tag / Label
  function toggleLabelPicker() {
    alert("Hiện modal chọn nhãn với màu sắc và nội dung");
  }
  
  // ✅ 4. Chuyển Task sang list khác
  // Sử dụng dropdown đã có trong .status-select
  // Phần onchange xử lý ngay khi chọn:
  document.addEventListener("change", function(e) {
    if (e.target.matches(".status-select")) {
      const newListTitle = e.target.value;
  
      const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const board = user.boards?.find(b => b.id === currentBoardId);
      if (!board) return;
  
      const taskId = parseInt(document.querySelector(".edit-task-box").dataset.taskId);
      let currentList = null;
      let task = null;
  
      for (const list of board.lists || []) {
        const found = list.tasks.find(t => t.id === taskId);
        if (found) {
          currentList = list;
          task = found;
          break;
        }
      }
  
      if (!task || !currentList) return;
  
      const newList = board.lists.find(l => l.title === newListTitle);
      if (!newList || newList.id === currentList.id) return;
  
      currentList.tasks = currentList.tasks.filter(t => t.id !== task.id);
      newList.tasks.push(task);
  
      // Update localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem("users", JSON.stringify(users));
      }
  
      renderBoardLists();
      closeEditTaskModal();
    }
  });
  
  // ✅ 5. Xác nhận xoá task
  function deleteCurrentTask() {
    if (!window.currentEditingTask) return;
  
    showConfirm(
      'Bạn có chắc chắn?',
      'Bạn sẽ không thể hoàn tác thao tác này!',
      () => {
        const { boardId, listId, taskId } = window.currentEditingTask;
        const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
        const board = (user.boards || []).find(b => b.id === boardId);
        if (!board) return;
  
        const list = (board.lists || []).find(l => l.id === listId);
        if (!list) return;
  
        const taskIndex = (list.tasks || []).findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
  
        list.tasks.splice(taskIndex, 1);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
  
        closeEditTaskModal();
        renderBoardLists();
      }
    );
  }
  