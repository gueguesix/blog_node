require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

const adminRouter = require('./admin.router.js')
const blogRouter = require('./blog.router.js')

app.set('view engine', 'pug') // Indique à Express que le moteur de templating à utiliser sera "Pug"
app.set('views', './views') // Indique à Express le dossier où se trouvent les vues (fichiers .pug)
app.set('view cache', process.env.NODE_ENV === 'production')

const PORT = 9000
const HOST = 'localhost'

app.use(express.static(path.join(__dirname, 'public'))) // Vérifie les requêtes de ressources publiques (css, images, js, ...)
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', blogRouter) // Traite les routes pour la partie front-office
app.use('/admin', adminRouter) // Traite les routes pour la partie back-office (/admin)

// Démarrage de l'application
// -----------------------------------------

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env // Récupère les valeurs des variables d'environnement présentes dans le fichier ".env"
const startApp = app => { // Création d'une fonction qui renvoie une promesse résolue (ou rejetée) en fonction du résultat du "app.listen" d'Express
    return new Promise( (resolve, reject) => {
        const server = app.listen(PORT, HOST, resolve)
        server.on('error', reject)
    } );
}

mongoose
    .connect(`mongodb://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {useNewUrlParser:true})
    .then(() => console.log('MongoDB : Connexion établie'))
    .then(() => startApp(app))
    .then(() => console.log(`Express : Le serveur écoute sur http://${HOST}:${PORT}`))
    .catch(err => console.error(err.message))