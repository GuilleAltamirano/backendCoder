const fs = require('fs')

class ContenedorComment {
    constructor(file){
        this.file = file;
    }

    async getAll () {
        try {
            let feedbackFile = await fs.promises.readFile(this.file, 'utf-8')
            let feedback = JSON.parse(feedbackFile)
            return feedback
        } catch (err) {console.log(`error => ${err}`)}
    }

    async getAdd (comment) {
        try {
            let comments = await this.getAll()
            comments.push(comment)
            await fs.promises.writeFile(this.file, JSON.stringify(comments))
        } catch (err) {console.log(`error => ${err}`)}
    }

}

module.exports = ContenedorComment;