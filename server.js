import fetch from "node-fetch";
import { load } from "cheerio";
import { Client } from "linkedin-private-api";
import fs from 'fs';
import { join } from 'path';
import express from 'express';
import http from "http"

//make the server and the socketsio

// if (process.env.NODE_ENV !== 'production') { dotenv.config() }
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

//server static file in the public directory
// app.use(express.static(join(".", '../client/build')));
app.use(express.static('./client/build'));

//Var & Const
let result = []
const options = ["URL 1", "URL 2", "URL 3", "URL 4"];
let timerInt
let deb = 0
let inc = deb + 1
const dataURL = [
  [
    {
    "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/legacy-media-international-ltd",
    "Entreprise": "Legacy Media International Ltd"
    },
    {
    "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/runway-training",
    "Entreprise": "Runway Training"
    }
  ]
]

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
  console.log('client connecté',socket.id);

  socket.on("get_scrap", function (selectedOption) {
    console.log('get_scrap')
    timerInt = setInterval(()=>{
        console.log('get_scrap_timer_int')
        scrapAllURL(selectedOption, dataURL[0], 0, deb, inc)
    }, 5 * 1000)
  });
});

async function GetLinkedinDataFromCompany(entreprise){
    // Login
    const client = new Client();
    try {
        await client.login.userPass({ username:"georges@greenly.earth", password:"25079819987" });
    } catch (error) {
        console.log(error)
    }
    let users = []
    let company = ""
    try {
        // Fetch the job's company
        const companiesScroller = client.search.searchCompanies({
          filters: { company: entreprise, },
          limit: 1,
        })
        company = await companiesScroller.scrollNext()
        // console.log("=======> ",company)
        const peopleScroller = client.search.searchPeople({
            filters: { company: entreprise },
            limit: 50,
        })
        users = await peopleScroller.scrollNext();
    } catch (error) {
        console.log("===>erreur")
        users = []
    }
    return {
      "EntrepriseURL": company,
      "Users": users
    }
}
async function getData(dataURL, dataURLIndex, dataIndex, html, url){
  const $ = load(html)
  switch(dataURLIndex){
    case 0: {
        console.log(dataURL[dataIndex]["Entreprise"], dataURLIndex, dataIndex, url)
        $('.break-words .opacity-60 a', html).each(async(index, el) => {
          //Get Linkedin Datas
          let lnData = await GetLinkedinDataFromCompany(dataURL[dataIndex]["Entreprise"])
          let users = lnData["Users"]
          let urls = lnData["EntrepriseURL"]
          try {
              if (!(users === undefined || users === "" || users === null || users.length === 0)){
                  users.forEach((user)=>{
                      if(!(user.profile.firstName === undefined || user.profile.firstName === "" || user.profile.firstName === null)){
                          result.push({
                              "isNew": "yes",
                              "Entreprise": dataURL[dataIndex]["Entreprise"],
                              "Domaine Web Entreprise": $(el).attr("href"),
                              "Prenom": user.profile.firstName,
                              "Nom": user.profile.lastName,
                              "Poste": user.profile.occupation,
                              "URL Profil Linkedin": user.navigationUrl,
                              "Email": "",
                              "Telephone": ""
                          })
                      }
                  })
                  //Show to the table
                  io.emit("scrap_result", result);
                  result = [];
              }
          } catch (error) {
              console.error("pass")
          }
      })
    } 
  }
}
async function firstScrapData(dataURL,dataURLIndex, url, index){
    try {
        const response = (await fetch(url))
        const html = await response.text()
        // console.log("HTML : " + url + " - " + html)
        await getData(dataURL,dataURLIndex, index, html, url)
    } catch (error) {
        console.error(error)
    }
}
function scrapAllURL(selectedOption, dataURL, dataURLIndex, debHere, incHere){
    if(debHere === dataURL.length) {
        io.emit("scrap_end", debHere);
        clearInterval(timerInt)
        deb = 0
        inc = deb + 1
    } else{
        console.log(debHere, dataURL[debHere]["Entreprise"])
        for(let i = debHere; i<incHere; i++){
          if(selectedOption === options[0]){
            firstScrapData(dataURL, dataURLIndex, dataURL[i]["FisrtURL"], i)
            //getData(dataURL, dataURLIndex, i, "", "")
          } else if(selectedOption === options[1]){
            getData(dataURL, dataURLIndex, i, "", "")
          } else if(selectedOption === options[2]){
            getData(dataURL, dataURLIndex, i, "", "")
          } else if(selectedOption === options[3]){
            getData(dataURL, dataURLIndex, i, "", "")
          }
        }
        deb = incHere
        inc = ( (incHere+1) >= dataURL.length) ? dataURL.length : (incHere+1)
    }
}

const port = 8080 //process.env.PORT;
server.listen(port, () => console.log(`Listening to port ${port}`));