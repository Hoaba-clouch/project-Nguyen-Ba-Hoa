const params = new URLSearchParams(window.location.search);
const currentBoardId = parseInt(params.get('id'));

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
  const boards = user.boards || [];

  const board = boards.find(b => b.id === currentBoardId);

  if (board?.backdrop) {
    document.body.style.backgroundImage = `url('${board.backdrop}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }
  const titleContainer = document.getElementById('board-title-container');
  if (titleContainer) {
    titleContainer.innerHTML = `
      <div class="board-title-wrapper">
        <h1 class="board-title">${board.title}</h1>
        <div class="star-wrapper" onclick="toggleStar(${board.id})">
          <i class="fa-star ${board.is_starred ? 'fas starred' : 'far'}"></i>
        </div>
      </div>
    `;
  }
  
  renderSidebarBoards();
  renderBoardLists();
});
// Render danh sách board
const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};

const boardList = document.getElementById("sidebarBoardList");

user.boards.forEach(board => {
  const li = document.createElement("li");
  li.className = "board-item";
  li.textContent = board.title;

  // Gắn sự kiện click để hiển thị tiêu đề
  li.addEventListener("click", () => {
    document.getElementById("board-title-container").innerHTML = `
      <h1 class="board-title">${board.title}</h1>
    <div class="star-wrapper" onclick="event.stopPropagation(); toggleStar(${board.id})">
                <i class="fas fa-star ${board.is_starred ? 'starred' : ''}"></i>
              </div>
    `;
    // Nếu cần hiển thị background thì dùng board.backdrop
  });

  boardList.appendChild(li);
});

function renderSidebarBoards() {
  const listEl = document.getElementById('sidebarBoardList');
  listEl.innerHTML = '';

  const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};

  const boards = (user.boards || []).filter(b => !b.is_closed);

  boards.forEach(board => {
    const li = document.createElement('li');
    li.className = 'board-item';

    if (board.id === currentBoardId) {
      li.classList.add('active');
    }

    li.onclick = () => {
      document.getElementById('pageLoader').classList.remove('hidden');
      setTimeout(() => {
        window.location.href = `board.html?id=${board.id}`;
      }, 3);
    };

    const icon = document.createElement('div');
    icon.className = 'board-icon';

    if (board.backdrop) {
        icon.style.backgroundImage = `url('${board.backdrop}')`;
        icon.style.backgroundSize = 'cover';
        icon.style.backgroundPosition = 'center';
      } else {
        icon.style.backgroundColor = board.backdrop || '#ccc';
      }
       

    const name = document.createElement('span');
    name.className = 'board-name';
    name.textContent = board.title;

    li.appendChild(icon);
    li.appendChild(name);
    listEl.appendChild(li);
  });
}

// phần thêm danh sách 
function toggleAddList() {
    const form = document.getElementById("addListForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
  }

  function cancelAddList() {
    document.getElementById("newListTitle").value = "";
    document.getElementById("addListForm").style.display = "none";
  }

  function addNewList() {
    const title = document.getElementById("newListTitle").value.trim();
    if (!title) return;
  
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    const board = (user.boards || []).find(b => b.id === currentBoardId);
    if (!board) return;
  
    const newList = {
      id: Date.now(),
      title: title,
      tasks: []
    };
  
    board.lists = board.lists || [];
    board.lists.push(newList);
  
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    renderBoardLists(); // để render đúng với ID mới tạo
    cancelAddList();
  }
  
  function showListTitleEdit(listId, iconElement) {
    const listHeader = iconElement.closest('.list-header');
    const titleEl = listHeader.querySelector('.list-title');
    
    const oldTitle = titleEl.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldTitle;
    input.className = 'list-title-input';
    input.onblur = () => saveListTitle(listId, input);
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        saveListTitle(listId, input);
      }
    };
  
    titleEl.replaceWith(input);
    input.focus();
  }
  function showListTitleEdit(listId, iconElement) {
    const listHeader = iconElement.closest('.list-header');
    const titleEl = listHeader.querySelector('.list-title');
  
    const oldTitle = titleEl.textContent;
  
    const inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.gap = '4px';
  
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldTitle;
    input.className = 'list-title-input';
    input.onkeydown = (e) => {
      if (e.key === 'Enter') saveListTitle(listId, input);
    };
  
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '✕';
    cancelBtn.className = 'cancel-btn';
    cancelBtn.onclick = () => {
      inputWrapper.replaceWith(titleEl); // quay lại title cũ
    };
  
    input.onblur = () => {
      // Cho thời gian để xử lý nút Cancel click
      setTimeout(() => {
        if (document.activeElement !== cancelBtn) {
          saveListTitle(listId, input);
        }
      }, 100);
    };
  
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(cancelBtn);
  
    titleEl.replaceWith(inputWrapper);
    input.focus();
  }
  
function saveListTitle(listId, inputEl) {
    const newTitle = inputEl.value.trim();
    if (!newTitle) return;
  
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    const board = user.boards.find(b => b.id === currentBoardId);
    const list = board?.lists.find(l => l.id === listId);
  
    if (list) {
      list.title = newTitle;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
  
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem('users', JSON.stringify(users));
      }
  
      renderBoardLists();
    }
  }
function saveListTitle(listId, inputEl) {
  const newTitle = inputEl.value.trim();
  if (!newTitle) {
    showMessage("Vui lòng nhập tên để sửa! ")
    return
  }


  const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const board = user.boards.find(b => b.id === currentBoardId);
  const list = board?.lists.find(l => l.id === listId);

  if (list) {
    list.title = newTitle;
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }

    renderBoardLists();
  }
}

  function renderBoardLists() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const board = (user.boards || []).find(b => b.id === currentBoardId);
    if (!board) return;
  
    const wrapper = document.querySelector(".board-wrapper");
    if (!wrapper) return;
  
    // Clear hết
    wrapper.innerHTML = "";
  
    board.lists?.forEach(list => {
      const listEl = document.createElement("div");
      listEl.className = "list";
      listEl.innerHTML = `
      <div class="list-header">
        <h3 class="list-title">${list.title}</h3>
        <div class="list-controls">
          <span>⇄</span>
          <span onclick="showListTitleEdit(${list.id}, this)">⋮</span>
        </div>
      </div>
    
      <div class="task-container">
        ${(list.tasks || []).map(task => `
<div  onclick="openEditTaskModal(${board.id}, ${list.id}, ${task.id})" class="task-card ${task.status === 'done' ? 'done' : ''}">
  <input type="checkbox" class="task-check" ${task.status === 'done' ? 'checked' : ''} onchange="toggleTaskStatus(${list.id}, ${task.id})">
  <span class="task-title">${task.title}</span>
  <i class="fa-regular fa-pen-to-square edit-icon" title="Chỉnh sửa"></i>
</div>

          `).join("")
          }
      </div>
    
      <div class="add-card-form" id="add-card-form-${list.id}" style="display: none;">
        <textarea class="task-input" data-list-id="${list.id}" placeholder="Nhập tiêu đề hoặc dán liên kết"></textarea>
        <div style="margin-top: 5px;">
          <a onclick="handleAddTask(${list.id})" class="add-task-btn">Thêm thẻ</a>
          <a onclick="cancelAddCard(${list.id})" class="cancel-task-btn bt cl"><i class="fas fa-times"></i>
</a>
        </div>

      </div>
    
<div class="add-card-trigger" id="add-card-trigger-${list.id}" onclick="showAddCardForm(${list.id})">
  <div class="add-left">
    <i class="fas fa-plus add-icon"></i>
    <span>Thêm thẻ</span>
  </div>
  <img class="side-icon" src="../assets/Frame.svg" alt="Xoá list" onclick="event.stopPropagation(); confirmDeleteList(${list.id})">
</div>


    `;
    
    
      wrapper.appendChild(listEl);
    });
  
    // Add ô "Thêm danh sách"
    const addListBox = document.createElement("div");
    addListBox.className = "listt addd-list";
    addListBox.innerHTML = `
      <button class="add-list-btn" onclick="toggleAddList()">+ Thêm danh sách khác</button>
      <div id="addListForm" style="display: none; margin-top: 10px;">
        <input id="newListTitle" type="text" placeholder="Nhập tên danh sách" />
        <div style="margin-top: 5px;">
          <a onclick="addNewList()">Thêm</a>
          <a onclick="cancelAddList()" class ="bt cl">Hủy</a>
        </div>
      </div>
    `;
    wrapper.appendChild(addListBox);
  }
  function confirmDeleteList(listId) {
    showConfirm(
      "Xoá danh sách?",
      "Toàn bộ thẻ trong danh sách này cũng sẽ bị xoá.",
      () => {
        const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
        const users = JSON.parse(localStorage.getItem('users')) || [];
  
        const board = (user.boards || []).find(b => b.id === currentBoardId);
        if (!board || !board.lists) return;
  
        board.lists = board.lists.filter(l => l.id !== listId);
  
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          users[index] = user;
          localStorage.setItem('users', JSON.stringify(users));
        }
  
        renderBoardLists();
        showMessage("Đã xoá danh sách.");
      }
    );
  }
  
  function toggleAddList() {
    const form = document.getElementById("addListForm");
    const button = document.querySelector(".add-list-btn");
  
    const isHidden = form.style.display === "none";
  
    form.style.display = isHidden ? "block" : "none";
    button.style.display = isHidden ? "none" : "inline-block";
  }
  
  function cancelAddList() {
    document.getElementById("newListTitle").value = "";
    document.getElementById("addListForm").style.display = "none";
    document.querySelector(".add-list-btn").style.display = "inline-block";
  }
  
  function showAddCardForm(listId) {
    document.getElementById(`add-card-form-${listId}`).style.display = 'block';
    document.getElementById(`add-card-trigger-${listId}`).style.display = 'none';
  }
  
  function cancelAddCard(listId) {
    document.getElementById(`add-card-form-${listId}`).style.display = 'none';
    document.getElementById(`add-card-trigger-${listId}`).style.display = 'flex';
  
    const textarea = document.querySelector(`#add-card-form-${listId} textarea`);
    if (textarea) {
      textarea.value = "";
    }
  }
  function toggleTaskStatus(listId, taskId) {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const board = (user.boards || []).find(b => b.id === currentBoardId);
    if (!board) return;
  
    const list = board.lists.find(l => l.id === listId);
    const task = list.tasks.find(t => t.id === taskId);
    if (!task) return;
  
    // Chuyển trạng thái
    task.status = task.status === "done" ? "pending" : "done";
  
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    renderBoardLists();
  }
  
  function addNewList() {
    const title = document.getElementById("newListTitle").value.trim();
    if (!title) {
        showMessage("Vui lòng nhập tên danh sách!", 3000);
        return;
      } 
  
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    const board = (user.boards || []).find(b => b.id === currentBoardId);
    if (!board) return;
  
    // Tạo list mới
    const newList = {
      id: Date.now(),
      title: title,
      tasks: []
    };
  
    board.lists = board.lists || [];
    board.lists.push(newList);
  
    // Cập nhật vào loggedInUser
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  
    // Đồng bộ lại vào users
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    renderBoardLists();
  }
// Hàm thêm thẻ
function handleAddTask(listId) {
    const input = document.querySelector(`.task-input[data-list-id="${listId}"]`);
    const title = input.value.trim();
    if (!title) {
        showMessage("Vui lòng nhập tên task!", 3000);
        return;
      }
  
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const board = (user.boards || []).find(b => b.id === currentBoardId);
    if (!board) return;
  
    const list = board.lists?.find(l => l.id === listId);
    if (!list) return;
  
    const newTask = {
      id: Date.now(),
      title: title,
          status: "pending"
    };
  
    list.tasks = list.tasks || [];
    list.tasks.push(newTask);
  
    // Update localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  
    renderBoardLists(); // re-render để hiển thị task mới
  }


  function closeCurrentBoard() {
    showConfirm(
      "Xác nhận đóng board?",
      "Board sẽ bị ẩn khỏi danh sách. Bạn có chắc muốn tiếp tục?",
      () => {
        const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
        const users = JSON.parse(localStorage.getItem("users")) || [];
  
        const board = user.boards?.find(b => b.id === currentBoardId);
        if (!board) return;
  
        board.is_closed = true;
  
        // Ghi lại loggedInUser
        localStorage.setItem("loggedInUser", JSON.stringify(user));
  
        const index = users.findIndex(u => u.username === user.username);
        if (index !== -1) {
          users[index] = JSON.parse(JSON.stringify(user)); // clone để chắc ăn
          localStorage.setItem("users", JSON.stringify(users));
        }
      showMessage("Đã đóng bảng thành công! ")
        window.location.href = "index.html";
      }
    );
  }
  


//   lọc
function applyFilter() {
    const keyword = document.getElementById('filterKeyword').value.toLowerCase();
  
    const isDoneChecked = document.getElementById('filterDone').checked;
    const isPendingChecked = document.getElementById('filterPending').checked;
  
    const noDate = document.getElementById('filterNoDate').checked;
    const overdue = document.getElementById('filterOverdue').checked;
    const upcoming = document.getElementById('filterUpcoming').checked;
  
    const selectedLabels = Array.from(document.querySelectorAll('.filter-label:checked')).map(cb => cb.value);
  
    document.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('.task-title').textContent.toLowerCase();
      const isDone = card.classList.contains('done');
      const dueDate = card.getAttribute('data-due'); // ISO format
      const labels = (card.getAttribute('data-labels') || '').split(',');
  
      let match = true;
  
      // Keyword
      if (keyword && !title.includes(keyword)) match = false;
  
      // Status
      if (isDoneChecked && !isDone) match = false;
      if (isPendingChecked && isDone) match = false;
  
      // Due Date
      if (dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const diff = (due - now) / (1000 * 60 * 60 * 24);
  
        if (overdue && due > now) match = false;
        if (upcoming && (diff > 1 || diff < 0)) match = false;
      } else {
        if (!noDate) match = false;
      }
  
      // Labels
      if (selectedLabels.length > 0 && !selectedLabels.some(l => labels.includes(l))) {
        match = false;
      }
  
      card.style.display = match ? 'block' : 'none';
    });
  }
  