"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const server = new server_1.default();
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//Rutas de mi app
server.app.use('/user', usuario_1.default);
//Conectar DB
//   mongoose.connect('mongodb://localhost:27017/fotosgram',
//                   { useNewUrlParser: true, useCreateIndex: true }, ( err ) => {
//           if( err ) throw err;
//           console.log('Base de datos online');
//       });
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram').then(() => {
    console.log("La base de datos está ONLINE");
})
    .catch((err) => {
    if (err)
        throw err;
});
//Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});