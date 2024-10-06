let input = document.getElementById('task');
let list = document.getElementById('list');
let completedList = document.getElementById('completedList');
let removedList = document.getElementById('removedList');

// Load tasks from localStorage on page load
window.onload = function () {
    loadTasks();
};

function saveTasks() {
    const tasks = [];
    const listItems = document.querySelectorAll('#list li, #completedList li, #removedList li');

    listItems.forEach(li => {
        const taskText = li.querySelector('span').textContent;
        const completed = li.querySelector('span').classList.contains('completed');
        const removed = li.parentElement === removedList;
        tasks.push({ task: taskText, completed, removed });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(({ task, completed, removed }) => {
        addTaskToDOM(task, completed, removed);
    });
}

document.getElementById('add').addEventListener('click', function () {
    const task = input.value;
    if (task === "") return;

    addTaskToDOM(task, false, false);
    saveTasks();

    input.value = ""; // Clear input field
});

function addTaskToDOM(task, completed, removed) {
    let li = document.createElement("li");

    // Task text with a fixed width
    let taskText = document.createElement("span");
    taskText.textContent = task;
    taskText.className = "tasktext";  // Assign fixed width class to task text

    if (completed) {
        taskText.classList.add("completed");
    }

    li.appendChild(taskText);

    let actionDiv = document.createElement('div');
    actionDiv.className = "action";

    let checkboxContainer = document.createElement('label');
    checkboxContainer.className = "checkbox-container";

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = "check";
    if (completed) checkbox.checked = true;

    let checkmark = document.createElement('span');
    checkmark.className = "checkmark";

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    checkbox.addEventListener('click', function () {
        taskText.classList.toggle("completed");
        if (checkbox.checked) {
            completedList.appendChild(li);
            removeDeletePermanentlyBtn(li);  // Remove "Delete Permanently" button
            addRemoveBtn(li);  // Ensure "Remove" button is added back
        } else {
            list.appendChild(li);
            removeDeletePermanentlyBtn(li);  // Remove "Delete Permanently" button
            addRemoveBtn(li);  // Ensure "Remove" button is added back
        }
        saveTasks();
    });

    actionDiv.appendChild(checkboxContainer);

    // Add "Remove" button only if it's not in the removed list
    if (!removed) {
        addRemoveBtn(li);  // Add "Remove" button
    }

    li.appendChild(actionDiv);

    // Append to the correct list
    if (removed) {
        removedList.appendChild(li);
        addDeletePermanentlyBtn(li); // Ensure "Delete Permanently" button is present in removed list
    } else if (completed) {
        completedList.appendChild(li);
    } else {
        list.appendChild(li);
    }
}

// Add "Remove" button
function addRemoveBtn(li) {
    let actionDiv = li.querySelector('.action');
    if (!actionDiv) return;  // Ensure actionDiv exists

    let removeBtn = li.querySelector(".removeBtn");
    if (!removeBtn) {  // Check if the "Remove" button exists
        removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "removeBtn";
        removeBtn.addEventListener('click', function () {
            removedList.appendChild(li);
            addDeletePermanentlyBtn(li);  // Ensure "Delete Permanently" button is added when moved to removed list
            removeRemoveBtn(li);  // Remove the "Remove" button when task moves to the removed list
            saveTasks();
        });
        actionDiv.appendChild(removeBtn);  // Ensure we're appending to the action div
    }
}

// Add "Delete Permanently" button if not already present
function addDeletePermanentlyBtn(li) {
    let actionDiv = li.querySelector('.action');
    if (!actionDiv) return;  // Ensure actionDiv exists

    let deleteBtn = li.querySelector(".deleteBtn");
    if (!deleteBtn) {  // Check if the button already exists
        deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "deleteBtn";
        deleteBtn.addEventListener('click', function () {
            li.remove();  // Remove the item from the DOM
            saveTasks();  // Save tasks to update localStorage after removal
        });

        actionDiv.appendChild(deleteBtn);  // Ensure we're appending to the action div
    }
}

// Remove "Delete Permanently" button
function removeDeletePermanentlyBtn(li) {
    const deleteBtn = li.querySelector(".deleteBtn");
    if (deleteBtn) {
        deleteBtn.remove();  // Remove the button if it exists
    }
}

// Remove "Remove" button from the removed list
function removeRemoveBtn(li) {
    const removeBtn = li.querySelector(".removeBtn");
    if (removeBtn) {
        removeBtn.remove();  // Remove the "Remove" button when item is moved to removed list
    }
}
