const mongoose=  require('mongoose');
const Schema = mongoose.Schema;

const postagem = new Schema ({
    titulo: {
        type: String,
        required: true
    }, 
    slug:{
        type: String,
        required: true
    },
    descriçao:{
        type: String,
        required: true
    }, 
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: String,
        ref: "categoria",
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }

})


mongoose.model("postagens", postagem);
