const { createClient } = require("oicq");
// 机器人的配置文件
const config = require('./config');
const hmaps = require("./messageMap");


// 根据 账号 创建客户端
const client = createClient(config.account);


client.on("system.online", async () => {
    console.log("Logged in!");
    // await client.setOnlineStatus('Online');
})


client.on("message", async e => {
    // console.log(e);
    hmaps.forEach(async (map_fs, key) => {
        map_fs.forEach(async messageMap => {
            // 群聊消息
            if (messageMap.message_type === "group") {
                if (String(e.group_id) === String(key)) {
                    // 匹配规则为空时
                    if (typeof messageMap.MatchRule === 'string' && messageMap.MatchRule.replace(/\s/ig, '').length === 0) {
                        Array.isArray(e.message) && e.message.forEach(async ms => {
                            try {
                                let reply = messageMap.Reply(ms.text, e);
                                // console.log(reply);
                                if (typeof reply === 'string' && reply.replace(/\s/ig, '').length !== 0) {
                                    await e.reply(reply, messageMap.Is_AITE_Reply);
                                } else if (Array.isArray(reply)) {
                                    await e.reply(reply, messageMap.Is_AITE_Reply);
                                }
                            } catch (error) {
                                throw error;
                            }
                        });
                    }
                    // 匹配规则不为空时
                    else {
                        // 生成正则表达式
                        let re = new RegExp(messageMap.MatchRule);
                        Array.isArray(e.message) && e.message.forEach(async ms => {
                            let timeArr = re.exec(ms.text);
                            if (Array.isArray(timeArr) && timeArr.length > 0) {
                                try {
                                    let reply = messageMap.Reply(ms.text, e);
                                    // console.log(reply);
                                    if (typeof reply === 'string' && reply.replace(/\s/ig, '').length !== 0) {
                                        await e.reply(reply, messageMap.Is_AITE_Reply);
                                    } else if (Array.isArray(reply)) {
                                        await e.reply(reply, messageMap.Is_AITE_Reply);
                                    }
                                } catch (error) {
                                    throw error;
                                }
                            }
                        });
                    }
                }
            }
            // 私聊消息
            else if (messageMap.message_type === "private") {
                if (String(e.from_id) === String(key)) {
                    // 匹配规则为空时
                    if (typeof messageMap.MatchRule === 'string' && messageMap.MatchRule.replace(/\s/ig, '').length === 0) {
                        Array.isArray(e.message) && e.message.forEach(async ms => {
                            try {
                                let reply = messageMap.Reply(ms.text, e);
                                // console.log(reply);
                                if (typeof reply === 'string' && reply.replace(/\s/ig, '').length !== 0) {
                                    await e.reply(reply, messageMap.Is_AITE_Reply);
                                } else if (Array.isArray(reply)) {
                                    await e.reply(reply, messageMap.Is_AITE_Reply);
                                }
                            } catch (error) {
                                throw error;
                            }
                        });
                    }
                    // 匹配规则不为空时
                    else {
                        // 生成正则表达式
                        let re = new RegExp(messageMap.MatchRule);
                        Array.isArray(e.message) && e.message.forEach(async ms => {
                            let timeArr = re.exec(ms.text);
                            if (Array.isArray(timeArr) && timeArr.length > 0) {
                                try {
                                    let reply = messageMap.Reply(ms.text, e);
                                    // console.log(reply);
                                    if (typeof reply === 'string' && reply.replace(/\s/ig, '').length !== 0) {
                                        await e.reply(reply, messageMap.Is_AITE_Reply);
                                    } else if (Array.isArray(reply)) {
                                        await e.reply(reply, messageMap.Is_AITE_Reply);
                                    }
                                } catch (error) {
                                    throw error;
                                }
                            }
                        });
                    }
                }
            }
        });
    })
    // e.reply("hello world", true) //true表示引用对方的消息
})


client.on("system.login.device", function (e) {
    console.log("已发送验证码");
    this.sendSmsCode();
    console.log("输入验证码：");
    process.stdin.once("data", code => {
        this.submitSmsCode(String(code).trim());
        this.login();
    })
}).login(config.password);

//之后还可能会输出设备锁url，需要去网页自行验证，也可监听 `system.login.device` 处理