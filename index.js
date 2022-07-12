// require("dotenv").config();
//
// const schedule = require("node-schedule");
// const {Client, Intents} = require('discord.js');
// const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, "GUILDS"]});
//
// const axios = require("axios");

const axios = require("axios");
const cheerio = require("cheerio");
const getHtml = async () => {
    try {
        return await axios.get("https://opensea.io/collection/the-meta-kongz");
        // axios.get 함수를 이용하여 비동기로 네이버의 html 파일을 가져온다.
    } catch (error) {
        console.error(error);
    }
};
getHtml()
    .then((html) => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $(
            "Blockreact__Block-sc-1xf18x6-0 Textreact__Text-sc-1w94ul3-0 cLsBvb kscHgv"
        ).children("li.ah_item");
        $bodyList.each(function (i, elem) {
            ulList[i] = {
                title: $(this).find("span.ah_k").text(),
                url: $(this).find("a.ah_a").attr("href"),
            };
        });
        const data = ulList.filter((n) => n.title);
        return data;
    })
    .then((res) => console.log(res));
// const getPrice = async () => {
//     let ret = (await axios.get(`http://127.0.0.1:8000/price?token=${process.env.COIN}`)).data;
//     if (ret.error) throw new Error("error");
//     return ret;
// };
//
// const sleep = time => new Promise(r => setTimeout(r, time));
// const getPriceSafely = async () => {
//     while (true) {
//         try {
//             let {p, p24} = await getPrice();
//             p = Math.floor(p);
//             p24 = Math.floor(p24);
//
//             return [p, p24];
//         } catch (e) {
//             console.log(e);
//             await sleep(1000);
//         }
//     }
// };
//
// const run = async () => {
//     let [p, p24] = await getPriceSafely();
//
//     let percent = Math.floor((p - p24) / p24 * 10000) / 100;
//     client.user.setActivity(`${process.env.SYMBOL} | ${percent}% ${p === p24 ? "" : (p > p24 ? "↗" : "↘")}`);
//
//     client.guilds.cache.forEach(guild => {
//         guild.me.setNickname(`₩${String(p).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`);
//     });
// };
//
//
// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//
//     run().then(() => schedule.scheduleJob("* * * * *", run));
// });













// client.on('messageCreate', async (message) => {
//     let guild = message.guild;
//     guild.me.setNickname("111111")
// });

//client.login(process.env.TOKEN);

// const axios = require('axios');
// const cache = require('./cache');
// const moment = require('moment');
// const _ = require('lodash');
// const { ethers } = require('ethers');
//
// function formatAndSendTweet(event) {
//     // Handle both individual items + bundle sales
//     const assetName = _.get(event, ['asset', 'name'], _.get(event, ['asset_bundle', 'name']));
//     const openseaLink = _.get(event, ['asset', 'permalink'], _.get(event, ['asset_bundle', 'permalink']));
//
//     const totalPrice = _.get(event, 'total_price');
//
//     const tokenDecimals = _.get(event, ['payment_token', 'decimals']);
//     const tokenUsdPrice = _.get(event, ['payment_token', 'usd_price']);
//     const tokenEthPrice = _.get(event, ['payment_token', 'eth_price']);
//
//     const formattedUnits = ethers.utils.formatUnits(totalPrice, tokenDecimals);
//     const formattedEthPrice = formattedUnits * tokenEthPrice;
//     const formattedUsdPrice = formattedUnits * tokenUsdPrice;
//
//     const tweetText = `${assetName} bought for ${formattedEthPrice}${ethers.constants.EtherSymbol} ($${Number(formattedUsdPrice).toFixed(2)}) #NFT ${openseaLink}`;
//
//     console.log(tweetText);
//
//     // OPTIONAL PREFERENCE - don't tweet out sales below X ETH (default is 1 ETH - change to what you prefer)
//     // if (Number(formattedEthPrice) < 1) {
//     //     console.log(`${assetName} sold below tweet price (${formattedEthPrice} ETH).`);
//     //     return;
//     // }
//
//     // OPTIONAL PREFERENCE - if you want the tweet to include an attached image instead of just text
//     // const imageUrl = _.get(event, ['asset', 'image_url']);
//     // return tweet.tweetWithImage(tweetText, imageUrl);
// }
// setInterval(() => {
//     const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(59, "seconds").unix();
//
//     console.log(`Last sale (in seconds since Unix epoch): ${cache.get('lastSaleTime', null)}`);
//
//     axios.get('https://api.opensea.io/api/v1/events', {
//         headers: {
//             'X-API-KEY': '59065d802d5a462ea82b610717a457de'
//         },
//         params: {
//             collection_slug: 'sunmiya-club-official',
//             event_type: 'successful',
//             occurred_after: lastSaleTime,
//             only_opensea: 'false'
//         }
//     }).then((response) => {
//         const events = _.get(response, ['data', 'asset_events']);
//
//         const sortedEvents = _.sortBy(events, function(event) {
//             const created = _.get(event, 'created_date');
//
//             return new Date(created);
//         })
//
//         console.log(`${events.length} sales since the last one...`);
//
//         _.each(sortedEvents, (event) => {
//             const created = _.get(event, 'created_date');
//
//             cache.set('lastSaleTime', moment(created).unix());
//             console.log(event)
//             // return formatAndSendTweet(event);
//         });
//     }).catch((error) => {
//         console.error(error);
//     });
// }, 10000);
//