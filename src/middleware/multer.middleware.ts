import multer from 'multer'

import { makeId } from '@utils/helpers'
import path from 'path'


export const uploadImage = multer({
    storage: multer.diskStorage({
        destination: 'public/images',
        filename(_, file, callback) {
            const name = makeId(15)
            callback(null, name + path.extname(file.originalname)) // e.g. a8sd3wja + .png
        }
    }),
    fileFilter(_, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            callback(null, true);
        } else {
            callback(new Error('Not an image'));
        }
    }
})