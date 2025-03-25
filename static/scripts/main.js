function main () {
    init()
    styleSearch()

    let search = document.querySelectorAll('.search')
    let switches = document.querySelectorAll(".form-check-input")

    switches = Array.from(switches)
    search.forEach((input, index) => input.addEventListener("input", () => {
        let searchSymb = document.getElementById("searchSymb" + input.id)
        searchSymb.style.opacity = input.value ? "0" : "0.5"
        
        if (switches[index + 1]?.checked)
            
            fetchAutoComplete(input, "api/data").then(response => response.json()).then(data => {
                SUG = data?.SUG

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
    let input = document.getElementById("ingredients")

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
    let search = document.querySelectorAll(".search")

    switches = Array.from(switches)
    search = Array.from(search)

    const handleSwitch = (sw, index, open) => {
        let exDiv = search[index]?.parentElement
        if (exDiv){
            sw.checked = open
            exDiv.style.display = sw.checked ? "block" : "none"
        }
    }

    let nb = 0
    
    switches.forEach((sw, index) => {
        sw.addEventListener("change", () => {

            if (index == 0) {
                switches.forEach((sw, index) => {
                    handleSwitch(sw, index - 1, switches[0].checked)
                    nb = sw.checked ? 4 : 0
                })
                return;
            }
            nb += sw.checked && index ? 1 : -1
            
            if (nb > 1)   
                switches[0].checked = true
            else switches[0].checked = false
            
            console.log(nb)
            
            handleSwitch(sw, index - 1, sw.checked)
        })
    })

}

const init = () => {
    let search = document.querySelectorAll(".search")
    search.forEach(input => {
        exDiv = input.parentElement
        exDiv.style.display = "none"
    })
}