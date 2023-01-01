const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try {
        let token = req.params.token
        console.log("token", token)
        if (!token) {
            return res.status(200).send({ status: false, message: `Missing authentication token in request` });
        }

        const decoded = jwt.verify(token, 'Doctor')

        if (!decoded) {
            return res.status(200).send({ status: false, message: `Invalid authentication token in request` });
        }

        req.Dr_ID = decoded.Dr_ID
        req.Dr_email = decoded.Dr_email
        next()
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.auth = auth;