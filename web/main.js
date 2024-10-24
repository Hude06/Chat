const { createClient } = supabase;

const { Preferences } = Capacitor.Plugins;
console.log("Hello")
if (supabase === undefined) {
    alert("No Internet")
}
export let supabase2 = createClient('https://dvlfunioxoupyyaxipnj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bGZ1bmlveG91cHl5YXhpcG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczODE2MzIsImV4cCI6MjA0Mjk1NzYzMn0.Tyqzm6kKzVZqnBDYN69Pb3fcwkSRcA4zUb6QSO0I6gY'); // Replace with your actual anon key
console.log(supabase2)
async function createMessage(msg,userSendingTo,public_key) {
        let userID = parseMessageUserID(await fetchMessage("Users","User_id"))
        let publicKeys = await fetchMessage("Users","Public_Key")
    try {
        for (let i = 0; i < userID.length; i++) {
            console.log("Sending MSG to",msg, userSendingTo, "From", public_key)
            console.log(userID)
            if (userID[i] === userSendingTo) {
                console.log("CORRECT ID")
                    let encryptedMessage = await encryptData((publicKeys[i].Public_Key), msg);

                    console.log("Encrypted MESSAGE IS", encryptedMessage)
                    await submitMessage('Messages',arrayBufferToBase64(encryptedMessage),"USER@test.com",arrayBufferToBase64(public_key),userSendingTo);
                    console.log("Message Sent, From Submit Message",true)
                }
            }
        } catch {
            throw new Error("Something wrong")  
        
        }
}
class GlobalDIV {
    constructor() {
        this.send_button = document.getElementById("send")
    }
    eventListeners() {
        document.getElementById("messageForm").addEventListener("submit", async function(e) {
            e.preventDefault();
            console.log("Clicked",document.getElementById("messageInput").value)
            let message = document.getElementById("messageInput").value
            let user2_ID = prompt("Enter the user ID you want to send the message to")
            document.getElementById("messageInput").value = ""
            createMessage()
            await createMessage(message,user2_ID,user.publickey)
        });        
        this.send_button.addEventListener("click", async (e) => {
            e.preventDefault();
            let message = document.getElementById("messageInput").value
            let user2_ID = prompt("Enter the user ID you want to send the message to")
            document.getElementById("messageInput").value = ""
            createMessage()
            await createMessage(message,user2_ID,user.publickey)
           
        })
    }
}
export async function generateAndExportKeyPair() {
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
export async function submitMessage(Table, MessageEncrypted,sender_id,Public_Key,sendingto) {
    console.log("Sending to ", sendingto)
    const { error } = await supabase2
    .from(Table) // Replace with your table name
    .insert({ created_at: Date.now, sender_id: sender_id, SendingTo:sendingto, encrypted_message:MessageEncrypted, public_key:Public_Key  }) // Replace with your column names and values;
    if (error) {
        console.error('Error submitting message:', error);
    }
}
export function parseMessageUserID(data) {
    let temp = []
    for (let i = 0; i < data.length; i++) {
        let newData = data[i]
        if (newData.User_id === null || newData.User_id === undefined || newData.User_id === "" || newData.User_id === "null"){
        } else {
            // console.log(newData.User_id)
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
    console.log("WE MADE A NEW USER AND SENT TO SUPABASE",supabase,UserId,publicKey)
    const { error2 } = await supabase
    .from("Users") 
    .insert({
      Public_Key: arrayBufferToBase64(publicKey),
      User_id: UserId,
      email: "USER NOT UNIT TEST@google.com"
    });    
}
let globals = new GlobalDIV()
globals.eventListeners()
function createMessageDiv(msg,user) {
    let messageDIV = document.createElement("div");
    let message = document.createElement("p");
    message.innerHTML = msg;
    messageDIV.className = "card"
    messageDIV.appendChild(message);
    document.getElementById("messages").appendChild(messageDIV);
}
class UserInfo {
    constructor(keys) {
        this.keys = keys
        this.userid = generateRandomString(10)
        this.publickey = null
        this.privatekey = null
        this.current_messages = []
    }
    init = async function() {
        this.keys = await generateAndExportKeyPair();
        this.publickey = this.keys.publicKey
        this.privatekey = this.keys.privateKey
        await createUser(this.userid, this.publickey,"User",supabase2)
    }
    async update() {
        let userid = await fetchMessage("Messages", "SendingTo");
        let messages = await fetchMessage("Messages", "encrypted_message");
    
        for (let i = 0; i < userid.length; i++) {
            // console.log(userid[i].SendingTo, user.userid)
            if (userid[i].SendingTo === user.userid) {
                let decryptedMessage = await decryptData(arrayBufferToBase64(user.privatekey), base64ToArrayBuffer(messages[i].encrypted_message));
                console.log("Current Messages", decryptedMessage);
                // Check if the decrypted message already exists
                if (this.current_messages.includes(decryptedMessage)) {
                    console.log("No new messages");
                } else {
                    console.log("New Message");
                    createMessageDiv(decryptedMessage)
                    this.current_messages.push(decryptedMessage);
                    this.publickey = arrayBufferToBase64(this.publickey)
                    this.privatekey = arrayBufferToBase64(this.privatekey)
                    if (this.publickey && this.privatekey) {
                        Preferences.set({ key: "user", value: JSON.stringify(user) });
                    }
                    this.publickey = base64ToArrayBuffer(this.publickey)
                    this.privatekey = base64ToArrayBuffer(this.privatekey)
                }
            }
        }
    
        setTimeout(() => this.update(), 2000);
        console.log("Updated");
    }
    
}
let user = null
// await Preferences.clear();
console.log((await Preferences.get({ key: "user" })).value)
if ((await Preferences.get({ key: "user" })).value !== undefined && ((await Preferences.get({ key: "user" })).value !== null)) {
    let temp = JSON.parse((await Preferences.get({ key: "user" })).value);
    user = new UserInfo();
    user.userid = temp.userid;
    user.publickey = base64ToArrayBuffer(temp.publickey);
    user.privatekey = base64ToArrayBuffer(temp.privatekey);
    user.current_messages = temp.current_messages;
    console.log("New user is ",user)
    
} else {
    user = new UserInfo();
    await user.init();
    console.log("New USER")
    let tempPublic = arrayBufferToBase64(user.publickey)
    let tempPrivate = arrayBufferToBase64(user.privatekey)
    let user2 = user
    console.log("Saving ",tempPrivate,tempPublic)
    user2.publickey = tempPublic
    user2.privatekey = tempPrivate
    console.log("This is ",user2)
    console.log()
    await Preferences.set({ key: "user", value: JSON.stringify(user2) });

    user2.publickey = base64ToArrayBuffer(user2.publickey)
    user2.privatekey = base64ToArrayBuffer(user2.privatekey)


    console.log("Usre1 is ",user)

}
await user.update();
console.log(user)
document.getElementById("usernameIS").innerHTML = user.userid
async function init() {
    if ((await Preferences.get({ key: "user" })).value !== undefined && ((await Preferences.get({ key: "user" })).value !== null)) {
        let temp = JSON.parse((await Preferences.get({ key: "user" })).value);
            for (let i = 0; i < temp.current_messages.length; i++) {
                createMessageDiv(temp.current_messages[i])
            }
        }
}
init();