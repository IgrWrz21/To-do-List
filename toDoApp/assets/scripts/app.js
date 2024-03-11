const addTaskButton = document.getElementById("addButton");
const textAreaNode = document.getElementById("addTask");
const mainSectionNode = document.querySelector("main");
const taskTemplate = document.getElementsByTagName("template")[0];
let taskId = 0;
console.log(mainSectionNode);
class Task {
  constructor(id) {
    this.taskContent = textAreaNode.value;
    this.isActive = false;
    this.id = `cbx-${id}`;
  }

  creatTaskModule() {
    let clone = taskTemplate.content.cloneNode(true);
    clone.querySelector(".taskContent p").textContent = this.taskContent;
    clone.querySelector("input").id = this.id;
    clone.querySelector("label").htmlFor = this.id;

    this.setLisnerForClose(clone.querySelector(".fa-xmark"));

    mainSectionNode.prepend(clone);
  }
  deleteTaskModal(evt) {
    let target = evt.target.parentElement;
    target.classList.add("disapearAnimation");
    setTimeout(() => {
      target.remove();
    }, 300);
  }
  setLisnerForClose(button) {
    button.addEventListener("click", this.deleteTaskModal);
  }
}
class ListInit {
  static init() {
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

addTaskButton.addEventListener("click", ListInit.init);
