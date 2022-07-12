import 'dotenv/config';
import { Client, MessageEmbed, TextChannel } from "discord.js";
import * as fs from "fs";


if(!process.env['DISCORD_TOKEN']) {
    throw new Error("Missing enviroment variables")
}

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]
});

const run = () => {

    setInterval(() => {
        getPost();
    }, 10000);
}

const getPost = () => {
    fetch("https://nomadcoders.co/graphql", {
        "method": "POST",
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"operationName\":\"threadsByCategory\",\"variables\":{\"page\":1,\"newestFirst\":true,\"category\":\"bla-bla\"},\"query\":\"query threadsByCategory($page: Int!, $newestFirst: Boolean!, $category: String!) {  threadsByCategory(page: $page, newestFirst: $newestFirst, category: $category){threads{...ThreadParts}}} fragment ThreadParts on ThreadType {\\n  id\\n  user{username}\\n  title\\n  isPinned}\"}", 
    }).then((response) => response.json()).then((data) => deletePin(data.data.threadsByCategory.threads));
}

const deletePin = (data: any) => {
    while(data[0].isPinned){
        console.log("good")
        data.shift()
    }
    checkPost(data)
}



const checkPost = (data: any) => {
    const jsonFile:any = fs.readFileSync('./lastpost.json');
    const jsonData:any = JSON.parse(jsonFile);
    // console.log(jsonData['bla-bla']);
    // console.log(data[0].id);

    
    if (jsonData['bla-bla'] != data[0].id) {
        const embed:any = new MessageEmbed()
        .setTitle(data[0].title)
        .setImage('https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fd1telmomo28umc.cloudfront.net%2Fmedia%2Fseo%2Fcommunity.jpg')
        .setDescription(`Posted in: #${(client.channels.cache.get(`${process.env.bla_bla}`) as TextChannel).name}\n\nBy: ${data[0].user.username}\n\n게시글이 등록되었어요!\n\n[체키라웃 :point_right::skin-tone-2:](https://nomadcoders.co/community/thread/${data[0].id})\n\n[${data[0].title} – 노마드 코더 Nomad Coders](https://nomadcoders.co/community/thread/${data[0].id})\nPost on 노마드 코더 Community `);
        (client.channels.cache.get(`${process.env.bla_bla}`) as TextChannel).send({embeds: [embed]});

        // jsonData['bla-bla'] = data[0]['id'];
        // fs.writeFileSync('./lastpost.json', jsonData);
        // (client.channels.cache.get(process.env.bla_bla) as TextChannel).send('Hello here!');
    }

}


client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    run()
});


client.login(process.env.DISCORD_TOKEN)