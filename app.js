import express from 'express';

const app = express();

app.disable('x-powered-by');

app.use('/', express.static('src'));
app.use('/dist', express.static('dist'));

app.listen(9001, err => {
    console.log(`[ + ] The server is running.`);
});