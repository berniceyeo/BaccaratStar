import express from express
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

//Intialising the express instance 
const app = express();
// set  the express view engine to expect ejs templates 
app.set('view engine', 'ejs')
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));
// Expose the files stored in the public folder
app.use(express.static('public'));

app.listen(3004);