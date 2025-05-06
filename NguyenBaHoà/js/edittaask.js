function openEditTaskModal(boardId, listId, taskId) {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = (user.boards || []).find(b => b.id === boardId);
    if (!board) return;
  
    const list = (board.lists || []).find(l => l.id === listId);
    if (!list) return;
  
    const task = (list.tasks || []).find(t => t.id === taskId);
    if (!task) return;
    window.currentEditingTask = { boardId, listId, taskId }; // ⬅️ PHẢI CÓ

    task.listId = listId; // để sau này lưu lại task
    currentEditTask = { ...task, boardId, listId, taskId: task.id };
    // ⬅️ CỰC KỲ QUAN TRỌNG! Phải có dòng này
  
    // mở modal & render UI
    const modal = document.getElementById('editTaskModal');
    modal.style.display = 'flex';
    modal.querySelector('.task-title').textContent = task.title || '';
    modal.querySelector('.editor-textarea').value = task.description || '';
    modal.querySelector('.status-select').value = task.status || 'TODO';
    modal.querySelector('.task-checkbox').checked = task.status === 'done';
  }
  
  function closeEditTaskModal() {
    const modal = document.getElementById('editTaskModal');
    if (modal) {
      modal.style.display = 'none';
    }
  
    // Xoá nội dung cũ trong modal nếu cần
    modal.querySelector('.editor-textarea').value = '';
    modal.querySelector('.task-title').textContent = '';
  
    modal.querySelector('.task-checkbox').checked = false;
  
    // Xoá biến tạm (nếu có)
    window.currentEditingTask = null;
  }
  
// ✅ 1. Validate nội dung mô tả không rỗng
function saveTaskChanges() {
    const modal = document.getElementById('editTaskModal');
    if (!modal) return;
   
    const description = modal.querySelector('.editor-textarea')?.value.trim();
    if (!description) {
      showMessage("Nội dung chi tiết không được để trống!");
      return;
    }
    if (modal) {
        modal.style.display = 'none';
      }
    
    
    showMessage("Lưu thay đổi thành công!");
  }
  
  // ✅ 2. Xử lý phần Date Picker (giả lập lịch đơn giản)
  function toggleDatePicker() {
    showMessage("Hiện lịch chọn ngày (phần này sẽ dùng input[type='date'] hoặc custom calendar nếu cần)");
  }
  
  // ✅ 3. Chọn Tag / Label
  function toggleLabelPicker() {
    showMessage("Hiện modal chọn nhãn với màu sắc và nội dung");
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
  function deleteCurrentTaskk() {
    if (!window.currentEditingTask) return;
    console.log("Task đang xoá:", window.currentEditingTask);
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
// modallabel


let currentLabel = null;
let currentTask = null; // gán từ modal task khi mở
let currentEditTask = null;

function openLabelManagerModal() {
    if (!currentEditTask) {
      showMessage("Không tìm thấy task hiện tại!");
      return;
    }
  
    currentTask = currentEditTask;
  
    // ✅ Nếu chưa có labels hoặc tag thì khởi tạo
    if (!currentTask.labels) currentTask.labels = [];
    if (!currentTask.tag) currentTask.tag = [];
  
    // ✅ Nếu chưa có nhãn nào → tạo sẵn một vài nhãn màu mặc định
    if (currentTask.labels.length === 0) {
      const defaultColors = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'];
      currentTask.labels = defaultColors.map((color, index) => ({
        id: Date.now() + index, // unique id
        content: '',            // chưa đặt tên
        color
      }));
    }
  
    renderLabelList();
    document.getElementById('labelManagerModal').style.display = 'flex';
  }
  

function closeLabelManagerModal() {
  document.getElementById('labelManagerModal').style.display = 'none';
}

function openLabelEditorModal(label = null) {
    currentLabel = label;
  
    const isEdit = !!label;
    document.getElementById('labelModalTitle').textContent = isEdit ? 'Edit Label' : 'Create Label';
    document.getElementById('createLabelActions').style.display = isEdit ? 'none' : 'flex';
    document.getElementById('editLabelActions').style.display = isEdit ? 'flex' : 'none';
  
    document.getElementById('labelContentInput').value = label?.content || '';
    selectedColor = label?.color || '#f44336';
    highlightSelectedColor(selectedColor);
  
    document.getElementById('labelEditorModal').style.display = 'flex';
  }
  

function closeLabelEditorModal() {
  document.getElementById('labelEditorModal').style.display = 'none';
  currentLabel = null;
}

// ===== Color Picker Logic =====
let selectedColor = '#f44336';

let selectedLabelColor = '';

function selectLabelColor(color, element) {
  selectedLabelColor = color;
  selectedColor = color; // ⚠️ PHẢI CÓ DÒNG NÀY

  document.querySelectorAll('.color-swatch').forEach(item => {
    item.classList.remove('selected');
  });

  element.classList.add('selected');
}

function highlightSelectedColor(color) {
  document.querySelectorAll('.color-swatch').forEach(div => {
    div.classList.remove('selected');
    if (div.style.backgroundColor === color) {
      div.classList.add('selected');
    }
  });
}

// ===== Tạo / Sửa / Xoá Label =====
function saveLabel() {
    const content = document.getElementById('labelContentInput').value.trim();
    if (!content) {
      showMessage('Label name is required.');
      return;
    }
  
    const labels = currentTask.labels || [];
  
    if (currentLabel) {
      // Chỉnh sửa nhãn
      const index = labels.findIndex(l => l.id === currentLabel.id);
      if (index !== -1) {
        labels[index] = {
          ...currentLabel,
          content,
          color: selectedColor
        };
      }
      // Update tag nếu nhãn này đang được chọn
      const tagIndex = currentTask.tag.findIndex(t => t.id === currentLabel.id);
      if (tagIndex !== -1) {
        currentTask.tag[tagIndex] = {
          ...currentLabel,
          content,
          color: selectedColor
        };
      }
    } else {
      // Tạo mới
      const newLabel = {
        id: Date.now(),
        content,
        color: selectedColor
      };
      labels.push(newLabel);
    }
  
    currentTask.labels = labels;
  
    saveToLocalStorage();
    renderLabelList(); // Cập nhật lại giao diện
    closeLabelEditorModal();
  }
  
  
  function deleteLabel() {
    if (!currentLabel) return;
  
    showConfirm(
      'Delete Label?',
      'You won’t be able to revert this!',
      () => {
        currentTask.labels = currentTask.labels.filter(l => l.id !== currentLabel.id);
        currentTask.tag = currentTask.tag.filter(t => t.id !== currentLabel.id);
  
        saveToLocalStorage();
        renderLabelList();
        closeLabelEditorModal();
      }
    );
  }
  
// ===== Render danh sách label =====
function renderLabelList() {
    const container = document.querySelector('.label-list');
    container.innerHTML = '';
  
    const labels = currentTask.labels || [];
    const selectedTags = currentTask.tag || [];
  
    labels.forEach(label => {
      const isChecked = selectedTags.some(t => t.id === label.id);
  
      const div = document.createElement('div');
      div.className = 'label-item';
      div.style.backgroundColor = label.color;
      div.style.padding = '6px';
      div.style.marginBottom = '5px';
      div.style.borderRadius = '4px';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
  
      div.innerHTML = `
   <input type="checkbox"
       class="label-checkbox"
       id="label-${label.id}"
       data-id="${label.id}"
       ${isChecked ? "checked" : ""}
       onchange="toggleTag(${label.id})" />


      <div class="label-box" style="background-color: ${label.color};">
        <span class="label-name">${label.content || "(No title)"}</span>
        <button class="edit-label-btn"
                onclick="openLabelEditorModal(JSON.parse(this.dataset.label))"
                data-label='${JSON.stringify(label).replace(/"/g, '&quot;')}'>
          <i class="fas fa-pen"></i>
        </button>
      </div>
    `;
  
      container.appendChild(div);
    });
  }
  

// ===== Chọn / Bỏ chọn nhãn cho task =====
function toggleTag(labelId) {
    const label = currentTask.labels.find(l => l.id === labelId);
    if (!label) return;
  
    const exists = currentTask.tag.some(t => t.id === labelId);
    if (!exists) {
      currentTask.tag.push(label);
    } else {
      currentTask.tag = currentTask.tag.filter(t => t.id !== labelId);
    }
  renderBoardLists();
    saveToLocalStorage();
  }

// ===== Lưu vào localStorage =====
function saveToLocalStorage() {
  const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
  const board = user.boards?.find(b => b.id === currentEditTask.boardId);
  const list = board?.lists?.find(l => l.id === currentEditTask.listId);
  const task = list?.tasks?.find(t => t.id === currentEditTask.id);

  if (task) {
    task.labels = currentEditTask.labels || [];
    task.tag = currentEditTask.tag || [];
    task.description = currentEditTask.description || '';
    task.due_date = currentEditTask.due_date || '';
  }

  localStorage.setItem('loggedInUser', JSON.stringify(user));
}

  
  
  
  function openDateModal() {
    if (!currentEditTask) return;
  
    document.getElementById('dateModal').style.display = 'flex';
  
    if (currentEditTask.dueDate) {
      const [date, time] = currentEditTask.dueDate.split('T');
      document.getElementById('dueDateInput').value = date || '';
      document.getElementById('dueTimeInput').value = time || '';
    } else {
      document.getElementById('dueDateInput').value = '';
      document.getElementById('dueTimeInput').value = '';
    }
  }
  
  
  function closeDateModal() {
    document.getElementById('dateModal').style.display = 'none';
  }
  
  function saveTaskDate() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = user.boards?.find(b => b.id === currentBoardId);
    if (!board) return;
  
    const list = board.lists?.find(l => l.id === currentEditTask.listId);
    const task = list?.tasks?.find(t => t.id === currentEditTask.id);
    if (!task) return;
  
    const dueDate = document.getElementById('dueDateInput').value;
    const dueTime = document.getElementById('dueTimeInput').value;
  
    // Gộp lại
    const fullDueDate = dueDate ? (dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T23:59:00`) : "";
    const isoDate = fullDueDate ? new Date(fullDueDate).toISOString() : "";
    
    task.due_date = isoDate;
    currentEditTask.due_date = isoDate;
    currentTask = currentEditTask; // ⚠️ Thêm dòng này
    
    saveToLocalStorage();
    closeDateModal();
    renderBoardLists();
    
  }
  
  
  function removeTaskDate() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = user.boards?.find(b => b.id === currentBoardId);
    if (!board) return;
    
    const list = board.lists?.find(l => l.id === currentEditTask.listId);
    const task = list?.tasks?.find(t => t.id === currentEditTask.id);
    if (!task) return;
    
    task.due_date = ''; // xóa đúng chỗ
    saveToLocalStorage();
    
    saveToLocalStorage();
    closeDateModal();
    renderBoardLists?.();
  }
  

  
// end modallabel
// <!-- modaldichyen -->
function openMoveTaskModal() {
    const modal = document.getElementById('moveTaskModal');
    modal.style.display = 'flex';
  
    const listSelect = document.getElementById('moveListSelect');
    const posSelect = document.getElementById('movePositionSelect');
  
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = user.boards?.find(b => b.id === currentEditTask.boardId);
    if (!board) return;
  
    // Đổ danh sách list
    listSelect.innerHTML = '';
    board.lists.forEach(list => {
      const option = document.createElement('option');
      option.value = list.id;
      option.textContent = list.title;
      if (list.id === currentEditTask.listId) option.selected = true;
      listSelect.appendChild(option);
    });
  
    // Đổ vị trí (0 đến list.tasks.length)
    const currentList = board.lists.find(l => l.id === currentEditTask.listId);
    posSelect.innerHTML = '';
    currentList?.tasks?.forEach((t, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `Position ${idx + 1}`;
      posSelect.appendChild(opt);
    });
  }
  
  function renderMovePositions() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = user.boards.find(b => b.id === currentEditTask.boardId);
    if (!board) return;
  
    const listId = parseInt(document.getElementById('moveListSelect').value);
    const list = board.lists.find(l => l.id === listId);
    if (!list) return;
  
    const posSelect = document.getElementById('movePositionSelect');
    posSelect.innerHTML = '';
  
    const numTasks = list.tasks.length;
  
    for (let i = 0; i <= numTasks; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i === numTasks ? `Vị trí ${i + 1} (cuối)` : `Vị trí ${i + 1}`;
      posSelect.appendChild(option);
    }
  
    // Nếu đang ở chính list đó thì mặc định vị trí hiện tại
    if (listId === currentEditTask.listId) {
      const currentIndex = list.tasks.findIndex(t => t.id === currentEditTask.id);
      posSelect.value = currentIndex;
    }
  }
  function confirmMoveTask() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = user.boards?.find(b => b.id === currentEditTask.boardId);
    if (!board) return;
  
    const fromList = board.lists?.find(l => l.id === currentEditTask.listId);
    const toListId = parseInt(document.getElementById('moveListSelect').value);
    const toList = board.lists?.find(l => l.id === toListId);
    const toPosition = parseInt(document.getElementById('movePositionSelect').value);
  
    if (!fromList || !toList) return;
  
    // Tìm & xóa task cũ
    const taskIndex = fromList.tasks.findIndex(t => t.id === currentEditTask.id);
    if (taskIndex === -1) return;
    const [task] = fromList.tasks.splice(taskIndex, 1);
  
    // Chèn vào danh sách mới
    toList.tasks.splice(toPosition, 0, task);
  
    // Cập nhật thông tin vị trí
 // Cập nhật thông tin vị trí
task.listId = toListId;
currentEditTask.listId = toListId;
// ⬅️ Gán lại currentEditTask mới vì task đã di chuyển list
 
    // Cập nhật localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  
    closeMoveTaskModal();
    closeEditTaskModal();
    renderBoardLists();
  }
  
  function closeMoveTaskModal() {
    document.getElementById('moveTaskModal').style.display = 'none';
  }
  
// <!-- end modaldichyen -->