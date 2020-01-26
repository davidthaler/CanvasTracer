const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const PORT = 8000
const app = express()

app.use(morgan('tiny'))
app.use(express.static(__dirname + '/static'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.redirect(303, '/MobileCanvas.html')
})

app.post('/data', (req, res) => {
    console.log(JSON.stringify(req.body))
    res.send('data received')
})

app.use(function(req, res){
    res.status(404)
    res.send('Resource not found.')
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Server Error.')
  })

app.listen(PORT, () => console.log('listening on ' + PORT))
