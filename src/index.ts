import 'dotenv/config';
import * as fs from "fs";
import axios from "axios";
import og from 'open-graph';
import {Client, MessageEmbed, TextChannel} from "discord.js";


const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]
});

client.login(process.env.DISCORD_TOKEN)

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    run()
});

const run = () => {
    setInterval( async () => {
        const jsonFile: any = fs.readFileSync('./config.json');
        const jsonData: any = JSON.parse(jsonFile);
        for(const key in jsonData) {
            const data = await getPost(key);
            checkPost(deletePin(data), key)
        }
    }, 60000);
}

const getPost = async (key:any) => {
    const {data} = await axios.post("https://nomadcoders.co/graphql", `{\"operationName\":\"threadsByCategory\",\"variables\":{\"page\":1,\"newestFirst\":true,\"category\":\"${key}\"},\"query\":\"query threadsByCategory($page: Int!, $newestFirst: Boolean!, $category: String!) {  threadsByCategory(page: $page, newestFirst: $newestFirst, category: $category){threads{...ThreadParts}}} fragment ThreadParts on ThreadType {\\n  id\\n  user{username}\\n  title\\n  isPinned}\"}`, {
        "headers": {
            "content-type": "application/json",
        },
    });
    return data.data.threadsByCategory.threads;
}

const deletePin = (data: any) => {
    while (data[0].isPinned) {
        data.shift()
    }
    
    return data
}

const checkPost = (data: any, key:any) => {
    const jsonFile: any = fs.readFileSync('./config.json');
    const jsonData: any = JSON.parse(jsonFile);
    if (!jsonData[`${key}`].latestId) {
        jsonData[`${key}`].latestId = data[0]['id'];
        fs.writeFileSync('./config.json', JSON.stringify(jsonData));
    } else if (jsonData[`${key}`].latestId != data[0].id) {
        const postIndex: any = data.indexOf(data.find((v: { id: any; }) => v.id === jsonData[`${key}`].latestId));

        for (let i = postIndex - 1; i >= 0; i--) {
            sendEmbed(data[i], jsonData[`${key}`].channelId)
        }
        jsonData[`${key}`].latestId = data[0]['id'];
        fs.writeFileSync('./config.json', JSON.stringify(jsonData));
    } else {
    }
}

const sendEmbed = (data: any, channelId: any) => {
    const url = `https://nomadcoders.co/community/thread/${data.id}`;
    og(url, (_err, meta:any) => {
        if (channelId) {
            const embed: any = new MessageEmbed()
                .setTitle(data.title)
                .setImage(meta.image.url)
                .setDescription(`Posted in: #${(client.channels.cache.get(`${channelId}`) as TextChannel).name}\n\nBy: ${data.user.username}\n\n게시글이 등록되었어요!\n\n[체키라웃 :point_right::skin-tone-2:](${url})\n\n[${meta.title}](${url})\n${meta.description}`);
            (client.channels.cache.get(`${channelId}`) as TextChannel).send({embeds: [embed]});
        }
    });
}