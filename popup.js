document.addEventListener("DOMContentLoaded", () => {
    const resetBtn = document.getElementById("resetIcon")
    let partContainer = document.querySelector(".partnum-container")

    function clear() {
        chrome.storage.local.clear(() => {
            console.log("Storage cleared.")
        });
    
        // clear the display
        const partContainer = document.querySelector(".partnum-container")
        partContainer.innerHTML = ""
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", clear)
    }

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
                });
            } else {
                const message = document.createElement("h3")
                message.innerHTML = "No part numbers to show yet!"
                partContainer.appendChild(message)
            }
        })
    }

    //COPY NUMBER
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("partnum")) {
            navigator.clipboard.writeText(event.target.innerText)
        }
    })
    updateDisplayedParts()
    

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "local" && changes.savedParts) {
            updateDisplayedParts()
        }
    })

    document.querySelectorAll(".partnum").forEach(partNum => {
        partNum.addEventListener("click", () => {
    
            let partNumberText = partNum.innerText
            navigator.clipboard.writeText(partNumberText)
        })
    })

    //CHANGE PAGES

        //containers
    const parts = document.getElementById("partNums")
    const email = document.getElementById("email")

        //btns
    const partsBtn = document.getElementById("listIcon")
    const emailBtn = document.getElementById("emailIcon")

    partsBtn.setAttribute("class", "active")

    function handlePages() {
        if (partsBtn.getAttribute("class") === "active") {
            parts.style.display = "flex"
            email.style.display = "none"
        } else {
            parts.style.display = "none"
            email.style.display = "flex"
        }
    }

    handlePages()

    emailBtn.addEventListener("click", () =>{
        emailBtn.setAttribute("class", "active")
        partsBtn.setAttribute("class", "")
        console.log(partsBtn.getAttribute("class"))
        handlePages()
    })

    partsBtn.addEventListener("click", () =>{
        emailBtn.setAttribute("class", "")
        partsBtn.setAttribute("class", "active")
        console.log(partsBtn.getAttribute("class"))
        handlePages()
    })

    //EMAILS
    const emailContainer = document.getElementById("emailContainer")
    const confirmBtn = document.getElementById("confirm")
    const toInput = document.getElementById("recipient")
    
    const priceBtn = document.getElementById("price")
    const etaBtn = document.getElementById("eta")

        //change email format
        const defaultEmail = document.createElement("p")

        //variables
        let price = false
        let eta = false
        let subject = "EMPTY"
        let multi
        let recipient = ""
        

        function getParts() {
            chrome.storage.local.get({ savedParts: [] }, (data) => {
                let savedParts = data.savedParts
        
                let multi = savedParts.length > 1
        
                defaultEmail.innerHTML = `Hi ${recipient}, <br><br> Could you provide the ${subject} for the following part${multi ? "s" : ""}?`
        
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
            subject = price && eta ? "price & ETA" : price ? "price" : eta ? "ETA" : "EMPTY";
            getParts()
            recipient = `${toInput.value}`
            defaultEmail.innerHTML = `Hi ${recipient}, <br><br> Could you provide the ${subject} for the following part${multi ? "s" : ""}?`
            emailContainer.append(defaultEmail)
        })

        //copy email
    const emailCopyBtn = document.getElementById("emailCopy")
    const coppiedLabel = document.getElementById("coppied")

    const upPos = "30"

    emailCopyBtn.addEventListener("click", () =>{
        coppiedLabel.style.translate = `0px ${upPos}px`
        navigator.clipboard.writeText(defaultEmail.innerText)
        setTimeout(function(){
            coppiedLabel.style.translate = `0px -${upPos}px`
        }, 1000)
    })
})
