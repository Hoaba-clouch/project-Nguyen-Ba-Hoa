// --- dashboard.js hoàn chỉnh cho huynh ---

// Đọc user đang đăng nhập
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!loggedInUser) {
    showMessage('Bạn chưa đăng nhập!');
    window.location.href = 'login.html';
}

// Biến lưu backdrop đang chọn khi tạo/sửa
let selectedBackdrop = "";
let currentEditingBoardId = null;



function closeCreateBoardModal() {
    document.getElementById('createBoardModal').style.display = 'none';
}


function closeEditModal() {
    document.getElementById('editBoardModal').style.display = 'none';
}

// Render danh sách boards
let currentFilter = "all"; // "all" | "starred" | "closed"

function renderBoards() {
    const boardList = document.querySelector('.page-content');
    boardList.innerHTML = '';

    if (!loggedInUser || !loggedInUser.boards) return;

    let boardsToRender = loggedInUser.boards;

    if (currentFilter === "starred") {
        boardsToRender = boardsToRender.filter(board => board.is_starred && !board.is_closed);
    } else if (currentFilter === "closed") {
        boardsToRender = boardsToRender.filter(board => board.is_closed);
    } else {
        boardsToRender = boardsToRender.filter(board => !board.is_closed);
    }

    if (boardsToRender.length > 0) {
        boardsToRender.forEach(board => {
            const card = document.createElement('div');
            card.className = 'card';
            if (board.backdrop) {
                card.style.backgroundImage = `url('${board.backdrop}')`;
            }
            card.innerHTML = `
                <div class="content">
                    <div class="star-wrapper" onclick="toggleStar(${board.id})">
                        <i class="fas fa-star ${board.is_starred ? 'starred' : ''}"></i>
                    </div>
                    <div class="delete-wrapper" onclick="deleteBoard(${board.id})">
                        <i class="fas fa-trash"></i>
                    </div>
                    <div class="title">${board.title}</div>
                    <button class="btn" onclick="openEditBoard(${board.id})">
                        <i class="fas fa-pen-to-square"></i> Edit this board
                    </button>
                </div>
            `;
            boardList.appendChild(card);
        });
    } else {
        // Nếu không có board thì hiển thị thông báo
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'color text-black 400 text-center';
        emptyMessage.textContent = 'Không có bảng nào trong mục này.';
        boardList.appendChild(emptyMessage);
    }

    // Nếu filter đang là "all" thì mới có nút "Create new board"
    if (currentFilter === "all") {
        const createCard = document.createElement('div');
        createCard.className = 'created-board';
        createCard.innerHTML = `
            <button class="btn btnn" onclick="openCreateBoardModal()">
                <i class="fas fa-plus"></i> Created new board
            </button>
        `;
        boardList.appendChild(createCard);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const greetingDiv = document.getElementById('greeting');

    if (loggedInUser && loggedInUser.fullName) {
        // Cắt chỉ lấy tên (nếu huynh muốn ngắn gọn)
        const firstName = loggedInUser.fullName.split(' ').pop(); // Lấy từ cuối cùng trong tên
        greetingDiv.textContent = `Hello, ${firstName}!`;
    } else {
        greetingDiv.textContent = `Xin chào!`;
    }

})

function renderStarredBoards() {
    const starredList = document.querySelector('.page-content-starred');
    starredList.innerHTML = '';

    const starredBoards = loggedInUser.boards.filter(board => board.is_starred && !board.is_closed);


    if (starredBoards.length > 0) {
        starredBoards.forEach(board => {
            const card = document.createElement('div');
            card.className = 'card';
            if (board.backdrop) {
                card.style.backgroundImage = `url('${board.backdrop}')`;
            }
            card.innerHTML = `
          <div class="content">
           <div class="star-wrapper" onclick="toggleStar(${board.id})">
                        <i class="fas fa-star ${board.is_starred ? 'starred' : ''}"></i>
                        
                        
                    </div>
                     <div class="delete-wrapper" onclick="deleteBoard(${board.id})">
                        <i class="fas fa-trash"></i>
                    </div>
            <h2 class="title">${board.title}</h2>
            <button class="btn" onclick="openEditBoard(${board.id})"><i class="fas fa-edit"></i> Edit this board</button>
          </div>
        `;
            starredList.appendChild(card);
        });
    }
}



function showAllBoards() {
    currentFilter = "all";
    const starredSection = document.getElementById('starredBoardsSection');
    starredSection.style.opacity = "1";
    starredSection.style.pointerEvents = "auto";
    renderBoards();
    renderStarredBoards();
}

function showStarredBoards() {
    currentFilter = "starred";
    const starredSection = document.getElementById('starredBoardsSection');
    starredSection.style.opacity = "1";
    starredSection.style.pointerEvents = "auto";
    renderBoards();
}

function showClosedBoards() {
    currentFilter = "closed";
    const starredSection = document.getElementById('starredBoardsSection');
    starredSection.style.opacity = "1";
    starredSection.style.pointerEvents = "none";

    renderBoards();
}




// Mở modal tạo board
function openCreateBoardModal() {
    document.getElementById('createBoardModal').style.display = 'block';
}

// Tạo board mới
function createBoard() {
    const title = document.getElementById('newBoardTitle').value.trim();

    if (!title) {
        showMessage("Vui lòng nhập tên board!");
        return;
    }

    // Nếu chưa chọn hình nền thì tự gán hình mặc định
    const backdrop = selectedBackdrop || 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/02/anh-phong-canh-66-1.jpg';

    loggedInUser.boards.push({
        id: Date.now(),
        title,
        backdrop,
        created_at: new Date().toISOString(),
        is_starred: false,
        is_closed: false,
        lists: []
    });

    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    renderBoards();
    document.getElementById('createBoardModal').style.display = 'none';
}


// Chọn backdrop
function selectBackdrop(url) {
    selectedBackdrop = url;
    // Bỏ selected ở tất cả ô trước
    document.querySelectorAll('.bg-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Thêm selected cho ô vừa click
    event.currentTarget.classList.add('selected');
}


// Mở modal sửa board
function openEditBoard(boardId) {
    const board = loggedInUser.boards.find(b => b.id === boardId);
    if (!board) return;

    document.getElementById('editBoardTitle').value = board.title;
    selectedBackdrop = board.backdrop;
    currentEditingBoardId = boardId;

    document.getElementById('editBoardModal').style.display = 'block';
}

// Lưu lại board sau khi sửa
function saveEditBoard() {
    const newTitle = document.getElementById('editBoardTitle').value.trim();
    if (!newTitle) {
        showMessage("Vui lòng nhập tiêu đề board!");
        return;
    }
    const board = loggedInUser.boards.find(b => b.id === currentEditingBoardId);
    if (!board) {
        showMessage("Không tìm thấy board cần sửa!");
        return;
    }

    board.title = newTitle;
    board.backdrop = selectedBackdrop;

    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    renderBoards();
    renderStarredBoards();

    document.getElementById('editBoardModal').style.display = 'none';
}

function deleteBoard(boardId) {
    showConfirm(
        'Are you sure?',
        'You won`t be able to revert this!',
        () => {
            loggedInUser.boards = loggedInUser.boards.filter(b => b.id !== boardId);
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            renderBoards();
            renderStarredBoards();

        }
    );
}



function toggleStar(boardId) {
    const board = loggedInUser.boards.find(b => b.id === boardId);
    if (!board) return;

    // Nếu chưa có is_starred, thêm vào mặc định false
    if (typeof board.is_starred === 'undefined') {
        board.is_starred = false;
    }

    // Đảo ngược trạng thái is_starred
    board.is_starred = !board.is_starred;

    // Lưu lại vào localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    // Cập nhật lại giao diện
    renderBoards();
    renderStarredBoards();

}

function showConfirm(message, subMessage, onConfirm) {
    const box = document.getElementById('confirmBox');
    box.innerHTML = `
      <div class="confirm-content">
        <div class="icon"><i class="fas fa-exclamation-circle"></i></div>
        <p class="main-message">${message}</p>
        <p class="sub-message">${subMessage}</p>
        <div class="confirm-actions">
                        <div class="actions">
                            <a onclick="confirmNo()" class="bt cl" onclick=" closeEditModal()" href="#">

                                Cancel
                            </a>
                            <a  onclick="confirmYes()" class="bt" onclick="saveEditBoard()" href="#">

                                Confirm
                            </a>


                        </div>
        
        </div>
      </div>
    `;
    box.style.display = 'flex';

    window.confirmYes = () => {
        onConfirm();
        box.style.display = 'none';
    };

    window.confirmNo = () => {
        box.style.display = 'none';
    };
}




const menuItems = document.querySelectorAll('ul li');

menuItems.forEach(item => {
    item.addEventListener('click', function () {
        menuItems.forEach(i => i.classList.remove('active')); // Xóa active cũ
        this.classList.add('active'); // Thêm active vào item vừa click
    });
});

function logout() {
    setTimeout(() => {
        showMessage('Bạn đã đăng xuất thành công!');

    }, 1500);

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2700); // Đợi 1 giây cho người dùng đọc thông báo
}

// --- Khởi động ---
renderBoards();
renderStarredBoards();