import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from '../dist/classes/token';
import { verificaToken } from "../middlewares/autenticacion";

const userRoutes = Router();

//Login

userRoutes.post('/login', (req: Request, resp: Response) => {
    const body = req.body;

    Usuario.findOne({email: body.email }, ( err, userDB) => {
        if(err) throw err;
        if(!userDB){
            return resp.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        console.log(body);
        if( userDB.compararPassword(body.password)){
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email : userDB.email,
                avatar: userDB.avatar
            });

            resp.json({
                ok: true,
                tokenUser
            });

        }else{
            return resp.json({
                ok: false,
                mensaje: 'Contraseña incorrecta '
            });
        }
    });
});


userRoutes.post('/create', (req: Request, res: Response ) => {
    
    const user = {
        nombre   : req.body.nombre,
        email    : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10), 
        avatar   : req.body.avatar
    };

    Usuario.create( user ).then(userDB => {
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email : userDB.email,
            avatar: userDB.avatar
        });


        res.json({
            ok: true,
            tokenUser
        });

    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });

});
//actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response ) => {
    const user = {
        nombre:     req.body.nombre || req.usuario.nombre,
        email:      req.body.email || req.usuario.email,
        avatar:     req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, ( err, userDB) =>{
        if ( err ) throw err;

        if( !userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email : userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            tokenUser
        });

    });
})


export default userRoutes;