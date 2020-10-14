import Express from './app';
import "./services/cronjob";


const { PORT } = process.env;


Express.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});