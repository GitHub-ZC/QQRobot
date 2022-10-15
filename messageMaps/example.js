/**
 * 可以定义多条消息匹配规则
 */
module.exports = [
    {
        // 消息类型 group(群聊) private(私聊)
        message_type: 'private',
        // 匹配规则  填写正则表达式 为空代表匹配所有消息
        MatchRule: ``,
        // true表示引用对方的消息 false表示引用对方的消息 只在群聊中 有效果
        Is_AITE_Reply: true,
        // 回复的消息内容 Reply为一个函数 如何需要 使用 functions 中的函数 请使用 function 写法
        // Reply: function () {
        //     // 调用自定义函数
        //     this.functions.函数();
        //     return "回复的消息内容"
        // },
        // 如果只需要返回消息 使用箭头函数就可以
        // Reply: () => "<<特定规则>> 回复内容",
        Reply: () => "回复的消息内容，请在此更改内容",
        // 自定义函数
        functions: {
        }
    },
    {
        // 消息类型 group(群聊) private(私聊)
        message_type: 'private',
        // 匹配规则  填写正则表达式 为空代表匹配所有消息
        MatchRule: `特定规则`,
        // true表示引用对方的消息 false表示引用对方的消息 只在群聊中 有效果
        Is_AITE_Reply: true,
        // 回复的消息内容 Reply为一个函数 如何需要 使用 functions 中的函数 请使用 function 写法
        // Reply: function () {
        //     // 调用自定义函数
        //     this.functions.函数();
        //     return "回复的消息内容"
        // },
        // 如果只需要返回消息 使用箭头函数就可以
        // Reply: () => "<<特定规则>> 回复内容",
        Reply: () => "<<特定规则>> 回复内容",
        // 自定义函数
        functions: {
        }
    },
]
