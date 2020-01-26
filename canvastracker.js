const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const PORT = 8000
const app = express()

app.listen(PORT, () => console.log('listening on ' + PORT))
