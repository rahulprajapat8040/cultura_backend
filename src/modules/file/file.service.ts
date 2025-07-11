import { BadRequestException, Injectable } from "@nestjs/common";
import * as multer from "multer";
import { MulterRequest, UploadedFile } from "src/utils/types/multerRequest";
import * as fs from 'fs'

@Injectable()
export class FileService {
    async uploadFile<T extends Record<string, any>>(req: MulterRequest, folder = '/'): Promise<{ file: UploadedFile[]; body: T }> {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const path = `uploads/${folder}`;
                fs.mkdirSync(path, { recursive: true })
                cb(null, path)
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`)
            }
        });

        const upload = multer({ storage }).any()

        return new Promise((resolve, reject) => {
            upload(req, {} as any, async (err) => {
                if (err) return reject(err);

                try {
                    const files = req.files && req.files.length > 0 ?
                        req.files : [];
                    resolve({ body: req.body, file: files })
                } catch (error) {
                    reject(error)
                };
            });
        });
    };

    async removeFile(files: any): Promise<void> {
        if (!files) {
            console.error("No files for delection")
        } else {
            try {
                if (Array.isArray(files)) {
                    files.forEach((file) => {
                        const path = file.path ? file.path : file
                        fs.unlinkSync(path)
                    })
                } else {
                    const path = files.path ? files.path : files
                    fs.unlinkSync(path)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}