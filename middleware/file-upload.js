const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v1: uuidv1 } = require("uuid");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const s3 = new aws.S3({});

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const multerFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  //!! turns undefinied/null to false, others to true
  let error = isValid ? null : new Error("Invalid mime type!");
  cb(error, isValid);
};

const fileUpload = multer({
  limits: 500000,
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.S3_BUCKET_NAME,
    cacheControl: 'max-age=604800',
    key: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(
        null,
        process.env.NODE_ENV !== "production"
          ? "dev/" + uuidv1() + "." + ext
          : uuidv1() + "." + ext
      );
    },
  }),
  fileFilter: multerFilter,
});

module.exports = fileUpload;
