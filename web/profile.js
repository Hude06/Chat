let contacts = localStorage.getItem("contacts");
console.log(contacts);
function createContactDiv(username,publicKey) {
    let contactDiv = document.createElement("div");
    contactDiv.className = "card";
    let username = document.createElement("p");
    username.innerHTML = username;
    let publicKey = document.createElement("p");
    publicKey.innerHTML = publicKey;
    contactDiv.appendChild(username);
    contactDiv.appendChild(publicKey);
    return contactDiv;
}
