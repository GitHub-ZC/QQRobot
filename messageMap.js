const fs = require('fs');

const hmaps = new Map();

var files = fs.readdirSync(__dirname + '/messageMaps');
var js_files = files.filter((f) => {
    return f.endsWith('.js');
});

// 批量导入 消息映射文件
for (var f of js_files) {
    console.log(`process controller: ${f}...`);
    let mapping = require(__dirname + '/messageMaps/' + f);
    hmaps.set(f.replace(".js", ''), mapping);
}

module.exports = hmaps;