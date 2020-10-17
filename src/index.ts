import Express from './app';

const { PORT } = process.env;

Express.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`);
});
