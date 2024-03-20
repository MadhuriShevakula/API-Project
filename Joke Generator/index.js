import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
let apiURL='';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs", {joke: null});
})

app.post('/generate-joke', async (req,res) => {

    const baseURL = 'https://v2.jokeapi.dev';
    let params = [];
    let cat= []; 

    try{
        const {categories, language, blackListFlags, "joke-type": type} = req.body;
        
        if(categories && categories.length >0){
            // categories.join(",");
            const categoriesArray = Array.isArray(categories) ? categories : [categories];
            categoriesArray.forEach(category => {
                cat.push(category);
                
            });
            // cat.push(`categories=${categories.join(",")}`);
        }

        if(language){
            params.push(`lang=${language}`);
        }

        if(blackListFlags && blackListFlags.length > 0){
            params.push(`blackListFlags=${blackListFlags.join(",")}`);
        }

        if(type){
            params.push(`type=${type}`);
        }
        if(categories===''){
            apiURL=`${baseURL}/joke/${params.join("&")}`;
        }
        else {
            apiURL=`${baseURL}/joke/${cat.join(",")}?${params.join("&")}`;
        }

        console.log(apiURL);

        const result = await axios.get(apiURL);

        // console.log(result.data);
        // console.log(result.data.joke);
        if(result.data.error){
            res.render("index.ejs", {joke: null, error: "No joke found"});
        }
        else {
            let renderData = {};

            if (type === "single") {
                renderData = result.data.joke !== undefined ? { joke: result.data.joke } : { joke: null, error: "Invalid joke format" };
            } else if (type === "twopart") {
                renderData = result.data.setup !== undefined ? { setup: result.data.setup, delivery: result.data.delivery } : { joke: null, error: "Invalid joke format" };
            } else {
                renderData = result.data.joke !== undefined ? { joke: result.data.joke } : { joke: null, error: "Joke Not Found" };
            }

            res.render("index.ejs", renderData);
        }
        // else{
        //     console.log(result.data.joke)
        //     if(type==="single"){
        //         if(result.data.joke!==undefined)
        //             res.render("index.ejs", {joke: result.data.joke});
        //         else
        //             res.render("index.ejs", {joke: null, error: "Invalid joke format"});
        //     }
        //     else if(type==="twopart"){
        //         if(result.data.joke!==undefined)
        //             res.render("index.ejs", {setup: result.data.setup, delivery: result.data.delivery});
        //         else
        //         res.render("index.ejs", {joke: null, error: "Invalid joke format"});
        //     }
        //     else{
        //         if(result.data.joke===undefined)
        //             res.render("index.ejs", {joke: null, error: "Invalid joke type or format"});
        //         else
        //            res.render("index.ejs", {joke: result.data.joke});  

        //     }
        // }
    }catch(error){
        console.log(error);
        res.render("index.ejs", {error: error.message})
    }
})

app.listen(port, () => {
    console.log(`server listening on ${port}`);
})