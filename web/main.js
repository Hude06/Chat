let supabase2 = null
try {
    const { createClient } = supabase;
    supabase2 = createClient('https://dvlfunioxoupyyaxipnj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bGZ1bmlveG91cHl5YXhpcG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczODE2MzIsImV4cCI6MjA0Mjk1NzYzMn0.Tyqzm6kKzVZqnBDYN69Pb3fcwkSRcA4zUb6QSO0I6gY'); // Replace with your actual anon key
    console.log("passed")
} catch {
    alert ("No Internet Connection")
    throw new Error("No Internet")
}
function getQueryParams(pram) {
    const params = new URLSearchParams(window.location.search);
    const temp = params.get(pram); // Gets the value of 'name'
    console.log(temp)
    return temp;
}

class Base64 {
    constructor() {
    }
    toBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    toArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
class MessagingService {
    constructor() {
        this.Preferences = Capacitor.Plugins.Preferences;
        this.PushNotifications = Capacitor.Plugins.PushNotifications;
    }
    init() {
        // this.PushNotifications.requestPermissions().then(result => {
        //     if (result.receive === 'granted') {
        //       PushNotifications.register();
        //     } else {
        //       console.error('Push notification permission denied');
        //     }
        //   });
    }
    async submitMessage(Table, MessageEncrypted,sender_id,Public_Key,sendingto) {
        const { error } = await supabase2
        .from(Table) // Replace with your table name
        .insert({ created_at: Date.now, sender_id: sender_id, SendingTo:sendingto, encrypted_message:MessageEncrypted, public_key:Public_Key  }) // Replace with your column names and values;
        if (error) {
            console.error('Error submitting message:', error);
        }
    }
    async createMessage(msg,userSendingTo,public_key) {
        let userID = parseMessageUserID(await fetchMessage("Users","User_id"))
        let publicKeys = await fetchMessage("Users","Public_Key")
    try {
        for (let i = 0; i < userID.length; i++) {
            if (userID[i] === userSendingTo) {
                    console.log(msg,publicKeys[i].Public_Key)
                    let encryptedMessage = await encryption.encryptData((publicKeys[i].Public_Key), msg);
                    console.log("Got to here",encryptedMessage)
                    await this.submitMessage('Messages',base64.toBase64(encryptedMessage),user.userid,base64.toBase64(public_key),userSendingTo);
                    console.log("Message Sent",true)
                }
            }
        } catch {
            throw new Error("Something wrong")  
        
        }
    }
    createMessageDiv(msg,user) {
        console.log(user)
        let messageDIV = document.createElement("div");
        let p2 = document.createElement("p"); 
        p2.innerHTML = "" + user
        messageDIV.appendChild(p2)
        let p = document.createElement("p");
        p.innerHTML = msg;
        messageDIV.className = "card"
        messageDIV.appendChild(p);
        document.getElementById("messages").appendChild(messageDIV);
    }
}
class Encryption {
    constructor() {

    }
    async generateAndExportKeyPair() {
        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );
    
        try {
            const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
            const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
    
            return {
                publicKey: exportedPublicKey,
                privateKey: exportedPrivateKey,
            };
        } catch (error) {
            console.error("Key export failed:", error);
            throw new Error("Failed to export the keys.");
        }
    }
    generateRandomString(length) {
        if (length < 1) return '';
    
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
    
        return randomString;
    }
    async importPublicKey(exportedKey) {
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
    async encryptData(publicKeyBase64, tempData) {
        console.log("Trying to encrypt")
        const publicKeyBuffer = base64.toArrayBuffer(publicKeyBase64); // Convert base64 to ArrayBuffer
        console.log("Trying to encrypt2")
        const publicKey = await this.importPublicKey(publicKeyBuffer); // Import the key properly
        const encodedData = new TextEncoder().encode(tempData); // Encode the data
        console.log("Got to here 2")
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            publicKey, // The public key
            encodedData // Data to encrypt
        );
    
        return encryptedData; // Return the encrypted data
    }
    async decryptData(privateKeyBase64, encryptedMessage) {
        try {
            const privateKeyBuffer = base64.toArrayBuffer(privateKeyBase64);
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
            // console.log("Decrypted message buffer:", new TextDecoder().decode(decryptedMessage));
            return new TextDecoder().decode(decryptedMessage);
    
        } catch (error) {
            throw new Error("Decryption failed: " + error.message);
        }
    }
}
let base64 = new Base64();
let messagingService = new MessagingService();
messagingService.init();
let encryption = new Encryption();
let contacts = []
let user2_ID = (getQueryParams("username"));
console.log(user2_ID)
class GlobalDIV {
    constructor() {
        this.send_button = document.getElementById("send")
        this.clearButton = document.getElementById("clear")
    }
    eventListeners() {
        this.clearButton.addEventListener("click", async function(e) {
            await messagingService.Preferences.clear();
            location.reload();
        })
        document.getElementById("messageForm").addEventListener("submit", async function(e) {
            e.preventDefault();
            let message = document.getElementById("messageInput").value
            if (user2_ID === null) {
                console.log("true")
                user2_ID = prompt("Enter the user ID you want to send the message to")
            }
            document.getElementById("messageInput").value = ""
            await messagingService.createMessage(message,user2_ID,user.publickey)
            await messagingService.createMessage(message,user.userid,user.publickey)
        });        
        this.send_button.addEventListener("click", async (e) => {
            e.preventDefault();
            let message = document.getElementById("messageInput").value
            if (user2_ID === null) {
                user2_ID = prompt("Enter the user ID you want to send the message to")
            }
            document.getElementById("messageInput").value = ""
            if (user2_ID === null || user2_ID === undefined || user2_ID === "" || user2_ID === "null") {
                console.log("Not submited")
            } else {
                await messagingService.createMessage(message,user2_ID,user.publickey)
                await messagingService.createMessage(message,user.userid,user.publickey)
            }
           
        })
    }
}
export function parseMessageUserID(data) {
    let temp = []
    for (let i = 0; i < data.length; i++) {
        let newData = data[i]
        if (newData.User_id === null || newData.User_id === undefined || newData.User_id === "" || newData.User_id === "null"){
        } else {
            temp.push(newData.User_id)
        }
    }
    return temp

}
export async function fetchMessage(Table, column) {
    const { data, error } = await supabase2
        .from(Table) // Replace with your table name
        .select(column) // Replace with your column names

    if (error) {
        console.error('Error fetching messages:', error);
        return;
    }
    return data
}
export async function createUser(UserId, publicKey, email,supabase) {
    const { error2 } = await supabase
    .from("Users") 
    .insert({
      Public_Key: base64.toBase64(publicKey),
      User_id: UserId,
      email: "user"
    });    
}
let globals = new GlobalDIV()
globals.eventListeners()
class UserInfo {
    constructor(keys) {
        this.keys = keys
        this.userid = encryption.generateRandomString(10)
        this.publickey = null
        this.privatekey = null
        this.username = null
        this.current_messages = []
    }
    init = async function() {
        this.keys = await encryption.generateAndExportKeyPair();
        this.publickey = this.keys.publicKey
        this.privatekey = this.keys.privateKey
        await createUser(this.userid, this.publickey,"User",supabase2)
    }
    async update() {
        let userid = await fetchMessage("Messages", "SendingTo");
        let messages = await fetchMessage("Messages", "encrypted_message");
        let sender = await fetchMessage("Messages", "sender_id");
        console.log("Ran1");
        for (let i = 0; i < userid.length; i++) {
            if (userid[i].SendingTo === user.userid) {
                let decryptedMessage = await encryption.decryptData(
                    base64.toBase64(user.privatekey),
                    base64.toArrayBuffer(messages[i].encrypted_message)
                );
    
                // Check if the decrypted message already exists
                let messageExists = this.current_messages.some(msg => msg.message === decryptedMessage);
    
                if (messageExists) {
                    console.log("Message already exists");
                    // You can choose to update any necessary state here instead of returning
                    continue; // Skip to the next iteration
                }
    
                // If the message does not exist, proceed to create it
                messagingService.createMessageDiv(decryptedMessage, sender[i].sender_id);
                let message = {
                    sender: sender[i],
                    message: decryptedMessage,
                    timestamp: Date.now()
                };
    
                this.current_messages.push(message);
                this.publickey = base64.toBase64(this.publickey);
                this.privatekey = base64.toBase64(this.privatekey);
    
                if (this.publickey && this.privatekey) {
                    messagingService.Preferences.set({ key: "user", value: JSON.stringify(user) });
                }
    
                this.publickey = base64.toArrayBuffer(this.publickey);
                this.privatekey = base64.toArrayBuffer(this.privatekey);
            }
        }
    
        console.log("Checking");
        setTimeout(() => this.update(), 2000);
    }
    
    
}
let user = null

if ((await messagingService.Preferences.get({ key: "user" })).value !== undefined && ((await messagingService.Preferences.get({ key: "user" })).value !== null)) {
    let temp = JSON.parse((await messagingService.Preferences.get({ key: "user" })).value);
    user = new UserInfo();
    user.userid = temp.userid;
    user.publickey = base64.toArrayBuffer(temp.publickey);
    user.privatekey = base64.toArrayBuffer(temp.privatekey);
    user.current_messages = temp.current_messages;
    console.log("New user is ",user)
    
} else {
    user = new UserInfo();
    await user.init();
    let tempPublic = base64.toBase64(user.publickey)
    let tempPrivate = base64.toBase64(user.privatekey)
    let user2 = user
    user2.publickey = tempPublic
    user2.privatekey = tempPrivate
    await messagingService.Preferences.set({ key: "user", value: JSON.stringify(user2) });

    user2.publickey = base64.toArrayBuffer(user2.publickey)
    user2.privatekey = base64.toArrayBuffer(user2.privatekey)
}
function loop() {
    if (document.activeElement === document.getElementById("messageInput")) {
        document.getElementById("bar").style.display = "none"
    } else {
        document.getElementById("bar").style.display = "flex"
    }
    requestAnimationFrame(loop)
}
document.getElementById("usernameIS").innerHTML = "Friend Code - " + user.userid
async function init() {
    await user.update();
    loop();
    if ((await messagingService.Preferences.get({ key: "user" })).value !== undefined && ((await messagingService.Preferences.get({ key: "user" })).value !== null)) {
        let temp = JSON.parse((await messagingService.Preferences.get({ key: "user" })).value);
            for (let i = 0; i < temp.current_messages.length; i++) {
                // messagingService.createMessageDiv(temp.current_messages[i].message,temp.current_messages[i].sender) 
                messagingService.createMessageDiv(temp.current_messages[i].message,temp.current_messages[i].sender.sender_id)
            }
        }
}
init();