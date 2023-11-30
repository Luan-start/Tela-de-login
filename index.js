const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors');

// Cria uma instância do servidor Express
const app = express()

// Habilita o CORS para permitir requisições de diferentes origens
app.use(cors());
app.use(express.json())
app.listen(3000);

// Array para armazenar informações 
const usuarios = []

app.post('/usuarios', (req, res) => {
    // A qui ele vai verifica se o usuário já está cadastrado pelo email
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email == req.body.email) {
            res.status(406).send("Usuário já cadastrado");
            return
        }
    }

    let hash = bcrypt.hashSync(req.body.senha, 10)

    // Cria um objeto de usuário
    let obj = {

        id: usuarios.length + 1,
        nome: req.body.nome,
        email: req.body.email,
        senha: hash,
        perfil: req.body.perfil
    }

    // Add o usuário ao array
    usuarios.push(obj)

    res.status(201).send(obj)
})

// Rota para realizar login e obter um token JWT
app.post('/usuarios/login', (req, res) => {
    let achou = false
    let token = ''

    // Verifica usuário e compara a senha 
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email == req.body.email) {
            achou = bcrypt.compareSync(req.body.senha, usuarios[i].senha)
            // Gera um token com as informações do usuário
            token = jwt.sign(
                {
                    id: usuarios[i].id,
                    nome: usuarios[i].nome,
                    email: usuarios[i].email,
                    perfil: usuarios[i].perfil
                }, '123')  
            break
        }
    }

    if (!achou) {
        res.status(404).send("Usuário ou senha inválido")
        return
    }

    res.status(200).send(token)
})
