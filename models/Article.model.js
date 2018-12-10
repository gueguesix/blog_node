/**
 * Fichier définissant le schéma Mongoose d'un article
 */

const mongoose = require('mongoose')
const shortid = require('shortid')
const idValidator = require('mongoose-id-validator')

// Création d'un nouveau Schema mongoose : ce schéma permettra d'indiquer à mongoose quelle doit être la structure d'un document `Article` qui entre dans la base.
// C'est un peut comme définir les champs d'une table avec MySQL et phpMyAdmin
const articleSchema = mongoose.Schema({
    '_id'         : {type : String, required : true, default : shortid.generate  },
	'title'       : {type : String, required : true},
	'dateCreated' : {type : Date,   required : true, default : Date.now},
	'content'     : {type : String, required : true},
	'category'    : {type : String, required : true, ref : 'Category'},
	'author'      : {type : String, required : true, ref : 'Author'},
})

// Plugin qui permet de s'assurer que les IDs entrants correspondent aux "ref" du champs
articleSchema.plugin(idValidator)


articleSchema.statics.createArticle = function createArticle(title, content, category, author) {
    let errors = [];
    if (title.trim() === '') errors.push(`Le titre doit être renseigné`)
    if (content.trim() === '') errors.push(`Le contenu doit être renseigné`)
    if (category.trim() === '') errors.push(`La catégorie doit être renseignée`)
    if (author.trim() === '') errors.push(`L'auteur doit être renseigné`)

    if (errors.length > 0)
        return Promise.reject(new Error(errors.join('<br>')))
    
    return this.create({
        title,
        content,
        category,
        author
    })
}

articleSchema.statics.updateArticle = function updateArticle(id, title, content, category, author) {
    let errors = [];
    if (title.trim() === '') errors.push(`Le titre doit être renseigné`)
    if (content.trim() === '') errors.push(`Le contenu doit être renseigné`)
    if (category.trim() === '') errors.push(`La catégorie doit être renseignée`)
    if (author.trim() === '') errors.push(`L'auteur doit être renseigné`)

    if (errors.length > 0)
        return Promise.reject(new Error(errors.join('<br>')))
        
    return this.findByIdAndUpdate(id, {
        title,
        content,
        category,
        author
    })
}

// Et sur la base de ce schéma, on exporte un nouveau modèle Mongoose qui permettra de manipuler et créer des documents de type `Article` dans la base Mongo
module.exports = mongoose.model('Article', articleSchema)
