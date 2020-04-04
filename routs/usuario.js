const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')
require('../models/usuario')
const Usuario = mongoose.model('usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')


routes.get('/registro', (req,res)=>{
    res.render('usuario/registro')
})

routes.post('/registro', (req,res)=>{
    var erros=[]

    if(!req.body.nome|| typeof req.body.nome==null || req.body.nome==undefined){
        erros.push({texto : 'nome inválido'})
    }
    if(!req.body.email || typeof req.body.email==null || req.body.email==undefined){
        erros.push({texto: 'email inválido'})

    }
    if(!req.body.senha || typeof req.body.senha==null || req.body.senha==undefined){
        erros.push({texto: 'senha inválida'})
    }
    if(req.body.senha.length<4){
        erros.push({texto: 'senha muito fraca'})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'senhas diferentes'})
    }
    if(erros.length>0){
        res.render('usuario/registro', {erros: erros})
    }
    else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg' , 'ja existe uma conta com esse email')
                res.redirect('/usuario/registro')
            }
            else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                   

                })
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash('error_msg', 'houve um erro durante o salvamento do usuario')
                            res.redirect('/usuario/registro')
                        }
                        novoUsuario.senha= hash

                        novoUsuario.save().then(()=>{
                            req.flash('success_msg', 'usuario salvo com sucesso')
                            res.redirect('/home')
                        }).catch((err)=>{
                            req.flash('error_msg', 'erro ao cadastrar usuario')
                            res.redirect('/usuario/registro')
                        })
                    })
                })
                

            }
        }).catch((err)=>{
            req.flash('error_msg' , 'houve um error no cadastro')
            res.redirect('/usuario/registro')
        })

    }
})

routes.get('/login', (req,res)=>{
    res.render('usuario/login')
})
routes.post('/login', (req, res, next)=>{

    passport.authenticate('local',{
        successRedirect: '/home',
        failureRedirect: '/usuario/login',
        failureFlash: true
    })(req,res,next)
    
})
routes.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success_msg', 'deslogado com sucesso')
    res.redirect('/home')
})



module.exports= routes