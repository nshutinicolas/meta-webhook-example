import express, { type Request, type Response } from 'express'
import crypto from 'crypto'
import { Conversation } from './services/conversations.js'
const app = express()

app.use(express.json())

const port = Number(process.env.PORT) || 3000
const verifyToken = process.env.VERIFY_TOKEN

app.get('/', (req: Request, res: Response) => {
    const mode = typeof req.query['hub.mode'] === 'string' ? req.query['hub.mode'] : undefined
    const challenge = typeof req.query['hub.challenge'] === 'string' ? req.query['hub.challenge'] : undefined
    const token = typeof req.query['hub.verify_token'] === 'string' ? req.query['hub.verify_token'] : undefined

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK VERIFIED')
        res.status(200).send(challenge ?? '')
        return
    }

    res.status(403).end()
})

// Handling incoming messages
app.post('/', (req: Request, res: Response) => {
    // const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19)
    // console.log(`\n\nWebhook received ${timestamp}\n`)
    // console.log(JSON.stringify(req.body, null, 2))
    // res.status(200).end()
    console.log(req.body)
    if (req.body.object === 'whatsapp_business_account') {
        req.body.entry.forEach((entry: any) => {
            entry.changes.forEach((change: any) => {
                const value = change.value
                if (value) {
                    const senderPhoneNumberId = value.metadata.phone_number_id
                    if (value.statuses) {
                        value.statuses.forEach((status: string) => {
                            // Handle message status updates
                            Conversation.handleStatus(senderPhoneNumberId, status)
                        })
                    }
                    if (value.messages) {
                        value.messages.forEach((rawMessage: any) => {
                            // Respond to message
                            Conversation.handleMessage(senderPhoneNumberId, rawMessage)
                        })
                    }
                }
            })
        })
    }
    res.status(200).send('EVENT_RECEIVED')
})

app.listen(port, () => {
    console.log(`\nListening on port ${port}\n`);
})

const verifyRequestSignature = (req: Request, res: Response, buf: crypto.BinaryLike) => {
    const signature = req.headers["x-hub-signature-256"] as string
    if (signature === undefined) {
        console.warn(`Couldn't find "x-hub-signature-256" in headers.`)
        return
    }
    const elements = signature.split("=");
    const signatureHash = elements[1];
    const expectedHash = crypto
        .createHmac("sha256", "config.appSecret")
        .update(buf)
        .digest("hex");
    if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
    }
}

// Parse application/json. Verify that callback came from Facebook
// app.use(express.json({verify: verifyRequestSignature}))
