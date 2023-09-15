require('./init_db')
const Inquirer = require('inquirer')
const Helper = require('../utils/Helper')
const User = require('../models/User')
const Constants = require('../constants')

const questions = [
    { type: 'input', name: 'name', message: 'Name:' },
    { type: 'input', name: 'email', message: 'Email address:' },
    { type: 'input', name: 'pwd', message: 'Password:' },
]

execute()

async function execute() {
    let data = await Inquirer.prompt(questions)
    if (!data.email || !data.name || !data.pwd) {
        console.log("Required params are missing")
        return
    }
    const user = new User({
        name: data.name,
        email: data.email,
        password: Helper.getHashedPassword(data.pwd),
        role: Constants.ROLE_ADMIN
    })
    await user.save()
    console.log("admin account created successfully")
}