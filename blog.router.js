const express = require('express')
const Article = require('./models/Article.model')
const Commentary = require('./models/Commentary.model')
const Author = require('./models/Author.model')

// Création d'un nouvel objet "Router"
let blogRouter = express.Router();

/**
 * GET /
 * Affiche la page d'accueil et tous les articles
 */
blogRouter.get('/', (req, res) => {
    Article.find().populate('author category').exec().then(articles => {
        res.render('index', { articles })
    }).catch(error => res.send(error.message))
})


/**
 * GET /article/:id
 * Affiche le détail d'un article en fonction de l'ID demandé
 */
blogRouter.get('/article/:id', (req, res) => {
    Promise.all ([
        Article.findById( req.params.id ).populate('author category').exec(),
        Commentary.find({commentaryLink: req.params.id}).populate('author commentaryLink').exec()
    ])
    .then(([article, commentaries]) => {
        if (!article) return Promise.reject(new Error('Article inexistant.'))
            res.render('article', { article, commentaries })
    }).catch(error => res.send(error.message))
})

/**
 * GET /admin/writeCommentary
 * Affiche le formulaire permettant de créer un nouvel article
 */
blogRouter.get('/:id/writeCommentary', (req, res) => {
    // Va récupérer la liste des auteurs et des categories en base, et les passent à la vue
    Promise.all([
        Author.find().sort('name'),
        Article.findById(req.params.id).populate('author').exec()
    ])
    .then(([authors, article]) => res.render('writeCommentary', { authors, article }))
    .catch(error => res.send(error.message))
})

/**
 * POST /writeCommentary
 * Récupère les données du formulaire et crée l'article dans la base.
 */
blogRouter.post('/:id/writeCommentary', (req, res) => {
    Commentary.createCommentary( req.params.id, req.body.contenu, req.body.auteur).then(() => {
        res.redirect('/')
    }).catch(error => res.send(error.message))
})


// Exporte l'objet Router créé
module.exports = blogRouter