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
    const button = document.createElement("button");
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4E4B45"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Zm160-240v-480 480Z"/></svg>`
    button.style.padding = 0
    button.style.paddingLeft = "3px"
    button.style.background = "none"
    button.style.border = "none"
    button.style.cursor = "pointer"

    button.addEventListener("mouseover", () => {
        button.style.filter = "brightness(0) saturate(100%) invert(85%) sepia(38%) saturate(5471%) hue-rotate(8deg) brightness(100%) contrast(114%)"
    })

    button.addEventListener("mouseout", () => {
        button.style.filter = "brightness(0) saturate(100%) invert(29%) sepia(9%) saturate(427%) hue-rotate(2deg) brightness(90%) contrast(88%)"
    })

    button.addEventListener("click", () => {
        let coppiedNum = part.closest(".p5_table_rec.datarow.p5_border_bottom.link.selectable")
        .querySelector(".p5_table_cell.p5t1_partno.cp_selectable span")

        let cleanNum = coppiedNum.innerText.replace(/\s/g, '')
        navigator.clipboard.writeText(cleanNum)
    })

    const targetElement = part.querySelector(".p5_bom_part_info_container")
    if (targetElement) {
        targetElement.style.padding = 0
        targetElement.prepend(button)
    }
};
