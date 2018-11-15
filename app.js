const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const router = express.Router()
const config = require('./config')
const tokenList = {}
const app = express()

router.get('/', (req, res) => {
    let response = {
        'message': 'You just found the API root.'
    }
    res.status(200).json(response);
})

router.post('/login', (req, res) => {
    const postData = req.body;
    const user = {
        "email": postData.email,
        "name": postData.name
    }
    // do the database authentication here, with user name and password combination.
    const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife })
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife })
    const response = {
        "status": "Logged in",
        "token": token,
        "refreshToken": refreshToken,
    }
    tokenList[refreshToken] = response
    res.status(200).json(response);
})

router.post('/refresh-token', (req, res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife })
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);
    } else {
        res.status(406).json({ message: 'Invalid request.' })
    }
})

router.use(require('./tokenChecker'))
// all secured routes under /api/ go after this point

router.get('/secure', (req, res) => {
    res.send('If you are reading this you are secured.')
})

app.use(bodyParser.json())

app.use('/api', router)

//Anything that doesn't match at root level goes here
app.use(function (req, res, next) {
    return res.status(404).json({ message: 'Not found.' });
});

app.listen(config.port || process.env.port || 3000);
console.log('Server started at port '+config.port || process.env.port || 3000);