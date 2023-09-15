const { v4: UUID } = require('uuid');
const Log = require('../models/Logs.js')
const ENV = require('../constants').ENV_TYPES
const DateUtil = require('./DateUtil')
const env = process.env.ENV

module.exports = {
    logRequest: async (req, res, next) => {
        req.req_id = UUID()
        let data = {
            req_id: req.req_id,
            url: req.url,
            method: req.method,
        }
        if (req.decoded_data)
            data.user_id = req.decoded_data.user_id
        if (Object.keys(req.body).length != 0)
            data.body = req.body
        await log(data)
        next()
    },

    logResponse: async (req, res, next) => {
        res.on('finish', async () => {
            let data = {
                req_id: req.req_id,
                status_code: res.statusCode
            }
            await log(data)
        })
        next()
    },

    log: async (data) => {
        let dt = {
            data: JSON.stringify(data)
        }
        await log(dt)
    },

    logError: async (msg, err) => {
        let dt = {
            data: JSON.stringify({
                msg: msg,
                error: err
            })
        }
        await log(dt)
    },

    logErrorByRequest: async (req, msg, err) => {
        let dt = {
            req_id: req.req_id,
            data: JSON.stringify({
                msg: msg,
                error: err
            })
        }
        await log(dt)
    },

    logByRequest: async (req, data) => {
        let dt = {
            req_id: req.req_id,
            data: JSON.stringify(data)
        }
        await log(data)
    }
}

async function log(data) {
    if (env != ENV.LOCAL)
        await Log(data).save()
    else {
        delete data.body
        data.inserted_at = DateUtil.parse(Date.now())
        console.log(JSON.stringify(data))
    }
}