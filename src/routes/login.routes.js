import express from 'express';


const routerLogin = new express.Router();

routerLogin.get('/login', (req, res) => {
    let user = req.query.user;

    req.session.user = user;
    res.send("El usuario fue guardado");

})


export default routerLogin;