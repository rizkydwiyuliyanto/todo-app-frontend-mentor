
    let tasks = [{
        id: 1,
        name: "Jog around athe park s13x",
        completed: false
      },];
  
  
      const showTasks = (task) => {
        let count = 0;
        const myListParent = document.getElementById("mylistParent");
        const total = document.querySelectorAll(".total");
        const div2 = document.createElement("div");
        div2.classList.add("list-group");
        div2.id = "mylistParent";
  
        task.forEach(x => {
          if (!x.completed) {
            count += 1
          }
          const div = document.createElement("div");
          div.setAttribute("data-check", `${x.completed}`);
          div.setAttribute("data-id", `${x.id}`);
          div.classList.add("background", "mylist", "fs-normal", "rounded-0", "d-flex", "px-3", "justify-content-start");
          div.innerHTML = `
            <div data-id=${x.id} onclick="setComplete(${x.completed}, ${x.id})" style="border: 2px solid grey; width: 30px; height: 30px;overflow: hidden;" class="${x.completed ? 'check-background' : ''}my-auto rounded-5 d-flex justify-content-center align-items-center me-3">
              ${x.completed ? '<img src="./images/icon-check.svg" width="20">' : ''}
            </div>
            <div class="task">
            ${x.completed ? `<span style="color: grey;text-decoration: line-through;">${x.name}</span>` : `<span>${x.name}</span>`}
            </div>
            <div onclick="deleteTask(${x.id})" class="ms-auto my-auto">
                <img class="d-block" src="./images/icon-cross.svg" width="20px" height="20px">  
            </div>
            `
          div2.appendChild(div)
        })
        myListParent.replaceWith(div2);
        Sortable.create(mylistParent, {
      group: "localStorage-example",
      store: {
          /**
           * Get the order of elements. Called once during initialization.
           * @param   {Sortable}  sortable
           * @returns {Array}
           */
          get: function (sortable) {
              var order = sessionStorage.getItem(sortable.options.group.name);
              return order ? order.split('|') : [];
          },
  
          /**
           * Save the order of elements. Called onEnd (when the item is dropped).
           * @param {Sortable}  sortable
           */
          set: function (sortable) {
              var order = sortable.toArray();
              sessionStorage.setItem(sortable.options.group.name, order.join('|'));
          }
      }
  });
        total.forEach(a => {
          a.innerHTML = count
        })
      }
  
      const getTask = () => {
        const options = document.querySelectorAll(".option");
        let filter = sessionStorage.getItem("filter");
        if (JSON.parse(filter) === null) {
          sessionStorage.setItem("filter", JSON.stringify("all"));
          filter = sessionStorage.getItem("filter");
        }
        let opt;
        switch (JSON.parse(filter)) {
          case "all":
            opt = "all"
            break
          case false:
            opt = "active";
            break
          default:
            opt = "completed"
            break;
        }
  
        options.forEach(x => {
          let data = x.getAttribute("data-option");
          if (data === opt) {
            x.classList.add("option-visited");
            x.classList.remove("option-notVisited")
          }else{
            x.classList.remove("option-visited");
            x.classList.add("option-notVisited")
          }
        });
  
        let filterTask = JSON.parse(filter) === "all" ? tasks : tasks.filter(a => { return a.completed === JSON.parse(filter) })
        showTasks(filterTask);
      }
  
      getTask()
  
      const setCheck = (val) => {
        const checks = document.querySelector(".check");
        if (val == "0") {
          checks.classList.add("check-background");
          checks.innerHTML =
            `
                <img src="./images/icon-check.svg" width="20">
              `
          checks.setAttribute("data-complete", "1");
        } else {
          checks.classList.remove("check-background");
          checks.innerHTML =
            `
                <img src="" width="20">
              `
          checks.setAttribute("data-complete", "0");
        }
      }
  
      const setCompleteTask = () => {
        const input = document.getElementById("input-task");
        const check = document.querySelector(".check");
        let a = check.getAttribute("data-complete");
        input.focus()
        setCheck(a)
      }
  
      const handlesubmit = (event) => {
        const idTasks = document.getElementById("input-task");
        const check = document.querySelector(".check");
        let isComplete = check.getAttribute("data-complete");
        event.preventDefault()
        let task = {
          id: tasks.length + 1,
          name: idTasks.value,
          completed: isComplete == "1" ? true : false
        }
        tasks.push(task);
        getTask()
        setCheck("1");
        idTasks.value = "";
      }
  
      const deleteTask = (id) => {
        let newTask = tasks.filter(x => { return x.id != id });
        tasks = newTask;
        getTask();
      }
  
      const option = (opt) => {
        switch (opt) {
          case "all":
            sessionStorage.setItem("filter", JSON.stringify("all"));
            break
          case "active":
            sessionStorage.setItem("filter", JSON.stringify(false));
            break
          default:
            sessionStorage.setItem("filter", JSON.stringify(true));
            break;
        }
        getTask()
      }
  
      const setComplete = (complete, id) => {
        const total = document.querySelectorAll(".total");
        const myList = document.querySelectorAll(".mylist");
        let newTask = tasks.map(x => {
          return id === x.id ? { ...x, completed: !complete } : x
        });
        tasks = newTask
        getTask()
      }
      const clearCompleted = () => {
        let newTask = tasks.filter(x => {
          return !x.completed
        })
        tasks = newTask;
        getTask()
      }
  