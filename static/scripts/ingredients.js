function main () {
    let search = document.getElementById('ingredients')
    search.value = "";
    search.addEventListener("input", () => {
        let searchSymb = document.getElementById("searchSymb")
        searchSymb.style.opacity = search.value ? "0" : "0.5"

        SuggestionsByIngredients()
    })

 
}

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
            <div class="suggestions container-block col-md-4"><div class="well">#${ingredients}<img src="${recipe.image}">${recipe.title}</div></div>
        `
    }
}

const verifyObject = obj => obj && obj !== "null" && obj !== "undefined" && Object.keys(obj).length > 0