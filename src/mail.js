'use strict'

var nodemailer = require('nodemailer');
var config = require('./config');


console.log('SMTP Configured');
console.log('Send Mail');

function trFactory(factoryCfg) {
    let transport = {
        service: config.fromEmail.service,
        auth: {
            user: config.fromEmail.user, //发送者邮箱
            pass: config.fromEmail.passCode //邮箱第三方登录授权码
        },
        debug: true
    }

    let option = {
        from: config.fromEmail.user, //发送者邮箱
        headers: {
            'X-Laziness-level': 1000
        }
    }
    if (factoryCfg && factoryCfg.transport && factoryCfg.option) {
        transport = factoryCfg.transport
        option = factoryCfg.option
    }

    return nodemailer.createTransport(transport, option);
}

var sendMail = (msgInfo, factoryCfg) => trFactory(factoryCfg).sendMail(msgInfo, (error, info) => {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
        msgInfo.text += `\r\nyour main mail has any error, maybe this mail was change passsword lastly. update the authorization code please. it will be launch by back up pain 🚀`
        sendMail(msgInfo, {
            transport: {
                service: config.bakEmail.service,
                auth: {
                    user: config.bakEmail.user, //发送者邮箱
                    pass: config.bakEmail.passCode //邮箱第三方登录授权码
                },
                debug: true
            },
            option: {
                from: config.bakEmail.user, //发送者邮箱
                headers: {
                    'X-Laziness-level': 1000
                }
            }
        })
    } else {
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
        transporter.close();
        return
    }
});


module.exports = sendMail;