const express = require('express')
const Author = require('./models/Author.model')
const Category = require('./models/Category.model')
const Article = require('./models/Article.model')
const Commentary = require('./models/Commentary.model')

// Création d'un nouvel objet "Router"
let adminRouter = express.Router();

/**
 * GET /admin/
 * Affiche la page d'accueil de l'espace d'administration (et la liste des articles)
 */
adminRouter.get('/', (req, res) => {
    Promise.all([
    Article.find().populate('author category').exec(),
    Commentary.find().populate('author commentaryLink').exec()
    ])
    .then(([articles, commentaries]) => {
        res.render('admin/admin', { articles, commentaries })
    }).catch(error => res.send(error.message))
})

/**
 * GET /admin/write
 * Affiche le formulaire permettant de créer un nouvel article
 */
adminRouter.get('/write', (req, res) => {
    // Va récupérer la liste des auteurs et des categories en base, et les passent à la vue
    Promise.all([
        Author.find().sort('name'),
        Category.find().sort('title')
    ])
    .then(([authors, categories]) => res.render('admin/write', { authors, categories }))
    .catch(error => res.send(error.message))
})

/**
 * POST /admin/write
 * Récupère les données du formulaire et crée l'article dans la base.
 */
adminRouter.post('/write', (req, res) => {
    Article.createArticle(req.body.titre, req.body.contenu, req.body.categorie, req.body.auteur).then(() => {
        res.redirect('/')
    }).catch(error => res.send(error.message))
})

/**
 * GET /admin/edit/:id
 * Affiche le formulaire permettant de supprimer un article via son ID
 */
adminRouter.get('/edit/:id', (req, res) => {
    // Va récupérer la liste des auteurs et des categories en base, et les passent à la vue
    Article.findById(req.params.id)
        .populate('author category')
        .then(article => {
            if (!article) return Promise.reject(new Error('Article introuvable!'))
            return article
        })
        .then(article => {
            return Promise.all([
                Author.find().sort('name'),
                Category.find().sort('title'),
                article
            ])
        })
        .then(([authors, categories, article]) => res.render('admin/edit', { authors, categories, article }))
        .catch(error => res.send(error.message))
})

adminRouter.post('/edit/:id', (req, res) => {
    Article.updateArticle(req.params.id, req.body.titre, req.body.contenu, req.body.categorie, req.body.auteur).then(() => {
        res.redirect('/admin')
    }).catch(error => res.send(error.message))
})

/**
 * DELETE /admin/delete/:id
 * Supprime l'article via son ID, et redirige vers l'accueil de l'espace d'administration
 */
adminRouter.get('/delete/:id', (req, res) => {
    Promise.all([
        Article.findByIdAndDelete(req.params.id),
        Commentary.findByIdAndDelete(req.params.id)
    ])
    .then(([articleDeleted, commentaryDeleted]) => {
        if (!articleDeleted && !commentaryDeleted) return Promise.reject(new Error('Article introuvable!'))
        res.redirect('/admin')
    }).catch(error => res.send(error.message))
})

adminRouter.get('/delete/:id', (req, res) => {
    Commentary.findByIdAndDelete(req.params.id).then(commentaryDeleted => {
        res.redirect('/admin')
    }).catch(error => res.send(error.message))
})

// Exporte l'objet Router créé
module.exports = adminRouter