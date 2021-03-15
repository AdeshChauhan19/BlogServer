const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const authAdmin = async (req, res, next) => {
 
    try {
        const admintoken = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(admintoken, 'thisismyadmin')
        const admin = await Admin.findOne({ _id: decoded._id, 'admintokens.admintoken': admintoken })

        if (!admin) {
            throw new Error()
        }
        req.admintoken = admintoken
        req.admin = admin
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = authAdmin
