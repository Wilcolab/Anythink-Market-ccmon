//TODO: seeds script should come here, so we'll be able to put some data in our local env

const mongoose = require('mongoose');

require('../models/User');
require('../models/Item');
require('../models/Comment');


const Item = mongoose.model('Item');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI);
} else {
    console.warn('Missing MONGODB_URI env');
}

let userId;
let itemId;

async function seedDatabase() {
    const users = Array.from(Array(100)).map((_item, i)=> ({
        username: `fakeuser${i}`,
        email:`fakeuser${i}@anythink.com`,
        bio:'test bio',
        image:'https://picsum.photos/200',
        role:'user',
        favorites:[],
        following: [],
    }))

    for(let user of users){
        const u = new User(user);

        const dbItem = await u.save();

        if(!userId) {
            userId = dbItem._id;
        }
    }

    
    const items = Array.from(Array(100)).map((_item, i) => ({
        slug: `fakeitem${i}`,
        title: `Fake Item ${i}`,
        description: 'test description',
        image:'https://picsum.photos/200',
        comments: [],
        tagList: ['test', 'tag'],
        seller: userId,
    }))

    for (item of items) {
        const it = new Item(item);

        const dbItem = await it.save();

        if(!dbItem) {
            itemId = dbItem
        }
    }

    const comments = Array.from(Array(100)).map((_item, i) => ({
        body: 'This is a test body',
        seller: userId,
        item: itemId,
    }))

    for (comment of comments) {
        const c = new Comment(comment);

        await c.save();
    }
}

seedDatabase().then(() => {
    process.exit();
}).catch((err) => {
    console.error(err);
    process.exit();
})