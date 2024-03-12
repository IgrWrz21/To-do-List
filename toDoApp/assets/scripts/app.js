const addTaskButton = document.getElementById("addButton");
const textAreaNode = document.getElementById("addTask");
const mainSectionNode = document.querySelector("main");
const taskTemplate = document.getElementById("taskTemplate");
const popupTemplate = document.getElementById("popupTemplate");

let taskId = 0;

class Task {
  constructor(id) {
    this.taskContent = textAreaNode.value;
    this.isActive = false;
    this.id = `cbx-${id}`;
    this.acceptButton;
  }

  creatTaskModule() {
    let clone = taskTemplate.content.cloneNode(true);
    const checkbox = clone.querySelector("input");
    checkbox.id = this.id;

    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("label").htmlFor = this.id;

    this.setLisnerForClose(clone.querySelector(".fa-xmark"));

    checkbox.addEventListener("change", () => {
      this.isActive = checkbox.checked;

      console.log(this.isActive, " ", this.id);
    });
    mainSectionNode.prepend(clone);
  }
  deleteTaskModal(evt) {
    let target = evt.parentElement;
    target.classList.remove("apearAnimation");
    target.classList.add("disapearAnimation");

    setTimeout(() => {
      target.remove();
    }, 300);
  }

  createModal(button) {
    const clone = popupTemplate.content.cloneNode(true);
    document.body.prepend(clone);
    document.body.classList.add("stopScroll");

    const popup = document.querySelector(".popup");
    const backDrop = document.querySelector(".bgc");
    const denaidBtn = popup.querySelector("#deinedButton");
    const acceptButton = popup.querySelector("#acceptButton");
    this.setLisnersForPopup(popup, backDrop, denaidBtn, acceptButton, button);
  }

  setLisnerForClose(button) {
    button.addEventListener("click", this.createModal.bind(this, button));
  }

  setLisnersForPopup(popup, backDrop, denaidBtn, acceptButton, button) {
    denaidBtn.addEventListener("click", () => {
      popup.classList.add("disapearAnimation");
      setTimeout(() => {
        popup.remove();
        backDrop.remove();
        document.body.classList.remove("stopScroll");
      }, 300);
    });
    acceptButton.addEventListener("click", () => {
      this.deleteTaskModal(button);
      //popup.classList.add("disapearAnimation");
      setTimeout(() => {
        popup.remove();
        backDrop.remove();
        document.body.classList.remove("stopScroll");
      });
    });
  }
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
}

addTaskButton.addEventListener("click", ListInit.initTask);
