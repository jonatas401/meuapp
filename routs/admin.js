const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categoria')
require("../models/postagem")
const postagem = mongoose.model('postagens')
const {eAdmin} = require('../helpers/eAdmin')



router.get('/categorias', eAdmin, (req, res)=>{
    Categoria.find().sort({date: 'desc'}).then((categoria)=>{
        res.render('admin/categorias', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'error ao listar categorias')
        res.redirect('/')
    })
   

})

router.post('/categorias/nova', eAdmin,(req,res)=>{
   var erros= []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome==null){
        erros.push({texto: "nome invalido"})
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug==null){
        erros.push({texto: "slug invalido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'nome muito pequeno'})
    }
    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{


    const NovaCategoria= {
    nome: req.body.nome,
    slug: req.body.slug
}
    

new Categoria(NovaCategoria).save().then(()=>{
    req.flash('success_msg', "categoria criada com sucesso")
    res.redirect('/categorias')
}).catch((err)=>{
    req.flash('error_msg', 'houve um error' + err)
    res.redirect('/')
})
    }
})


router.get('/categorias/add', eAdmin,(req, res)=>{
    res.render('admin/addcategorias')
})


router.post('/categorias/edit',eAdmin,(req, res)=>{
    var erros=[]

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome==null){
        erros.push({texto:'nome invalido!'})
    }
    if(!req.body.slug || typeof req.body.slug== undefined || req.body.slug==null){
        erros.push({texto:'slug invalido!'})
    }
    if (req.body.nome.length < 2){
        erros.push({texto:'nome muito pequeno!'})
    }
    if(erros.length>0){
        res.render('admin/editcategorias', {erros: erros})
    }else {



    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
       
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg', 'categoria editada com sucesso')
            res.redirect('/categorias')
        }).catch((err)=>{
            req.flash('error_msg', "erro ao editar categoria")
            res.redirect('/categorias')
        })
    }).catch((err)=>{
        req.flash|("error_msg", "erro ao editar categoria")
        res.redirect('/categorias')
    })
}
})


router.post('/categoria/deletar',eAdmin,(req, res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', "deletada com sucesso")
        res.redirect('/categorias')
    }).catch((err)=>{
        req.flash('error_msg', "arro ao deletar categoria")
        res.redirect('/categorias')
    })
})


router.get('/categorias/edit/:id',eAdmin,(req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg','id nao encontrado')
        res.redirect('/categorias')
    })
   
})

router.get('/postagens', eAdmin,(req, res)=>{
    postagem.find().populate('categoria').sort({date: 'desc'}).then((postagem)=>{
        res.render('admin/postagens', {postagem:postagem})
    }).catch((err)=>{
        req.flash('error_msg', 'erro ao listar postagens!')
        res.render('admin/postagens')
    })

   
})

router.get('/postagens/add', eAdmin,(req, res)=>{
    Categoria.find().then((categoria)=>{
        res.render('admin/addpostagem', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg',"error ao carregar formulario")
        res.redirect('/postagens')
    })
    
})


router.post('/postagem/nova',eAdmin, (req, res)=>{
  var erross=[]

   
   if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo==null){
    erross.push({texto:'titulo invalido!'})
}
    if(!req.body.slug || typeof req.body.slug==undefined || req.body.slug==null){
        erross.push({texto: 'slug invalido'})
    }
    if(!req.body.descriçao || typeof req.body.descriçao==undefined || req.body.descriçao==null ){
        erross.push({texto: 'descriçao invalida'})
    }
    if(!req.body.conteudo || typeof req.body.conteudo==undefined || req.body.conteudo==null){
        erross.push({texto: 'conteudo invalido'})
    }
    if(req.body.categoria=="0"){
        erross.push({texto:'categoria invalida'})
    }
    if(erross.length>0){
        res.render('admin/addpostagem', {erross: erross})
      
    }
    
    else {
        const novaPostagem={
            titulo: req.body.titulo,
            slug: req.body.slug,
            descriçao: req.body.descriçao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
           

        }
        new postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', 'postagem salva com sucesso!')
            res.redirect('/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'houve um error ao postar')
            res.redirect('/postagens')
        })
     

   }

})
router.get('/postagens/edit/:id', eAdmin,(req, res)=>{
   
    postagem.findOne({_id: req.params.id}).then((postagem)=>{

    Categoria.find().then((categoria)=>{
        res.render('admin/editpostagens',{categoria: categoria ,postagem: postagem})
        req.flash('success_msg', 'editada com sucesso')
    }).catch((err)=>{
        req.flash('error_msg', 'error ao listar categorias')
    })


    }).catch((err)=>{
        req.flash('error_msg', 'error ao encotrar postagem')
        res.redirect('/postagens')
    })
})

router.post('/postagem/edit', eAdmin,(req, res)=>{
    postagem.findOne({_id: req.body.id}).then((postagem)=>{
        
        postagem.titulo= req.body.titulo
        postagem.slug = req.body.titulo
        postagem.descriçao= req.body.descriçao
        postagem.conteudo = req.body.conteudo
        postagem.categoria= req.body.categoria


        postagem.save().then(()=>{
        req.flash('success_msg', 'post editado com sucesso!')
        res.redirect('/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'erro ao editar categoria')
        res.redirect('/postagens')
    })
})



router.post('/postagem/deletar',eAdmin,(req, res)=>{
    postagem.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'postagem deletada com sucesso')
        res.redirect('/postagens')
    }).catch((err)=>{
        req.flash('error_msg', 'falha ao deletar post')
        res.redirect('/postagens')
    })
})



module.exports= router