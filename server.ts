import app from './src/app';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5100;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
