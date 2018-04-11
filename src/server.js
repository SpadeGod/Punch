var request = require('request')
var superagent = require('superagent')
var cronJob = require("cron").CronJob
var sendMail = require('./mail')
var config = require('./config')
var checkHolidays = require('./holiday.js')


var Punch = (url, userConfig, type) => {
    request.post(config.loginUrl, userConfig, (err, res, body) => {
        if (!err) {
            let cookieArr = res.headers["set-cookie"]
            let cookie = cookieArr.find((value, index, arr) => value.includes('sid')) // 含有sid的那条cookie才是可用的cookie
            superagent.get(url).set("Cookie", cookie).end((err, res) => {
                // 邮件信息设置，使用自定义配置覆盖默认配置
                let message = Object.assign({}, config.message, userConfig.form.message)
                try {
                    if (err) {
                        message.subject = 'punch error :('
                        // console.log(err.response)
                        message.text = `Error msg:${err.response.res.text}\r\n\r\nResponse: ${JSON.stringify(err.response)}`
                    } else if (res.res['text'].includes('打卡成功')) {
                        let date = new Date()
                        let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
                        message.subject = `${type} success :) punch time: ${time}`
                        message.text = res.res['text']
                        // console.log(res.res['text'])
                    } else {
                        message.subject = 'unknow error #_#'
                        message.text = `Manual knuckling please ！\r\n\r\nResponse: ${JSON.stringify(err.response)}`
                    }
                    sendMail(message)
                } catch (error) {
                    message.subject = 'server error，node was exit，waiting for reload !'
                    message.text = `error info：\r\n\r\n${error}`
                    sendMail(message)
                }
            })
        } else {
            console.dir(err)
        }
    })
}

/**
 * @description createRandomTime
 * @returns 
 */
function getRandomTime() {
    // random minutes between 0 and 20
    let minutes = parseInt(Math.random() * 20, 10)
    // random second between 0 and 60
    let second = parseInt(Math.random() * 60, 10)
    return {
        minutes,
        second
    }
}

var launch = () => {
    // get currentDate
    let date = new Date()
    // check whether working days
    checkHolidays(date) && config.users.map((item) => {
        let {
            minutes,
            second
        } = getRandomTime()
        console.log(`延迟${second}分${minutes}秒`)
        // delay execute
        setTimeout(function () {
            if (date.getHours() < 12) {
                // punching the go on work before 12:00 pm
                Punch(config.InWorkUrl, item, 'go on work')
            } else {
                // punching the off work after 12:00 pm
                Punch(config.OutWorkUrl, item, 'off work')
            }
        }, (minutes * 60 + second) * 1000)
    })
}

new cronJob('0 30 8,18 * * *', function () {
    launch()
}, null, true, 'Asia/Shanghai')

// send launch mail
sendMail(config.message)
