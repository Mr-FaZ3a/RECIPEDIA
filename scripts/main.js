function main () {
    let search = document.getElementById('ingredients')
    search.addEventListener("input", () => {
        let searchSymb = document.getElementById("searchSymb")
        if (search.value == "")
            searchSymb.style.opacity = "0.5"
        else 
            searchSymb.style.opacity = "0"
    })
}

window.onload = main

console.log("hell world")