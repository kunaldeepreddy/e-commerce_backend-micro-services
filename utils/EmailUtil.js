const AWS = require("aws-sdk");
const NodeMailer = require("nodemailer");
const HandleBars = require("handlebars");
const Constants = require("../constants");
const FS = require("fs");
const Path = require("path");
const LogUtil = require("./LogUtil");

AWS.config.update({
	accessKeyId: Constants.AWS_ACCESS_KEY_ID,
	secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY,
	region: Constants.AWS_REGION,
});

var transporter = NodeMailer.createTransport({
	SES: new AWS.SES({
		apiVersion: "2010-12-01",
	}),
});

module.exports = {
	sendForgotPasswordEmail: async (name, email, hash) => {
		const path = Path.join(__dirname, "../templates/change_pwd.html");
		const html = FS.readFileSync(path, { encoding: "utf-8" });
		var template = HandleBars.compile(html);
		var replacements = {
			name: name,
			reset_link: Constants.URL + "user/" + "forgot-password/reset?hash=" + hash,
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from:
				Constants.EMAIL_FROM_NAME + " <" + Constants.EMAIL_FROM_ADDRESS + ">",
			to: email,
			subject: "Homely Haven - Reset Password",
			html: htmlToSend,
		};
		try {
			await transporter.sendMail(mailOptions);
			return { status: true, message: "Mail has been sent." };
		} catch (err) {
			LogUtil.logError("failed to send email", err);
			return { status: false, message: "Failed to send mail." };
		}
	},
};
