
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");

const filterInput = document.querySelector("#todoSearch");

const categoryIcons = {
    care: "fa-magic",
    urgent: "fa-exclamation",
    work: "fa-briefcase",
    housework: "fa-home",
    hobby: "fa-paint-brush",
    shopping: "fa-shopping-bag",
    remainder: "fa-bell"
};

let todos = [];
let todo={
    text:" " ,
    category: ""
}


runEvents();

 
function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded",pageLoaded);
    secondCardBody.addEventListener("click",clickFunction);
    clearButton.addEventListener("click",allTodosEverywhere);
    filterInput.addEventListener("keyup",filter);
}

function pageLoaded(){
    checkTodosFromStorage();
    todos.forEach(function(todo)
    {
       addTodoToUI(todo);
    });
}

function filter(e){
    const filterValue = e.target.value.toLowerCase().trim();
    const todoListesi = document.querySelectorAll(".list-group-item");
    
    if(todoListesi.length>0){
        todoListesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                //
                todo.setAttribute("style","display : block");
            }else{
                todo.setAttribute("style","display : none !important");
            }
        });

    }else{
        showAlert("warning","Filtreleme yapmak için en az bir todo olmalıdır!");
    }

}

function allTodosEverywhere(){
   
   const todoListesi = document.querySelectorAll(".list-group-item");
   if(todoListesi.length>0){
    //Ekrandan Silme
    todoListesi.forEach(function(todo)
    {
        todo.remove();
    });

    //Storage'dan Silme
    todos=[];
    localStorage.setItem("todos",JSON.stringify(todos));
    showAlert("success","Başarılı bir şekilde silindi");
   }
   else
   {
    showAlert("warning","Silmek için en az bir todo olmalıdır");
   }
}

function clickFunction(e)
{
    if(e.target.type=="checkbox")
    {
        const checkbox=e.target;
        const parent=checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        const text= parent.children[1].querySelector('p');
        if (checkbox.checked) {
            text.style.textDecoration = 'line-through';
        }
        else 
        {
            text.style.textDecoration = 'none';
        }
    }
    else if(e.target.type=="button"){


        removeTodoToUI(e);
    }
}

function removeTodoToUI(e){

    const rowparent=  e.target.parentElement.parentElement;
  
    const sibling= rowparent.children[1];
   // p etiketi içeriyorsa onun ilk çocuk öğesine (yani p etiketine) erişiyoruz
    const pElement = sibling.querySelector('p');

  // p etiketinin metin içeriğini almak için textContent kullanıyoruz
    const siblingText = pElement.textContent;



    const parentElement=rowparent.parentElement.parentElement.parentElement.parentElement;
   const todo = parentElement;
  

   todo.remove();
  
   removeTodoToStorage(siblingText);
   showAlert("success","Todo başarıyla silindi.");
    
   
    
}

function removeTodoToStorage(removeTodo){
    checkTodosFromStorage();
    todos = todos.filter(function(todo) {
        return todo.text !== removeTodo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(e) {
    e.preventDefault(); 
    const inputText = addInput.value.trim();
    const selectedCategory = document.getElementById("form-select").value;
    
   
    if (inputText == null || inputText == "") {
        showAlert("warning", "Lütfen boş bırakmayınız!");
    } else {
        const newTodo = {
            text: inputText,
            category: selectedCategory
        };
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo Eklendi.");
        addInput.value="";
    }

 
}

function addTodoToUI(todo) {
    const iconClass = categoryIcons[todo.category];
    const li = document.createElement("li");
    li.className="list-group-item";

    li.innerHTML = `
        <div class="${todo.category} row ms-2 mt-3">
            <div class="toast d-flex align-items-center border-0">
                <div class="toast-body">
                    <div class="toast-body2 align-items-center font-medium">
                        <div class="row">
                            <div class="col-1 me-2">
                                <div class="row">
                                    <div class="col-2 d-flex align-items-center">
                                        <span class="icon input-group-text">
                                            <i class="fa ${iconClass}"></i>
                                        </span>
                                    </div>
                                    <div class="col-1 ms-4 d-flex align-items-center">
                                        <div class="checkbox-wrapper-33">
                                            <label class="checkbox">
                                                <input class="checkbox__trigger visuallyhidden" type="checkbox">
                                                <span class="checkbox__symbol">
                                                    <svg aria-hidden="true" class="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4 14l8 7L24 7"></path>
                                                    </svg>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="listText col d-flex align-items-center">
                                <p>${todo.text}</p>
                            </div>
                            <div class="col-1 d-flex align-items-center">
                                <button type="button" class="btn-close ms-auto me-2 d-flex align-items-center" data-bs-dismiss="toast" aria-label="Close">
                                    <i data-feather="x" class="feather-sm fill-white text-info"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    todoList.appendChild(li);
  
}

function addTodoToStorage(newTodo,selectedCategory) {
    checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function checkTodosFromStorage() {
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

function showAlert(type, message) {
    /*
    <div class="alert alert-warning" role="alert">
    This is a warning alert—check it out!
  </div>*/
    const div = document.createElement("div");
    //   div.className="alert alert-"+type;
    div.className = `alert alert-${type}`; //litirel template
    div.textContent = message;

    firstCardBody.appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);
}