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

    //copy number
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
})
