"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.creaRCarpetaUsuario(userId);
            //Nombre del archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            //Mover el archivo del Temp a nuestra carpeta.
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        //6.copy.jpg
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = (0, uniqid_1.default)();
        return `${idUnico}.${extension}`;
        //nombre archivo
        //const nombreArchivo
    }
    creaRCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        //console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesDeTempHaciaPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPOst = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPOst)) {
            fs_1.default.mkdirSync(pathPOst);
        }
        const imagenesTemp = this.ObtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPOst}/${imagen}`);
        });
        return imagenesTemp;
    }
    ObtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        //path posts
        //si la imagen no existe
        const pathPhoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts', img);
        //Si la imagen existe
        const existe = fs_1.default.existsSync(pathPhoto);
        console.log('existe', existe);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathPhoto;
    }
}
exports.default = FileSystem;
