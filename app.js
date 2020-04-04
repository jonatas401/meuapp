const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routs/admin.js');
const path = require('path');
const mongoose = require ("mongoose");
const session = require('express-session');
const flash = require('connect-flash')
require('./models/postagem')
const Postagem= mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categoria')
const routes = require('./routs/usuario')
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./db/db')


//configurações

//sessions
app.use(session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(flash());
//midleware
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next();
})  




//body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
//handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    
    //conectando com banco de dados mongoose
    mongoose.promise = global.promise;
    mongoose.connect(db.mongoURI).then(()=>{
        console.log('conectado com o banco de dados com sucesso !')
    }).catch((err)=>{
        console.log('houve um error'+err);
    })

    
    //public para  poder usar o css e o js
    app.use(express.static(path.join(__dirname,'public')));


    
//rotas

app.get('/home', (req, res)=>{
    Postagem.find().populate("categoria").sort({date:'desc'}).then((postagens)=>{
        res.render('index', {postagens: postagens})
    }).catch((err)=>{
   req.flash('error_msg', 'houve um error na pagina principal')
   res.redirect('/404')
    })
    
})
app.get('/publico/postagem/:slug', (req,res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }
        else{
            req.flash('error_msg', 'está postagem não existe!')
            res.redirect('/home')
        }
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro ao carregar a pagina')
        res.redirect('/home')
    })
})

app.get('/publico/categorias', (req,res)=>{
    Categoria.find().then((categoria)=>{
        res.render('categorias/index', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'houve um error ao listar categorias')
        res.redirect('/home')
    })
})
app.get('/publico/categorias/:slug', (req,res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
        if(categoria){

            Postagem.find({categoria: categoria._id}).then((postagens)=>{

                res.render('categorias/postagens', {postagens: postagens ,categoria: categoria})
            })
        }
        else{
            req.flash('error_msg', 'houve um erro ao encontrar categoria')
            res.redirect('/publico/categorias')
        }
    }).catch((err)=>{
        req.flash('error_msg', 'houve um error ao encontrar categoria')
        res.redirect('/publico/categorias')
    })
})

app.get('/404', (req,res)=>{
    res.send('error 404')
})

 app.use('/', admin)
 app.use('/usuario', routes)


//botando servidor local pra rodar

const PORT = process.env.PORT ||8081 
app.listen(PORT, ()=>{
    console.log('sevidor rodando na porta 8081')
})