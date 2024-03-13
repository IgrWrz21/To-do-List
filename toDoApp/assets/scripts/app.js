const addTaskButton = document.getElementById("addButton");
const textAreaNode = document.getElementById("addTask");
const mainSectionNode = document.querySelector("main");
const taskTemplate = document.getElementById("taskTemplate");
const popupTemplate = document.getElementById("popupTemplate");

let taskNumber = 0;

let taskId = 0;

class Task {
  constructor(id, pgrsBar) {
    this.taskContent = textAreaNode.value;
    this.isActive = false;
    this.id = `cbx-${id}`;
    this.acceptButton;
    this.progressBar = pgrsBar;
    //console.log(this.progressBar);
    taskNumber++;
  }

  creatTaskModule() {
    let clone = taskTemplate.content.cloneNode(true);
    const checkbox = clone.querySelector("input");
    checkbox.id = this.id;

    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("label").htmlFor = this.id;
    this.button = clone.querySelector(".fa-xmark");
    this.setEvtListenerForPoppUp(this.button);

    checkbox.addEventListener("change", () => {
      this.isActive = checkbox.checked;

      console.log(this.isActive, " ", this.id);
    });
    mainSectionNode.prepend(clone);
  }

  setEvtListenerForPoppUp(button) {
    console.log(button);
    button.addEventListener("click", (button) => {
      console.log(this, "to to");
      new PopUp(button.srcElement, this.deleteTaskModule);
    });
  }
  deleteTaskModule() {
    let target = this.button.parentElement;
    target.classList.remove("apearAnimation");
    target.classList.add("disapearAnimation");

    setTimeout(() => {
      target.remove();
      taskNumber--;
      //updateProgresBar(activeTaskNumber,taskNumber)
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
      this.deleteTaskModuleFunction(this.button);
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
  // deleteTaskModule(evt) {
  //   let target = evt.parentElement;
  //   target.classList.remove("apearAnimation");
  //   target.classList.add("disapearAnimation");

  //   setTimeout(() => {
  //     target.remove();
  //     taskNumber--;
  //     //updateProgresBar(activeTaskNumber,taskNumber)
  //   }, 300);
  // }
}

class appInit {
  static init() {
    let b1 = new ProgressBar();
    b1.updateProgresBar(5, 10);

    addTaskButton.addEventListener("click", () => {
      //console.log(b1);
      if (textAreaNode.value === "") {
        alert("Add someting to the input");
        return;
      }
      let t1 = new Task(taskId);
      t1.creatTaskModule();
      taskId++;
      textAreaNode.value = "";
    });
  }
  //static init;
}

class ProgressBar {
  constructor() {
    this.progressBarDiv = document.querySelector(".bar");
  }

  updateProgresBar(activeTasks, allTaskNumber) {
    const lvl = (activeTasks / allTaskNumber) * 100;
    this.progressBarDiv.style.width = `${lvl}%`;
    this.progressBarDiv.textContent = `${lvl.toFixed(1)}%`;
  }
}

appInit.init();
//addTaskButton.addEventListener("click", appInit.init);
