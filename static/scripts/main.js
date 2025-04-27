var SUG = [];
var RECIPES = [];
var lastInput ;

function main () {
    styleSearch()

    let search = document.querySelectorAll('.search')
    let switches = document.querySelectorAll(".form-check-input")
    
    switches = Array.from(switches)
    search = Array.from(search)

    search.forEach((s, index) => {
        const input = generateInput(s)
        if (input.id == "ingredients" || input.id == "cuisine"){
            s.addEventListener("input", async event => {
                console.log(event.target.id)
                await inputInputBehaviour(event, switches, index)
                generateSUG(input)

                lastInput = input.value
            })

            s.addEventListener("focusout", event => SUGListBehaviour(event, input))
        }
        else s.addEventListener("input", async event => await inputInputBehaviour(event, switches, index))
    })

    document.addEventListener("submit", event => {
        event.preventDefault()
        switches.forEach(async (sw, index) => {
            if (sw.name == "simple" && sw.checked){
                const input = generateInput(search[index-1])
                
                await fetchingPost(input, "/api/data").then(response => response.json()).then(data => generateRESULTS(data?.RECIPES));
            }
        })
    })
    document.addEventListener("reset", event => {
        const suggestions = document.getElementById("suggestions")

        RECIPES = []
        suggestions.innerHTML = ``
    })
}

const generateRESULTS = data => {
    const suggestions = document.getElementById("suggestions")

    const generate = object => {
        for (let recipe of object) {
            const newDiv = document.createElement("div")
            const image = document.createElement("img")
            const text = document.createTextNode(recipe["title"])
            
            image.loading = "lazy"
            image.src = recipe['image']
            
            newDiv.className = "container-block col-md-4 suggestions"
            
            newDiv.appendChild(image)
            newDiv.appendChild(text)
            
            if (checkRecipeExistance(recipe)){
                suggestions.appendChild(newDiv)
                RECIPES.push(recipe)
            }
        }
    }

    const checkRecipeExistance = recipe => {
        for (let rec of RECIPES)
            if (recipe.id == rec.id)
                return false
        return true
    }

    try{
        for (let element in data) {
            const object = data[element]
            
            if (!(typeof object === "object")) continue 
            
            generate(object)
        }
    }
    catch{
        generate(data)
    }
}


const SUGListBehaviour = (event, input) => {
    const list = document.getElementById(`${input.id}-sug`)

    let item = event.explicitOriginalTarget
    item = event.explicitOriginalTarget?.classList ? item : item.parentNode

    if (item?.classList.contains(`${input.id}-item`))
        input.value = item.innerHTML

    SUG = []

    list.innerHTML = ``
}

const generateInput = search => {
    for (let element in search.children)
        if (search.children[element].tagName == "INPUT")
            return search.children[element]
}

const generateSUG = (input) => {
    const key = input.id
    const list = document.getElementById(`${key}-sug`)
   
    list.innerHTML = ``

    for (let i of SUG[key]){
        const index = input.value.lastIndexOf(",")
        const item = document.createElement("li")

        let string = input.value.substring(0, index)
        if (string) 
            string += ", " 
        string += (i.name ? i.name : i.title)

        const text = document.createTextNode(string)

        item.className = `list-group-item list-group-item-action ${key}-item`

        item.appendChild(text)
        list.appendChild(item)
    }
}

const inputInputBehaviour = async (event, switches, index) => {
    const input = event.target

    let searchSymb = document.getElementById("searchSymb" + input.id)
    searchSymb.style.opacity = input.value ? "0" : "0.5"
    
    if (switches[index + 1]?.checked)
        return await fetchingPost(input, "/api/auto-complete").then(response => response.json()).then(data => SUG = data?.SUG )
}

const fetchingPost = async (input, path) => await fetch(path, 
    {
        method: "POST",
        headers: {
            "Accept" : "application/json",
            "Content-Type": "application/json"
        },
        body : JSON.stringify({[input.name] : input.value})
    }
)

window.onload = main

const styleSearch = () => {
    let switches = document.querySelectorAll(".form-check-input")
    let inputs = document.querySelectorAll(".search")

    switches = Array.from(switches)
    inputs = Array.from(inputs)

    const inputDisplay = (index, display) => index > -1 ? inputs[index].style.display = display ? "block" : "none" : null 

    let complexMode = false

    switches.forEach((sw, index) => sw.addEventListener("change", () => {
        if (sw.name == "complex") {
            complexMode = !complexMode
            switches.forEach((s, index) =>{
                s.checked = complexMode;
                inputDisplay(index-1, complexMode) 
            })
        }else if (sw.id == "enable-cuisine") {
            switches[0].checked = sw.checked
            
            inputDisplay(index - 1, sw.checked)
        }else
            inputDisplay(index-1, sw.checked)
    }))
}

document.addEventListener("click", event => {
    let list ;
    let li ;
    if (event.target.tagName == "LI"){
        li = event.target
        list = event.target.parentElement
    }
    else{
        const list1 = document.getElementById("ingredients-sug")
        const list2 = document.getElementById("cuisine-sug")

        SUG = []
        list1.innerHTML = ``
        list2.innerHTML = ``
        return ;
    }
    
    if (li){

        const id = list.id.substring(0, list.id.indexOf("-"))
        const input = document.getElementById(id)

        input.value = li.innerText
        list.innerHTML = ``

        SUG = []
    }
})
