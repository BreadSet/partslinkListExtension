const observer = new MutationObserver(() => {
    Array.from(document.getElementsByClassName("p5_table_rec datarow p5_border_bottom link selectable"))
        .filter(part => !part.hasAttribute("data-mutated"))
        .forEach(part => {
            part.setAttribute("data-mutated", "true")
            addButton(part)
        })
})

observer.observe(document.body, { subtree: true, childList: true })

const addButton = (part) => {
    const btnContainer = document.createElement("div")
    btnContainer.style.width = "32px"
    btnContainer.style.height = "32px"
    btnContainer.style.display = "flex"
    btnContainer.style.justifyContent = "center"
    btnContainer.style.alignItems = "center"
    btnContainer.style.paddingTop = "5px"

    const button = document.createElement("button")
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4E4B45"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Zm160-240v-480 480Z"/></svg>`
    button.style.padding = 0
    button.style.background = "none"
    button.style.border = "none"
    button.style.cursor = "pointer"
    btnContainer.append(button)

    //hover
    button.addEventListener("mouseover", () => {
        button.style.filter = "brightness(0) saturate(100%) invert(85%) sepia(38%) saturate(5471%) hue-rotate(8deg) brightness(100%) contrast(114%)"
    })

    button.addEventListener("mouseout", () => {
        button.style.filter = "brightness(0) saturate(100%) invert(29%) sepia(9%) saturate(427%) hue-rotate(2deg) brightness(90%) contrast(88%)"
    })

    //animate button on click
    const svg = button.querySelector("svg")

    btnContainer.addEventListener("mousedown", () => {
        svg.setAttribute("height", "20px")
        svg.setAttribute("width", "20px")

        setTimeout(function(){
            svg.setAttribute("height", "24px")
            svg.setAttribute("width", "24px")
        }, 150)
    })

    button.addEventListener("click", () => {
        let copiedNum = part.closest(".p5_table_rec.datarow.p5_border_bottom.link.selectable")
            .querySelector(".cp_selectable span")
    
        let descriptionRoot = part.closest(".p5_table_rec.datarow.p5_border_bottom.link.selectable")
            .querySelector(`[class*="description"].cp_selectable span`)
    
        let cleanNum = copiedNum.innerText.replace(/\s/g, '')
        let description = descriptionRoot ? descriptionRoot.innerText : "No Description"
        let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })


        //add to storate
        chrome.storage.local.get({ savedParts: [] }, (data) => {
            let savedParts = data.savedParts

            savedParts.unshift({ partNum: cleanNum, description, time: currentTime })

            chrome.storage.local.set({ savedParts }, () => {
                console.log("Saved to chrome.storage:", savedParts)
            })
        })

        navigator.clipboard.writeText(cleanNum)
    })
    

    const targetElement = part.querySelector(".p5_bom_part_info_container")
    if (targetElement) {
        targetElement.style.padding = 0
        targetElement.prepend(btnContainer)
    }
}
