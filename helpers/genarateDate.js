const moment = require("moment")

module.exports = {
    genarateDate : (date,format) => {
        return moment(date).format(format)
    }
}