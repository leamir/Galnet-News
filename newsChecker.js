const axios = require('axios');
const cheerio = require('cheerio');

function run(index, callback) {

    axios.get('https://community.elitedangerous.com').then(({ data }) => {
        const $ = cheerio.load(data); // Initialize cheerio
        const articlesTitles = 
            $('.article h3 a')
                .map((_, a) => $(a).text())
                .toArray()
        let articlesBody = 
            $('.article p')
                .map((_,a) => $(a).text())
                .toArray()
        const articlesDate = articlesBody.filter(a => new RegExp('^[0-9]{2} [A-Za-z]{3} [0-9]+$').test(a))
        articlesBody = articlesBody.filter(a => !new RegExp('^[0-9]{2} [A-Za-z]{3} [0-9]+$').test(a))
        
        callback({
            title: articlesTitles[index], 
            date: articlesDate[index], 
            body: articlesBody[index]
        });
    });
}

module.exports = run