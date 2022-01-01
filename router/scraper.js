const express = require("express");
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const stringify = require('json-stringify-safe');

const scraper = async(url) =>{
    const {data} = await axios.get(url)
    const $ = cheerio.load(data);
    let id = $(".ud-component--course-landing-page-udlite--sidebar-container").attr('data-component-props')
    id = id.split('750x422/')[1].split("_")[0]


    const udemyUrl1 = `https://www.udemy.com/api-2.0/courses/${id}/?fields[course]=title,context_info,primary_category,primary_subcategory,avg_rating_recent,visible_instructors,locale,estimated_content_length,num_subscribers`
    const udemyUrl2 = `https://www.udemy.com/api-2.0/course-landing-components/${id}/me/?components=purchase,sidebar_container,curriculum_context`


    const [udemyData1,udemyData2] = await Promise.all([axios.get(udemyUrl1),axios.get(udemyUrl2)])
 

    const {title,visible_instructors,avg_rating_recent,primary_category,primary_subcategory,subcategory,locale,} = udemyData1
    const {purchase,sidebar_container,curriculum_context} = udemyData2

    return {
        udemyData1,
        udemyData2
    }
}

/*

course-landing-components/1362070/me/?components=price_text,deal_badge,discount_expiration,redeem_coupon,gift_this_course,base_purchase_section,purchase_tabs_context,subscribe_team_modal_context,lifetime_access_context
course-landing-components/1362070/me/?components=curriculum_context
contexts/me/?visiting=True&tracking=True&me=True&request=True&Config=True&experiment=sw
course-landing-components/1362070/me/?components=deal_badge,discount_expiration,gift_this_course,price_text,purchase,recommendation,redeem_coupon,cacheable_deal_badge,cacheable_discount_expiration,cacheable_price_text,cacheable_buy_button,buy_button,buy_for_team,cacheable_purchase_text,cacheable_add_to_cart,money_back_guarantee,instructor_links,incentives_context,top_companies_notice_context,curated_for_ufb_notice_context,sidebar_container,purchase_tabs_context,subscribe_team_modal_context,lifetime_access_context,available_coupons
*/



router.get('/api', async (req, res) => {
    if(!req.query.url){
        res.status(400).json({
            message: "No url found"
        })
        return
    }
    const {url} = req.query
    if(url.substring(0,29)!=="https://www.udemy.com/course/"){
        res.status(400).json({
            message: "Invalid url"
        })
        return
    }  
    const {udemyData1,udemyData2} = await scraper(url)
    res.status(200).json({
        data: udemyData1
    })
})

module.exports = router;