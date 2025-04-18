function main () {
    styleSearch()

    let search = document.querySelectorAll('.search')
    let switches = document.querySelectorAll(".form-check-input")

    switches = Array.from(switches)
    search = Array.from(search)

    search.forEach((s, index) => s.addEventListener("input", () => {
        // generate input
        let input;
        for (let i in s.children)
            if (s.children[i].tagName == "INPUT")
                input = s.children[i]
            else if (input) break

        let searchSymb = document.getElementById("searchSymb" + input.id)
        searchSymb.style.opacity = input.value ? "0" : "0.5"
        
        if (switches[index + 1]?.checked)
            
            fetchAutoComplete(input, "api/data").then(response => response.json()).then(data => {
                let SUG = data?.SUG

                const newDiv = document.createElement("div", {class: "Container-fluid Well"})

                for (object in SUG){
                    const newContent = document.createTextNode(object["title"])
                    newDiv.appendChild(newDiv)
                } 
                input.parentElement.appendChild(newDiv)

            })
            
            fetchRecipes(input, "api/auto-complete").then(response => response.json()).then(data => {
                RECIPES = data?.RECIPES
                input.style.boxShadow = verifyObject(RECIPES) ? "0 0 10px green" : "0 0 10px red"
            })


    }))

    
}

const fetchRecipes = (input, path) => fetch(path,
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

let baseURL = "https://api.spoonacular.com/recipes"

const SuggestionsByIngredients = async () => {
    const ingredient = document.getElementById("ingredients")
    const endpoint = `${baseURL}/findByIngredients`
    const param = new URLSearchParams({
        apiKey : "ca3f41f038834995add29d5032f16a23",
        ingredients : ingredient.value,
        number : 10
    })

    const response = await fetch(`${endpoint}?${param}`)

    if (!response.ok) throw new Error("Failed to fetch data")
    else {
        const data = await response.json()
        updateSuggestions(data, "Ingredients")
    }
}

const updateSuggestions = (data, type) => {
    const input = document.getElementById("ingredients")

    input.style.boxShadow = verifyObject(data) ? "0 0 10px green" : "0 0 10px red"

    const suggestions = document.getElementById("suggestions")
    suggestions.innerHTML = ""
    
    for (let recipe of data){
        suggestions.innerHTML += `
            <div class="suggestions container-block col-md-4"><div class="well">#${type}<img src="${recipe.image}">${recipe.title}</div></div>
        `
    }
}

const verifyObject = obj => obj && obj !== "null" && obj !== "undefined" && Object.keys(obj).length > 0

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
            switches[1].checked = sw.checked || switches[1].checked
            switches[2].checked = sw.checked || switches[2].checked

            switches.forEach((s, index) => inputDisplay(index - 1, s.checked))
        
        }else 
            inputDisplay(index-1, sw.checked)
    }))
}