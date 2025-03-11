document.addEventListener("DOMContentLoaded", () => {
    //VARIABLES
    let partContainer = document.querySelector(".partnum-container")

    const resetBtn = document.getElementById("resetIcon")
    const parts = document.getElementById("partNums")

    const email = document.getElementById("email")
    const partsBtn = document.getElementById("listIcon")
    const emailBtn = document.getElementById("emailIcon")
    const emailContainer = document.getElementById("emailContainer")
    const confirmBtn = document.getElementById("confirm")
    const toInput = document.getElementById("recipient")
    const priceBtn = document.getElementById("price")
    const etaBtn = document.getElementById("eta")

    const dropdownBtn = document.getElementById("toggleOpening")
    const dropdownContent = document.getElementById("dropdown")
    const arrow = document.getElementById("arrowIcon")

    const openingInput = document.getElementById("openingInput")

    const emailCopyBtn = document.getElementById("emailCopy")
    const coppiedLabel = document.getElementById("coppied")

    const changesBtn =  document.getElementById("changesBtn")
    const changesDropDwn = document.getElementById("changesDropDwn")

    //UPDATE DISPLAY
    function updateDisplayedParts() {
        chrome.storage.local.get({ savedParts: [] }, (data) => {
            let savedParts = data.savedParts
            partContainer.innerHTML = ""
    
            if (savedParts.length > 0) {
                savedParts.forEach(part => {
                    let partDiv = document.createElement("div")
                    partDiv.classList.add("prev-partnum")
    
                    partDiv.innerHTML = `
                        <p class="partnum">${part.partNum}</p>
                        <p class="description">${part.description}</p>
                        <p class="time">${part.time}</p>`
    
                    partContainer.appendChild(partDiv)
                })
            } else {
                const message = document.createElement("h3")
                message.innerHTML = "No part numbers to show yet!"
                partContainer.appendChild(message)
            }
        })
    }

    updateDisplayedParts()

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "local" && changes.savedParts) {
            updateDisplayedParts()
        }
    })

    //Clear
    function clear() {
        chrome.storage.local.clear(() => {
            console.log("Storage cleared.")
        })
    
        // clear the display
        const partContainer = document.querySelector(".partnum-container")
        partContainer.innerHTML = ""
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", clear)
    }

    //COPY NUMBER
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("partnum")) {
            navigator.clipboard.writeText(event.target.innerText)
        }
    })

    //CHANGE PAGES
    function handlePages() {
        if (partsBtn.getAttribute("class") === "active") {
            parts.style.display = "flex"
            email.style.display = "none"
        } else {
            parts.style.display = "none"
            email.style.display = "flex"
        }
    }

    partsBtn.setAttribute("class", "active")

    function handlePageButtons(active) {
        if (active) {
            emailBtn.setAttribute("class", "active")
            partsBtn.setAttribute("class", "")
        } else {
            emailBtn.setAttribute("class", "")
            partsBtn.setAttribute("class", "active")
        }
        handlePages()
    }

    emailBtn.addEventListener("click", () =>{
        handlePageButtons(true)
        
    })

    partsBtn.addEventListener("click", () =>{
        handlePageButtons(false)

    })

    //EMAILS

        //dropdown
        function handleEmailState(state){
            if (state === "open") {
                dropdownContent.style.display = "flex"
                arrow.style.rotate = "180deg"
            } else {
                dropdownContent.style.display = "none"
            arrow.style.rotate = "0deg"
            }
        }

    dropdownBtn.addEventListener("click", () => {
        if (dropdownContent.style.display === "flex") {
            handleEmailState()
        } else {
            handleEmailState("open")
        }
    })
        //close if clicked outside
    document.addEventListener("click", (event) => {
        if (!dropdownContent.contains(event.target) && !dropdownBtn.contains(event.target)) {
            handleEmailState()
        }
    })

    //change format
    
        //variables
        let price = false
        let eta = false
        let subject = "EMPTY"
        let multi
        let Opening = "Hi"
        let recipient = ""

    const defaultEmail = document.createElement("p")
    const dropdownItems = dropdownContent.querySelectorAll("p")

        //select opening
    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            openingInput.value = item.innerHTML
            handleEmailState()
        })
    })

    function getParts() {
        chrome.storage.local.get({ savedParts: [] }, (data) => {
            let savedParts = data.savedParts
    
            let multi = savedParts.length > 1
            
            Opening = openingInput.value

            defaultEmail.innerHTML = `${Opening} ${recipient}, <br><br> Could you provide the ${subject} for the following part${multi ? "s" : ""}?`
    
            if (savedParts.length > 0) {
                savedParts.forEach(part => {

                    let partElement = document.createElement('p')
                    partElement.classList.add('part-item')
                    partElement.innerHTML = `${part.partNum}`
                    defaultEmail.appendChild(partElement)
                })
            } else {
                defaultEmail.innerHTML = "Copy a part number to get started."
            }
        })
    }

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.savedParts) {
            getParts()
        }
    })
    getParts()

    emailContainer.append(defaultEmail)

    priceBtn.addEventListener("click", () => {
        price = !price
        priceBtn.setAttribute("class", price ? "selected" : "")
    })

    etaBtn.addEventListener("click", () =>{
        eta = !eta
        etaBtn.setAttribute("class", eta ? "selected" : "")
    })

    confirmBtn.addEventListener("click", () =>{
        subject = price && eta ? "price & ETA" : price ? "price" : eta ? "ETA" : "EMPTY"
        getParts()
        recipient = `${toInput.value}`
        defaultEmail.innerHTML = `Hi ${recipient}, <br><br> Could you provide the ${subject} for the following part${multi ? "s" : ""}?`
        emailContainer.append(defaultEmail)
    })

    //copy email
    const upPos = "30"

    emailCopyBtn.addEventListener("click", () =>{
        coppiedLabel.style.translate = `0px ${upPos}px`
        navigator.clipboard.writeText(defaultEmail.innerText)
        setTimeout(function(){
            coppiedLabel.style.translate = `0px -${upPos}px`
        }, 1000)
    })

    //CHANGES DROPDOWN
    changesBtn.addEventListener("click", () =>{
        changesDropDwn.style.display = changesDropDwn.style.display === "flex" ? "none" : "flex"
    })
})