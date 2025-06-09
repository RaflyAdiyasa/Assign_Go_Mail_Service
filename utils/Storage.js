import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// const storage = new Storage({
//   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
//   keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH
// });

const storage = new Storage();


const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
    }

    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

export default bucket;