import express from 'express'
import { deleteThumbnail, generateThumnail } from '../Controllers/ThumbnailControllers.js'
import protect from '../middlewares/auth.js'

const thumbnailRouter=express.Router()

// implemented the middleware also
thumbnailRouter.post('/generate',protect,generateThumnail)
thumbnailRouter.delete('/delete/:id',protect,deleteThumbnail)


export default thumbnailRouter


