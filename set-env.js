const fs = require('fs')

module.exports = function config() {
    try {
        var contents = fs.readFileSync('.env', 'utf8')
    } catch {
        return
    }
    contents.split('\n').forEach( function (line, idx) {
        data = line.split('=')
        key = data[0]
        data.shift()
        value = data.join('=').trim()
        process.env[key] = value
    })
}