const telegraf = require('telegraf');
const { v4: uuidV4 } = require('uuid');
require('dotenv').config();
const factGenerator = require('./factGenerator');

const bot = new telegraf.Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	const message = 'please use the /fact command to recieve a new fact';
	ctx.reply(message);
});

bot.command('fact', async (ctx) => {
	try {
		console.log(ctx);
		ctx.reply('please wait i am generating an image !!!');
		const imagePath = `./temp/${uuidV4()}.jpg`;
		await factGenerator.generateImage(imagePath);
		await ctx.replyWithPhoto({ source: imagePath });
		factGenerator.deleteImage(imagePath);
	} catch (error) {
		console.log(error);
		ctx.reply('error happend in sending image!');
	}
});

bot.launch();
