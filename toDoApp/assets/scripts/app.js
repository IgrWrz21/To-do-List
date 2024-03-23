const addTaskButton = document.getElementById("addButton");
const textAreaNode = document.getElementById("addTask");
const mainSectionNode = document.querySelector("main");
const taskTemplate = document.getElementById("taskTemplate");
const popupTemplate = document.getElementById("popupTemplate");

let alltasksNumber = 0;
let activeTasksNumber = 0;
let taskId = 0;

class Task {
  constructor(id, active = false, taskText) {
    this.taskContent = textAreaNode.value || taskText;
    this.isActive = active;
    this.id = `cbx-${id}`;
  }

  createTask(pgrsBar, ls, taskType) {
    let clone = taskTemplate.content.cloneNode(true);
    const checkbox = clone.querySelector("input");
    checkbox.id = this.id;

    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("label").htmlFor = this.id;
    this.button = clone.querySelector(".fa-xmark");
    this.progressBar = pgrsBar;
    this.localStorageClass = ls;

    this.setEvtListenerForPoppUp(this.button);

    checkbox.addEventListener(
      "change",
      this.setEvtListenerForCheckBox.bind(this, checkbox)
    );
    mainSectionNode.prepend(clone);
    if (taskType == "newTask") {
      alltasksNumber++;

      this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);
      this.localStorageClass.setTaskFromLocalStorageHandler(
        this.id,
        this.taskContent,
        this.isActive
      );
    } else {
      if (this.isActive) {
        checkbox.checked = true;
      }
    }
  }

  setEvtListenerForCheckBox(checkbox) {
    this.isActive = checkbox.checked;
    console.log(this.isActive);
    this.isActive ? activeTasksNumber++ : activeTasksNumber--;
    this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);

    this.localStorageClass.updateTaskFromLocalStorageHandler(
      this.id,
      this.isActive
    );
  }

  setEvtListenerForPoppUp(button) {
    button.addEventListener("click", (button) => {
      new PopUp(
        button.srcElement,
        this.deleteTaskModule.bind(this, this.progressBar)
      );
    });
  }
  deleteTaskModule(prg) {
    let target = this.button.parentElement;
    target.classList.remove("apearAnimation");
    target.classList.add("disapearAnimation");

    setTimeout(() => {
      target.remove();

      console.log(this.isActive);
      if (this.isActive) {
        alltasksNumber--;
        activeTasksNumber--;
      } else {
        alltasksNumber--;
      }
      this.localStorageClass.removeTaskFromLocalStorageHandler(this.id);
      prg.updateProgresBar(activeTasksNumber, alltasksNumber);
    }, 300);
  }
}

class PopUp {
  constructor(button, deleteFuntion) {
    const clone = popupTemplate.content.cloneNode(true);
    document.body.prepend(clone);
    document.body.classList.add("stopScroll");
    this.popup = document.querySelector(".popup");
    this.backDrop = document.querySelector(".bgc");
    this.deniedBtn = this.popup.querySelector("#deinedButton");
    this.acceptButton = this.popup.querySelector("#acceptButton");
    this.button = button;
    this.deleteTaskModuleFunction = deleteFuntion;
    this.setLisnersForPopup();
  }

  setLisnersForPopup() {
    this.deniedBtn.addEventListener("click", () => {
      this.popup.classList.add("disapearAnimation");
      this.popUpRemover(300);
    });
    this.acceptButton.addEventListener("click", () => {
      this.deleteTaskModuleFunction();
      this.popUpRemover(0);
    });
  }
  popUpRemover(time) {
    setTimeout(() => {
      this.popup.remove();
      this.backDrop.remove();
      document.body.classList.remove("stopScroll");
    }, time);
  }
}

class ProgressBar {
  constructor() {
    this.progressBarDiv = document.querySelector(".bar");
    this.progressBarDivContainer = this.progressBarDiv.previousElementSibling;
  }

  updateProgresBar(activeTasks, allTaskNumber) {
    let lvl = (activeTasks / allTaskNumber) * 100;
    if (isNaN(lvl)) {
      lvl = 0;
    }
    this.progressBarDiv.style.width = `${lvl}%`;
    this.progressBarDivContainer.textContent = `${lvl.toFixed(0)}%`;
  }
}

class LocalStorageHandler {
  constructor() {
    let i = JSON.parse(localStorage.getItem("tasks"));
    this.allTasksHistory = i || [];
    this.progressBarStatus;
  }

  setTaskFromLocalStorageHandler(id, taskContent, isActive) {
    const taskObj = {
      taskId: id,
      taskContent: taskContent,
      isActive: isActive,
    };
    this.allTasksHistory.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(this.allTasksHistory));
    localStorage.setItem("allTasks", alltasksNumber);
    localStorage.setItem("activeTasks", activeTasksNumber);
  }
  updateTaskFromLocalStorageHandler(id, activeStatus) {
    localStorage.setItem("activeTasks", activeTasksNumber);
    let tempTaskArray = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tempTaskArray.length; i++) {
      if (tempTaskArray[i].taskId === id) {
        tempTaskArray[i].isActive = activeStatus;
        localStorage.setItem("tasks", JSON.stringify(tempTaskArray));
        break;
      }
    }
    this.allTasksHistory = tempTaskArray;
  }
  removeTaskFromLocalStorageHandler(id) {
    let tempTaskArray = JSON.parse(localStorage.getItem("tasks"));

    for (let i = 0; i < tempTaskArray.length; i++) {
      if (tempTaskArray[i].taskId === id) {
        tempTaskArray.splice(i, 1);
        localStorage.setItem("tasks", JSON.stringify(tempTaskArray));
        break;
      }
    }
    localStorage.setItem("allTasks", alltasksNumber);
    localStorage.setItem("activeTasks", activeTasksNumber);
    this.allTasksHistory = tempTaskArray;
  }

  reBuildTaskHandler() {
    let b1 = new ProgressBar();

    const taskArry = JSON.parse(localStorage.getItem("tasks"));

    for (const task of taskArry) {
      let idTask = task.taskId.replace("cbx-", "");
      let t2 = new Task(idTask, task.isActive, task.taskContent);

      t2.createTask(b1, this, "oldTask");
      alltasksNumber = localStorage.getItem("allTasks");

      activeTasksNumber = localStorage.getItem("activeTasks");
    }

    const lastElementOfHistoryArray =
      this.allTasksHistory[this.allTasksHistory.length - 1];
    taskId = +lastElementOfHistoryArray.taskId.replace("cbx-", "") + 1;
  }
}

class appInit {
  static init() {
    let progressBarObject = new ProgressBar();
    let localStorageObject = new LocalStorageHandler();
    if (JSON.parse(localStorage.getItem("tasks")).length) {
      localStorageObject.reBuildTaskHandler();
      progressBarObject.updateProgresBar(activeTasksNumber, alltasksNumber);
    }
    addTaskButton.addEventListener("click", () => {
      if (textAreaNode.value === "") {
        alert("Add someting to the input");
        return;
      }
      let t2 = new Task(taskId);
      t2.createTask(progressBarObject, localStorageObject, "newTask");
      taskId++;
      textAreaNode.value = "";
    });
  }
}

appInit.init();
