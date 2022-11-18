import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Types } from 'aws-sdk/clients/s3'
import todosAcess from './todosAcess'
const XAWS = AWSXRay.captureAWS(AWS)
const s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' })
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET


const generateUploadUrl = async (todoId: string, userId:string) =>{
  
    const url = s3Client.getSignedUrl('putObject', {
        Bucket: s3BucketName,
        Key: todoId,
        Expires: 1000,
    });
    if(url) {
        const attachmentUrl = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
        todosAcess.updateTodoAttachment(todoId,userId,attachmentUrl)
    }
    return url 
}
export {generateUploadUrl}
