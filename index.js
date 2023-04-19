import fetch from "node-fetch"
import cheerio from "cheerio"
import { appendFileSync, writeFileSync } from "fs"
import { Client } from 'linkedin-private-api'

const fs = require('fs');
const path = require('path');
const express = require('express');

//make the server and the socketsio
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//server static file in the public directory
app.use(express.static(path.join(__dirname, '../client/build')));

//Var & Const
let result = []
const options = ["URL 1", "URL 2", "URL 3", "URL 4"];
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
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nanogreen-cleaning-limited",
        "Entreprise": "Nanogreen Sustainable Facilities Management"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/content-communications-associates-ltd",
        "Entreprise": "Content Communications Associates Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/really-good-beers-ltd",
        "Entreprise": "Really Good Beers Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ovation-wealth-advisors",
        "Entreprise": "Ovation Wealth Advisors"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mitheridge-capital-management-llp",
        "Entreprise": "Mitheridge Capital Management LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dreamore-ltd-trading-as-just-wears",
        "Entreprise": "JustWears"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mickelberry-gardens-llc",
        "Entreprise": "Mickelberry Gardens, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brave-technology-coop",
        "Entreprise": "Brave Technology Coop"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eva-nyc",
        "Entreprise": "Eva-NYC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jack-grace",
        "Entreprise": "Jack & Grace"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beeble-liquor-ltd",
        "Entreprise": "Beeble Liquor Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/amika",
        "Entreprise": "Amika"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/across-the-pond",
        "Entreprise": "Across the Pond"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sus-gain",
        "Entreprise": "SusGain"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-invisible-collection-ltd",
        "Entreprise": "The Invisible Collection Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/spirit-animal-coffee",
        "Entreprise": "Spirit Animal Coffee"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/naveia",
        "Entreprise": "Naveia"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stanhope-plc",
        "Entreprise": "Stanhope PLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impact-agency-fabrik-oy",
        "Entreprise": "Impact Agency Fabrik Oy"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/food-for-skin",
        "Entreprise": "FOOD for SKIN"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mthk-limited",
        "Entreprise": "MTHK Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/colibrily",
        "Entreprise": "Colibrily"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mickelberry-gardens-llc",
        "Entreprise": "Mickelberry Gardens, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brave-technology-coop",
        "Entreprise": "Brave Technology Coop"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beeble-liquor-ltd",
        "Entreprise": "Beeble Liquor Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sus-gain",
        "Entreprise": "SusGain"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-invisible-collection-ltd",
        "Entreprise": "The Invisible Collection Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/smith-connors",
        "Entreprise": "Smith & Connors"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/uprise-up",
        "Entreprise": "Uprise Up"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nomon-design",
        "Entreprise": "Nomon Design"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/recursos-e-insumos-clnicos-ecolgicos-spa",
        "Entreprise": "Recursos e Insumos Clínicos Ecológicos Spa"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pe-cube",
        "Entreprise": "PE Cube"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/food-cabinet-bv",
        "Entreprise": "Food Cabinet B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/harrison-brands",
        "Entreprise": "Harrison Brands"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/solvid-ondernemen",
        "Entreprise": "Solvid Ondernemen"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/xenia-sp-a-sb",
        "Entreprise": "Xenia S.p.A. SB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/revolt",
        "Entreprise": "REVOLT"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/not-another-company-ltd",
        "Entreprise": "Not Another Company Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/e-moving",
        "Entreprise": "E-Moving"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ingleandrhode",
        "Entreprise": "Ingle & Rhode Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rocky-mountain-solar-corp",
        "Entreprise": "Rocky Mountain Solar Corp."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gel-studios-ltd",
        "Entreprise": "GEL Studios Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/threadline",
        "Entreprise": "Threadline"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/archer-connections",
        "Entreprise": "Archer Connections"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/capital-rx-inc",
        "Entreprise": "Capital Rx, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/prime-buchholz-llc",
        "Entreprise": "Prime Buchholz LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pyzel-surfboards-llc",
        "Entreprise": "Pyzel Surfboards, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/poches-et-fils",
        "Entreprise": "Poches et fils"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/learning-pool",
        "Entreprise": "Learning Pool"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/felix-capital-partners-llp",
        "Entreprise": "Felix Capital Partners LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/my-pup-my-pick-up-point",
        "Entreprise": "MyPup, My Pick up Point"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/navigate",
        "Entreprise": "Navigate"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mmrg-ltd",
        "Entreprise": "MMRG Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/elephant-gin-gmb-h",
        "Entreprise": "Elephant Gin GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ostrom-aplus-energy-gmb-h",
        "Entreprise": "Ostrom"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cobry-ltd",
        "Entreprise": "Cobry Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/marvel-fmcg-ltd",
        "Entreprise": "Marvel FMCG Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/international-management-school-geneva",
        "Entreprise": "International Management School Geneva"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fielding-international",
        "Entreprise": "Fielding International"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/naos-asset-management-limited",
        "Entreprise": "NAOS Asset Management Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rgreen-invest",
        "Entreprise": "RGREEN INVEST"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-good-idea-s-b-srl",
        "Entreprise": "The Good Idea Srl Società Benefit"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ninth-seat",
        "Entreprise": "Ninth Seat"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wright-communications",
        "Entreprise": "Wright Communications"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/measure-to-improve-llc",
        "Entreprise": "Measure To Improve, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impact-boom",
        "Entreprise": "Impact Boom"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/meanwhile-drinks",
        "Entreprise": "Meanwhile Drinks"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/obrien-fine-foods",
        "Entreprise": "O'Brien Fine Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aton-spa-societ-benefit",
        "Entreprise": "ATON S.P.A Società Benefit"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/last-tour",
        "Entreprise": "Last Tour"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/clarendon-fund-managers",
        "Entreprise": "Clarendon Fund Managers"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/onegreenbottle-ltd",
        "Entreprise": "onegreenbottle ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/papirus",
        "Entreprise": "Papirus"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kiklos-architects",
        "Entreprise": "kiklos architects"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/oxbow-partners",
        "Entreprise": "Oxbow Partners"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sustain-life",
        "Entreprise": "Sustain.Life"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bohill-partners-limited",
        "Entreprise": "Bohill Partners Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/batllegroup",
        "Entreprise": "Enric Batlle group s.l."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/next-gen-wealth-managers-sa",
        "Entreprise": "NextGen Wealth Managers SA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lean-lawyers-llp",
        "Entreprise": "LEAN LAWYERS LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pcshek-tecnologa-y-servicios",
        "Entreprise": "PCSHEK Tecnología y servicios"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bullion-productions-limited",
        "Entreprise": "Bullion Productions Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/samm-trading",
        "Entreprise": "SAMM TRADING"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sparta-global-limited",
        "Entreprise": "Sparta Global Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cooper-parry",
        "Entreprise": "Cooper Parry"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-tartan-blanket-co",
        "Entreprise": "The Tartan Blanket Co."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/food-huggers-inc",
        "Entreprise": "Food Huggers Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gts-financial-llc",
        "Entreprise": "GTS Financial, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sea-bird",
        "Entreprise": "SeaBird"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dsg-group",
        "Entreprise": "DSG Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/in-nature-berhad",
        "Entreprise": "InNature Berhad"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/port-xchange-products-bv",
        "Entreprise": "PortXchange Products B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/black-isle-brewing-co-ltd",
        "Entreprise": "Black Isle Brewing Co Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/casologica",
        "Entreprise": "Casológica"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/evovest",
        "Entreprise": "Evovest"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kassl-editions",
        "Entreprise": "KASSL Editions"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lovers-tempo-design-inc",
        "Entreprise": "Lover's Tempo Design Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/linificio-e-canapificio-nazionale-srl",
        "Entreprise": "Linificio e Canapificio Nazionale srl"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ekomia-gmb-h",
        "Entreprise": "ekomia GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/firetail",
        "Entreprise": "Firetail"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/osaka-labs",
        "Entreprise": "Osaka Labs"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beer52",
        "Entreprise": "Beer52"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/unifrog-education-ltd",
        "Entreprise": "Unifrog Education Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/r-a-c-e-r",
        "Entreprise": "RACER"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/koos-service-design",
        "Entreprise": "Koos Service Design"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/caplor-energy",
        "Entreprise": "Caplor Energy"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/water-babies-group-limited",
        "Entreprise": "Water Babies Group Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/watershed-partners-inc",
        "Entreprise": "Watershed Partners, GBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/yrs-truly",
        "Entreprise": "YRS TRULY"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/petalon-limited",
        "Entreprise": "Petalon Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/larochelle-groupe-conseil",
        "Entreprise": "Larochelle Groupe Conseil"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-natural-mat-co-ltd",
        "Entreprise": "Naturalmat"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rheal-superfoods",
        "Entreprise": "Rheal Superfoods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/coaction-specialty-insurance",
        "Entreprise": "Coaction Specialty Insurance"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/olwg",
        "Entreprise": "Olsights"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stand4-socks",
        "Entreprise": "Stand4 Socks"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/agility-eco-services-limited",
        "Entreprise": "Agility Eco Services Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/health-post-limited",
        "Entreprise": "HealthPost"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kans-and-kandy-group",
        "Entreprise": "KKP Holdings Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/acuity",
        "Entreprise": "Acuity"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/omega-wealth-management-llc",
        "Entreprise": "Omega Wealth Management, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/heaps-normal",
        "Entreprise": "Heaps Normal"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wespire",
        "Entreprise": "WeSpire"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/smart-wave",
        "Entreprise": "SmartWave"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tsunami-sport-limited",
        "Entreprise": "Tsunami Sport Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dh-pr-ltd",
        "Entreprise": "DH-PR Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pascol",
        "Entreprise": "Pascol srl"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brett-nicholls-associates",
        "Entreprise": "Brett Nicholls Associates"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fitzer",
        "Entreprise": "Fitzer"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bulgarelli-production-srl",
        "Entreprise": "BULGARELLI PRODUCTION SRL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/foilco-limited",
        "Entreprise": "Foilco Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/scott-construction-group",
        "Entreprise": "Scott Construction Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/amplify-capital-inc",
        "Entreprise": "Amplify Capital Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/simba-sleep",
        "Entreprise": "Simba Sleep"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/neerlands-glorie-groente-fruit-bv",
        "Entreprise": "Neerlands Glorie Groente & Fruit B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/oxy-capital-sgfcr",
        "Entreprise": "Oxy Capital - SGOIC, S.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/new-apprenticeship-inc",
        "Entreprise": "New Apprenticeship, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/future-proof-consulting",
        "Entreprise": "FutureProof Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fero-holdings-limited",
        "Entreprise": "FERO HOLDINGS LIMITED"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pow-food",
        "Entreprise": "Pow Food"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/innova-funding",
        "Entreprise": "Innova Funding"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-boatyard-distillery-ltd",
        "Entreprise": "The Boatyard Distillery Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sustained-fun-limited",
        "Entreprise": "Sustained Fun"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mine-srl-sb",
        "Entreprise": "Mine"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/toroto-sapi-de-cv",
        "Entreprise": "Toroto, SAPI de CV"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/goli-nutrition",
        "Entreprise": "Goli Nutrition"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cubitts",
        "Entreprise": "Cubitts"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/priory-business-group-plc",
        "Entreprise": "Priory Business Group PLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/optimising-it",
        "Entreprise": "Optimising IT"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gibbs-m-smith-inc",
        "Entreprise": "Gibbs M. Smith, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rise-consulting-ltd",
        "Entreprise": "Rise Consulting Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/silver-lining",
        "Entreprise": "Silver Lining"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fourfront-group-holdings-ltd",
        "Entreprise": "Fourfront Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/i-vesta-family-office",
        "Entreprise": "iVesta Family Office"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/everlastly-inc",
        "Entreprise": "Everlastly Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/simply-washrooms-ltd",
        "Entreprise": "Simply Washrooms ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/executive-integrity",
        "Entreprise": "Executive Integrity"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/only-orca-limited",
        "Entreprise": "ONLY ORCA LIMITED"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/people-focus-consulting",
        "Entreprise": "People Focus Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/new-zealand-native-honey-products-limited",
        "Entreprise": "New Zealand Native Honey Products Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/andcrafted-ltd-ta-plank-hardware",
        "Entreprise": "Plank Hardware"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jb-skinguru-inc",
        "Entreprise": "JB Skinguru Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/packed-with-purpose",
        "Entreprise": "Packed with Purpose"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/e-farmz",
        "Entreprise": "eFarmz"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gobe-corp-pty-ltd",
        "Entreprise": "Urth"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nm2-tecnologia",
        "Entreprise": "NM2 - Tecnologia Ambiental Inovadora"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/agami-family-office",
        "Entreprise": "AGAMI Family Office"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-loading-dock",
        "Entreprise": "The Loading Dock"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/akt-ii",
        "Entreprise": "AKT II"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wash-with-water",
        "Entreprise": "Wash with Water"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aurelia",
        "Entreprise": "Aurelia"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gardens-of-the-sun",
        "Entreprise": "Gardens of the Sun"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hello-solarman",
        "Entreprise": "Hello Solarman 太陽人全民電廠-宏威環球事業股份有限公司"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fibtex-sas",
        "Entreprise": "Fibtex SAS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-steadman-group",
        "Entreprise": "The Steadman Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/craftsman-technology-group-l-l-c",
        "Entreprise": "Craftsman Technology Group, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/seed-sustainable-entrepreneurial-ecosystem-development",
        "Entreprise": "SEED - Sustainable Entrepreneurial Ecosystem Development"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/workplace-futures-group-limited",
        "Entreprise": "Workplace Futures Group Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/futureheads-recruitment-ltd",
        "Entreprise": "Futureheads Recruitment Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/zak-communications",
        "Entreprise": "Zak Communications"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/holland-harvey-architects",
        "Entreprise": "Holland Harvey Architects"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ethanology-distillation",
        "Entreprise": "Ethanology® Distillation"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tintoria-pa-jacchetti-srl",
        "Entreprise": "Tintoria P.A. Jacchetti srl Società Benefit"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/angeles-investment-advisors",
        "Entreprise": "Angeles Investment Advisors"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/we-are-caring-pte-ltd",
        "Entreprise": "We Are Caring Pte Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/proyectos-maf-ca",
        "Entreprise": "Proyectos MAF C.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bambino-mio",
        "Entreprise": "Bambino Mio"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-barton-partnership",
        "Entreprise": "The Barton Partnership"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nolk",
        "Entreprise": "Nolk"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/b-l-b-v-i-g-n-o-b-l-e-s",
        "Entreprise": "BLB VIGNOBLES"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nkuku-ltd",
        "Entreprise": "Nkuku Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nutricia-export-bv",
        "Entreprise": "Nutricia Export B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/green-loop-sustainable-architecture-engineering-ltda",
        "Entreprise": "Green Loop Sustainable Architecture & Engineering Ltda"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kevins-natural-foods",
        "Entreprise": "Kevin's Natural Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/krystal-hosting-ltd",
        "Entreprise": "Krystal Hosting Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/heath-ceramics-ltd",
        "Entreprise": "Heath Ceramics, LTD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cocoliche-ropa-con-otra-oportunidad",
        "Entreprise": "Cocoliche Ropa Con Otra Oportunidad"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/so-good-so-you",
        "Entreprise": "So Good Brand, Inc. DBA So Good So You"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wee-hive-llc",
        "Entreprise": "Wee Hive LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/point3-wellbeing",
        "Entreprise": "POINT3 Wellbeing"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/evolve-collaborative",
        "Entreprise": "Evolve Collaborative"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/luida-corporation",
        "Entreprise": "Luida Corporation"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/woodbourne-capital-management-international-lp",
        "Entreprise": "Woodbourne Capital Management International LP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/naturalpes",
        "Entreprise": "Naturalpes"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cariloha",
        "Entreprise": "Cariloha"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vitalis-dr-joseph",
        "Entreprise": "TEAM DR JOSEPH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lopez-performance-solutions-lo-pe-s",
        "Entreprise": "Lopez Performance Solutions"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/master-of-ceremonies-ltd",
        "Entreprise": "Pals"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mr-marvis-bv",
        "Entreprise": "MR MARVIS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/project-reef",
        "Entreprise": "Project Reef"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/studio-henk",
        "Entreprise": "Studio Henk"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tiraki-ltd",
        "Entreprise": "Tiraki Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/natural-pod",
        "Entreprise": "Natural Pod"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/le-petit-planet-limited",
        "Entreprise": "Le Petit Planet Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/don-baez",
        "Entreprise": "Don Baez"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/asbz-advogados",
        "Entreprise": "/asbz"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-vervain-collective-llc",
        "Entreprise": "The Vervain Collective LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/all-chiefs",
        "Entreprise": "AllChiefs"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nikita",
        "Entreprise": "Nikita"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/horn",
        "Entreprise": "HORN"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bpm-development-llc",
        "Entreprise": "BPM Development"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/paradigm-foods",
        "Entreprise": "Paradigm Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rock-solid-knowledge",
        "Entreprise": "Rock Solid Knowledge"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tactical-solutions-fs-limited",
        "Entreprise": "Tactical Solutions FS Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/core-physio",
        "Entreprise": "CorePhysio"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/descalza-llc",
        "Entreprise": "Descalza LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/verdacity",
        "Entreprise": "Verdacity"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impacto-experience-design",
        "Entreprise": "Impacto ED"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/meteo-holdco-limited",
        "Entreprise": "Meteo Holdco Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/playa-viva-llc",
        "Entreprise": "Playa Viva LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/red-stamp-agency-inc",
        "Entreprise": "Red Stamp Agency Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/elemis",
        "Entreprise": "ELEMIS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ceres-organics",
        "Entreprise": "Ceres Organics"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ancient-nutrition",
        "Entreprise": "Ancient Nutrition"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/yemanja",
        "Entreprise": "Yemanja"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/energy-datametrics",
        "Entreprise": "Energy Datametrics"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/intelligent-waste-management-ltd",
        "Entreprise": "Intelligent Waste Management Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pad-studio-ltd",
        "Entreprise": "PAD studio Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ampa-holdings-llp",
        "Entreprise": "Ampa Holdings LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cz-tokosova-hydrovalv",
        "Entreprise": "CZ Tokosova Hydrovalv"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wild-cosmetics",
        "Entreprise": "Wild"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/systmes-nergie-tst-inc",
        "Entreprise": "Systèmes Énergie TST Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/appinio",
        "Entreprise": "Appinio"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/true-ideas",
        "Entreprise": "True Ideas"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/chic-p",
        "Entreprise": "ChicP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/slx",
        "Entreprise": "SLX"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/switch",
        "Entreprise": "SWiTCH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aveda-corporation",
        "Entreprise": "Aveda Corporation"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bohemi-handcrafted",
        "Entreprise": "Bohemi Handcrafted"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/inhabit-hotels",
        "Entreprise": "Inhabit Hotels"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rocketmakers",
        "Entreprise": "Rocketmakers"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/welight-madagascar",
        "Entreprise": "WELIGHT MADAGASCAR"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/les-artistes-paris",
        "Entreprise": "LES ARTISTES PARIS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tyr-gesto",
        "Entreprise": "TYR Gestão"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/telos-impact-srl",
        "Entreprise": "Telos Impact"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/byou-aa",
        "Entreprise": "B.You Açaí"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/indeed-innovation-gmb-h",
        "Entreprise": "INDEED Innovation GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-baz-group",
        "Entreprise": "The BAZ Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/worms",
        "Entreprise": "Worms"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vitasoy-international-singapore-pte-ltd",
        "Entreprise": "Vitasoy International Singapore Pte Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vanilla-sugar-pty-ltd",
        "Entreprise": "Vanilla Sugar Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/i-khofi-ltd",
        "Entreprise": "iKhofi Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/magic-foundry-limited",
        "Entreprise": "Ooni"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/solgaard-design-inc",
        "Entreprise": "Solgaard Design Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fishtnk-inc",
        "Entreprise": "Fishtnk Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/climate-change-coaches",
        "Entreprise": "Climate Change Coaches"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beagle-button-limited",
        "Entreprise": "Beagle Button Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/farm-ferments",
        "Entreprise": "Hawthorne Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/switchee-ltd",
        "Entreprise": "Switchee Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/friendly-design-co",
        "Entreprise": "Friendly Design Co"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/moo-free-ltd",
        "Entreprise": "Moo Free Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/manifest",
        "Entreprise": "Manifest"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/main-incubator-gmb-h",
        "Entreprise": "neosfer GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/practice-scott-labs",
        "Entreprise": "Scott Laboratories Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/natilik-corporation-ltd",
        "Entreprise": "Natilik Corporation Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/opportunity-threads-llc",
        "Entreprise": "Opportunity Threads, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-dragonfly-agency-limited",
        "Entreprise": "The Dragonfly Agency Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/accouter-group-of-companies",
        "Entreprise": "Accouter Group of Companies"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eco-systems",
        "Entreprise": "EcoSystems"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sundown-pastoral-co-pty-ltd",
        "Entreprise": "Sundown Pastoral Co Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/arjuna-capital",
        "Entreprise": "Arjuna Capital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/topiku",
        "Entreprise": "Topiku"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fernweh",
        "Entreprise": "Fernweh"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brand-evangelists-for-beauty-ltd",
        "Entreprise": "BRAND EVANGELISTS FOR BEAUTY LTD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/auszi-inc",
        "Entreprise": "AUSZI GBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/prime-roots",
        "Entreprise": "Prime Roots"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/derval-research",
        "Entreprise": "DervalResearch"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/httpswwwparksprojectus",
        "Entreprise": "Parks Project"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/colere-inc",
        "Entreprise": "Colere Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bcp-capital-ltd",
        "Entreprise": "BCP Capital Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/t-e-capital-partners",
        "Entreprise": "TE Capital Partners"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ready-set-rocket",
        "Entreprise": "Ready Set Rocket"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/niu-body-inc-oa-three-ships",
        "Entreprise": "Three Ships"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/happiness-capital",
        "Entreprise": "Happiness Capital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/u-creative-concepts",
        "Entreprise": "U+ Creative Concepts"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-trampery",
        "Entreprise": "The Trampery"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/skizo",
        "Entreprise": "Skizo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pure-table-top",
        "Entreprise": "Pure Table Top"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/revolk",
        "Entreprise": "Grupo Klover"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/supple-studio-ltd",
        "Entreprise": "Supple Studio Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kriket",
        "Entreprise": "KRIKET"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aila-recruitment-limited",
        "Entreprise": "Aila Recruitment Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fiils-beauty-limited",
        "Entreprise": "Fiils Beauty Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/this-ability-limited",
        "Entreprise": "ThisAbility Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eolo-sp-a",
        "Entreprise": "EOLO SpA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/belterra-agroflorestas",
        "Entreprise": "Belterra Agroflorestas"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/civibank-spa-sb",
        "Entreprise": "Civibank Spa SB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ring-capital",
        "Entreprise": "Ring Capital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/raylo-group-ltd",
        "Entreprise": "Raylo Group Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aew-ventures-ltd",
        "Entreprise": "AEW Ventures Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/data-gardener-solutions-limited",
        "Entreprise": "DataGardener Solutions Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/all-matters",
        "Entreprise": "AllMatters"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dancing-goats-coffee",
        "Entreprise": "Dancing Goats® Coffee"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eco-movers",
        "Entreprise": "EcoMovers"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dataflex-international-bv",
        "Entreprise": "Dataflex International B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kellys-storage",
        "Entreprise": "Kelly's Storage"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/north-six-inc",
        "Entreprise": "North Six"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tft",
        "Entreprise": "TFT"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/latam-payment-group",
        "Entreprise": "Latam Payment Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/shape-history",
        "Entreprise": "Shape History"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/b-u-b-k-a",
        "Entreprise": "Bubka"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/north-six-europe-limited",
        "Entreprise": "North Six Europe Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stephens-scown-llp",
        "Entreprise": "Stephens Scown LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/buttress-architects-ltd",
        "Entreprise": "Buttress Architects Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/la-fourche-sas",
        "Entreprise": "La Fourche SAS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wakuli",
        "Entreprise": "Wakuli"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/integratedwork",
        "Entreprise": "Integrated Work"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/american-halal-company-pbc-dba-saffron-road-foods",
        "Entreprise": "American Halal Company, PBC D/B/A Saffron Road Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/meyers-as",
        "Entreprise": "Meyers A/S"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gripple-limited",
        "Entreprise": "Gripple Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vendis-capital-management",
        "Entreprise": "Vendis Capital Management"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/south-pole-netherlands-bv",
        "Entreprise": "South Pole Netherlands BV"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/b-t-s-a-b-i-o-t-e-c-n-o-l-o-g-i-a-s-a-p-l-i-c-a-d-a-s-s-l",
        "Entreprise": "BTSA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/torrens-university-australia-t-u-a-t-h-i-n-k-education-group",
        "Entreprise": "Torrens University Australia, Think Education, and Media Design School"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/v2food",
        "Entreprise": "v2food"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/zenz-owner-holding-as",
        "Entreprise": "Zenz Owner Holding A/S"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hpe-growth",
        "Entreprise": "HPE Growth"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/turtle-fur",
        "Entreprise": "Turtle Fur"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/orgain",
        "Entreprise": "Orgain"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/milkwood-trading-pty-ltd",
        "Entreprise": "Milkwood Trading Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/edp-iran",
        "Entreprise": "Danone Dairy Pars"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lorica-partners-pty-ltd",
        "Entreprise": "Lorica Partners Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/haeckels",
        "Entreprise": "Haeckels"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/technowrapp",
        "Entreprise": "Technowrapp"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gemelli-consulting",
        "Entreprise": "Gemelli Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/spring-fashion-design-lda",
        "Entreprise": "Spring Fashion & Design, Lda"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/inthewear",
        "Entreprise": "The Gifting Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-metal-window-company-ltd-ta-the-rooflight-company",
        "Entreprise": "the Rooflight Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/republica-organic",
        "Entreprise": "Republica Organic"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/modern-milkman-ltd",
        "Entreprise": "Modern Milkman Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/matter-of-focus",
        "Entreprise": "Matter of Focus"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bridgehouse-company-secretaries-limited",
        "Entreprise": "Bridgehouse Company Secretaries Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hidra-srl-sb",
        "Entreprise": "Hidra srl sb"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gerding-edlen",
        "Entreprise": "The Green Cities Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/madeira-wine-company",
        "Entreprise": "Madeira Wine Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aline-et-olivier-nutrition-bio",
        "Entreprise": "Aline et Olivier Nutrition Bio"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/glamcorner",
        "Entreprise": "GlamCorner"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/major-players",
        "Entreprise": "Major Players"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/choucair-testing-sa",
        "Entreprise": "Choucair"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pony-rider",
        "Entreprise": "Pony Rider"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grubengold-gmb-h",
        "Entreprise": "Grubengold GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/unico-interior-sas",
        "Entreprise": "Unico Interior SAS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mgov",
        "Entreprise": "Movva"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/new-ground-group-ltd",
        "Entreprise": "New Ground Group Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sekr",
        "Entreprise": "Sekr"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/afir",
        "Entreprise": "AFIR"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nesto-inc",
        "Entreprise": "Nesto Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gmg-ventures-llp",
        "Entreprise": "GMG Ventures LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fair-capital-partners",
        "Entreprise": "Fair Capital Partners"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dropps",
        "Entreprise": "Dropps"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/durabrik-bouwbedrijf-n-v",
        "Entreprise": "Durabrik Bouwbedrijf NV"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stilling",
        "Entreprise": "Stilling"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/matter-consulting",
        "Entreprise": "Matter Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cr-consultora-en-sustentabilidad",
        "Entreprise": "CR Consultora en Sustentabilidad"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sn-dach",
        "Entreprise": "SN DACH, Nutricia Milupa GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/space-group",
        "Entreprise": "Space Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sicsa",
        "Entreprise": "SICSA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tebrio",
        "Entreprise": "TEBRIO"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/marine-layer",
        "Entreprise": "Marine Layer"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/recycling-lives-holdings-ltd",
        "Entreprise": "Recycling Lives Holdings Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/project-hive-pet-company",
        "Entreprise": "Project Hive Pet Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lovers-agency-limited",
        "Entreprise": "Lovers Agency Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bespoke-advice-limited",
        "Entreprise": "Bespoke - Advice Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-module-company",
        "Entreprise": "THE MODULE COMPANY"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/amba",
        "Entreprise": "Amba"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/baby-gourmet-inc",
        "Entreprise": "Baby Gourmet Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/w-real-estate-ltd",
        "Entreprise": "W Real Estate Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-atypical-partner",
        "Entreprise": "Atypical Partner"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mind-facilities-management-sa",
        "Entreprise": "Mind Facilities Management SL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/faithful-friend-trusty-scout-limited",
        "Entreprise": "Kemosabe"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/platos-tradicionales-sa",
        "Entreprise": "PLATOS TRADICIONALES, S.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wild-adventures-melbourne",
        "Entreprise": "Wild Adventures Melbourne"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pando-alliance",
        "Entreprise": "Pando Alliance"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nspr-limited",
        "Entreprise": "NSPR Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ellandi-management-limited",
        "Entreprise": "Ellandi Management Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/zebra-growth",
        "Entreprise": "Zebra Growth"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/i2-c-architects",
        "Entreprise": "i2C Architects"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jungle-merchandise-pty",
        "Entreprise": "Jungle Merchandise PTY"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ce-floyd-company-inc",
        "Entreprise": "C.E. Floyd Company, PBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/supplement-technologies",
        "Entreprise": "Supplement Technologies"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/motocard-global-motard-ventures-sl",
        "Entreprise": "MOTOCARD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/south-col-advisors-llc",
        "Entreprise": "SouthCol Advisors, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/naturehouse",
        "Entreprise": "Nature.house"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/moonen-packaging",
        "Entreprise": "Moonen Packaging"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/triple-point-llp",
        "Entreprise": "Triple Point LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beam-up-ltd",
        "Entreprise": "Beam Up Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/orean-personal-care-ltd",
        "Entreprise": "Orean Personal Care Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/temple-group-ltd",
        "Entreprise": "Temple Group Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/votary-limited",
        "Entreprise": "Votary Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gammadia-sa",
        "Entreprise": "Gammadia SA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dille-kamille-international-bv",
        "Entreprise": "Dille & Kamille"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/food-enterprise-solutions",
        "Entreprise": "Food Enterprise Solutions"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/next-wave-partners",
        "Entreprise": "NextWave Partners"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/thompson-brand-partners",
        "Entreprise": "Thompson Brand Partners"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gener8tor",
        "Entreprise": "gener8tor"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/smileat-sl",
        "Entreprise": "Smileat S.L"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vanti",
        "Entreprise": "Vanti"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brendle-group-inc",
        "Entreprise": "Brendle Group, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/smart-plastic-technologies",
        "Entreprise": "Smart Plastic Technologies"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/baboo-travel-pbc",
        "Entreprise": "Baboo Travel"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sirop-cie-inc",
        "Entreprise": "Sirop & Cie inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bee-squared-apiaries",
        "Entreprise": "Bee Squared Apiaries"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/animal-trust-vets-cic",
        "Entreprise": "Animal Trust Vets CIC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ballo",
        "Entreprise": "Ballo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/delilites-ireland-ltd",
        "Entreprise": "Delilites Ireland Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/innovation-design-co-ltd",
        "Entreprise": "Innovation Design Co., Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/km-zero-water-sl",
        "Entreprise": "KM ZERO WATER SL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/assemble",
        "Entreprise": "Assemble"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/david-baker-architects",
        "Entreprise": "David Baker Architects"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/teresa-monroe",
        "Entreprise": "Teresa Monroe"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ziba-foods-llc",
        "Entreprise": "Ziba Foods LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ovgo",
        "Entreprise": "ovgo inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-stone-house-group",
        "Entreprise": "The Stone House Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/commercial-foundation",
        "Entreprise": "Commercial Foundation"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/partake-foods-inc",
        "Entreprise": "Partake Foods, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/meridiam-sas",
        "Entreprise": "Meridiam SAS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc",
        "Entreprise": "RampRate A Team, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/future-arc",
        "Entreprise": "Future Arc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/b-o-r-e-a-l-i-s-g-l-o-b-a-l-a-s-s-e-t-m-a-n-a-g-e-m-e-n-t-i-n-c",
        "Entreprise": "BOREALIS GLOBAL ASSET MANAGEMENT INC."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bike-club",
        "Entreprise": "Bike Club"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pangaia-materials-science-limited",
        "Entreprise": "Pangaia Materials Science Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tekiti-experiencias-mexicanas-sa-de-cv",
        "Entreprise": "Tekiti"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/neuron",
        "Entreprise": "NEURON"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cowboy",
        "Entreprise": "Cowboy"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/onepoint",
        "Entreprise": "onepoint"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/anne-mulaire",
        "Entreprise": "Anne Mulaire"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cp-essenze-srl",
        "Entreprise": "C.P. Essenze S.r.l."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ccilu-international-inc",
        "Entreprise": "Ccilu International Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kura-biotech-spa",
        "Entreprise": "Kura Biotech SPA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/season-arts-preschool",
        "Entreprise": "Season Arts Preschool"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/martys-meals-inc",
        "Entreprise": "Shine Pet Food Co."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fifty-fifty-post-production-ltd",
        "Entreprise": "Fifty Fifty Post Production Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gamma-gurus-pty-ltd",
        "Entreprise": "Gamma Gurus Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/n-family-holdings-ltd",
        "Entreprise": "N Family Holdings Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-not-company",
        "Entreprise": "The Not Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/intense-wines-bv",
        "Entreprise": "Intense Wines B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/boska-food-tools",
        "Entreprise": "Boska Food Tools"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/te-rehe-group-limited",
        "Entreprise": "Te Rehe Group Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/colrio-design",
        "Entreprise": "Colírio Design"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/acs-clothing-ltd",
        "Entreprise": "ACS Clothing Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/geo-capital",
        "Entreprise": "GeoCapital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/uphouse",
        "Entreprise": "UpHouse"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/palatine-private-equity",
        "Entreprise": "Palatine Private Equity"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/verdier-co-corporate-advisory",
        "Entreprise": "Verdier & Co. Corporate Advisory"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/heron-anstead-media-global-limited-ta-orange-door",
        "Entreprise": "Heron Anstead Media Global Limited T/A OrangeDoor"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cmpp-srl",
        "Entreprise": "CMP&P SRL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/buff",
        "Entreprise": "Original Buff"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fearne-and-rosie",
        "Entreprise": "Fearne and Rosie"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sapphire-capital-partners-llp",
        "Entreprise": "Sapphire Capital Partners LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/white-light-ltd",
        "Entreprise": "White Light Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ensemble-capital-management",
        "Entreprise": "Ensemble Capital Management"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/go-mad-limited",
        "Entreprise": "Go M.A.D. Thinking"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-heirloom-sauce-company-ltd",
        "Entreprise": "The Heirloom Sauce Company Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vinokilo-robin-balser-holding-gmb-h",
        "Entreprise": "vinokilo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/helvetia-environnement-groupe",
        "Entreprise": "Helvetia Environnement Groupe"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/clear-horizon-consulting-pty-ltd",
        "Entreprise": "Clear Horizon Consulting pty ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gestin-de-riesgos-sostenibles",
        "Entreprise": "Gestión de Riesgos Sostenibles"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/logopost-sealizacinsa",
        "Entreprise": "LOGOPOST S.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vigilance-properties-ltd",
        "Entreprise": "Vigilance Properties Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ecolana",
        "Entreprise": "Ecolana"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/givergy-ltd",
        "Entreprise": "Givergy LTD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ie-design-consultancy-ltd-ta-ie-brand-wwwiebrandcouk-and-ie-digital-wwwiedigitalcouk",
        "Entreprise": "IE Brand & Digital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/siren-communications",
        "Entreprise": "Siren Communications"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jones-food-company-ltd",
        "Entreprise": "Jones Food Company Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/n-a-t-r-a-m-i-d-c-o-s-l",
        "Entreprise": "NATRA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/les-cosmetiques-frais",
        "Entreprise": "Les Cosmétiques Frais"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/water-bear-network",
        "Entreprise": "WaterBear Network"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nm",
        "Entreprise": "NÃM"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/in-pact-partners-sa",
        "Entreprise": "InPact Partners SA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/good-buy-gmb-h",
        "Entreprise": "GoodBuy GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/open-media",
        "Entreprise": "OPEN Media"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/not-another-beer-co-limited-trading-as-lucky-saint",
        "Entreprise": "Not Another Beer Co Limited trading as Lucky Saint"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sacred-spirits-holdings-ltd",
        "Entreprise": "Sacred Spirits Holdings Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/anthony-collins-solicitors-llp",
        "Entreprise": "Anthony Collins Solicitors LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ecolink-inc",
        "Entreprise": "Ecolink Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ready-pac-foods-inc",
        "Entreprise": "Bonduelle Fresh Americas US"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/y2-b-your-balanced-workflow",
        "Entreprise": "Y2B - Your Balanced Workflow"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/love",
        "Entreprise": "LOVE."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/botanitec-sp-a",
        "Entreprise": "Botanitec"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-nue-co",
        "Entreprise": "The Nue Co"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/siderperu",
        "Entreprise": "SIDERPERU"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/we-are-tilt",
        "Entreprise": "We Are Tilt"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/suricats-consulting",
        "Entreprise": "Suricats Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/simeks",
        "Entreprise": "Simek's"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rise-concepts",
        "Entreprise": "Rise Concepts"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sinewave-energy-solutions-ltd",
        "Entreprise": "Sinewave Energy Solutions Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/soul-energy",
        "Entreprise": "Soul Energy"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/arete-initiative",
        "Entreprise": "Arete Initiative"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/optiat-ltd-ta-up-circle-beauty",
        "Entreprise": "UpCircle Beauty"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/activas",
        "Entreprise": "Activas"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beckett-simonon",
        "Entreprise": "Beckett Simonon"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/loopsider",
        "Entreprise": "LOOPSIDER"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/arista-advisory-group",
        "Entreprise": "Arista Advisory Group, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/love-brand-co-ltd",
        "Entreprise": "LOVE BRAND & Co. Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nestle-health-science-us",
        "Entreprise": "Nestlé Health Science US"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vital-proteins-llc",
        "Entreprise": "Vital Proteins LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aday",
        "Entreprise": "Aday"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/breaders-srl",
        "Entreprise": "breaders srl"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gourmend-foods-llc",
        "Entreprise": "Gourmend Foods, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/broprinter",
        "Entreprise": "Broprinter"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/abaris-financial-group-llc",
        "Entreprise": "Abaris Financial Group LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/design-force",
        "Entreprise": "Design Force"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/clock",
        "Entreprise": "Clock"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bosquia-nature-sl",
        "Entreprise": "Bosquia Nature, S.L."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beanstalk-h-p-s-ltd",
        "Entreprise": "Gamban Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/coomer-l-l-c",
        "Entreprise": "COOMER"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tyler-grange-group-limited",
        "Entreprise": "Tyler Grange Group Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/collective",
        "Entreprise": "Collective - Digital Creative Agency"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cult-ldn",
        "Entreprise": "Cult"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/neuland-gmb-h",
        "Entreprise": "neu.land GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-curators",
        "Entreprise": "The Curators"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/la-spec",
        "Entreprise": "LA SPEC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/neom-ltd",
        "Entreprise": "NEOM Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/digit-business",
        "Entreprise": "Digit Business"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wopilo-better-path-s-a-s",
        "Entreprise": "Wopilo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dodds-and-shute-limited",
        "Entreprise": "Dodds and Shute Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pyramid",
        "Entreprise": "Pyramid"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/voyelle",
        "Entreprise": "Voyelle"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/centrus-corporate-finance-ltd",
        "Entreprise": "Centrus Corporate Finance Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/guarantee-laundries-limited",
        "Entreprise": "GUARANTEE LAUNDRIES LIMITED"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tenue-de-soleil-bv",
        "Entreprise": "Tenue de Soleil B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/almighty-beverages-ltd",
        "Entreprise": "Almighty Beverages Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/digital-magics-sp-a",
        "Entreprise": "Digital Magics S.p.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/freed-foods-ltd",
        "Entreprise": "Freed Foods Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/balance-me",
        "Entreprise": "Balance Me"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tower-farm",
        "Entreprise": "Tower Farm"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/haworth-tompkins",
        "Entreprise": "Haworth Tompkins"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/search-laboratory",
        "Entreprise": "Search Laboratory"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/apple-tree-communications-sl",
        "Entreprise": "APPLE TREE COMMUNICATIONS SL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/whyz-executive-search",
        "Entreprise": "Whyz Executive Search"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-leisure-collective-international-pty-ltd",
        "Entreprise": "The Leisure Collective International Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kane-footwear-llc",
        "Entreprise": "Kane Footwear LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nuu",
        "Entreprise": "NUU"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ways-srl",
        "Entreprise": "Ways Srl SB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/core-landscape-products",
        "Entreprise": "CORE Landscape Products"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/overflow-pbc",
        "Entreprise": "Overflow PBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vescor-group-limited",
        "Entreprise": "Vescor Group and GrowUp Farms"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/a-beautiful-story-b-v",
        "Entreprise": "A Beautiful Story B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/luna-naturals",
        "Entreprise": "LUÜNA naturals"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ascent-employment-law-corporation",
        "Entreprise": "Ascent Employment Law Corporation"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/goal-17-media",
        "Entreprise": "Goal 17 Media"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/flavia-amadeu-amadeu-sustentvel-ltda",
        "Entreprise": "FLAVIA AMADEU e AMADEU SUSTENTÁVEL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/greenspoon-ltd",
        "Entreprise": "Greenspoon Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/first-sentier-investors",
        "Entreprise": "First Sentier Investors"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vantea-smart-sp-a",
        "Entreprise": "Vantea SMART SpA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pieminister",
        "Entreprise": "Pieminister"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/arezzo-co",
        "Entreprise": "Arezzo&Co"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tarjetas-del-mar-sa",
        "Entreprise": "La Anónima Fintech"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rebel-girls",
        "Entreprise": "Rebel Girls"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/italgraniti-group-sp-a",
        "Entreprise": "Italgraniti Group S.p.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aventur",
        "Entreprise": "Aventur Group Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/human-forest-limited",
        "Entreprise": "Human Forest Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wayb-inc",
        "Entreprise": "WAYB, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/prolog-coffee",
        "Entreprise": "Prolog Coffee"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/camber-collective",
        "Entreprise": "Camber Collective"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/will-be-group",
        "Entreprise": "iQo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/abnex-capital",
        "Entreprise": "Abénex"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/8th-walton",
        "Entreprise": "8th & Walton"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/think-rapt",
        "Entreprise": "Think RAPT"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/karibu",
        "Entreprise": "Karibu"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tennent-brown-architects",
        "Entreprise": "Tennent Brown Architects"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/crowdcube",
        "Entreprise": "Crowdcube"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/reids-automotive-recycling-ltd",
        "Entreprise": "Reid's Automotive Recycling Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/john-altman",
        "Entreprise": "John Altman"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/infarm-indoor-urban-farming-gmb-h",
        "Entreprise": "Infarm – Indoor Urban Farming B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/organix-brands-ltd",
        "Entreprise": "Organix Brands Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-duppy-share",
        "Entreprise": "The Duppy Share"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ideal-manufacturing-ltd-ta-fill-refill-co",
        "Entreprise": "Ideal Manufacturing Ltd t/a Fill Refill Co"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rogue-heart-media",
        "Entreprise": "Rogue Heart Media"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/teist-catering",
        "Entreprise": "Teist Catering"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/substrakt",
        "Entreprise": "Substrakt"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/logic-studio",
        "Entreprise": "Logic Studio"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mob",
        "Entreprise": "MOB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/biopackaging",
        "Entreprise": "Biopackaging"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/viking-drinks-l-l-c",
        "Entreprise": "Viking Drinks LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/metric-coffee",
        "Entreprise": "Metric"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/profitable-ideas-exchange",
        "Entreprise": "Profitable Ideas Exchange"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/adp-architecture-limited",
        "Entreprise": "ADP Architecture Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grupo-morena",
        "Entreprise": "Grupo Morena"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/012-factory",
        "Entreprise": "012factory Spa Società Benefit"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/heward-mills-limited",
        "Entreprise": "HewardMills Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/come-together-wellness",
        "Entreprise": "Come Together Wellness"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/oknygaard-as",
        "Entreprise": "OKNygaard A/S"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grc-parfum-spa",
        "Entreprise": "GRC PARFUM spa"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/allcot-ag",
        "Entreprise": "ALLCOT AG"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/theotclab",
        "Entreprise": "TheOTCLab"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lusana",
        "Entreprise": "Lusana"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/clean-beauty-co-ltd",
        "Entreprise": "BYBI Beauty"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grupo-tactica",
        "Entreprise": "Grupo TACTICA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/findasense",
        "Entreprise": "Findasense"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/whizz-education-limited",
        "Entreprise": "Whizz Education Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/femme-laboratorio-da-mulher",
        "Entreprise": "Femme - Laboratório da Mulher"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/capfi",
        "Entreprise": "CAPFI"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ecoliv-buildings-pty-ltd",
        "Entreprise": "Ecoliv Buildings Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mana-earthly-paradise",
        "Entreprise": "Mana Earthly Paradise"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/studio-oa",
        "Entreprise": "Studio O+A"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-uplift-partnership",
        "Entreprise": "The Uplift Partnership"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tea-pak-srl",
        "Entreprise": "TeaPak s.r.l. SB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/curious-and-company",
        "Entreprise": "Curious and Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/scalora-holdings-llc-dba-scalora-consulting-group",
        "Entreprise": "Scalora Consulting Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/optimist-drinks",
        "Entreprise": "OPTIMIST Drinks"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-wild-foods",
        "Entreprise": "The Wild Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/latbio",
        "Entreprise": "LatBio S.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/caisse-d-epargne-hauts-de-france",
        "Entreprise": "Caisse d'Epargne Hauts de France"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bakery-group",
        "Entreprise": "Bakery Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/genui-gmb-h",
        "Entreprise": "GENUI GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/feed-your-soul-llc",
        "Entreprise": "Feed Your Soul"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/psychopomp-limited",
        "Entreprise": "Psychopomp Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wild-lama",
        "Entreprise": "Wild Lama"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/phyto-therapy-pty-ltd",
        "Entreprise": "Phyto-Therapy Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/4cp",
        "Entreprise": "4CP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/el-pastoret-de-la-segarra",
        "Entreprise": "Pastoret"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/etifor",
        "Entreprise": "Etifor Srl Società Benefit"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fortissimo-chocolates",
        "Entreprise": "Fortissimo Chocolates"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/native-advisory-llc",
        "Entreprise": "Native Advisory LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/moss-earth",
        "Entreprise": "Moss Earth"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/abcom",
        "Entreprise": "abcom"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rwd-limited",
        "Entreprise": "RWD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/icebug-ab",
        "Entreprise": "Icebug AB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/making-cents-international",
        "Entreprise": "Making Cents International"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aire-studio-sa",
        "Entreprise": "Aire Studio"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tiptoe",
        "Entreprise": "TIPTOE"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/herbaland-naturals-inc",
        "Entreprise": "Herbaland Naturals Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bligraf-sa",
        "Entreprise": "Bligraf"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-nursery-research-planning-ltd",
        "Entreprise": "The Nursery Research & Planning Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/southbridge",
        "Entreprise": "Southbridge"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lodestone-communications-trading-name-of-lodestone-oxford-ltd",
        "Entreprise": "Lodestone Communications"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/visit-good-place",
        "Entreprise": "Visit GoodPlace"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/koa-switzerland-ag",
        "Entreprise": "Koa"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/soil-capital",
        "Entreprise": "Soil Capital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/isle-of-wight-distillery",
        "Entreprise": "Isle of Wight Distillery"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/deck-donohue",
        "Entreprise": "Deck & Donohue"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/koup",
        "Entreprise": "Koup"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impact-hub-caracas-ca",
        "Entreprise": "Impact Hub Caracas C.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/paper-culture-llc",
        "Entreprise": "Paper Culture LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/intelligent-nutrients",
        "Entreprise": "Intelligent I-N"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wild-card-public-relations-limited",
        "Entreprise": "Wild Card Public Relations Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pathmore-food-group",
        "Entreprise": "Pathmore Food Group d/b/a Inked Bread Co."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vandecq-sa-brasserie-leopold-7",
        "Entreprise": "Brasserie LEOPOLD7"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grupo-report",
        "Entreprise": "Grupo Report"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stamp-productions",
        "Entreprise": "Stamp Productions"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bridge-city-law",
        "Entreprise": "Bridge City Law"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/good-ventures-ltd",
        "Entreprise": "Good Ventures Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/idea-translations",
        "Entreprise": "Idea Translations"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kazi-yetu",
        "Entreprise": "Kazi Yetu"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/alternative-foods",
        "Entreprise": "OGGS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/inuka-coaching",
        "Entreprise": "Inuka Coaching"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/manawa-honey-nz",
        "Entreprise": "Tuhoe Tuawhenua Trust T/A Manawa Honey NZ"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/diosa-designs-inc",
        "Entreprise": "DIOSA designs Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/redington-limited",
        "Entreprise": "Redington Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/alier-sa",
        "Entreprise": "ALIER S.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/percy-ellis-holdings-inc",
        "Entreprise": "Percy Ellis Holdings Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-re-wrap",
        "Entreprise": "The re-wrap Association"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/blue-mark",
        "Entreprise": "BlueMark"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sunhouse-creative",
        "Entreprise": "Sunhouse Creative"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/karma-drinks",
        "Entreprise": "Karma Drinks"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/blue-frog-breakfast",
        "Entreprise": "Blue Frog Breakfast"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impact-advocaten",
        "Entreprise": "impact advocaten"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/maddyness",
        "Entreprise": "Maddyness"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/chabaso-bakery",
        "Entreprise": "Chabaso Bakery"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/earth-animal",
        "Entreprise": "Earth Animal Ventures"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/he-nu-company-gmb-h",
        "Entreprise": "the nu company GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/digital-attitude-srl",
        "Entreprise": "Digital Attitude Srl"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lares",
        "Entreprise": "Lares"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/good-sam-pbc-dba-good-sam-foods",
        "Entreprise": "GoodSam PBC, dba GoodSam Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/conformit-technology-inc",
        "Entreprise": "Conformit Technology Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impression-digital-limited",
        "Entreprise": "Impression Digital Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grupo-imasd",
        "Entreprise": "Grupo Imasd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lixir-drinks",
        "Entreprise": "Lixir Drinks"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ocushield-ltd",
        "Entreprise": "Ocushield LTD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mark-making",
        "Entreprise": "mark-making*"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/biscuits-agathe",
        "Entreprise": "Biscuits Agathe"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hilltop-honey-ltd",
        "Entreprise": "Hilltop Honey LTD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/r-a-bailey-co-unlimited-company",
        "Entreprise": "R & A Bailey & Co Unlimited Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mind-arc",
        "Entreprise": "MindArc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sage-alms",
        "Entreprise": "Sage & Alms DBA Kanda Chocolates"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/we-are-liminal-ltd",
        "Entreprise": "We Are Liminal Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/candy-kittens",
        "Entreprise": "Candy Kittens"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/piper",
        "Entreprise": "Piper"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/b-n-p-performance-philanthropique",
        "Entreprise": "BNP Performance philanthropique"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/branch-financial-inc",
        "Entreprise": "Branch Financial, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bird-blend-tea-ltd",
        "Entreprise": "Bird & Blend Tea Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jennings-of-garsington-ltd",
        "Entreprise": "Jennings of Garsington Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gravning-gmb-h",
        "Entreprise": "Gravning GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/banana-moon-workshop-ltd",
        "Entreprise": "Banana Moon Clothing"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/charter-brands-ltd",
        "Entreprise": "Charter Brands Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sensat",
        "Entreprise": "Sensat"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brl",
        "Entreprise": "BRØL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-organic-company-ap-s",
        "Entreprise": "The Organic Company ApS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wahoo-films",
        "Entreprise": "Wahoo Films"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/adeptid",
        "Entreprise": "AdeptID"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/morning",
        "Entreprise": "Morning"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bristol-seafood",
        "Entreprise": "Bristol Seafood"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dead-happy-limited",
        "Entreprise": "Dead Happy Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/circle",
        "Entreprise": "Circle"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-handmade-soap-company",
        "Entreprise": "The Handmade Soap Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/four-objects-ltd",
        "Entreprise": "Four Objects Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/les-mouettes-vertes",
        "Entreprise": "Les Mouettes Vertes"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/foodspeed-limited",
        "Entreprise": "Foodspeed Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fazla",
        "Entreprise": "Fazla"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/taylor-pass-honey-co",
        "Entreprise": "Taylor Pass Honey Co"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/muddy-puddles",
        "Entreprise": "Muddy Puddles"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/reink-media-group-llc",
        "Entreprise": "Reink Media Group, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/volpara-health-technologies-ltd",
        "Entreprise": "Volpara Health Technologies Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/blended-impact-inc",
        "Entreprise": "Blended Impact, Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/frisbi-marketing",
        "Entreprise": "Frisbi Marketing"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/emerald-stay",
        "Entreprise": "Emerald Stay"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/project-offset-ltd",
        "Entreprise": "COCO+"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/four-communications-group-ltd",
        "Entreprise": "Four Communications Group Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/algaex-sa",
        "Entreprise": "Algaex S.A"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hecht-bannier-hb-selection",
        "Entreprise": "Hecht & Bannier"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/endeavor-design-inc",
        "Entreprise": "Endeavor Design Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/plant-meat-limited-ta-this",
        "Entreprise": "Plant Meat Limited T/A THIS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/visual-ilusion",
        "Entreprise": "Visual Ilusion"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lava-advisory-partners-limited",
        "Entreprise": "Lava Advisory Partners Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cascadia-seaweed",
        "Entreprise": "Cascadia Seaweed"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/procook",
        "Entreprise": "ProCook"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lodestar-hub-pbc",
        "Entreprise": "Lodestar"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/blue-patagon-srl",
        "Entreprise": "Blue Patagon"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brubank",
        "Entreprise": "Brubank"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/natural-designs-landscaping",
        "Entreprise": "Natural Designs Landscaping"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/admind",
        "Entreprise": "Admind"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/aires-de-campo",
        "Entreprise": "Aires de Campo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/innova-feed",
        "Entreprise": "Innovafeed"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/berg-kaprow-lewis-l-l-p",
        "Entreprise": "Berg Kaprow Lewis LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-habitat-penang-hill",
        "Entreprise": "The Habitat Penang Hill"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mangrove-consulting",
        "Entreprise": "Mangrove consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wrappr",
        "Entreprise": "Wrappr"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/re-vaso-reuy-sas",
        "Entreprise": "ReVaso"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pacific-fin-capital",
        "Entreprise": "Pacific Fin Capital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/altamedinet-gmb-h",
        "Entreprise": "altamedinet GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ambro-sol-srl-sb",
        "Entreprise": "Ambro-Sol Srl SB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/social-impact-hub",
        "Entreprise": "Social Impact Hub"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/motion-energy-holdings-pty-ltd",
        "Entreprise": "Motion Energy Holdings Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/emperor-design-consultants-limited",
        "Entreprise": "Emperor"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fabricsmart-ta-scrummi",
        "Entreprise": "Fabricsmart t/a Scrummi"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rato-ri-moda-e-design",
        "Entreprise": "RatoRói Moda e Design"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hive-brands-inc",
        "Entreprise": "Hive Brands, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/farm-company-as",
        "Entreprise": "FarmCompany A/S"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/e-smart-recycling",
        "Entreprise": "eSmart Recycling"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wiredscore",
        "Entreprise": "WiredScore"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jumo-world-limited",
        "Entreprise": "Jumo World Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/macecofar-cia-ltda-bic",
        "Entreprise": "MACECOFAR CIA LTDA BIC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hive-cleaning",
        "Entreprise": "Hive Cleaning"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/open-creates-ltd",
        "Entreprise": "Open Creates Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mina-digital-ltd",
        "Entreprise": "Mina Digital Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vintners-daughter",
        "Entreprise": "Vintner's Daughter"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/altafonte-sl",
        "Entreprise": "Altafonte"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/necessaire-inc",
        "Entreprise": "Nécessaire, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/redbird-media-group",
        "Entreprise": "Redbird Media Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/coalafied",
        "Entreprise": "Coalafied"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/alpin-schule-innsbruck-gmb-h",
        "Entreprise": "ASI Reisen"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vanity-cosmetica-srl",
        "Entreprise": "VANITY COSMETICA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/life-is-tech",
        "Entreprise": "Life is Tech!"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ciele-athletics",
        "Entreprise": "Ciele Athletics"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/micro-scooters-ltd",
        "Entreprise": "Micro Scooters"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grace-farms-foods-llc",
        "Entreprise": "Grace Farms Foods"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/in-blooom-co-ltd",
        "Entreprise": "inBlooom Co"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/energy-management-sa",
        "Entreprise": "Energy Management SA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/morgan-innovation-technology-ltd",
        "Entreprise": "Morgan Innovation & Technology Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/talisker-consulting",
        "Entreprise": "Talisker Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/value-investment-colombia-sas",
        "Entreprise": "VIC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/enabling-qapital-ag",
        "Entreprise": "Enabling Qapital AG"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/casacom",
        "Entreprise": "CASACOM"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eolys-beaut",
        "Entreprise": "EOLYS beauté"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/myfood-france-sas",
        "Entreprise": "Myfood"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tembici",
        "Entreprise": "Tembici"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/profit-reimagined",
        "Entreprise": "Profit Reimagined™Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wazoku-ltd",
        "Entreprise": "Wazoku"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cuatro-dos-srl",
        "Entreprise": "Cuatro Dos SRL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lick-home",
        "Entreprise": "Lick Home"
      },
      // {
      //   "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/culture-art-and-nature-can",
      //   "Entreprise": "Culture, Art and Nature (CAN)"
      // },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wood-for-good",
        "Entreprise": "Wood for Good"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/d-infrastructure",
        "Entreprise": "bd infrastructure"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/horizon-software",
        "Entreprise": "Horizon Software"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rbw-consulting-limited",
        "Entreprise": "RBW Consulting Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/circular-citizen-consulting",
        "Entreprise": "Circular Citizen Consulting"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fable-home-goods",
        "Entreprise": "Fable"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/norda-stelo-inc",
        "Entreprise": "Norda Stelo Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/corban-blair-pty-ltd",
        "Entreprise": "Corban & Blair Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sense-of-scale-llc",
        "Entreprise": "Sense of Scale, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/basil",
        "Entreprise": "Basil"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/better-all-round-ltd",
        "Entreprise": "Better All Round Ltd / Fibre Revolution Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nimgenetics-genmica-y-medicina-sl",
        "Entreprise": "NIMGENETICS GENÓMICA Y MEDICINA, S.L"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/love-raw-ltd",
        "Entreprise": "LoveRaw"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/a-n-a-i-k",
        "Entreprise": "ANAIK"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bit-prophets-and-wizards-bv",
        "Entreprise": "Bit"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/designers-remix-as",
        "Entreprise": "Designers Remix A/S"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/horizon-business-plans",
        "Entreprise": "Horizon Business Plans"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/devocion-usa",
        "Entreprise": "Devoción USA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/optimal-workshop-ltd",
        "Entreprise": "Optimal Workshop"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/buildings-alive-pty-limited",
        "Entreprise": "Buildings Alive"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/vibrant-body-company",
        "Entreprise": "Vibrant Body Company"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bufete-ius-aequitas-abogados-sl",
        "Entreprise": "Bufete Ius Aequitas Abogados SLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/december-19",
        "Entreprise": "december19"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eco-noronha",
        "Entreprise": "EcoNoronha"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jacquet-s-a",
        "Entreprise": "Jacquet SA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brand-fuel",
        "Entreprise": "Brand Fuel"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/alleyoop",
        "Entreprise": "Alleyoop"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/yuool",
        "Entreprise": "Yuool"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/comply-direct",
        "Entreprise": "Comply Direct"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nuliv-science-usa-inc",
        "Entreprise": "Nuliv Science Usa Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/swap-this-holding",
        "Entreprise": "SwapThis Holding"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/good-lab",
        "Entreprise": "Good.Lab"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/edgecom-energy",
        "Entreprise": "Edgecom Energy"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/zonneveld-best-bv",
        "Entreprise": "Zonneveld Best b.v."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/urban-leaf",
        "Entreprise": "Urban Leaf"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bsco",
        "Entreprise": "BS&CO"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/221-consulting-ltd-dba-knowmium",
        "Entreprise": "Knowmium"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ads-insight",
        "Entreprise": "ADS Insight"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/results-lab",
        "Entreprise": "ResultsLab"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/zuczug",
        "Entreprise": "zuczug"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kplus-v-bv",
        "Entreprise": "KplusV B.V."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/homeexchange",
        "Entreprise": "HomeExchange"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/qida-caring-well-sl",
        "Entreprise": "QIDA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stories-services-ltd",
        "Entreprise": "Stories"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-impact-lab",
        "Entreprise": "Rethinkable"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sycous-limited",
        "Entreprise": "Sycous Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/olio-exchange",
        "Entreprise": "OLIO Exchange"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/myriad-media-designs-inc",
        "Entreprise": "Myriad"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/crank-2021-target",
        "Entreprise": "Crank"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/meyer-action-marketing",
        "Entreprise": "Meyer Action Marketing"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lloydsdirect",
        "Entreprise": "LloydsDirect"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/project-blu",
        "Entreprise": "Project Blu"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/derksen-drolsbach",
        "Entreprise": "Derksen & Drolsbach"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mrcagney",
        "Entreprise": "MRCagney"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lrm-wealth-management-pty-ltd",
        "Entreprise": "Via Financial Group Pty Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ridgeview-estate-winery-limited",
        "Entreprise": "Ridgeview Estate Winery Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/threesixty-architecture",
        "Entreprise": "Threesixty Architecture"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/market-lane-coffee",
        "Entreprise": "Market Lane Coffee"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/laietana-de-llibreteria-sl",
        "Entreprise": "Laie"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/notepad",
        "Entreprise": "Notepad"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/agden-consulting-limited",
        "Entreprise": "Agden Consulting Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/atmos-financial-pbc",
        "Entreprise": "Atmos Financial, PBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kane-communications-group",
        "Entreprise": "Kane Communications Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rio-biocosmeticos",
        "Entreprise": "RIÔ BIOCOSMÉTICOS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/4-hbitos-para-mudar-o-mundo",
        "Entreprise": "4 Habitos para Mudar o Mundo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lestrange",
        "Entreprise": "L'Estrange"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/thrift-plus",
        "Entreprise": "Thrift Plus"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/xigxag-limited",
        "Entreprise": "xigxag Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/go-tofreedom",
        "Entreprise": "GoTofreedom"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/holson-sas",
        "Entreprise": "holson"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-doing-good-model",
        "Entreprise": "The Doing Good Model"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bloom",
        "Entreprise": "Bloom Care"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/brabners-llp",
        "Entreprise": "Brabners LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/urban-jungle-services-ltd",
        "Entreprise": "Urban Jungle Services Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/osiris",
        "Entreprise": "OSIRIS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/big-bang",
        "Entreprise": "Big Bang"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/piantando",
        "Entreprise": "Piantando"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/value-squared",
        "Entreprise": "Value Squared"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/fitotek",
        "Entreprise": "Fitotek"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/net-zero-group",
        "Entreprise": "Net Zero Group"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sustainable-nw-wood",
        "Entreprise": "Sustainable NW Wood"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ocaquatics-swim-school",
        "Entreprise": "Ocaquatics Swim School"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/terra-blue-wealth-management",
        "Entreprise": "Terra Blue Wealth Management"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/business-interiors-of-idaho",
        "Entreprise": "Freeform"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/elsmere-education",
        "Entreprise": "Elsmere Education"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/atypic",
        "Entreprise": "Atypic"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/daphni",
        "Entreprise": "daphni"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/konjak-paris",
        "Entreprise": "Konjak Paris"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/emerge-next-leaders-llc",
        "Entreprise": "Emerge Next Networks, LLC."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/talking-tables",
        "Entreprise": "Talking Tables"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/panambi-recicla-srl",
        "Entreprise": "Panambi Recicla SRL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eprcomunicazione-societ-benefit-a-rl",
        "Entreprise": "Eprcomunicazione società benefit a r.l."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tool-be",
        "Entreprise": "Tool-be"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/condor-technologies",
        "Entreprise": "Condor Technologies"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mediatree",
        "Entreprise": "Mediatree"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/work-bright",
        "Entreprise": "WorkBright"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/column-software-pbc",
        "Entreprise": "Column Software, PBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/f-o-r-t-a-l-e-z-a-s-a-d-e-i-n-m-u-e-b-l-e-s",
        "Entreprise": "FORTALEZA S.A. DE INMUEBLES"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bumerang-takeaway-sl",
        "Entreprise": "Bumerang Takeaway SL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/scrap-ad",
        "Entreprise": "ScrapAd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sarno-display-srl",
        "Entreprise": "Sarno Display srl"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hitch",
        "Entreprise": "Hitch"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/madre-mejores-empaques",
        "Entreprise": "Madre Mejores Empaques"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hawksmoor",
        "Entreprise": "Hawksmoor"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mida-sp-a",
        "Entreprise": "MIDA SB S.p.A."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/hemingway-design",
        "Entreprise": "HemingwayDesign"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/future-bens-gmb-h",
        "Entreprise": "FutureBens GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/wwwzoncoalitienl",
        "Entreprise": "Zoncoalitie"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/zentys-medical",
        "Entreprise": "Zentys Medical"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ziba-design-inc",
        "Entreprise": "Ziba Design Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/we-maintain",
        "Entreprise": "WeMaintain"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/young-foodies",
        "Entreprise": "YF"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dna-design",
        "Entreprise": "DNA Design"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ganni-a-s",
        "Entreprise": "Ganni A/S"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bio-bulgaria",
        "Entreprise": "Bio Bulgaria"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/jaguar",
        "Entreprise": "Ecosistema Jaguar"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/we-who-do",
        "Entreprise": "WeWhoDo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/always-be-content-limited",
        "Entreprise": "Always Be Content Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/south-pole-gmb-h",
        "Entreprise": "South Pole GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ice-dragon-corrosion-inc",
        "Entreprise": "ICE dragon corrosion inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/adore-me",
        "Entreprise": "Adore Me"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pennard-practice-ltd",
        "Entreprise": "Pennard Practice Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/c-hoare-co",
        "Entreprise": "C. Hoare & Co."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/feed-projects",
        "Entreprise": "FEED"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bleeker-inc",
        "Entreprise": "Bleeker, PBC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/15-lightyears-inc",
        "Entreprise": "15 lightyears, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/neat-home-ltd",
        "Entreprise": "Neat Home Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/senseinvest",
        "Entreprise": "Senseinvest"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/valtex",
        "Entreprise": "CABAÏA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/tradewater-llc",
        "Entreprise": "Tradewater, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/beenz-ltd",
        "Entreprise": "BeeNZ Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/m-cultivo",
        "Entreprise": "M-Cultivo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/big-sky-mind-pty-ltd",
        "Entreprise": "Human.Kind"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dryrobe",
        "Entreprise": "dryrobe"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ozone-coffee-roasters-international",
        "Entreprise": "Ozone Coffee Roasters International"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-leets-consortium",
        "Entreprise": "The Leets Consortium"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/air",
        "Entreprise": "air"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/light-warrior-wellness",
        "Entreprise": "Wanderlust"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-honest-kitchen",
        "Entreprise": "The Honest Kitchen"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/moorish-ltd",
        "Entreprise": "Moorish LTD"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/radio-flyer-inc",
        "Entreprise": "Radio Flyer Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/nordgreen-ap-s",
        "Entreprise": "Nordgreen ApS"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/global-brand-and-export-development-llc",
        "Entreprise": "Global Brand and Export Development, LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/berghaus",
        "Entreprise": "Berghaus"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-other-dada-regenerative-consultancy-architecture",
        "Entreprise": "theOtherDada - Regenerative Consultancy & Architecture Practice"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/terratinta-group-srl-sb",
        "Entreprise": "Terratinta Group Srl SB"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/why-gmb-h",
        "Entreprise": "&why GmbH"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/de-bonne-facture",
        "Entreprise": "De Bonne Facture"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/blaze-partners",
        "Entreprise": "Blaze Partners"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/anglian-bespoke-corrugated-and-packaging-ltd",
        "Entreprise": "Anglian Bespoke Corrugated and Packaging Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/care-pros",
        "Entreprise": "CarePros"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/outfly-innovation-ltd",
        "Entreprise": "Outfly Innovation Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pai-skincare",
        "Entreprise": "Pai Skincare"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-impact-collective",
        "Entreprise": "The Impact Collective"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lunchskins",
        "Entreprise": "Lunchskins"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/impacto-35",
        "Entreprise": "Impacto 35"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/pupfish-sustainability-solutions-inc",
        "Entreprise": "Pupfish Sustainability Solutions Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/dragonfly-ventures",
        "Entreprise": "Dragonfly Ventures"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/english-tea-shop-group",
        "Entreprise": "English Tea Shop"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/comprando-en-grupo",
        "Entreprise": "Comprando en Grupo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/bdebueno-maihue",
        "Entreprise": "BDEBUENO / MAIHUE"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/s-m-a-c-a-b-o-s-e-s-i-s-t-e-m-a-s-l-t-d-a",
        "Entreprise": "Santo Angelo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/rutabago",
        "Entreprise": "Rutabago"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/we-hero",
        "Entreprise": "WeHero"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ethicdrinks",
        "Entreprise": "Ethicdrinks"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/protein-europe-bv",
        "Entreprise": "Protein Europe BV"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/natures-crops-inc",
        "Entreprise": "Natures Crops Inc"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/danone-de-mxico",
        "Entreprise": "Danone de México"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/solbari",
        "Entreprise": "Solbari"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kabuto-foods-ltd",
        "Entreprise": "Kabuto Foods ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/la-newyorkina-sl",
        "Entreprise": "La Newyorkina SL"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/eka-ventures",
        "Entreprise": "Eka Ventures"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/carbonext-holding-ltda",
        "Entreprise": "Carbonext"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/different-dog-ltd",
        "Entreprise": "Different Dog Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/studio-xag",
        "Entreprise": "Studio XAG"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/farm-connection-consultoria-agrcola-connect-farm",
        "Entreprise": "ConnectFARM"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/arca-etichette-sp-a",
        "Entreprise": "Arca Etichette SpA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/istoria-group-ltd",
        "Entreprise": "Istoria Group Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/liforme",
        "Entreprise": "Liforme"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/gather-brands",
        "Entreprise": "Gather Brands"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/q-impact-investment-management-sgeic-sa",
        "Entreprise": "Q-IMPACT Investment Management SGEIC SA"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ethical-digital",
        "Entreprise": "Ethical Digital"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-jolly-hog-group-ltd",
        "Entreprise": "The Jolly Hog Group Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mother-kombucha",
        "Entreprise": "Mother Kombucha"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/sun-god-ltd",
        "Entreprise": "SunGod Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/a-d-h-o-c-c-o-a-c-h-i-n-g",
        "Entreprise": "AD HOC COACHING"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/breathe-architecture",
        "Entreprise": "Breathe Architecture"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/luum",
        "Entreprise": "Luum"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/interconnect-communications-pty-ltd-ta-carbon-offset-co",
        "Entreprise": "Carbon Offset Co."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ready-state",
        "Entreprise": "Ready State"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/moneyworks-nz-ltd",
        "Entreprise": "Moneyworks NZ Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/unison-company-ltd",
        "Entreprise": "Unison Company Ltd."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/freight-brokers-ltd",
        "Entreprise": "Freight Brokers Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/joe-bean-coffee-l-l-c",
        "Entreprise": "Joe Bean Coffee LLC"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/the-modern-house",
        "Entreprise": "The Modern House"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/q-b-s-technology-group-limited",
        "Entreprise": "QBS Technology Group Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/portman-settled-estates-limited",
        "Entreprise": "Portman Settled Estates Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/monashee-health-collective",
        "Entreprise": "Monashee Health Collective"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/arte-groep",
        "Entreprise": "Arte Groep"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/elige-verde",
        "Entreprise": "Elige Verde"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/market-one-go-to-market-experts",
        "Entreprise": "Market One"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/copastur-viagens-e-turismo-ltda",
        "Entreprise": "Copastur Turismo"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cristin-fernndez-arquitectos",
        "Entreprise": "Cristián Fernández Arquitectos"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lukkap-chile",
        "Entreprise": "Lukkap Chile"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/downing-llp",
        "Entreprise": "Downing LLP"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/steppes-travel",
        "Entreprise": "Steppes Travel"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/telic-advisory-limited",
        "Entreprise": "Telic Advisory Limited"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/balancing-lifes-issues-inc",
        "Entreprise": "Balancing Life's Issues, Inc."
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/investment-quorum-ltd",
        "Entreprise": "Investment Quorum Ltd"
      },
      {
        "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/kit-and-kin-ltd",
        "Entreprise": "Kit and Kin Ltd"
      }
  ],
  [
      {
        "Entreprise": "Wieland Awarded Silver Medal by ESG Evaluator EcoVadis"
      },
      {
        "Entreprise": "eschbach Awarded Bronze Sustainability Rating from EcoVadis"
      },
      {
        "Entreprise": "ACCO Brands EMEA awarded EcoVadis Bronze Medal ..."
      },
      {
        "Entreprise": "Ricoh Awarded Gold Rating By EcoVadis For Sustainability ..."
      },
      {
        "Entreprise": "Westlake Epoxy Receives EcoVadis Platinum Award ..."
      },
      {
        "Entreprise": "Ricoh awarded Gold rating by EcoVadis for its sustainability ..."
      },
      {
        "Entreprise": "Envision Plastics Receives EcoVadis Silver Award for ..."
      },
      {
        "Entreprise": "Stolt Nielsen : Tankers achieves gold rating in EcoVadis ..."
      },
      {
        "Entreprise": "Indorama Ventures Wins Gold Medal by EcoVadis for ..."
      },
      {
        "Entreprise": "Rhenus Air & Ocean Joins Clean Cargo"
      },
      {
        "Entreprise": "Atos recognized as Supplier Engagement Leader by CDP for 4th year running"
      },
      {
        "Entreprise": "Air Liquide awarded EcoVadis' Gold medal for its action on ..."
      },
      {
        "Entreprise": "Konica Minolta placed in top five percent of companies in ..."
      },
      {
        "Entreprise": "WENDEL: 2022 Full-Year Results: Good performance of the ..."
      },
      {
        "Entreprise": "Sisal awarded Gold from EcoVadis for its sustainability ..."
      },
      {
        "Entreprise": "EcoVadis awards Scott Bader Gold sustainability rating"
      },
      {
        "Entreprise": "Nexans has been awarded a Platinum medal for its CSR ..."
      },
      {
        "Entreprise": "Johnson Controls awarded platinum sustainability rating by ..."
      },
      {
        "Entreprise": "EcoVadis and S&P: SPIE in the top 10% in its sector in terms ..."
      },
      {
        "Entreprise": "Temenos Tops Software Industry in S&P Global Sustainability ..."
      },
      {
        "Entreprise": "Lumentum Awarded the Platinum EcoVadis Medal for ..."
      },
      {
        "Entreprise": "Emery Oleochemicals receives EcoVadis Silver award"
      },
      {
        "Entreprise": "ICS awarded platinum medal in EcoVadis Corporate Social ..."
      },
      {
        "Entreprise": "Watch: Faravelli releases video pledging commitment to ..."
      },
      {
        "Entreprise": "Womble Bond Dickinson scoops ESG Firm of the Year award ..."
      },
      {
        "Entreprise": "CANPACK Group Awarded Top Platinum Sustainability Rating ..."
      },
      {
        "Entreprise": "Methanex Awarded EcoVadis Gold Medal for Sustainability ..."
      },
      {
        "Entreprise": "Canon's sustainability efforts rewarded with top 5% Gold ..."
      },
      {
        "Entreprise": "Continental Takes on Co-Chair of Tire Industry Project | ..."
      },
      {
        "Entreprise": "Ardagh awarded EcoVadis platinum rating"
      },
      {
        "Entreprise": "Element Solutions Announces 2022 ESG Report and ..."
      },
      {
        "Entreprise": "American Express Global Business Travel awarded platinum ..."
      },
      {
        "Entreprise": "Arco awarded gold medal by EcoVadis"
      },
      {
        "Entreprise": "Element Solutions Inc Announces 2022 ESG Report and Sustainability \nRecognition"
      },
      {
        "Entreprise": "Gurit receives Silver rating for sustainability performance"
      },
      {
        "Entreprise": "CGI awarded platinum rating by EcoVadis"
      },
      {
        "Entreprise": "Situ awarded silver sustainability rating from EcoVadis"
      },
      {
        "Entreprise": "GEKA earns EcoVadis Platinum sustainability rating for third ..."
      },
      {
        "Entreprise": "Nouryon Achieves EcoVadis Gold Rating For Sustainability ..."
      },
      {
        "Entreprise": "JCDecaux ranked “Platinum” by EcoVadis for its ..."
      },
      {
        "Entreprise": "Jojoba Desert Earns EcoVadis Gold Medal"
      },
      {
        "Entreprise": "Bridgestone retains EcoVadis Platinum rating"
      },
      {
        "Entreprise": "CSRWire - LyondellBasell Secures Advanced Recycled ..."
      },
      {
        "Entreprise": "Huhtamaki acquires full ownership of its foodservice distribution joint \nventure in Australia"
      },
      {
        "Entreprise": "EVS Achieves EcoVadis Silver Status For Its First CSR ..."
      },
      {
        "Entreprise": "WBD awarded gold standard certification by leading ..."
      },
      {
        "Entreprise": "Sakata INX's UK Subsidiary Earns Silver Medal in EcoVadis ..."
      },
      {
        "Entreprise": "VDM Metals receives Gold status from EcoVadis"
      },
      {
        "Entreprise": "ACI Worldwide Honored with EcoVadis Silver Medal for ..."
      },
      {
        "Entreprise": "Klöckner Pentaplast Awarded Gold Rating By EcoVadis ..."
      },
      {
        "Entreprise": "KRATON ACHIEVES ECOVADIS PLATINUM LEVEL ..."
      },
      {
        "Entreprise": "IBG France (Beauty Services Europe) awarded top EcoVadis ..."
      },
      {
        "Entreprise": "Cintas Honored With Multiple Workplace and Employment ..."
      },
      {
        "Entreprise": "Kumho Tire Obtains Silver Medal from Ecovadis in ESG ..."
      },
      {
        "Entreprise": "ATA Freight Once Again Awarded EcoVadis Bronze ..."
      },
      {
        "Entreprise": "EFESO names Consulting a top performer in sustainability"
      },
      {
        "Entreprise": "Kendal's James Cropper claims gold medal rating from ..."
      },
      {
        "Entreprise": "Sanjay Upadhyay, Director Finance and Group CFO of Deepak Nitrite Limited \nconferred The BW Best CFO Large Enterprise award"
      },
      {
        "Entreprise": "Corporate Social Responsibility: Boralex Awarded EcoVadis ..."
      },
      {
        "Entreprise": "CSRWire - Tersano Is Awarded Prestigious EcoVadis Medal ..."
      },
      {
        "Entreprise": "Tosca Awarded the EcoVadis Gold Medal for Sustainability ..."
      },
      {
        "Entreprise": "Brenntag : achieves with platinum the highest possible status in the \nEcoVadis sustainability assessment"
      },
      {
        "Entreprise": "INX International Honored By EcoVadis For Sustainability ..."
      },
      {
        "Entreprise": "Bain & Company earns a Platinum rating from EcoVadis for ..."
      },
      {
        "Entreprise": "Staples Promotional Products Launches the Promotional ..."
      },
      {
        "Entreprise": "Hilton Recognized for Sustainability Leadership by Dow ..."
      },
      {
        "Entreprise": "Azelis awarded Platinum from sustainability ratings agency ..."
      },
      {
        "Entreprise": "Canon's Sustainability Efforts Earn Gold Rating From EcoVadis"
      },
      {
        "Entreprise": "Xsys achieves EcoVadis 2022 silver medal rating"
      },
      {
        "Entreprise": "Archroma awarded EcoVadis Gold in CSR 2020"
      },
      {
        "Entreprise": "Dormakaba : Halbjahresbericht 2022/23"
      },
      {
        "Entreprise": "Dunlop Protective Footwear Earns Gold Rating from EcoVadis"
      },
      {
        "Entreprise": "Qosina Corp. Awarded EcoVadis Silver Medal for ..."
      },
      {
        "Entreprise": "ICL Awarded Prestigious Gold Medal by EcoVadis"
      },
      {
        "Entreprise": "ROHM Awarded Platinum Rating by EcoVadis for 2021 ..."
      },
      {
        "Entreprise": "What does Holmen Iggesund's 'platinum' sustainability rating ..."
      },
      {
        "Entreprise": "Weekly Recap: hubergroup Deutschland Earns EcoVadis ..."
      },
      {
        "Entreprise": "Burlington company earns platinum award for sustainability ..."
      },
      {
        "Entreprise": "Sustainability at Sydney"
      },
      {
        "Entreprise": "Nexans celebrates the recognition of its CSR performance"
      },
      {
        "Entreprise": "Xinhua Silk Road: Seraphim awarded silver medal in ..."
      },
      {
        "Entreprise": "Griffith Foods Mexico Receives Silver Medal from EcoVadis"
      },
      {
        "Entreprise": "CSRWire - Rockwell Automation Achieves EcoVadis Gold ..."
      },
      {
        "Entreprise": "Arkay Packaging Awarded Gold Rating in EcoVadis CSR ..."
      },
      {
        "Entreprise": "Samsung Biologics Recognized For Its Sustainability Efforts"
      },
      {
        "Entreprise": "Epson awarded EcoVadis platinum status"
      },
      {
        "Entreprise": "Diamond Packaging Earns Platinum Rating From EcoVadis"
      },
      {
        "Entreprise": "Muntons awarded platinum medal for sustainability ..."
      },
      {
        "Entreprise": "DS Smith awarded platinum rating from EcoVadis"
      },
      {
        "Entreprise": "Naolys receives Gold Medal for sustainability from EcoVadis"
      },
      {
        "Entreprise": "Baker Hughes Receives Three External Recognitions for ..."
      },
      {
        "Entreprise": "Ineos Styrolution receives platinum rating from EcoVadis"
      },
      {
        "Entreprise": "Firmenich achieves highest EcoVadis Platinum sustainability ..."
      },
      {
        "Entreprise": "Sales at 30 September 2022"
      },
      {
        "Entreprise": "ICS expands its sustainable and circular packaging solutions ..."
      },
      {
        "Entreprise": "First-of-its-kind C2C Gold cashmere"
      },
      {
        "Entreprise": "Tata Steel Mining becomes first Indian Company to receive ..."
      },
      {
        "Entreprise": "PRESSE: Parador erhält Gold-Zertifizierung für ..."
      },
      {
        "Entreprise": "Nokia Mobile gets platinum sustainability rating"
      },
      {
        "Entreprise": "Lumson accelerates their business development in North ..."
      },
      {
        "Entreprise": "Barentz Earns Silver Level Recognition from Sustainability ..."
      },
      {
        "Entreprise": "Johnson Controls Receives Two Awards for Exceptional ESG ..."
      },
      {
        "Entreprise": "Socomec Awarded Highest EcoVadis Certification Medal"
      },
      {
        "Entreprise": "Carton Service Achieves FSC Certification"
      },
      {
        "Entreprise": "Nouryon Announces Recipients Of 2022 Supplier Of The Year ..."
      },
      {
        "Entreprise": "Greif signs its first sustainable financing agreement; receives ..."
      },
      {
        "Entreprise": "3D Metalforge shutters Singapore and Houston operations"
      },
      {
        "Entreprise": "Onsemi Earns Platinum Medal From EcoVadis 2022 ..."
      },
      {
        "Entreprise": "Archroma awarded Platinum by EcoVadis for CSR"
      },
      {
        "Entreprise": "Sodexo receives the AGEFI Sustainable Business Award in ..."
      },
      {
        "Entreprise": "EcoVadis upgrades Arcadis sustainability rating from Silver to ..."
      },
      {
        "Entreprise": "HAS Healthcare Advanced Synthesis (HAS"
      },
      {
        "Entreprise": "EcoVadis Upgrades INNIO Jenbacher Rating to Gold Medal ..."
      },
      {
        "Entreprise": "Chemours Receives Gold Medal From EcoVadis for Its ..."
      },
      {
        "Entreprise": "Elopak Receives Platinum Sustainability Rating from EcoVadis"
      },
      {
        "Entreprise": "Greif Awarded Gold Rating from EcoVadis for Fourth ..."
      },
      {
        "Entreprise": "Sabic wins platinum medal in sustainability from EcoVadis"
      },
      {
        "Entreprise": "Neo Performance's Estonia REE facility awarded for ..."
      },
      {
        "Entreprise": "Fedrigoni: six purchases for the benefit of the luxury world"
      },
      {
        "Entreprise": "Faravelli announces new collaboration with Natural ..."
      },
      {
        "Entreprise": "SPIE announces the closing of the Sustainability-linked ..."
      },
      {
        "Entreprise": "EcoVadis Awards Sulzer Mixpac AG With Silver Rating"
      },
      {
        "Entreprise": "External recognition"
      },
      {
        "Entreprise": "JCDecaux gets Gold from EcoVadis for environmental & CSR performance"
      },
      {
        "Entreprise": "Nation Ford Chemical Receives 2022 EHS Gold Award"
      },
      {
        "Entreprise": "Ecovadis raises $500m in funding round led by General ..."
      },
      {
        "Entreprise": "Iggesund's paper mills receive EcoVadis Platinum medal"
      },
      {
        "Entreprise": "Sustainability award for International SOS"
      },
      {
        "Entreprise": "Vantage Specialty Chemicals earns EcoVadis Gold rating"
      },
      {
        "Entreprise": "Klöckner Pentaplast"
      },
      {
        "Entreprise": "SPIE enters into exclusive negotiations for the acquisition of ..."
      },
      {
        "Entreprise": "Tech Mahindra Launches End-to-End ESG Offerings to ..."
      },
      {
        "Entreprise": "Join Asquan at MULA 2023!"
      },
      {
        "Entreprise": "Endress+Hauser Maintains Top Position in Sustainability Audit"
      },
      {
        "Entreprise": "Grant Thornton releases 2022 ESG Report; continues its ..."
      },
      {
        "Entreprise": "CGI's 2022 ESG Report details its progress in building a more ..."
      },
      {
        "Entreprise": "BTS wins human capital management awards for client work"
      },
      {
        "Entreprise": "Johnson Controls Distinguished as Global Climate Leader by ..."
      },
      {
        "Entreprise": "Sustainability: Knorr-Bremse makes a major contribution to ..."
      },
      {
        "Entreprise": "Nouryon Announces 2022 Supplier of the Year Awards"
      },
      {
        "Entreprise": "Westlake Epoxy Achieves EcoVadis Platinum Sustainability ..."
      },
      {
        "Entreprise": "Jones Healthcare Group Earns Silver Ranking From EcoVadis"
      },
      {
        "Entreprise": "Zuellig Pharma Clinches Ecovadis Gold Medal 2021 For ..."
      },
      {
        "Entreprise": "Socomec Showcase Latest Energy Storage Systems at EES ..."
      },
      {
        "Entreprise": "Sustainability ratings"
      },
      {
        "Entreprise": "Livent Receives 2022 EcoVadis Gold Sustainability Rating"
      },
      {
        "Entreprise": "HMD Global"
      },
      {
        "Entreprise": "Lumentum 200G PAM4 EMLs Honored by 2023 Lightwave ..."
      },
      {
        "Entreprise": "Costa Navarino picks up WTM award for reducing plastic waste"
      },
      {
        "Entreprise": "Indices and Ratings"
      },
      {
        "Entreprise": "Corby luxury installation specialists awarded gold for ..."
      },
      {
        "Entreprise": "INNIO's Commitment to Global Sustainability Recognized by ..."
      },
      {
        "Entreprise": "Qosmedix Earns Bronze From EcoVadis"
      },
      {
        "Entreprise": "edie Awards 2023: Shortlist of finalists revealed"
      },
      {
        "Entreprise": "Interplex Sustainability Commitments Crowned with 2021 ..."
      },
      {
        "Entreprise": "Firmenich Strengthens Sustainability Performance in FY2022 ..."
      },
      {
        "Entreprise": "ALD awarded EcoVadis Gold label in recognition of its CSR ..."
      },
      {
        "Entreprise": "Winners of Private Equity Wire US Awards announced"
      },
      {
        "Entreprise": "CSRWire - LyondellBasell Quickly Advances Towards Its 2030 ..."
      },
      {
        "Entreprise": "Clariant's Rootness Awake Wins Gold at the BSB Innovation ..."
      },
      {
        "Entreprise": "Fastenal releases inaugural ESG Report"
      },
      {
        "Entreprise": "Amcor Sustainability Report reflects on landmark year"
      },
      {
        "Entreprise": "Pyrum Innovations gains permit for expanded main plant"
      },
      {
        "Entreprise": "Micron Announces Historic Investment of up to $100 Billion to ..."
      },
      {
        "Entreprise": "Corporate Social Responsibility Related News Releases and ..."
      },
      {
        "Entreprise": "EcoVadis assesses WHP for sustainability"
      },
      {
        "Entreprise": "Stony Brook"
      },
      {
        "Entreprise": "Neptune Energy announces H1 2022 results"
      },
      {
        "Entreprise": "Go Inspire hires client development director"
      },
      {
        "Entreprise": "Sustainable Medicines Packaging Awards finalists announced"
      },
      {
        "Entreprise": "This Trust wireless keyboard and mouse set is a WFH bargain"
      },
      {
        "Entreprise": "Jacobs Recognized in The Dow Jones Sustainability World ..."
      },
      {
        "Entreprise": "Silab améliore son score EcoVadis - Actus"
      },
      {
        "Entreprise": "Temenos Awarded the Top ESG Rating by MSCI"
      },
      {
        "Entreprise": "Geberit recognized as the global leader for sustainable ..."
      },
      {
        "Entreprise": "Ring Container Technologies Receives Sustainable ..."
      },
      {
        "Entreprise": "Innospec Achieves Gold Rating in EcoVadis CSR Assessment ..."
      },
      {
        "Entreprise": "Go Inspire partners with Bloomreach on personalisation"
      },
      {
        "Entreprise": "NetApp Delivers Portfolio Innovations to Address Skyrocketing ..."
      },
      {
        "Entreprise": "Smurfit Kappa in top 1% of Ecovadis' worldwide sustainability ..."
      },
      {
        "Entreprise": "Johnson Controls Recognized in the 2023 Global 100 Listing ..."
      },
      {
        "Entreprise": "Axalta Receives EcoVadis Gold Star Award - BodyShop ..."
      },
      {
        "Entreprise": "CHEP receives the EcoVadis Platinum Recognition Level ..."
      },
      {
        "Entreprise": "CSRWire - LyondellBasell Selects Executive Vice President of ..."
      },
      {
        "Entreprise": "Rockwell Automation issues annual sustainability report"
      },
      {
        "Entreprise": "Sustainability at the core: Need of the hour for global ..."
      },
      {
        "Entreprise": "Albéa Earns EcoVadis Gold"
      },
      {
        "Entreprise": "External Assessments - Ball"
      },
      {
        "Entreprise": "Holcim Deutschland GmbH wins award for sustainable ..."
      },
      {
        "Entreprise": "At Davos 2023"
      },
      {
        "Entreprise": "Epson Earns Platinum Rating For Sustainability From ..."
      },
      {
        "Entreprise": "Pyrum building up to 10 pyrolysis plants with Unitank"
      },
      {
        "Entreprise": "Fostering Business Resilience through Sustainability"
      },
      {
        "Entreprise": "Deepak Nitrite Limited awarded the prestigious 'Excellence in ..."
      },
      {
        "Entreprise": "Indicators - The main ESG ratings"
      },
      {
        "Entreprise": "Sederma Achieves Diamond Award at ICI for BB-Biont"
      },
      {
        "Entreprise": "Hotelys décroche la médaille d'argent EcoVadis"
      },
      {
        "Entreprise": "CSR performance indicators for 2022"
      },
      {
        "Entreprise": "Aptar Releases 2021 Corporate Sustainability / ESG Report"
      },
      {
        "Entreprise": "Lumson supports Race for the Cure"
      },
      {
        "Entreprise": "Lumson supports Race for the Cure"
      },
      {
        "Entreprise": "Mercedes-Benz using 'tyre plastic' in vehicle production"
      },
      {
        "Entreprise": "EcoSynthetix Receives Platinum Score for Sustainability for ..."
      },
      {
        "Entreprise": "Firmenich earns sustainability credit with fifth CDP “triple A”"
      },
      {
        "Entreprise": "Tech Mahindra Q3 FY23 Results"
      },
      {
        "Entreprise": "Corporate Responsibility and Sustainability"
      },
      {
        "Entreprise": "Jojoba Desert: Redefining sustainability"
      },
      {
        "Entreprise": "Pyrum to set up JV pyrolysis plant"
      },
      {
        "Entreprise": "Sustainability"
      },
      {
        "Entreprise": "Sederma's BB-Biont Receives 2022 I FEEL GOOD Award"
      },
      {
        "Entreprise": "Sappi North America releases 2021 Sustainability Report ..."
      },
      {
        "Entreprise": "Zignago Vetro wins sustainable glass making award"
      },
      {
        "Entreprise": "Liebherr gets top marks for sustainability from global auditor"
      },
      {
        "Entreprise": "Awards and Recognition"
      },
      {
        "Entreprise": "Croxsons to showcase expanding lifestyle and wellness range ..."
      },
      {
        "Entreprise": "Sustainability ratings and rankings"
      },
      {
        "Entreprise": "Top five sustainable packaging companies of 2022"
      },
      {
        "Entreprise": "ESG ratings"
      },
      {
        "Entreprise": "Owens Corning (OC) Q3 2022 Earnings Call Transcript"
      },
      {
        "Entreprise": "Sustainable Packaging Solutions"
      },
      {
        "Entreprise": "Shaping the Sustainable Future of Manufacturing in Germany"
      },
      {
        "Entreprise": "Sustainalytics Ranks INNIO ESG Risk Rating as Number One ..."
      },
      {
        "Entreprise": "GEKA Expands Headquarters in Germany; Receives Eco ..."
      },
      {
        "Entreprise": "How New Age Technologies are Gearing Us Towards Supply ..."
      },
      {
        "Entreprise": "Tech Mahindra to Establish its First Data & AI and Cloud ..."
      },
      {
        "Entreprise": "Lumson's XPaper wins at Cosmopack Awards 2022"
      },
      {
        "Entreprise": "National Association of Corporate Directors New Jersey ..."
      },
      {
        "Entreprise": "Essity Is Recognized Globally For Its Continued Leadership In ..."
      },
      {
        "Entreprise": "Tech Mahindra Inks MoU with Tagawa City"
      },
      {
        "Entreprise": "Gold standard is a natural for Botto Giuseppe"
      },
      {
        "Entreprise": "Tech Mahindra Selected as Nynas' Digital Transformation ..."
      },
      {
        "Entreprise": "B2B Sustainability Forum for the Americas: 5 Key Takeaways"
      },
      {
        "Entreprise": "Puig outlines key achievements with 2030 ESG Agenda"
      },
      {
        "Entreprise": "Will Human-Centricity Create a Sustainable Digitized Economy?"
      },
      {
        "Entreprise": "Innospec Publishes 2020 Responsible Business Report"
      },
      {
        "Entreprise": "Bilfinger SE"
      },
      {
        "Entreprise": "ICS celebrates 30th anniversary in 2021 with logo makeover"
      },
      {
        "Entreprise": "Tech Mahindra Q2 FY23 Results"
      },
      {
        "Entreprise": "Bel: Annual financial information 2021"
      },
      {
        "Entreprise": "BorsodChem Wins top Award for Sustainability and CSR - BBJ"
      },
      {
        "Entreprise": "Greif Releases 2021 Sustainability Report Highlighting ..."
      },
      {
        "Entreprise": "TK Elevator wins 2nd prize at National Award for Excellence in ..."
      },
      {
        "Entreprise": "CWT wins top green rating"
      },
      {
        "Entreprise": "Tech Mahindra Unveils Telco Smart Analytics Lab Dedicated ..."
      },
      {
        "Entreprise": "Tech Mahindra Launches Cloud BlazeTech to Maximize ..."
      },
      {
        "Entreprise": "Itomic Joins R744.com as Silver Partner"
      },
      {
        "Entreprise": "Alba wins EcoVadis award for CSR activities"
      },
      {
        "Entreprise": "Mascara specialist Geka launches new sustainable fibre ..."
      },
      {
        "Entreprise": "Bain & Company acts on global sustainability imperative with ..."
      },
      {
        "Entreprise": "Merck"
      }
  ]
]

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
  console.log('client connecté',socket.id);

  socket.on("get_scrap", function (selectedOption) {
    console.log('get_scrap')
    setInterval(()=>{
        scrapAllURL(selectedOption, dataURL[0], 0, deb, inc)
    }, 10 * 1000)
  });

});

function capitalizeWords(str) {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}
async function GetLinkedinDataFromCompany(entreprise){
    // Login
    const client = new Client();
    await client.login.userPass({ username:"georges@greenly.earth", password:"25079819987" });
    let users = []
    let company = ""
    try {
        // Fetch the job's company
        const companiesScroller = client.search.searchCompanies({
          filters: { company: entreprise, },
          limit: 1,
        })
        company = await companiesScroller.scrollNext()
        //console.log("=======> ",company)
        // Search for profiles and send an invitation
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
  const $ = cheerio.load(html)
  switch(dataURLIndex){
    case 0: {
        // console.log(dataURL[dataURLIndex], dataURLIndex, dataIndex, html, url)
        $('.break-words .opacity-60 a', html).each(async(index, el) => {
          //Get Linkedin Datas
          let users = await GetLinkedinDataFromCompany(dataURL[dataIndex]["Entreprise"])
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
        console.log("HTML : " + url + " - " + html)
        await getData(dataURL,dataURLIndex, index, html, url)
    } catch (error) {
        console.error(error)
    }
}
function scrapAllURL(selectedOption, dataURL, dataURLIndex, debHere, incHere){
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
    if(inc === dataURL.length) {
      io.emit("scrap_end", inc);
    }
}


server.listen(8080);