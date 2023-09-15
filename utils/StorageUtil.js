const AWS = require('aws-sdk');
const Constants = require("../constants");
AWS.config.update({
    accessKeyId: Constants.AWS_ACCESS_KEY_ID,
    secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY,
    region: Constants.AWS_REGION
});
const S3 = new AWS.S3();

module.exports = {
    uploadImage: async (title, file, mime) => {
        return await S3.upload({
            Bucket: Constants.AWS_S3_IMAGES,
            Key: title,
            Body: file,
            ACL: "public-read",
            ContentType: mime
        }).promise()
    },

    deleteImage: async (file) => {
        const file_name = file.substring(file.lastIndexOf("/") + 1)
        return await S3.deleteObject({
            Bucket: Constants.AWS_S3_IMAGES,
            Key: file_name
        }).promise()
    }
}