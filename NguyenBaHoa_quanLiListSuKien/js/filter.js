function openFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
      modal.style.display = 'block';
    }
    renderFilterLabels();
  }
  
  function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  function applyTaskFilters() {
    const done = document.querySelector("#filterDone")?.checked;
    const pending = document.querySelector("#filterNotDone")?.checked;
  
    window.currentFilter = {
      done,
      pending
    };
  
    renderBoardLists();
    closeFilterModal();
    showMessage("Đã áp dụng bộ lọc!");
  }
  function getFilterData() {
    return {
      keyword: document.getElementById("filterKeyword")?.value.trim().toLowerCase() || "",
      done: document.getElementById("filterDone")?.checked || false,
      pending: document.getElementById("filterNotDone")?.checked || false,
      noDate: document.getElementById("filterNoDate")?.checked || false,
      overdue: document.getElementById("filterOverdue")?.checked || false,
      upcoming: document.getElementById("filterDueSoon")?.checked || false,
      colors: Array.from(document.querySelectorAll(".filter-label-color:checked"))
                   .map(cb => cb.value)
    };
  }
  
  
  document.getElementById('filterApplyBtn').addEventListener('click', () => {
    window.currentFilter = getFilterData();
    renderBoardLists();
    closeFilterModal();
    showMessage('Đã áp dụng bộ lọc!');
  });
  function renderFilterLabels() {
    const container = document.getElementById('filterLabelsContainer');
    container.innerHTML = '';
  
    const defaultLabelColors = [
      "#f44336", "#ff9800", "#ffeb3b", "#4caf50",
      "#2196f3", "#9c27b0", "#e91e63", "#795548",
      "#607d8b", "#cddc39"
    ];
  
    defaultLabelColors.forEach(color => {
      const id = `filterLabel-${color.slice(1)}`;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'filter-label-color';
      checkbox.id = id;
      checkbox.value = color;
  
      const label = document.createElement('label');
      label.htmlFor = id;
      label.style.display = 'inline-flex';
      label.style.alignItems = 'center';
      label.style.margin = '4px 8px 4px 0';
      label.innerHTML = `
        <span class="spann" style="width: 18em; height: 19px; border-radius: 3px; margin-right: 6px; background-color: ${color}; display: inline-block;"></span>
     
      `;
  
      container.appendChild(checkbox);
      container.appendChild(label);
    });
  }
  
  
       // true = dùng filteredTasks
  
  