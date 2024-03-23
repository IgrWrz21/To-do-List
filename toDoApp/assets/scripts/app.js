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
    //this.acceptButton;
    //this.progressBar = pgrsBar;
    //console.log(this.progressBar);
    //taskNumber++;
  }

  creatTaskModule(pgrsBar, ls) {
    let clone = taskTemplate.content.cloneNode(true);
    const checkbox = clone.querySelector("input");
    checkbox.id = this.id;
    //this.localStorageClass = ls;
    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("label").htmlFor = this.id;
    this.button = clone.querySelector(".fa-xmark");
    this.progressBar = pgrsBar;
    this.localStorageClass = ls;
    //console.log(pgrsBar, this.progressBar, "wazne");
    this.setEvtListenerForPoppUp(this.button);

    checkbox.addEventListener("change", () => {
      this.isActive = checkbox.checked;
      this.isActive ? activeTasksNumber++ : activeTasksNumber--;
      this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);

      this.localStorageClass.updateTaskFromLocalStorageHandler(
        this.id,
        this.isActive
      );
      //console.log(this.isActive, " ", this.id);
    });
    mainSectionNode.prepend(clone);
    alltasksNumber++;
    //console.log(this.progressBar, this.button);
    this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);
    this.localStorageClass.setTaskFromLocalStorageHandler(
      this.id,
      this.taskContent,
      this.isActive
    );

    //this.setTaskFromLocalStorageHandler();
  }

  createTaskFromLocalStorage(pgrsBar, ls) {
    let clone = taskTemplate.content.cloneNode(true);
    const checkbox = clone.querySelector("input");
    checkbox.id = this.id;
    //this.localStorageClass = localStrg;
    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("label").htmlFor = this.id;
    this.button = clone.querySelector(".fa-xmark");
    this.progressBar = pgrsBar;
    this.localStorageClass = ls;
    //console.log(pgrsBar, this.progressBar, "wazne");
    this.setEvtListenerForPoppUp(this.button);
    if (this.isActive) {
      checkbox.checked = true;
    }
    checkbox.addEventListener("change", () => {
      this.isActive = checkbox.checked;
      this.isActive ? activeTasksNumber++ : activeTasksNumber--;
      this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);
      this.localStorageClass.updateTaskFromLocalStorageHandler(
        this.id,
        this.isActive
      );
      console.log(
        `activeTasks:${activeTasksNumber}, allTasks:${alltasksNumber}`
      );
      //this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);
      //this.setTaskFromLocalStorageHandler();
      // this.localStorageClass.setTaskFromLocalStorageHandler(
      //   this.id,
      //   this.taskContent,
      //   this.isActive
      // );

      //console.log(this.isActive, " ", this.id);
    });
    mainSectionNode.prepend(clone);
    //console.log(this.progressBar, this.button);

    //this.setTaskFromLocalStorageHandler();
  }
  setEvtListenerForCheckBox() {
    this.isActive = checkbox.checked;
    this.isActive ? activeTasksNumber++ : activeTasksNumber--;
    this.progressBar.updateProgresBar(activeTasksNumber, alltasksNumber);

    this.localStorageClass.updateTaskFromLocalStorageHandler(
      this.id,
      this.isActive
    );
  }

  setEvtListenerForPoppUp(button) {
    //console.log(button);
    button.addEventListener("click", (button) => {
      // console.log(this, "to to");
      //console.log(this.progressBar);
      new PopUp(
        button.srcElement,
        this.deleteTaskModule.bind(this, this.progressBar)
      );
    });
  }
  deleteTaskModule(prg) {
    //console.log(this.button);
    let target = this.button.parentElement;
    target.classList.remove("apearAnimation");
    target.classList.add("disapearAnimation");
    // console.log(this.progressBar);
    setTimeout(() => {
      target.remove();

      console.log(this.isActive);
      if (this.isActive) {
        alltasksNumber--;
        activeTasksNumber--;
      } else {
        alltasksNumber--;
      }
      //onsole.log(this.progressBar, this.button);
      console.log("task deleted");
      console.log(this.id);
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
    //console.log(this.progressBarDivContainer);
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
    console.log(id);
    const taskObj = {
      taskId: id,
      taskContent: taskContent,
      isActive: isActive,
    };
    this.allTasksHistory.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(this.allTasksHistory));
    localStorage.setItem("allTasks", alltasksNumber);
    localStorage.setItem("activeTasks", activeTasksNumber);
    // localStorage.setItem("allTasks", alltasksNumber);
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
  }
  removeTaskFromLocalStorageHandler(id) {
    // console.log(id);
    //id = id.replace("cbx-", "");
    let tempTaskArray = JSON.parse(localStorage.getItem("tasks"));
    //console.log(tempTaskArray, "  1");
    //console.log(tempTaskArray);
    for (let i = 0; i < tempTaskArray.length; i++) {
      if (tempTaskArray[i].taskId === id) {
        tempTaskArray.splice(i, 1);
        localStorage.setItem("tasks", JSON.stringify(tempTaskArray));
        break;
      }
    }
    localStorage.setItem("allTasks", alltasksNumber);
    localStorage.setItem("activeTasks", activeTasksNumber);
    console.log(tempTaskArray, "  2");
    this.allTasksHistory = tempTaskArray;
    console.log(this.allTasksHistory);
  }

  reBuildTaskHandler() {
    let b1 = new ProgressBar();

    const taskArry = JSON.parse(localStorage.getItem("tasks"));
    //console.log(taskId);

    //console.log(taskId);
    console.log(this);
    //taskId = taskId.replace("cbx-", "");
    for (const task of taskArry) {
      let idTask = task.taskId.replace("cbx-", "");
      console.log(idTask);
      let t2 = new Task(idTask, task.isActive, task.taskContent);

      t2.createTaskFromLocalStorage(b1, this);
      alltasksNumber = localStorage.getItem("allTasks");
      //taskId++;
      activeTasksNumber = localStorage.getItem("activeTasks");
    }
    // const historyArrayLength =
    //   this.allTasksHistory[this.allTasksHistory.length - 1];

    const lastElementOfHistoryArray =
      this.allTasksHistory[this.allTasksHistory.length - 1];
    //console.log(+taskId.taskId.replace("cbx-", "") + 1);
    taskId = +lastElementOfHistoryArray.taskId.replace("cbx-", "") + 1;
  }
}

class appInit {
  // static startInit() {
  //   if (!localStorage.length) {
  //     return;
  //   } else {
  //     let ls = new LocalStorageHandler();
  //     ls.reBuildTaskHandler();
  //   }
  // }
  static init() {
    let b1 = new ProgressBar();
    let ls = new LocalStorageHandler();
    if (localStorage.length) {
      ls.reBuildTaskHandler();
      b1.updateProgresBar(activeTasksNumber, alltasksNumber);
    }
    addTaskButton.addEventListener("click", () => {
      if (textAreaNode.value === "") {
        alert("Add someting to the input");
        return;
      }
      let t2 = new Task(taskId);
      console.log(ls);
      t2.creatTaskModule(b1, ls);
      taskId++;
      textAreaNode.value = "";
    });
  }
  //static init;
}
//appInit.startInit();
appInit.init();

//TODO
//Repair funcition for automaticly check button after relaod page, hisotry dont updatate isActive position
