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
indx=0;
let todos = [];
let todo={
    text:"" ,
    category: "",
    endDate: "",
    checked:false,
    index:0
    
}


function sortArray()
{
    todos.sort(function(a,b)
{
    let d1=new Date(a.endDate),
    d2=new Date(b.endDate);
    if(d1<d2)
    {
        return -1;
    }
    if(d1>d2)
    {
        return 1;
    }
    
});
console.log(todos);

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
    indx=0;
    checkTodosFromStorage();
    if(todos.length>0)
    {

             
        sortArray();
        todos.forEach(function(todo)
                {
                addTodoToUI(todo);
                });
    }
    else {
        emptyTodo();
        
    }
    

    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arasında olduğu için +1
    var day = String(today.getDate()).padStart(2, '0');
    var minDateTime = `${year}-${month}-${day}`;

    document.getElementById("endDate").setAttribute("min", minDateTime);
}
function emptyTodo()
{
    const div = document.createElement("div");
   
   
    div.className="empty-card col-md-12  ";





    div.innerHTML = `

        <div class="card-body">
            <div class="row justify-content-center ">
                <div class="col-5 m-t-30 ">
                    <h4 >YAPILICAK AKTİVİTE YOK</h4>
                   
                </div>
            </div>
        </div>
        
                           
    `;




    todoList.appendChild(div);
    
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
   
    var txt;
         if (confirm("Tüm yapılacakları silmek istediğinze emin misiniz?"))  {
         const todoListesi = document.querySelectorAll(".list-group-item");
            if(todoListesi.length>0){
                //Ekrandan Silme
                todoListesi.forEach(function(todo)
                    { 
                    todo.remove();
                    });

            //Storage'dan Silme
            todos=[];
            indx=0;
            localStorage.setItem("todos",JSON.stringify(todos));
            emptyTodo();
            showAlert("success","Başarılı bir şekilde silindi");
             }
             else
            {
                showAlert("warning","Silmek için en az bir todo olmalıdır");
            }

        }
        
        else {
            showAlert("warning","Silme işlemi iptal edildi");
        }
   
}

function clickFunction(e)
{
    
    if(e.target.type=="checkbox")
    {
    
        const index = Number(e.target.className[0]);

        // Todo öğesini bulun
        const eleman = todos.find(todo => todo.index === index);


        const checkbox=e.target;
        const parent=checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
       
        
        const text= parent.children[1].querySelector('p');
        if (checkbox.checked) {
            eleman.checked= true;
            text.style.textDecoration = 'line-through';
        }
        else 
        {
            eleman.checked= false;
            text.style.textDecoration = 'none';
        }

        localStorage.setItem("todos", JSON.stringify(todos));
    }
    else if(e.target.type=="button"){
        var txt;
         if (confirm("Silmek istediğinze emin misiniz?"))  {
         removeTodoToUI(e);
        }
        else {
            showAlert("warning","Silme işlemi iptal edildi");
        }
  


        
    }
}

function removeTodoToUI(e){

    const rowparent=  e.target.parentElement.parentElement;
  
    const sibling= rowparent.children[1];
    const pElement = sibling.querySelector('p');

    const siblingText = pElement.textContent;



    const parentElement=rowparent.parentElement.parentElement.parentElement.parentElement;
   const todo = parentElement;

   indx--;
  

   todo.remove();
  
   removeTodoToStorage(siblingText);
   showAlert("success","Todo başarıyla silindi.");
   if(todos.length==0)
   {
    emptyTodo();
   }
    
   
    
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
    const date = document.getElementById("endDate").value;
    
    
   
    if (inputText == null || inputText == "") {
        showAlert("warning", "Lütfen boş bırakmayınız!");
    } else {
        indx++;
        const newTodo = {
            text: inputText,
            category: selectedCategory,
            endDate: date,
            index: indx,
            checked:false
        };
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo Eklendi.");
        addInput.value="";
        
    }

 
}

function addTodoToUI(todo) {
   if(todos.length==0)
   {
    const removeElement=todoList.querySelector(".empty-card ");
    const removeParent=removeElement.parentNode;
    removeParent.removeChild(removeElement);
   }
    const iconClass = categoryIcons[todo.category];
    const li = document.createElement("li");
    const idx= todo.index;

    

    li.className="list-group-item ";
    li.setAttribute("draggble","true");
    li.innerHTML = `
        <div class="${todo.category} row ms-2 mt-3">
            <div class="toast d-flex align-items-center border-0">
                <div class="toast-body">
                    <div class="toast-body2 font-medium">
                        <div class="row todo-context">
                            <div class="col-1 me-2">
                                <div class="row">
                                    <div class="col-2 d-flex align-items-center">
                                        <span class="icon input-group-text">
                                            <i class="fa ${iconClass}"></i>
                                        </span>
                                    </div>
                                    <div class="col-1 ms-4 d-flex align-items-center">
                                        <div class="checkbox-wrapper-33">
                                            <label class="checkbox  ">
                                                <input class="${idx} checkbox__trigger visuallyhidden" type="checkbox">
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
                            <div class="col-9">
                                <div class="row">
                                    <div class="todoText col-12 d-flex align-items-center">
                                        <p>${todo.text}</p>
                                    </div>
                                    <div  class="todoDate col-3">
                                        <p>End date: ${todo.endDate}</p>
                                    </div>
                                </div>

                            </div>
                    
                            <div class="col-1 remove-todo d-flex align-items-center ">
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


    const text=li.querySelector('p');
    const checkbox=li.querySelector('input');
 
    if(todo.checked==true)
    {
        checkbox.checked=true;

        text.style.textDecoration = 'line-through';


    }
    else 
    {
        checkbox.checked=false;
        text.style.textDecoration = 'none';
    }
    todoList.appendChild(li, todoList.firstChild);

}

function addTodoToStorage(newTodo) {
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
 
    const div = document.createElement("div");
    div.className = `alert alert-${type}`; 
    div.textContent = message;

    firstCardBody.appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);
}

