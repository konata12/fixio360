import dotenv from "dotenv";
import * as fs from 'fs';
import pkg from 'aws-sdk';
const { S3 } = pkg;


dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3
export const uploadImg = (file, pref) => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: pref + file.filename + '.jpg'
    }

    return s3.upload(uploadParams).promise()
}

// downloads a files from s3
export const getUrlFromAWS = async (fileKey, prefix) => {
    const presignedURL = await s3.getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: prefix + fileKey, //filename
        Expires: 100 //time to expire in seconds
    });

    console.log('getting url')

    return presignedURL
}

// delete file from s3
export const deleteImg = (fileName, pref) => {
    const deleteParams = {
        Bucket: bucketName,
        Key: pref + fileName
    }

    return s3.deleteObject(deleteParams).promise()
}