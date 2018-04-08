# -Punch  [![travis](https://travis-ci.org/SpadeGod/Punch.svg?branch=master)](https://travis-ci.org/SpadeGod/Punch)
 Punch for zsy
 
 if you found this, don't make public, just secretly use. :)



# Log

add judge for china holidays. Finally there is no artificial judgment  [2018-04-08]

# Used

1. clone project from GitHub. create config.js in directory "src" and copy the code to build your no manual Clock In world!

Have Fun :)

```javascript

module.exports = {
    loginUrl: 'https://www.zhisiyun.com/login', //  loginUrl
    users: [{ // login for multiplayer
        form: { 
            'client': 'xxx',
            'username': 'xxx',
            'password': 'xxx',
            '提交': '登录', // this property was no must to or must, i forgot... just write it.
            'message': {
                'to': 'xxx@qq.com',
                'cc': 'xxx@qq.com',
            },
        }
    }, {
        form: {
            'client': 'xxx',
            'username': 'xxx',
            'password': 'xx',
            '提交': '登录',
            'message': {
                'to': 'xxx@qq.com',
            },
        }
    }],
    InWorkUrl: 'https://www.xxx.com/xxx/', // request for go work
    OutWorkUrl: 'https://www.xxx.com/xxx/', // request for after work
    fromEmail: {
        service: 'QQ',
        user: 'xxx@qq.com', // sender mail
        passCode: 'xxx', // authorization code
    },
    bakEmail: {
        service: 'QQ',
        user: 'xxx@qq.com', //  sender mail back up
        passCode: 'xxx' // authorization code back up
    },
    message: {
        to: 'xxx@qq.com',
        cc: 'xxx@qq.com',
        subject: '', 
        text: '', 
        html: '',
        watchHtml: '', // Apple Watch specific HTML body 苹果手表指定HTML格式
        attachments: [], // An array of attachments 附件
    }
}

```

2. Move to the src/shell and run the command

```shell
nohup ./monitorNode.sh &
```


