const { Preferences } = window.Capacitor.Plugins;
const { createClient } = supabase;

class Globls {
    constructor() {
        this.supabase2 = createClient('https://dvlfunioxoupyyaxipnj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bGZ1bmlveG91cHl5YXhpcG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczODE2MzIsImV4cCI6MjA0Mjk1NzYzMn0.Tyqzm6kKzVZqnBDYN69Pb3fcwkSRcA4zUb6QSO0I6gY'); // Replace with your actual anon key
        this.messages = [];
        this.sidebar = document.getElementById("sidebar");
        this.user = null;
        this.LOGOUTDIV = document.getElementById("logout")

        this.SIGNUPBUT = document.getElementById("SIGNUP")

        this.USERNAMEDIV = document.getElementById("usernameIS")

        this.CONTACTSDropDown = document.getElementById("contacts")

        this.CONTACTSDIV = document.getElementById("contacts_div")

        this.PUBKEYDIV = document.getElementById("UsersPubKey")

        this.CLEARBUTTON = document.getElementById("Clear")
        this.NEWCONTACT = document.getElementById("NEWCONTACT")
        this.contacts = []

        this.SENDBUTTON = document.getElementById("send")

    }
}   
class Contact {
    constructor(n,pub) {
        this.name = n;
        this.publicKey = pub;
        this.option = document.createElement("option");
        this.option.innerHTML = n;
    }
}
class UserInfo {
    constructor(keys) {
        this.keys = keys
        this.userid = generateRandomString(10)
        this.publickey = null
        this.privatekey = null
    }
    init = async function() {
        this.keys = await generateKeyPair();
        this.publickey = await exportKey(this.keys.publicKey, "spki", true)
        this.privatekey = await exportKey(this.keys.privateKey, "pkcs8", false)
        createUser(this.userid, this.publickey,"",globals)
    }
    save() {
        saveData("privateKey",this.privatekey)
        saveData("publicKey",this.publickey)
        saveData("userID",this.userid)
    }
}
async function updateContacts() {
    try {
        let TempContacts = await getData("contacts");
        // console.log("Removed",await Preferences.remove({ key: 'contacts' }));
        // console.log(TempContacts)
        let contacts = TempContacts ? JSON.parse(TempContacts) : [];
        // console.log(contacts)
        for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            contact.option = document.createElement("option");
            contact.option.innerHTML = contact.name;

            globals.CONTACTSDropDown.append(contact.option);
            // console.log("Valye is ",)
            // console.log("Added event Lissener")
        }
    } catch (error) {
        console.error("Error retrieving contacts:", error);
    }
}
async function newContact(name, pubKey) {
    if (!globals.CONTACTSDropDown) {
        console.error("Contact dropdown not initialized.");
        return null; // Or throw an error
    }

    let contact = new Contact(name, pubKey);
    globals.contacts.push(contact);
    globals.CONTACTSDropDown.append(contact.option);

    contact.option.addEventListener("click", function() {
        globals.PUBKEYDIV.innerHTML = contact.publicKey;
    });

    try {
        let TempContacts = await getData("contacts");
        // console.log(TempContacts)
        let contacts = TempContacts ? JSON.parse(TempContacts) : [];
        contacts.push(contact);
        saveData("contacts", JSON.stringify(contacts));
        // console.log("New Contact", JSON.parse(await getData("contacts")));
    } catch (error) {
        console.error("Error retrieving or saving contacts:", error);
    }

    return contact;
}
export async function encryptData(publicKeyBase64, tempData) {
    // console.log("Encrypting daat is",base64ToArrayBuffer(publicKeyBase64))
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64); // Convert base64 to ArrayBuffer
    const publicKey = await importPublicKey(publicKeyBuffer); // Import the key properly
    const encodedData = new TextEncoder().encode(tempData); // Encode the data
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey, // The public key
        encodedData // Data to encrypt
    );

    return encryptedData; // Return the encrypted data
}
export async function decryptData(privateKeyBase64, encryptedMessage) {
    console.log("Working")
    try {
        const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            true,
            ["decrypt"]
        );
        const decryptedMessage = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            privateKey,
            encryptedMessage
        );
        console.log("Ran")
        console.log("Decrypted message buffer:", new TextDecoder().decode(decryptedMessage));
        return new TextDecoder().decode(decryptedMessage);

    } catch (error) {
        throw new Error("Decryption failed: " + error.message);
    }
}
async function saveData(key, value) {
    try {
        await Preferences.set({
            key: key,
            value: value,
        });
        // console.log('Data saved:', key, value);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}
export async function generateKeyPair() {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048, // Length of the key in bits
            publicExponent: new Uint8Array([1, 0, 1]), // Commonly used exponent
            hash: "SHA-256", // Hash function
        },
        true, // Whether the key is extractable
        ["encrypt", "decrypt"] // Usages
    );

    return { publicKey, privateKey };
}
function updateContactListDiv() {
    globals.PUBKEYDIV.innerHTML = globals.CONTACTSDropDown.value;
    setTimeout(updateContactListDiv,500)
}
export async function exportKey(key, format,pub) {
    try {
        if (pub) {
                const exportedKey = await window.crypto.subtle.exportKey("spki", key);
                // console.log("WORKED Pub")
                return exportedKey
        } else {
                const exportedKey = await window.crypto.subtle.exportKey("pkcs8", key);
                return exportedKey
        }
    } catch (error) {
        console.error("Key export failed:", error);
        throw new Error("Failed to export the key.");
    }
}
export async function importPublicKey(exportedKey) {
    return await window.crypto.subtle.importKey(
        "spki", // Format
        exportedKey, // The exported key data
        {
            name: "RSA-OAEP",
            hash: "SHA-256", // Hash function used
        },
        true, // Whether the key is extractable
        ["encrypt"] // Usages
    );
}
async function getData(key) {
    try {
        const { value } = await Preferences.get({ key: key });
        return value;
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
}
export function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
export function base64ToArrayBuffer(base64) {
    // console.log("Base 64 is ", base64)
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
export function generateRandomString(length) {
    if (length < 1) return '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }

    return randomString;
}
export let globals = new Globls();
let session = await globals.supabase2.auth.getSession();
// let user = await (getData("user"))
if (globals.CONTACTSDropDown) {
    updateContacts();
    updateContactListDiv()
}
if (globals.NEWCONTACT) {
    globals.NEWCONTACT.addEventListener("click", async function() {
        console.log("New Contact");
        let name = prompt("Enter the contact's name:");
        let pubKey = prompt("Enter the contact's public key:");
        console.log("CLICKEDDD")
        newContact(name, pubKey);
    });
}
if (globals.CLEARBUTTON) {
    globals.CLEARBUTTON.addEventListener("click", async function() {
        const { error } = await globals.supabase2.auth.signOut()
        await Preferences.remove({ key: 'password' });
        await Preferences.remove({ key: 'username' });
        await Preferences.remove({ key: 'publicKey' });
        await Preferences.remove({ key: 'privateKey' });
        await Preferences.remove({ key: 'userID' });

        console.log("Cleared")
        console.log(error)
    })
}
if (globals.SENDBUTTON) {
    globals.SENDBUTTON.addEventListener("click", async function(e) {
        e.preventDefault();
        let tempData = document.getElementById("messageInput").value;
        let tempContact = globals.CONTACTSDropDown.value;

        try {
            for (const contact of globals.contacts) {
                if (contact.name === tempContact) {
                    console.log("Data is ", tempData);
                    console.log("Base 64 is ", base64ToArrayBuffer(globals.MYPUBLICKEY));
                    console.log("Running")
                    const encryptedMessage = await encryptData(globals.MYPUBLICKEY, tempData);
                    console.log("Encrypted Message is ", arrayBufferToBase64(encryptedMessage));
                    await submitMessage('Messages', arrayBufferToBase64(encryptedMessage), globals.CURRENTUSERID, globals.MYPUBLICKEY, contact.publicKey);
                    console.log("Sent");
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
}
if (session.data.session !== null) {
    console.log("Sesion is ",session.data.session.user.email)
    console.log(globals.CURRENTUSERID)
    globals.user = session.data.session.user.email
    if (globals.USERNAMEDIV) {
        globals.USERNAMEDIV.innerHTML = globals.user
    }
} else {
    let tempUser = await getData("username")
    let tempPass = await getData("password")
    if (tempUser && tempPass) {
        console.log("Logging in")
    }

}
if (globals.SIGNUPBUT) {
    globals.SIGNUPBUT.addEventListener("click", async function(e) {
        e.preventDefault()
        let TempEmail = await getData("username")
        let TempPass = await getData("password")
        let [email, password] = await Promise.all([TempEmail, TempPass]);
        if (email && password) {
            alert("Already signed in")
        } else {
            let emailDiv = document.getElementById("email").value
            let passwordDiv = document.getElementById("password").value
            console.log(emailDiv,passwordDiv)
            await saveData("username",emailDiv)
            await saveData("password",passwordDiv)
            await signUp(emailDiv,passwordDiv) 
        }
    })
}
if (session.data.session !== null) {
    globals.user = session.data.session.user.email;
} else {
    if (getData("username") && getData("password")) {
        let TempEmail = await getData("username")
        let TempPass = await getData("password")
        let [email, password] = await Promise.all([TempEmail, TempPass]);
        console.log(email,password)
        if (email && password) {
            await login(email,password)
        } else {
            console.log("Never loged in")
        }
    }
    console.log("No user logged in")
}
async function login(email,password) {
    const { data, error } = await globals.supabase2.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        console.error('Error logging in:', error);
        return;
    }
    globals.user = email;
    if (globals.USERNAMEDIV) {
        globals.USERNAMEDIV.innerHTML = globals.user
    }
}
// console.log(parseMessageUserID(await fetchMessage("Users","User_id")))
// let temp = await fetchMessage("Messages","SendingTo")
// console.log(temp.length)
// for (let i = 0; i < temp.length; i++) {
//     // console.log("Fetch messages is ",globals.CURRENTUSERID,temp[i].SendingTo)
//     if (temp[i].SendingTo === globals.CURRENTUSERID) {
//         // console.log("Message is for me",temp[i].SendingTo)
//         let pubkey = await fetchMessage("Users","Public_Key")
//         let msg = await fetchMessage("Messages", "encrypted_message");
//         // console.log("Fetched messages:", msg);
//         if (msg && msg[i]) {
//             let encryptedArrayBuffer = base64ToArrayBuffer(msg[i].encrypted_message);
//             // console.log("ArrayBuffer for Decryption:", encryptedArrayBuffer);
            
//             try {
//                 let decryptedMessage = await decryptData(globals.MYPRIVATEKEY, encryptedArrayBuffer);
//                 // console.log("Decrypted Message is:", decryptedMessage);
//             } catch (error) {
//                 // console.error("Error decrypting message:", error);
//             }
//         }
//     }
// }


// let encryptedMessage = await encryptData(arrayBufferToBase64(user2.publickey), message);
// await submitMessage('Messages',arrayBufferToBase64(encryptedMessage),"temp@google.com",arrayBufferToBase64(user1.publickey),user2.userid);
async function yourFunction() {
    let userid = await fetchMessage("Messages", "SendingTo");
    let messages = await fetchMessage("Messages", "encrypted_message");

    for (let i = 0; i < userid.length; i++) {
        if (userid[i].SendingTo === globals.CURRENTUSERID) {
            console.log("Message is for me", userid[i].SendingTo);
            console.log("Private key:", globals.MYPRIVATEKEY);
            console.log("Encrypted message:", messages[i].encrypted_message);

            try {
                console.log("We tried")
                let data = await decryptData(globals.MYPRIVATEKEY, base64ToArrayBuffer(messages[i].encrypted_message));
                console.log("Decrypted data:", data);
            } catch (error) {
                console.log("FAILLED")
                console.error("Decryption failed:", error);
            }
        }
    }
}
yourFunction();

export function parseMessageUserID(data) {
    let temp = []
    for (let i = 0; i < data.length; i++) {
        let newData = data[i]
        if (newData.User_id === null || newData.User_id === undefined || newData.User_id === "" || newData.User_id === "null"){
            console.log("No User ID")
        } else {
            // console.log(newData.User_id)
            temp.push(newData.User_id)
        }
    }
    return temp

}
export async function fetchMessage(Table, column) {
    const { data, error } = await globals.supabase2
        .from(Table) // Replace with your table name
        .select(column) // Replace with your column names

    if (error) {
        console.error('Error fetching messages:', error);
        return;
    }
    return data
}
// console.log("id is ",globals.CURRENTUSERID)
export async function createUser(UserId, publicKey, email,globals) {
    const { error2 } = await globals.supabase2

    .from("Users") 
    .insert({
      User_id: UserId,
      Public_Key: publicKey,
      email: email
    });
}
async function signUp(email,password) {
    // const { publicKey, privateKey } = await generateKeyPair();
    // const exportedPublicKey = await exportKey(publicKey, "spki",true);
    // const exportedPrivateKey = await exportKey(privateKey, "pkcs8",false);
    // globals.MYPUBLICKEY = arrayBufferToBase64(exportedPublicKey);
    // globals.MYPRIVATEKEY = arrayBufferToBase64(exportedPrivateKey);
    // globals.CURRENTUSERID = generateRandomString(10)
    let user = new UserInfo()
    user.init();   
    const { data, error } = await globals.supabase2.auth.signUp({
        email: email,
        password: password,
    })
        if (error) {
            console.error('Error signing up:', error);
            alert(error)
            return;
        } else {
            // console.log("Signed up","RUNNING")
            const { error2 } = await globals.supabase2

            .from("Users") 
            .insert({
              User_id: globals.CURRENTUSERID,
              Public_Key: globals.MYPUBLICKEY,
              email: email
            });
            return data, publicKey, privateKey
        }
}
export async function submitMessage(Table, MessageEncrypted,sender_id,Public_Key,sendingto) {
    const { error } = await globals.supabase2
    .from(Table) // Replace with your table name
    .insert({ created_at: Date.now, sender_id: sender_id, SendingTo:sendingto, encrypted_message:MessageEncrypted, public_key:Public_Key  }) // Replace with your column names and values;
    if (error) {
        console.error('Error submitting message:', error);
    }
}
