import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${userId}/profile.jpg`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    if (!uploadResult || !uploadResult.Location) {
      throw new InternalServerErrorException('Failed to upload file to S3');
    }

    return uploadResult.Location;
  }
}
