import { Request } from "express";

export interface MulterRequest extends Request {
    files: Express.Multer.File[]
}

export type UploadedFile = Express.Multer.File;