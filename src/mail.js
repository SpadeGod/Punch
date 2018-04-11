'use strict'

var nodemailer = require('nodemailer');
var config = require('./config');


console.log('SMTP Configured');
console.log('Send Mail');

/**
 * Factory to create transport
 * @param {*} factoryCfg 
 */
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

/**
 * main function to send email, if main mail is unavailable will used backup mail.
 * When all of the backup mail all unavailable, it will throw Error for it. But its looks like useless now, 
 * because i have no monitoring for program level and it not need to be complex.
 * @param {*} msgInfo 
 * @param {*} factoryCfg 
 * @param {*} isBak 
 */
var sendMail = (msgInfo, factoryCfg, isBak) => trFactory(factoryCfg).sendMail(msgInfo, (error, info) => {
    if (error) {
        if (!isBak) {
            console.log('Error occurred');
            console.log(error.message);
            msgInfo.text += `\r\nyour main mail has any error, maybe this mail was change passsword lastly. 
                update the authorization code please. it will be launch by back up pain 🚀`
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
            }, true)
        } else {
            console.error('your email is all close. please check it and reload program.')
            return
        }
    } else {
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
        transporter.close();
        return
    }
});


module.exports = sendMail;