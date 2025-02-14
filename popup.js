document.addEventListener("DOMContentLoaded", () => {
    const resetBtn = document.getElementById("resetIcon")
    let partContainer = document.querySelector(".partnum-container")

    function clear() {
        chrome.storage.local.clear(() => {
            console.log("Storage cleared.");
        });
    
        // Clear the display (remove all items)
        const partContainer = document.querySelector(".partnum-container");
        partContainer.innerHTML = "";  // Remove all children
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", clear)
    }

    function updateDisplayedParts() {
        chrome.storage.local.get({ savedParts: [] }, (data) => {
            let savedParts = data.savedParts
            partContainer.innerHTML = ""

            savedParts.forEach(part => {
                let partDiv = document.createElement("div")
                partDiv.classList.add("prev-partnum")

                partDiv.innerHTML = `
                    <p class="partnum">${part.partNum}</p>
                    <p class="description">${part.description}</p>
                    <p class="time">${part.time}</p>`

                partContainer.appendChild(partDiv)

            })
        })
    }

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
