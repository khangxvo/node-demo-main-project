const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const { default: mongoose } = require('mongoose')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const Joi = require('joi')
// password is 123456

/**
 * Authorization a user and give them a unique token
 */



router.get('/', async (req, res) => {
    const users = await User.find().sort('name')
    res.send(
        _.map(users, ({ _id, name, email }) => ({ _id, name, email }))
    )
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Invalid email or password.')
    }

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
        return res.status(400).send('Invalid email or password.')
    }

    const token = user.generateAuthToken();
    res.send(token)
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(req);
}

module.exports = router;