const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const Genre = require('./models/genre');
const Track = require('./models/track');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/api/genres', async (context) => {
	let genres = await Genre.fetchAll();
	context.body = genres;
});

router.del('/api/tracks/:id', async (context) => {
	let id = context.params.id;
	let track = new Track({TrackId: id});
	track = await track.fetch();

	try {
		if(!track) {
			throw new Error(`Track ${id} cannot be found`);
		}
		await track.destroy();
		context.body = 'Deleted Track';
	} catch (e) {
		context.status = 422;
		context.body = {
			error: e.message
		}
	}
});

router.get('/api/genres/:id', async (context) => {
	let id = context.params.id;
	let genre = new Genre({GenreId: id});
	genre = await genre.fetch();

	try {
		if(!genre) {
			throw new Error(`Genre ${id} cannot be found`);
		}
		context.body = genre;
	} catch (e) {
		context.status = 404;
		context.body = {
			error: e.message
		};
	}
});

router.post('/api/genres', async (context) => {
	// verify that Name isn't blank
	let name = context.request.body.name;

	try {
		if(!name) {
			throw new Error('A genre must have a name');
		}

		let genre = new Genre({Name: name});
		let genreWasFound = await genre.fetch();

		if(genreWasFound) {
			throw new Error(`Genre ${name} already exists`);
		}	

		await genre.save();
		context.body = genre;	
	} catch (e) {
		context.status = 422;
		context.body = {
			error: e.message
		};
	}
});


app.use(router.routes());
app.listen(process.env.PORT || 3000);
