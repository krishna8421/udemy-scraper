const express = require("express");
const router = express.Router()
const cheerio = require('cheerio')
const axios = require('axios')

router.post('/apiOld', async (req, res) => {
    if(!req.body.url){
        res.status(400).json({
            message: "No url found"
        })
        return
    }
    const url = req.body.url
    const {data} = await axios.get(url)
    const $ = cheerio.load(data);
    const title = $(".clp-lead__title")
    const image = $("meta[property='og:image']").attr('content')
    const headline = $(".clp-lead__headline")
    const rating = $("span[data-purpose='rating-number']").text()+"/"+"5"
    const totalStudents = $("div[data-purpose='enrollment']").text()
    let lastUpdate
    $(".last-update-date").find("span").each((i,el)=>{
        if(i==1){
            lastUpdate = $(el).text().trim().split(" ")[2]
        }
    })
    const  language = $("div[data-purpose='lead-course-locale']").text()
    let price = $("div[data-purpose='enrollment']").html()

    console.log(price);

    res.status(200).json({
        url: url,
        image: image,   
        title: title.text().replace(/\n/g, ''),
        headline: headline.text().replace(/\n/g, ''),
        rating,
        totalStudents: totalStudents.split(" ")[0].replace(/\n/g, ''),
        lastUpdate,
        language: language.trim(),
        
    })

})


module.exports = router;