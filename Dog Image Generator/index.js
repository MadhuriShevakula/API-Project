import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let baseURL = 'https://dog.ceo/api/';

let breeds = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


axios.get(`${baseURL}breeds/list/all`)
    .then(response => {
        breeds = response.data.message;
        // console.log(breeds)
    })
    .catch(error => {
        console.error('Failed to fetch breeds:', error);
    });


app.get("/", async (req, res) => {
    // try {
    //     const result = await axios.get(`${baseURL}breeds/list/all`);
    //     const breeds = result.data.message;
    //     res.render("index.ejs", {breeds: breeds, breed: null});
    // } catch (error) {
    //     console.log(error);
        res.render("index.ejs", { breeds: breeds, breed: req.query.breed || null });
    // }
});

app.get("/random", async (req, res) => {
    try {
        const {breed, subbreed } = req.query;
        let endpoint = 'breeds/image/random';
        if (breed && subbreed) {
            endpoint = `breed/${breed}/${subbreed}/images/random`;
        } else if (breed) {
            endpoint = `breed/${breed}/images/random`;
        }
        // console.log(breed)
        const response = await axios.get(`${baseURL}${endpoint}`);
        const imgURL = response.data.message;
        res.render("index.ejs", { breeds, imgURL,  breed});
    } catch (error) {
        console.log(error);
        res.render("index.ejs", { breeds, error: 'Failed to fetch image. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`server listening on ${port}`);
});


