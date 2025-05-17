import express from "express";
import moviesController from "../controllers/moviesController.js";
import multer from "multer";

const router = express.Router();

const upload = multer({dest: "public/"})



router.route("/")
.get(moviesController.getAllMovies)
.post(upload.single("image"), moviesController.insertMovies);

router.route('/:id')
    .put(upload.single('imagen'), moviesController.updateMovie)
    .delete(moviesController.deleteMovie)


export default router;