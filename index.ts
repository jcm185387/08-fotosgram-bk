import Server from "./classes/server";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';


import userRoutes from "./routes/usuario";
import postRoutes from './routes/post';

const server = new Server();

//Body parser
server.app.use( bodyParser.urlencoded( { extended: true }) );
server.app.use( bodyParser.json() );


//FileUpload
server.app.use( fileUpload() );




//Rutas de mi app
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);


//Conectar DB
//   mongoose.connect('mongodb://localhost:27017/fotosgram',
//                   { useNewUrlParser: true, useCreateIndex: true }, ( err ) => {
//           if( err ) throw err;
//           console.log('Base de datos online');
//       });

 mongoose.connect('mongodb://localhost:27017/fotosgram').then(() =>{
     console.log("La base de datos está ONLINE");
 })
 .catch((err) => {
     if(err) throw err;
 });

//Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${ server.port}`);
});