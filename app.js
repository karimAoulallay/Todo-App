//------------------------------------------------- Task class -------------------------------------------------//

class Task {
  constructor(title, id, complete) {
    this.title = title;
    this.id = id;
    this.complete = complete;
  }

  static createTask(task) {
    let newTask = {
      title: task.title,
      id: task.id,
      complete: task.complete,
    };
    // add to ui
    Ui.addToUi(newTask);
    // add to array
    Store.addToArray(newTask);
  }
}

//------------------------------------------------- UI class -------------------------------------------------//

class Ui {
  static themeIcon = document.querySelector(".theme-icon").querySelector("img");
  static bg = document.querySelector(".bg");
  static taskList = document.querySelector(".list-tasks");
  static html = document.querySelector("html");

  // Change theme color

  static ChangeTheme() {
    if (this.html.getAttribute("data-theme") == "dark") {
      this.html.setAttribute("data-theme", "light");
      this.themeIcon.setAttribute("src", "images/icon-moon.svg");
    } else {
      this.html.setAttribute("data-theme", "dark");
      this.themeIcon.setAttribute("src", "images/icon-sun.svg");
    }
    // add theme to local storage
    Store.storeThemeData(this.html.getAttribute("data-theme"));
  }

  // add task to Ui
  static addToUi(newTask) {
    // create a new div
    let task = document.createElement("div");
    // classes
    task.classList.add("row", "task");
    // attributes
    task.setAttribute("data-complete", newTask.complete);
    task.setAttribute("data-id", newTask.id);
    // add task to list
    this.taskList.prepend(task);

    // create check circle
    let check = document.createElement("div");
    // classes
    check.classList.add("circle", "check");
    // add to task element
    task.append(check);

    // create task title
    let title = document.createElement("span");
    // classes
    title.classList.add("text-task");
    title.append(newTask.title);
    // add task element
    task.append(title);

    // create cross
    let cross = document.createElement("div");
    // classes
    cross.classList.add("cross");
    // cross element content
    cross.innerHTML = "<img src=\"images/icon-cross.svg\" alt='cross icon' />";
    // add cross element to task
    task.append(cross);
  }

  // delete task

  static deleteTask(e) {
    if (e.target.parentElement.classList.contains("cross")) {
      e.target.closest(".task").remove();
      Store.taskArray = Store.taskArray.filter(
        (task) => task.id != e.target.closest(".task").getAttribute("data-id")
      );
      window.localStorage.setItem("tasks", JSON.stringify(Store.taskArray));
    }
    // left tasks method
    Ui.leftTasks();
  }

  // complete task with check mark

  static completeTask(e) {
    if (e.target.classList.contains("check")) {
      let mainTask = e.target.closest(".task");
      if (mainTask.getAttribute("data-complete") == "true") {
        // change task element data complete attribute
        mainTask.setAttribute("data-complete", "false");
        // loop over task array
        Store.taskArray.forEach((task) => {
          if (task.id == mainTask.getAttribute("data-id")) {
            task.complete = "false";
          }
        });
        // add change to local storage
        window.localStorage.setItem("tasks", JSON.stringify(Store.taskArray));
      } else {
        // change task element data complete attribute
        mainTask.setAttribute("data-complete", "true");
        // loop over task array
        Store.taskArray.forEach((task) => {
          if (task.id == mainTask.getAttribute("data-id")) {
            task.complete = "true";
          }
        });
        // add changes to local storage
        window.localStorage.setItem("tasks", JSON.stringify(Store.taskArray));
      }
      // left tasks method
      Ui.leftTasks();
    }
  }

  static leftTasks() {
    let tasksNum = document.querySelector(".left-items");
    let counter = 0;
    Store.taskArray.forEach((task) => {
      if (task.complete == "false") {
        counter++;
      }
    });
    tasksNum.innerHTML = counter;
  }

  // filter options

  static filterOptions() {
    let allOpt = document.querySelector(".all-opt");
    let activeOpt = document.querySelector(".active-opt");
    let completedOpt = document.querySelector(".completed-opt");
    let filterOpts = document.querySelectorAll(".filter span");

    // show all tasks

    document.addEventListener("click", (e) => {
      let allTasks = document.querySelectorAll(".task");
      if (e.target.classList.contains("all-opt")) {
        // remove active class
        filterOpts.forEach((opt) => {
          opt.classList.remove("active");
        });
        // add active class
        allOpt.classList.add("active");
        // show all tasks
        allTasks.forEach((task) => {
          task.style.display = "flex";
        });
      }
    });

    // show active tasks

    document.addEventListener("click", (e) => {
      let allTasks = document.querySelectorAll(".task");
      if (e.target.classList.contains("active-opt")) {
        // remove active class
        filterOpts.forEach((opt) => {
          opt.classList.remove("active");
        });
        // add active class
        activeOpt.classList.add("active");
        // show all tasks
        allTasks.forEach((task) => {
          if (task.getAttribute("data-complete") === "false") {
            task.style.display = "flex";
          } else {
            task.style.display = "none";
          }
        });
      }
    });

    // show complete tasks

    document.addEventListener("click", (e) => {
      let allTasks = document.querySelectorAll(".task");
      if (e.target.classList.contains("completed-opt")) {
        // remove active class
        filterOpts.forEach((opt) => {
          opt.classList.remove("active");
        });
        // add active class
        completedOpt.classList.add("active");
        // show all tasks
        allTasks.forEach((task) => {
          if (task.getAttribute("data-complete") === "true") {
            task.style.display = "flex";
          } else {
            task.style.display = "none";
          }
        });
      }
    });
  }

  // clear completed tasks

  static clearCompleted() {
    document.addEventListener("click", (e) => {
      let allTasks = document.querySelectorAll(".task");
      if (e.target.classList.contains("clear-completed")) {
        allTasks.forEach((removeTask) => {
          if (removeTask.getAttribute("data-complete") == "true") {
            // remove task from ui
            removeTask.remove();
            // remove task from task array
            Store.taskArray = Store.taskArray.filter(
              (task) => task.id != removeTask.getAttribute("data-id")
            );
            console.log(Store.taskArray);
            // add new array to local storage
            window.localStorage.setItem(
              "tasks",
              JSON.stringify(Store.taskArray)
            );
          }
        });
      }
    });
  }
}

//------------------------------------------------- Store class -------------------------------------------------//

class Store {
  static taskArray = [];

  // add theme data to local storage

  static storeThemeData(mode) {
    window.localStorage.setItem("theme", JSON.stringify(mode));
  }

  //  get stored theme data from local storage

  static getStoredTheme() {
    let data = window.localStorage.getItem("theme");

    if (data) {
      let htmlMode = JSON.parse(data);
      Ui.html.setAttribute("data-theme", htmlMode);
      if (htmlMode == "light") {
        Ui.themeIcon.setAttribute("src", "images/icon-moon.svg");
      } else {
        Ui.themeIcon.setAttribute("src", "images/icon-sun.svg");
      }
    }
  }

  // add task to array

  static addToArray(newTask) {
    // add to array
    Store.taskArray.push(newTask);
    // add to local storage
    window.localStorage.setItem("tasks", JSON.stringify(this.taskArray));
  }

  // get local storage tasks

  static getStoredTasks() {
    let data = window.localStorage.getItem("tasks");

    if (data) {
      let tasks = JSON.parse(data);
      tasks.forEach((task) => {
        Task.createTask(task);
      });
    }
  }
}

//------------------------------------------------- Theme functions and events -------------------------------------------------//

// change theme on click event

Store.getStoredTheme();

Ui.themeIcon.onclick = (e) => {
  Ui.ChangeTheme();
};

//------------------------------------------------- Task functions and events -------------------------------------------------//

Store.getStoredTasks();

// Event on submit the task

let btn = document.querySelector(".add-task-btn");
let input = document.querySelector("input");

// create task

btn.onclick = (e) => {
  if (input.value != "") {
    let task = new Task(input.value, Date.now(), "false");
    Task.createTask(task);
    // clear input value
    input.value = "";
    // prevent event
    e.preventDefault();
  } else {
    // prevent event
    e.preventDefault();
  }
};

// delete task [ bubbling method ]

document.addEventListener("click", (e) => {
  Ui.deleteTask(e);
});

// complete task [ bubbling method ]

document.addEventListener("click", (e) => {
  Ui.completeTask(e);
});

//------------------------------------------------- Options functions and events -------------------------------------------------//

// tasks left

Ui.leftTasks();

// filter options

Ui.filterOptions();

// clear completed task

Ui.clearCompleted();
