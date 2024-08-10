import dotenv from 'dotenv';
import { connectToDB } from './db/index.js';
import { app } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error => {
    console.log('MongoDB Connection Error:', error);
})) 