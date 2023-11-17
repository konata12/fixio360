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
export const uploadFile = (file, pref) => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: pref + file.filename
    }

    return s3.upload(uploadParams).promise()
}


// downloads a files from s3
export const getPaginationFilesStream = (fileKey, prefix) => {
    const downloadParams = {
        prefix: prefix,
        Bucket: bucketName
    }

    return s3.ListObjectsV2(downloadParams).createReadStream()
}