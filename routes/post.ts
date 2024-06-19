import { Router, Response } from "express";
import {verificaToken } from '../middlewares/autenticacion'
import { Post } from '../models/post.model';
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";
import { Usuario } from '../models/usuario.model';

const postRoutes = Router();
const fileSystem = new FileSystem();

// Obtener POst paginados.

postRoutes.get('/', async (req: any, res: Response) => {


    let pagina = Number( req.query.pagina) || 1;
    let skip  = pagina -1;
    skip = skip * 10;

    const posts = await Post.find()
                            .populate('usuario', '-password')
                            .sort({_id: -1 })
                            .skip( skip )
                            .limit(10)
                            .exec();

    res.json({
        ok:true, 
        pagina,
        posts

    });
});

// Crear Post
postRoutes.post('/', [verificaToken], ( req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;
    
    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id);

    body.imgs = imagenes;
    console.log(body);
    Post.create( body ).then( async postDB => {


       // await postDB.populate('usuario', '-password').execPopulate();
       await postDB.populate('usuario', '-password');

        res.json({
            ok: true,
            post: postDB
        });
    }).catch( err => {
        res.json( err );
    })
});

//Servicio para subir archivos

postRoutes.post('/upload', [verificaToken], async (req: any, res: Response ) =>{
    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }
    
    const file: FileUpload = req.files.image;

    if( !file ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo -image'
        });
    }

    if( !file.mimetype.includes('image') ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id);

    res.json ({
        ok: false,
        file: file.mimetype
    });

});

postRoutes.get(`/imagen/:userid/:img`, (req:any, res: Response ) => {
        
    const userId = req.params.userid;
    const img    = req.params.img;

    const pathPhoto = fileSystem.getFotoUrl( userId, img );

    
    res.sendFile( pathPhoto );
});  

export default postRoutes; 