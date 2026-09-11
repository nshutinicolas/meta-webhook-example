import express, {} from 'express';
const app = express();
app.use(express.json());
const port = Number(process.env.PORT) || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
app.get('/', (req, res) => {
    const mode = typeof req.query['hub.mode'] === 'string' ? req.query['hub.mode'] : undefined;
    const challenge = typeof req.query['hub.challenge'] === 'string' ? req.query['hub.challenge'] : undefined;
    const token = typeof req.query['hub.verify_token'] === 'string' ? req.query['hub.verify_token'] : undefined;
    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge ?? '');
        return;
    }
    res.status(403).end();
});
app.post('/', (req, res) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n\nWebhook received ${timestamp}\n`);
    console.log(JSON.stringify(req.body, null, 2));
    res.status(200).end();
});
app.listen(port, () => {
    console.log(`\nListening on port ${port}\n`);
});
//# sourceMappingURL=app.js.map