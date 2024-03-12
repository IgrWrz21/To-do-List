const addTaskButton = document.getElementById("addButton");
const textAreaNode = document.getElementById("addTask");
const mainSectionNode = document.querySelector("main");
const taskTemplate = document.getElementById("taskTemplate");
const popupTemplate = document.getElementById("popupTemplate");

const popupModal = document.querySelector(".popup");
const bgcPopupModal = document.querySelector(".bgc");
const acceptButton = document.getElementById("acceptButton");
const deniedButton = document.getElementById("deinedButton");
let taskId = 0;
//console.log(mainSectionNode);
class Task {
  constructor(id) {
    this.taskContent = textAreaNode.value;
    this.isActive = false;
    this.id = `cbx-${id}`;
    this.acceptButton;
  }

  creatTaskModule() {
    let clone = taskTemplate.content.cloneNode(true);
    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("input").id = this.id;
    clone.querySelector("label").htmlFor = this.id;

    this.setLisnerForClose(clone.querySelector(".fa-xmark"));

    mainSectionNode.prepend(clone);
    //mainSectionNode.querySelector("");
    //console.log(clone);
  }
  deleteTaskModal(evt) {
    let target = evt.parentElement;
    target.classList.add("disapearAnimation");

    setTimeout(() => {
      target.remove();
    }, 300);
  }

  setLisnerForClose(button) {
    button.addEventListener("click", this.creatPopupModule.bind(this, button));
  }

  creatPopupModule(button) {
    const clone = popupTemplate.content.cloneNode(true);
    document.body.prepend(clone);
    document.body.classList.add("stopScroll");

    const popup = document.querySelector(".popup");
    const backDrop = document.querySelector(".bgc");
    const denaidBtn = popup.querySelector("#deinedButton");
    const acceptButtond = popup.querySelector("#acceptButton");
    denaidBtn.addEventListener("click", () => {
      popup.remove();
      backDrop.remove();
      document.body.classList.remove("stopScroll");
    });
    acceptButtond.addEventListener("click", () => {
      this.deleteTaskModal(button);
      popup.remove();
      backDrop.remove();
      document.body.classList.remove("stopScroll");
    });
  }

  //deniedButton.addEventListener("click", tooglePopupVisabiltybOff);
}
class ListInit {
  static initTask() {
    if (textAreaNode.value === "") {
      alert("Add someting to the input");
      return;
    }
    let t1 = new Task(taskId);

    t1.creatTaskModule();
    taskId++;
    textAreaNode.value = "";
  }
  // static initPopup() {
  //   let clone = popupTemplate.content.cloneNode(true);
  // }
}

// const tooglePopupVisabiltybOn = () => {
//   popupModal.classList.add("visable");
//   bgcPopupModal.classList.add("visable");
// };

// const tooglePopupVisabiltybOff = () => {
//   popupModal.classList.remove("visable");
//   bgcPopupModal.classList.remove("visable");
// };

addTaskButton.addEventListener("click", ListInit.initTask);
//ListInit.initPopup();

// const disableScroll=()=>{
//   window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
//   window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
//   window.addEventListener('keydown', preventDefaultForScrollKeys, false);
// }
