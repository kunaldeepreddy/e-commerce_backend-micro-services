const moment = require("moment");

const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

function parse(time) {
	return moment(time).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
}

module.exports = {
	DAY_IN_MILLIS,
	parse: parse,

	getCurrentTime: () => {
		return new Date().getTime();
	},

	getDayStart: (time) => {
		let date = new Date(time);
		date.setHours(0, 0, 0, 1);
		return date.getTime();
	},

	getDayEnd: (time) => {
		let date = new Date(time);
		date.setHours(23, 59, 59, 999);
		return date.getTime();
	},

	getDaysBetween: (start, end) => {
		return Math.ceil((end - start) / DAY_IN_MILLIS);
	},
};
