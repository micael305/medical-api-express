import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
console.log(PORT)

app.get('/', (req, res) => {
    res.send(`
        <h1>ExpressJS</h1>
        <p>Esta es un aplicación node.js con express.js</p>
        <p>Corre en el puerto ${PORT}</p>`);
})

app.listen(PORT, () => {
    console.log('Our app is working')
})