const express = require('express')
const app = express()
const port = 3000

app.use("/styles", express.static(__dirname + '/styles'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})