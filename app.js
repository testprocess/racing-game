import express from 'express';

const app = express();

app.disable('x-powered-by');

app.use('/', express.static('src'));
app.use('/dist', express.static('dist'));
app.use('/public', express.static('public'));

app.listen(9002, err => {
    console.log(`[ + ] The server is running.`);
});