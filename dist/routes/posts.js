"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const postRoutes = (0, express_1.Router)();
postRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    res.json({
        ok: true
    });
});
