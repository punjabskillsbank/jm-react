import axios from 'axios';

// Upload attachments to S3
export const S3_UPLOAD_RETRIES_NUM = 3;

export interface UploadResult {
  uploadedKeys: string[];
  failedFiles: string[];
}

interface PresignedUrl {
  uploadUrl: string;
  s3Key: string;
}

export const uploadFilesToS3 = async (
  files: File[],
  urls: PresignedUrl[]
): Promise<UploadResult> => {
  const uploadedKeys: string[] = [];
  const failedFiles: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { uploadUrl, s3Key } = urls[i];

    let success = false;
    for (let attempt = 1; attempt <= S3_UPLOAD_RETRIES_NUM; attempt++) {
      try {
        await axios.put(uploadUrl, file, {
          headers: { 'Content-Type': file.type },
        });
        uploadedKeys.push(s3Key);
        success = true;
        break;
      } catch (err) {
        console.warn(`Upload attempt ${attempt} failed for ${file.name}`);
        if (attempt === S3_UPLOAD_RETRIES_NUM) {
          failedFiles.push(file.name);
        }
      }
    }
  }

  return { uploadedKeys, failedFiles };
};