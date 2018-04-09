var request = require('request')
var superagent = require('superagent')
var cronJob = require("cron").CronJob
var sendMail = require('./mail')
var config = require('./config')
var checkHolidays = require('./holiday.js')

/** 
 * @description 打卡
 */
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
                        message.subject = `${type}success :) punch time: ${time}`
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
    // 延迟数在 1-30分钟内随机
    let minutes = parseInt(Math.random() * 30, 10)
    // 延迟秒数在 0-60秒内随机
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
                // 12点之前打上班卡
                Punch(config.InWorkUrl, item, '上班')
            } else {
                // 12点之后打下班卡
                Punch(config.OutWorkUrl, item, '下班')
            }
        }, (minutes * 60 + second) * 1000)
    })
}

new cronJob('0 30 8,18 * * 1-5', function () {
    launch()
}, null, true, 'Asia/Shanghai')

// send launch mail
sendMail(config.message)
