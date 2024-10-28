import { generateRandomString,generateAndExportKeyPair,arrayBufferToBase64,base64ToArrayBuffer,encryptData,submitMessage,parseMessageUserID,fetchMessage,supabase2,createUser,decryptData } from "../main.js"

class UserInfo {
    constructor(keys) {
        this.keys = keys
        this.userid = generateRandomString(10)
        this.publickey = null
        this.privatekey = null
    }
    init = async function() {
        console.log("Unit Test Started",true)
        this.keys = await generateAndExportKeyPair();
        this.publickey = this.keys.publicKey
        this.privatekey = this.keys.privateKey
        await createUser(this.userid, this.publickey,"UnitTest1",supabase2)
        console.log("Unit Test Finished",true)

    }
}
function Test64() {
    let data = "Hello, world!";
    const encoder = new TextEncoder();
    const arrayBuffer = encoder.encode(data).buffer; 
    let base64 = arrayBufferToBase64(arrayBuffer);
    let newBuffer = base64ToArrayBuffer(base64);
    const decoder = new TextDecoder();
    const decodedData = decoder.decode(newBuffer);
    console.log("Unit Test PASSED BASE64.......", data === decodedData);
}
Test64();
async function testSending() {
    console.log("Unit Test Started",true)
    let user1 = new UserInfo();
    let user2 = new UserInfo();
    await user1.init();
    let message = "Hello, world!";
    // SENDING MESSAGE FROM USER 1 TO USER 2
    //Wait for user to fully init
    
    await user2.init().finally(async () => {
        let userID = parseMessageUserID(await fetchMessage("Users","User_id"))
        let publicKeys = await fetchMessage("Users","Public_Key")
    try {
        for (let i = 0; i < userID.length; i++) {
            if (userID[i] === user2.userid) {
                if (publicKeys[i].Public_Key !== (arrayBufferToBase64(user2.publickey))) {
                    throw new Error("Unit Test FAILED.......");
                } else {
                    console.log("Part 1 Started",true)
                    let encryptedMessage = await encryptData((publicKeys[i].Public_Key), message);
                    console.log("Part 1 Middle")
                    await submitMessage('Messages',arrayBufferToBase64(encryptedMessage),"UNITTEST@test.com",(user1.publickey),user2.userid);
                    console.log("Part 1 Passed",true)
                }
                let userid = await fetchMessage("Messages","SendingTo")
                let messages = await fetchMessage("Messages","encrypted_message")
                for (let i = 0; i < userid.length; i++) {
                    if (userid[i].SendingTo === user2.userid) {
                        let decryptedMessage = await decryptData(arrayBufferToBase64(user2.privatekey), base64ToArrayBuffer(messages[i].encrypted_message));
                        if (decryptedMessage === message) {
                            console.log("Unit Test PASSED.......", true);
                            } else {
                                throw new Error("Unit Test FAILED.......");
                            }
                        }
                    }
                }
            }
        } catch {
            throw new Error("Something wrong")  
        
        }
    });
}
testSending();