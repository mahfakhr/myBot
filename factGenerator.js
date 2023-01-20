const { createClient } = require('pexels');
const Jimp = require('jimp');
const fs = require('fs');
let { facts } = require('./fact');

function randomFact() {
	const fact = facts[randomInteger(0, facts.length - 1)];
	return fact;
}

async function generateImage(imagePath) {
	const fact = randomFact();
	const photo = await getRanodmImage(fact.animal);
	await editImage(photo, imagePath, fact.fact);
}

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRanodmImage(animal) {
	try {
		const client = createClient(process.env.PEXELS_API_KEY);
		const query = animal;
		let image;
		await client.photos.search({ query, per_page: 10 }).then((res) => {
			const images = res.photos;
			image = images[randomInteger(0, images.length - 1)];
		});
		return image;
	} catch (error) {
		console.log(error);
		getRanodmImage(animal);
	}
}

async function editImage(image, imagePath, fact) {
	try {
		const imageUrl = image.src.medium;
		let animalImage = await Jimp.read(imageUrl).catch((err) =>
			console.log(error)
		);
		const animalImageWidth = animalImage.bitmap.width;
		const animalImageHeight = animalImage.bitmap.height;
		let imageDarkner = await new Jimp(
			animalImageWidth,
			animalImageHeight,
			'#000000'
		);
		imageDarkner = imageDarkner.opacity(0.5);
		animalImage = await animalImage.composite(imageDarkner, 0, 0);
		let posX = animalImageWidth / 15;
		let posY = animalImageHeight / 15;
		let maxWidth = animalImageWidth - posX * 2;
		let maxHeight = animalImageHeight - posY;

		let font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
		await animalImage.print(
			font,
			posX,
			posY,
			{
				text: fact,
				alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
				alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
			},
			maxWidth,
			maxHeight
		);

		await animalImage.writeAsync(imagePath);
		console.log('Image generated successfully');
	} catch (erorr) {
		console.log(erorr);
	}
}
const deleteImage = (imagePath) => {
	fs.unlink(imagePath, (err) => {
		if (err) {
			return;
		}
		console.log('file deleted');
	});
};

module.exports = { generateImage, deleteImage };
