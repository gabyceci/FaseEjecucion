import moviesModel from "../models/Movies.js";
import {v2 as cloudinary} from "cloudinary";
import {config} from "../config.js";

//1- Configurar cloudinary con nuestra cuenta
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

//Array de funciones vacío
const moviesController = {};

//SELECT
moviesController.getAllMovies = async (req, res) => {
    const Movies = await moviesModel.find();
    res.json(Movies);
};


//INSERT
moviesController.insertMovies = async (req, res) => {
    const {name, description, director, gender, year, duration} = req.body;
    let imageURL = ""

    //Subir la imagen a Cloudinary
    if(req.file){
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "public",
                allowed_formats: ["png", "jpg", "jpeg"]
            }
        )
        //Guardo en la variable la URL de donde se subió la imagen
        imageURL = result.secure_url
    }

    //Guardar todo en la base de datos
    const newMovie = new moviesModel({name, description, director, gender, year, duration, image: imageURL})
    await newMovie.save();

    res.json({message: "Movie saved"});
};

// DELETE
moviesController.deleteMovie = async (req, res) => {
  await moviesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Movie deleted" });
};

// UPDATE
moviesController.updateMovie = async (req, res) => {
    try {
        const { name, description, director, gender, year, duration } = req.body;
        const { id } = req.params;
        
        // 1. Buscar la película a actualizar
        const movieToUpdate = await moviesModel.findById(id);
        
        if (!movieToUpdate) {
            return res.status(404).json({ message: "Movie not found" });
        }
        
        let imageURL = movieToUpdate.image;
        
        // 2. Si se subió una nueva imagen
        if (req.file) {
            // Eliminar la imagen anterior de Cloudinary si existe
            if (movieToUpdate.image) {
                const urlParts = movieToUpdate.image.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split('.')[0];
                const folder = "public";
                
                await cloudinary.uploader.destroy(`${folder}/${publicId}`);
            }
            
            // Subir la nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "public",
                    allowed_formats: ["png", "jpg", "jpeg"]
                }
            );
            
            imageURL = result.secure_url;
        }
        
        // 3. Actualizar los datos en la base de datos
        const updatedMovie = await moviesModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                director,
                gender,
                year,
                duration,
                image: imageURL
            },
            { new: true } // Para devolver el documento actualizado
        );
        
        res.json({
            message: "Movie updated successfully",
            movie: updatedMovie
        });
        
    } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).json({ 
            message: "Error updating movie", 
            error: error.message 
        });
    }
};

export default moviesController;
