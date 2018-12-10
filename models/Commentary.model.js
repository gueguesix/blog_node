/**
 * Fichier définissant le schéma Mongoose d'un commentaire
 */

const mongoose = require('mongoose')
const shortid = require('shortid')
const idValidator = require('mongoose-id-validator')

// Création d'un nouveau Schema mongoose : ce schéma permettra d'indiquer à mongoose quelle doit être la structure d'un document `Commentary` qui entre dans la base.
// C'est un peut comme définir les champs d'une table avec MySQL et phpMyAdmin
const commentarySchema = mongoose.Schema({
    '_id'         : {type : String, required : true, default : shortid.generate  },
	'dateCreated' : {type : Date,   required : true, default : Date.now},
	'content'     : {type : String, required : true},
    'author'      : {type : String, required : true, ref : 'Author'},
    'commentaryLink' : {type : String, required : true, ref : 'Article'}
})

// Plugin qui permet de s'assurer que les IDs entrants correspondent aux "ref" du champs
commentarySchema.plugin(idValidator)


commentarySchema.statics.createCommentary = function createCommentary(commentaryLink, content, author) {
    let errors = [];
    if (content.trim() === '') errors.push(`Le contenu doit être renseigné`)
    if (author.trim() === '') errors.push(`L'auteur doit être renseigné`)

    if (errors.length > 0)
        return Promise.reject(new Error(errors.join('<br>')))
    
    return this.create({
        content,
        author,
        commentaryLink
    })
}

commentarySchema.statics.updateCommentary = function updateCommentary(id, title, content, commentaryLink, author) {
    let errors = [];
    if (content.trim() === '') errors.push(`Le contenu doit être renseigné`)
    if (author.trim() === '') errors.push(`L'auteur doit être renseigné`)

    if (errors.length > 0)
        return Promise.reject(new Error(errors.join('<br>')))
        
    return this.findByIdAndUpdate(id, {
        content,
        author,
        CommentaryLink
    })
}

// Et sur la base de ce schéma, on exporte un nouveau modèle Mongoose qui permettra de manipuler et créer des documents de type `Commentary` dans la base Mongo
module.exports = mongoose.model('Commentary', commentarySchema)
