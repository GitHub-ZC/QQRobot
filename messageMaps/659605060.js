const moment = require("moment");
const { segment } = require("oicq");
const TimeEventManager = require("../utils/TimeEventManger");

module.exports = [
    {
        // 消息类型 group private
        message_type: 'group',
        // 匹配规则  正则
        MatchRule: ``,
        // true表示引用对方的消息
        Is_AITE_Reply: true,
        // 回复的消息内容
        Reply: function (text, e) {
            let form = this.functions.getTextTime(text);
            console.log(form);
            return this.functions.F(form, e);
        },
        // 自定义函数
        functions: {
            // 格式化时间字符串
            F(form, e) {
                let s = '';
                let yearMouthDay = moment().format('YYYY-MM-DD');
                
                // 字符串替换规则
                let rules = {
                    '九': '9',
                    '八': '8',
                    '七': '7',
                    '六': '6',
                    '五': '5',
                    '四': '4',
                    '三': '3',
                    '二': '2',
                    '一': '1',
                    '零': '0',
                    '点': ':',
                    ',': ':',
                    '.': ':',
                    '_': ':',
                    ':': ':',
                    '：': ':',
                    '年': '-',
                    '月': '-',
                    '日': ''
                };

                let str = form.C;
                if (str === '__NO__' || str === undefined || str === null) {
                    return '';
                }

                let arr = str.split(/[点\.\-\:\：\_\,\，]/);

                if (Array.isArray(arr) && arr[0]) {
                    //实现功能： "十九" => "一九" => 19
                    if (Array.isArray(/二十\s*?[一二三]/.exec(arr[0])) && /二十\s*?[一二三]/.exec(arr[0]).length > 0) {
                        arr[0] = arr[0].replace('十', '');
                    } else if (Array.isArray(/十\s*?[一二三四五六七八九]/.exec(arr[0])) && /十\s*?[一二三四五六七八九]/.exec(arr[0]).length > 0) {
                        arr[0] = arr[0].replace('十', '一');
                    }
                }

                if (Array.isArray(arr) && arr[1]) {
                    //实现功能： "四十五" => "四五" => 45
                    if (Array.isArray(/[一二三四五]\s*?十\s*?[一二三四五六七八九]/.exec(str)) && /[一二三四五]\s*?十\s*?[一二三四五六七八九]/.exec(str).length > 0) {
                        arr[1] = arr[1].replace('十', '');
                    }
                    //实现功能： "四十" => "四零" => 40
                    else if (Array.isArray(/[一二三四五]\s*?十/.exec(arr[1])) && /[一二三四五]\s*?十/.exec(arr[1]).length > 0) {
                        arr[1] = arr[1].replace('十', '零');
                    }
                    //实现功能： "十九" => "一九" => 19
                    else if (Array.isArray(/十\s*?[一二三四五六七八九]/.exec(arr[1])) && /十\s*?[一二三四五六七八九]/.exec(arr[1]).length > 0) {
                        arr[1] = arr[1].replace('十', '一');
                    }
                }
                

                if (Array.isArray(arr)) {
                    str = arr.join(':')
                }

                // 进行字符串的替换
                for (let index = 0; index < str.length; index++) {
                    if (rules[str[index]]) {
                        s += rules[str[index]];
                    } else {
                        s += str[index];
                    }
                }

                // 年月日的替换  2022-10-2
                if ( form.A.indexOf('月') !== -1) {
                    yearMouthDay = '';
                    if(form.A.indexOf('年') == -1) {
                        yearMouthDay = moment().format('YYYY') + '-';
                    }
                    let arr = form.A.split('月');
                    if (Array.isArray(arr) && arr[0]) {
                        //实现功能： "十九" => "一九" => 19
                        if (Array.isArray(/(十[一二])/.exec(arr[0])) && /(十[一二])/.exec(arr[0]).length > 0) {
                            arr[0] = arr[0].replace('十', '一');
                        }
                        if (Array.isArray(/十/.exec(arr[0])) && /十/.exec(arr[0]).length > 0) {
                            arr[0] = arr[0].replace('十', '一零');
                        }
                    }

                    if (Array.isArray(arr) && arr[1]) {
                        //实现功能： "四十五" => "四五" => 45
                        if (Array.isArray(/[一二三]\s*?十\s*?[一二三四五六七八九]/.exec(arr[1])) && /[一二三]\s*?十\s*?[一二三四五六七八九]/.exec(arr[1]).length > 0) {
                            arr[1] = arr[1].replace('十', '');
                        }
                        //实现功能： "四十" => "四零" => 40
                        else if (Array.isArray(/[一二三]\s*?十/.exec(arr[1])) && /[一二三]\s*?十/.exec(arr[1]).length > 0) {
                            arr[1] = arr[1].replace('十', '零');
                        }
                        //实现功能： "十九" => "一九" => 19
                        else if (Array.isArray(/十\s*?[一二三四五六七八九]/.exec(arr[1])) && /十\s*?[一二三四五六七八九]/.exec(arr[1]).length > 0) {
                            arr[1] = arr[1].replace('十', '一');
                        }
                    }

                    if (Array.isArray(arr)) {
                        arr = arr.join('-');
                    }
                    for (let index = 0; index < arr.length; index++) {
                        if (rules[arr[index]] != undefined) {
                            yearMouthDay += rules[arr[index]];
                        } else {
                            yearMouthDay += arr[index];
                        }
                    }
                }

                let s_ = s;
                s = `${yearMouthDay} ${s}`;
                // 最终的生成时间
                let formTime = moment(s, 'YYYY-MM-DD HH:mm');

                // 生成时间无效
                if(!formTime.isValid()) {
                    return '通知：当前输入的日期无效';
                }

                // 对 明天  后天 进行时间的格式化
                if(form.A === '明天') {
                    formTime = formTime.add(1, 'days');
                } else if(form.A === '后天') {
                    formTime = formTime.add(2, 'days');
                }

                if(parseInt(s_.split(/[点\.\-\:\：\_\,\，]/)[0]) < 13) {
                    if(form.B === '下午') {
                        formTime = formTime.add(12, 'hours');
                    } else if(form.B === '晚上') {
                        formTime = formTime.add(12, 'hours');
                    }
                }

                if (moment().isAfter(formTime)) {
                    return `当前输入的时间, 已经过去, 请输入未来的时间`
                }
                // 获取时间差 毫秒
                // let timeout = formTime.diff(moment(), 'milliseconds');


                // let timer = setTimeout(() => {
                //     // console.log('+++++++++++++++++++++++++', e);
                //     e.group.sendMsg([segment.at(e.sender.user_id), '\n\n', `当前时间：${formTime.format('YYYY-MM-DD HH:mm')}\n提醒事件：${form.D}`]);
                //     // console.log("---------------", TimeEventManager.getAllTimeEventInManager(e.sender.user_id));
                //     let hmap = TimeEventManager.getTimeEventManager();
                //     hmap.set(e.sender.user_id, TimeEventManager.getAllTimeEventInManager(e.sender.user_id).filter(timeEvent => {
                //         if (parseInt(timeEvent.timer) === parseInt(timer)) {
                //             console.log(`清除 ${timer} ${timeEvent.timer}`);
                //             return false;
                //         }
                //         return true;
                //     }));
                // }, timeout);

                // console.log(timer);
                // 将确定的时间时间 加入到 TimeEventManager
                TimeEventManager.setTimeEventToManager(e.sender.user_id, {
                    group: e.group,
                    time: formTime.format('YYYY-MM-DD HH:mm'),
                    text: `${formTime.format('YYYY年MM月DD日 HH:mm')} ${form.D}`,
                    atText: [segment.at(e.sender.user_id), '\n\n', `当前时间：${formTime.format('YYYY年MM月DD日 HH:mm')}\n提醒事件：${form.D}`]
                })

                // console.log(e.group);
                return `通知：将在 ${formTime.format('YYYY年MM月DD日 HH:mm')} 提醒你`;
                // return ([
                //     segment.face(101),
                //     segment.face(102),
                //     "\ntwo faces"
                // ])
            },
            // 匹配 xx:xx:xx xx:xx 时间类型
            getTimeFromText(text) {
                let timeArr = /([0-9]|0[0-9]|1[0-9]|2[0-3]):(([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])|[0-5][0-9]|[0-9])/ig.exec(text);
                if (Array.isArray(timeArr) && timeArr.length > 0) {
                    return timeArr[0] || '__NO__';
                }
                return '__NO__';
            },
            // 匹配类型   今天上午9点做核酸
            getTextTime(text) {
                let form = {
                    A: '__NO__',
                    B: '__NO__',
                    C: '__NO__',
                    D: '__NO__'
                }


                // 匹配年月日
                let yearMouthDay = /(([0-9]{4}|[0-9]{2}|[零一二三四五六七八九]{4}|[零一二三四五六七八九]{2})\s*?年\s*?){0,1}(0[1-9]|1[0-2]|[1-9]|十[一二]|[一二三四五六七八九十])\s*?月\s*?([1-2][0-9]|3[0-1]|0[1-9]|[1-9]|零[一二三四五六七八九]|[一二]十{0,1}[零一二三四五六七八九]{0,1}|三十{0,1}[零一二]{0,1}|十[一二三四五六七八九])\s*?[日号]{0,1}/ig.exec(text);
                if (Array.isArray(yearMouthDay) && yearMouthDay.length > 0) {
                    if (Array.isArray(yearMouthDay) && yearMouthDay.length > 0) {
                        form.A = yearMouthDay[0].replace(/\s/ig, '') || '';
                    }
                } else {
                    let time1Arr = /[今后明]\s*?天/ig.exec(text);
                    if (Array.isArray(time1Arr) && time1Arr.length > 0) {
                        form.A = time1Arr[0].replace(/\s/ig, '') || '今天';
                    }
                }

                // 匹配 上 中 下 午
                let time2Arr = /[上中下]\s*?午/ig.exec(text);
                if (Array.isArray(time2Arr) && time2Arr.length > 0) {
                    form.B = time2Arr[0].replace(/\s/ig, '') || '__NO__';
                } else {
                    // 匹配 早晚
                    let time3Arr = /[早晚]\s*?上/ig.exec(text);
                    if (Array.isArray(time3Arr) && time3Arr.length > 0) {
                        form.B = time3Arr[0].replace(/\s/ig, '') || '__NO__';
                    }
                }

                // 匹配具体时间
                let time4Arr = /([0-9]|0\s*?[0-9]|1\s*?[0-9]|2\s*?[0-3]|[零一二三四五六七八九十]|十\s*?[一二三四五六七八九]|(二十|二)\s*?[一二三十])\s*?[点\.\:\,\-\_\：\，]\s*([0-5]\s*?[0-9]|[0-9]|[一二三四五]\s*?十\s*?[一二三四五六七八九]|十\s*?[一二三四五六七八九]|[零一二三四五]\s*?[一二三四五六七八九]|[一二三四五]\s*?十|[零一二三四五六七八九十]){0,1}/ig.exec(text);
                if (Array.isArray(time4Arr) && time4Arr.length > 0) {
                    form.C = time4Arr[0].replace(/\s/ig, '') || '__NO__';
                }

                text = text.replace(/(([0-9]{4}|[0-9]{2}|[零一二三四五六七八九]{4}|[零一二三四五六七八九]{2})\s*?年\s*?){0,1}(0[1-9]|1[0-2]|[1-9]|十[一二]|[一二三四五六七八九十])\s*?月\s*?([1-2][0-9]|3[0-1]|0[1-9]|[1-9]|零[一二三四五六七八九]|[一二]十{0,1}[零一二三四五六七八九]{0,1}|三十{0,1}[零一二]{0,1}|十[一二三四五六七八九])\s*?[日号]{0,1}/ig, '');
                text = text.replace(/([0-9]|0\s*?[0-9]|1\s*?[0-9]|2\s*?[0-3]|[零一二三四五六七八九十]|十\s*?[一二三四五六七八九]|(二十|二)\s*?[一二三十])\s*?[点\.\:\,\-\_\：\，]\s*([0-5]\s*?[0-9]|[0-9]|[一二三四五]\s*?十\s*?[一二三四五六七八九]|十\s*?[一二三四五六七八九]|[零一二三四五]\s*?[一二三四五六七八九]|[一二三四五]\s*?十|[零一二三四五六七八九十]){0,1}/ig, '');
                text = text.replace(/[上中下]\s*?午/ig, '');
                text = text.replace(/[早晚]\s*?上/ig, '');
                text = text.replace(/[今后明]\s*?天/ig, '');
                form.D = text.replace(/\s/ig, '');

                return form;
            }
        }
    },
    {
        message_type: 'group',
        MatchRule: `查询所有`,
        Is_AITE_Reply: true,
        Reply: function (text, e) {
            console.log(TimeEventManager.getAllTimeEventInManager(e.sender.user_id).map((m, index) => `\n${index + 1}: ${m.text}`));
            return TimeEventManager.getAllTimeEventInManager(e.sender.user_id).length ? TimeEventManager.getAllTimeEventInManager(e.sender.user_id).map((m, index) => `\n${index + 1}: ${m.text}`) : '你好 当前备忘录列表为空';
        },
        functions: {
        }
    },
    {
        // 消息类型 group(群聊) private(私聊)
        message_type: 'group',
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
        Reply: function (text, e) {
            let re_ = /删除备忘录\s*?([1-9][0-9][0-9]|[1-9][0-9]|[1-9])/ig;
            let arr = re_.exec(text);
            if(arr !== null && Array.isArray(arr) && arr.length > 1) {
                arr = arr[1].replace(/\s/ig, '');
            } else {
                return '';
            }

            TimeEventManager.clearTimeEventManager(e.sender.user_id, arr);

            console.log(TimeEventManager.getAllTimeEventInManager(e.sender.user_id).map(m => m.text));
            return TimeEventManager.getAllTimeEventInManager(e.sender.user_id).length ? TimeEventManager.getAllTimeEventInManager(e.sender.user_id).map((m, index) => `\n${index + 1}: ${m.text}`) : '通知：当前备忘录列表为空';
        },
        // 自定义函数
        functions: {
        }
    },
    {
        // 消息类型 group(群聊) private(私聊)
        message_type: 'group',
        // 匹配规则  填写正则表达式 为空代表匹配所有消息
        MatchRule: `删除所有备忘录`,
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
        Reply: function (text, e) {
            TimeEventManager.clearTimeEventManager(e.sender.user_id);

            return '通知：备忘录列表已清空';
        },
        // 自定义函数
        functions: {
        }
    },
]
