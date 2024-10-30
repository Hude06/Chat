let preferences = Capacitor.Plugins.Preferences;
let user = (await preferences.get({ key: "user" })).value;
let userDIV = document.getElementById("users");
let parsed = JSON.parse(user);
// console.log(parsed)
let contacts = parsed.current_messages

let contactsPUSHED = []
console.log(contacts,contacts.length)
for (let i = 0; i < contacts.length; i++) {
    console.log("Contact",contacts[i])
    if (contactsPUSHED.includes(contacts[i].sender.sender_id)) {
        console.log("Already pushed")
    } else {
        userDIV.appendChild(createContactDiv(contacts[i].sender.sender_id));
        contactsPUSHED.push(contacts[i].sender.sender_id)
    }
}
// let contacts = localStorage.getItem("contacts");
function createContactDiv(username) {
    let contactDiv = document.createElement("div");
    contactDiv.className = "card";
    contactDiv.id = "contact";
    let user = document.createElement("i");
    user.className = "bi bi-person-circle";
    let usernameDIV = document.createElement("p");
    usernameDIV.innerHTML = username;
    contactDiv.appendChild(usernameDIV);
    contactDiv.appendChild(user);
    user.addEventListener("click", () => {
        console.log("clicked")
        window.location.href = "./index.html?username=" + username;

    })
    return contactDiv;
}
