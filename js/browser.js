const { ipcRenderer, shell } = require("electron");

var li_list = [];

ipcRenderer.on("url", (event, pid, id, arg, arg1) => {
    if (arg == "new") {
        new_tab(pid, id, arg1);
    } 
     if (arg == "title") {
        title(pid, id, arg1);
    } 
    if (arg == "icon") {
        icon(pid, id, arg1);
    }
});

function new_tab(pid, id, url) {
    var li = document.getElementById("tab").cloneNode(true);
    li_list.push(li);
    li.style.display = "flex";
    li.setAttribute("data-url", url);
    li.querySelector("span").onclick = () => {
        ipcRenderer.send("tab_view", pid, id, "top");
        focus_tab(li);
    };
    var button = li.querySelector("button");
    button.onclick = () => {
        ipcRenderer.send("tab_view", pid, id, "close");
        var l = document.querySelectorAll("li");
        for (i in li_list) {
            if (li_list[i] === li) {
                if (i == 0) {
                    focus_tab(li_list[1]);
                } else {
                    focus_tab(li_list[i - 1]);
                }
                li_list.splice(i, 1);
            }
        }
        document.getElementById("tabs").removeChild(li);
    };
    document.getElementById("tabs").appendChild(li);
    focus_tab(li);
    li.id = "id" + id;
}

function focus_tab(li) {
    var l = document.querySelectorAll("li");
    for (i of l) {
        if (i === li) {
            i.classList.add("tab_focus");
        } else {
            i.classList.remove("tab_focus");
        }
    }
    for (j in li_list) {
        if (li_list[j] === li) {
            li_list.splice(j, 1);
            li_list.push(li);
        }
    }
}

function title(pid, id, arg) {
    document.querySelector(`#id${id} > span`).innerHTML = arg;
}

function icon(pid, id, arg) {
    document.querySelector(`#id${id} > img`).src = arg[0];
}

ipcRenderer.on("open_in_browser", () => {
    var url = document.querySelector(".tab_focus").getAttribute("data-url");
    shell.openExternal(url);
});