import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { Types } from 'aws-sdk/clients/s3'
// const XAWS = AWSXRay.captureAWS(AWS)
const s3Client: Types = new AWS.S3({ signatureVersion: 'v4' })
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET


const generateUploadUrl = async (todoId: string) =>{

    const url = s3Client.getSignedUrl('putObject', {
        Bucket: s3BucketName,
        Key: todoId,
        Expires: 1000,
    });

    return url 
}
export {generateUploadUrl}
