const deleteBtn = document.querySelectorAll('.fa-trash')  //creating variables to select something from the dom to be use for event listeners
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //event listener for whenever a trash can is click implement a deleteItem Function

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})//event listener for whenever a class item or span  is click implement a markComplete Function

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})//event listener for whenever a class item or span.completed  is click implement a markUnComplete Function

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //make a delete request to the server to delete the item that is being selected for deletion
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText //getting specific item to be deleted
            })
          })
        const data = await response.json() //awaiting for backend to give okay then return to home screen 
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { //grabbing a put request to update item completion
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //this is return so they know which item is to be updated (the backend know)
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() ///wait for a okay response so that they can reload the page of the update

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grab parent of item that needs to be change
    try{
        const response = await fetch('markUnComplete', {
            method: 'put', //create a put object to give to the backend server
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //send the item that neeeds to be change
            })
          })
        const data = await response.json() //wait for a okay response so it can reload homepage
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err) //if error response console log error
    }
}