const addTaskButton = document.getElementById("addButton");
const textAreaNode = document.getElementById("addTask");
const mainSectionNode = document.querySelector("main");
const taskTemplate = document.getElementById("taskTemplate");
const popupTemplate = document.getElementById("popupTemplate");
const datePickerElement = document.getElementById("dateSelector");

let alltasksNumber = 0;
let activeTasksNumber = 0;
let taskId = 0;

class Task {
  constructor(id, active = false, taskText, deadLineDate) {
    this.taskContent = textAreaNode.value || taskText;
    this.isActive = active;
    this.id = `cbx-${id}`;
    this.creationDate = this.getCrationDate();
    this.deadLineDate = deadLineDate || datePickerElement.value;
  }

  createTask(pgrsBar, ls, taskType) {
    let clone = taskTemplate.content.cloneNode(true);
    const checkbox = clone.querySelector("input");
    checkbox.id = this.id;

    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("label").htmlFor = this.id;
    clone.querySelector(".creationDate").textContent = this.getCrationDate();

    this.eventCalendarButton = clone.querySelector(".fa-calendar");
    this.button = clone.querySelector(".fa-xmark");
    this.progressBar = pgrsBar;
    this.localStorageClass = ls;
    this.getDeadLineDate(clone.querySelector(".deadLineDate"), taskType);
    this.setEvtListenerForPoppUp(this.button);
    this.setLisnerForCreateEvent();
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
        this.isActive,
        this.creationDate,
        this.deadLineDate
      );
    } else {
      if (this.isActive) {
        checkbox.checked = true;
      }
    }
  }
  getCrationDate() {
    const currentDate = new Date();
    const formatter = new Intl.DateTimeFormat("pl", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    let formattedDate = formatter.format(currentDate);
    formattedDate = formattedDate.replace(/\./g, "/");
    this.creationDate = formattedDate;
    return `Created ${formattedDate}`;
  }
  formatData(data, charToSplit, newChar, options) {
    let year, month, day;
    if (options.old === "YrFirst") {
      [year, month, day] = data.split(`${charToSplit}`);
    } else if (options.old === "dayFirst") {
      [day, month, year] = data.split(`${charToSplit}`);
    }
    if (options.new === "YrFirst") {
      console.log("yearfirst");
      return `${year}${newChar}${month}${newChar}${day}`;
    } else if (options.new === "dayFirst") {
      console.log("dayFirst");
      return `${day}${newChar}${month}${newChar}${year}`;
    }
  }
  getDeadLineDate(deadLineTextNode, mode) {
    //console.log(this.deadLineDate);

    if (mode !== "oldTask") {
      //console.log(this.deadLineDate);
      this.deadLineDate = this.formatData(this.deadLineDate, "-", "/", {
        old: "YrFirst",
        new: "dayFirst",
      });
    }
    deadLineTextNode.textContent = `Dead-Line ${this.deadLineDate}`;
  }

  setLisnerForCreateEvent() {
    this.eventCalendarButton.addEventListener("click", () => {
      console.log(this.deadLineDate);
      const dateForEvent = this.formatData(this.deadLineDate, "/", "-", {
        old: "dayFirst",
        new: "YrFirst",
      });
      console.log(dateForEvent);
      addCalendarEvent(
        this.taskContent,
        `Dead-Line for:${this.taskContent}`,
        dateForEvent
      );
    });
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
    const taskArrayFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
    this.allTasksHistory = taskArrayFromLocalStorage || [];
    this.progressBarStatus;
  }

  setTaskFromLocalStorageHandler(
    id,
    taskContent,
    isActive,
    creationDate,
    deadLineDate
  ) {
    const taskObj = {
      taskId: id,
      taskContent: taskContent,
      isActive: isActive,
      creationDate: creationDate,
      deadLineDate: deadLineDate,
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
    const removedItemIndex = tempTaskArray.findIndex(
      (task) => task.taskId === id
    );

    tempTaskArray.splice(removedItemIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tempTaskArray));
    localStorage.setItem("allTasks", alltasksNumber);
    localStorage.setItem("activeTasks", activeTasksNumber);
    this.allTasksHistory = tempTaskArray;
  }

  reBuildTaskHandler() {
    let b1 = new ProgressBar();

    const taskArry = JSON.parse(localStorage.getItem("tasks"));

    for (const task of taskArry) {
      let idTask = task.taskId.replace("cbx-", "");
      let t2 = new Task(
        idTask,
        task.isActive,
        task.taskContent,
        task.deadLineDate
      );

      t2.createTask(b1, this, "oldTask");
      alltasksNumber = localStorage.getItem("allTasks");

      activeTasksNumber = localStorage.getItem("activeTasks");
    }

    const lastElementOfHistoryArray =
      this.allTasksHistory[this.allTasksHistory.length - 1];
    taskId = +lastElementOfHistoryArray.taskId.replace("cbx-", "") + 1;
  }
}
class DatePicker {
  constructor() {
    this.setDefaultAndMinDate();
  }
  convertDate() {
    const crtDDate = new Date().toISOString().split("T")[0];
    return crtDDate;
  }
  setDefaultAndMinDate() {
    const currentDate = new Date();
    datePickerElement.setAttribute("value", this.convertDate(currentDate));
    datePickerElement.setAttribute("min", this.convertDate(currentDate));
  }
}

class appInit {
  static init() {
    let progressBarObject = new ProgressBar();
    let localStorageObject = new LocalStorageHandler();
    let datePicker = new DatePicker();

    if (
      localStorage.getItem("tasks") &&
      JSON.parse(localStorage.getItem("tasks")).length
    ) {
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
