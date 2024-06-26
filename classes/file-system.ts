import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
import postRoutes from '../routes/post';


export default class FileSystem {
    constructor() {};
     
    guardarImagenTemporal( file: FileUpload, userId: string ){
        
        return new Promise<void>( (resolve, reject ) => {
            const path = this.creaRCarpetaUsuario( userId );

            //Nombre del archivo
            const nombreArchivo = this.generarNombreUnico( file.name );
    
            //Mover el archivo del Temp a nuestra carpeta.
            file.mv(`${ path }/${ nombreArchivo }`, (err: any) => {
                if( err){
                    reject( err );      
                }else{
                    resolve();
                }
            });
        });
        

    }

    private generarNombreUnico ( nombreOriginal: string){
        //6.copy.jpg

        const nombreArr = nombreOriginal.split('.');    
        const extension = nombreArr[ nombreArr.length -1];

        const idUnico = uniqid();

        return `${ idUnico }.${ extension }`;
        //nombre archivo
        //const nombreArchivo

    }

    private creaRCarpetaUsuario( userId: string ){
        const pathUser = path.resolve( __dirname, '../uploads/', userId );
        const pathUserTemp  = pathUser + '/temp';
        
        //console.log(pathUser);

        const existe = fs.existsSync( pathUser );

        if( !existe){
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp ); 
        }

        return pathUserTemp;


    }

    public imagenesDeTempHaciaPost(userId: string){
        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        const pathPOst = path.resolve( __dirname, '../uploads/', userId, 'posts' );

        if( !fs.existsSync(pathTemp)){
            return [];
        }

        if( !fs.existsSync(pathPOst)){
            fs.mkdirSync( pathPOst );
        }

        const imagenesTemp = this.ObtenerImagenesEnTemp( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync(`${ pathTemp }/${ imagen }`,`${ pathPOst }/${imagen}`);
        });

        return imagenesTemp;

    }

    private ObtenerImagenesEnTemp(userId: string ){
        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );

        return fs.readdirSync( pathTemp ) || [];

    }


    getFotoUrl ( userId: string, img: string ) {
        //path posts
        //si la imagen no existe
        const pathPhoto = path.resolve( __dirname, '../uploads/', userId, 'posts', img );

        //Si la imagen existe
        const existe = fs.existsSync( pathPhoto );
        console.log('existe', existe);
        if( !existe ){
            return path.resolve( __dirname, '../assets/400x250.jpg');
        }


        return pathPhoto; 
    }


}