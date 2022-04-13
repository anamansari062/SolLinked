import dayjs from "dayjs"

export class Post {
    constructor(publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.tag = accountData.tag
        this.title = accountData.title
        this.content = accountData.content
    }

    get key() {
        return this.publicKey.toBase58()
    }

    get author_display() {
        const author = this.author.toBase58()
        return author.slice(0, 4) + '..' + author.slice(-4)
    }

    get created_at() {
        return dayjs.unix(this.timestamp).format('lll')
    }

    get created_ago() {
        return dayjs.unix(this.timestamp).fromNow()
    }
}