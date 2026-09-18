export class Message {
    id: string
    type: string
    senderPhoneNumber: string
    constructor(message: any) {
        this.id = message.id
        let messageType = message.type
        if (messageType === "interactive") {
            this.type = message.interactive.button_reply.id
        } else {
            this.type = "unknown"
        }
        this.senderPhoneNumber = message.from
    }
}
