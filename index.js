import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue,remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-5aec1-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl=document.getElementById("shopping-list")

onValue(shoppingListInDB, function(snapshot) {

    let itemsArray=Object.values(snapshot.val())
    clearshoppingListEl()

    for(let i=0;i<itemsArray.length;i++){
        let currentItem=itemsArray[i]
        appendItemToShoppingListEl(currentItem)
    }


})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue) //push to db
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    let snapBool=snapshot.exists()
    if(snapBool){
        let itemsArray=Object.entries(snapshot.val())
        clearshoppingListEl()

        for(let i=0;i<itemsArray.length;i++){
            let currentItem=itemsArray[i]
            let currentValue=currentItem[1]
            let currentID=currentItem[0]
            appendItemToShoppingListEl(currentItem)
        }
    }else{
        shoppingListEl.innerHTML="No items here ... yet!"
    }


})


function clearshoppingListEl(){
    shoppingListEl.innerHTML=""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemValue=item[1]
    let itemID=item[0]

    let newListEl=document.createElement("li")
    newListEl.textContent=itemValue

    newListEl.addEventListener("click",function(){
        let exactItemLocationDB=ref(database,`shoppingList/${itemID}`)
        remove(exactItemLocationDB)
    })


    shoppingListEl.append(newListEl)


}