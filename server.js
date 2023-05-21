import fetch from "node-fetch";
import { load } from "cheerio";
import { Client } from "linkedin-private-api";
// import fs from 'fs';
// import { join } from 'path';
import express from 'express';
import http from "http";
import compression from "compression"

//make the server and the socketsio yanne sidibe

// if (process.env.NODE_ENV !== 'production') { dotenv.config() }
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

//server static file in sthe public directory
// app.use(express.static(join(".", '../client/build'))); 
app.use(express.static('./client/build'));
app.use(compression());

//Var & Const
let timerInt
let deb = 0
let inc = deb + 1
const mod_leads = 1
const mod_comp = 1

let result = []
const options = ["SBTI", "CDP", "Ecovadis", "B-Corp", "Test 5 of SBTI"];
const optionsICP = ["All - P1 + P2 + P3", "P1 - Persona Sustainability", "P2 - Persona CEO/COO/Legal", "P3 - Persona RH & Marketing"];
const jobsICP = [
  "'Sustainability Manager' OR 'Head of Sustainability' OR 'Sustainability Officer' OR 'Chief Impact Officer' OR 'Environmental Manager' OR 'ESG Manager'",
  "'Chief Procurement Officer' OR 'Chief Legal Officer' OR 'Chief Compliance Officer’ OR ‘Chief Transformation Officer’ OR ‘Head of Operations’",
  "'Chief Marketing Officer' OR 'Chief People Officer' OR 'Human Resources Director’ OR ‘Head of Marketing’ OR ‘Head of Human Resources’ OR ‘Marketing Director’",
];
const jobs = {
  "icp1": ["directeur", "directrice", "director", "head of", "project manager", "chargé", "chargée", "chef de Projet", "cheffe de Projet", "coordinateur", "responsable", "coordinatrice", "coordinator", "chief", "manager", "partner", "analyste"],
  "icp2": ["rse", "qse", "hse", "qhse", "environnement", "développement durable", "sustainability", "esg", "isr", "csr", "impact", "climat", "climate", "numérique responsable", "bas-carbone"],
  // OR
  "icp3": ["directeur", "directrice", "director", "chief", "head of"],
  "icp4": ["opérations", "operations", "achats", "procurement", "achats responsables", "quality", "stratégie", "finance", "qualité", "conformité"],
  // NOT
  "icpno": ["sales", "commercial", "adjoint", "assistant", "stagiaire", "consultant", "freelance", "r&d", "si", "it", "administrateur", "business", "fresque", "advisor", "hr", "recruitment"],
}
const locs = {
  "fr": ["france", "paris", "toulouse", "lyon", "belgium", "brussels", "luxembourg", "switzerland", "québec", "quebec"],
  "us": ["canada", "united states", "usa", "mexico", "greenland", "saint pierre and miquelon", "san fransisco", "california"],
  "uk" : ["germany", "austria","bulgaria","croatia","cyprus","denmark", "spain","estonia","finland","greece","hungary","ireland",
    "iceland","italy","latvia","liechtenstein","lithuania","malta","norway","netherlands","poland","portugal","czech",
    "czech","romania", "united kingdom", "slovakia", "slovenia", "sweden", "vatican"],
}
const locs_greenly = ["Greenly France", "Greenly USA", "Greenly UK", "Greenly RoW"];

const dataURL = [
  [
    {
      "Entreprise": "2 Sisters Food Group"
    },
    {
      "Entreprise": "24 Ltd"
    },
    {
      "Entreprise": "2degrees"
    },
    {
      "Entreprise": "3B-Fibreglass"
    },
    {
      "Entreprise": "3i Group plc"
    },
    {
      "Entreprise": "4most"
    },
    {
      "Entreprise": "80 Acres Urban Agriculture, Inc"
    },
    {
      "Entreprise": "A&L Goodbody"
    },
    {
      "Entreprise": "A-Insinöörit Oy"
    },
    {
      "Entreprise": "A. Espersen A/S"
    },
    {
      "Entreprise": "A.G. Barr plc"
    },
    {
      "Entreprise": "A.S. Watson Holdings Limited"
    },
    {
      "Entreprise": "A/S Vestfrost"
    },
    {
      "Entreprise": "A1 Telekom Austria Group"
    },
    {
      "Entreprise": "A2A S.p.A."
    },
    {
      "Entreprise": "A2G S.A.C B.I.C"
    },
    {
      "Entreprise": "AAK AB"
    },
    {
      "Entreprise": "Aakel Technologies Inc."
    },
    {
      "Entreprise": "Aardvark Certification Ltd"
    },
    {
      "Entreprise": "Aarti Industries"
    },
    {
      "Entreprise": "Aasted ApS"
    },
    {
      "Entreprise": "AB Fagerhult"
    },
    {
      "Entreprise": "AB InBev"
    },
    {
      "Entreprise": "AB SKF"
    },
    {
      "Entreprise": "AB Sugar"
    },
    {
      "Entreprise": "AB Tingstad Papper"
    },
    {
      "Entreprise": "AB Volvo"
    },
    {
      "Entreprise": "ABB"
    },
    {
      "Entreprise": "Abbott"
    },
    {
      "Entreprise": "AbbVie"
    },
    {
      "Entreprise": "Abdi Ibrahim Pharmaceuticals"
    },
    {
      "Entreprise": "Abel & Cole Ltd."
    },
    {
      "Entreprise": "Abertis Infraestructuras"
    },
    {
      "Entreprise": "ABF Data Systems dba Direct Systems Support"
    },
    {
      "Entreprise": "ABM Industries Inc"
    },
    {
      "Entreprise": "ABOUT YOU"
    },
    {
      "Entreprise": "ABP Food Group"
    },
    {
      "Entreprise": "Abt Associates"
    },
    {
      "Entreprise": "AcBel Polytech Inc."
    },
    {
      "Entreprise": "ACC Limited"
    },
    {
      "Entreprise": "ACCA (Association of Chartered Certified Accountants)"
    },
    {
      "Entreprise": "ACCEDO BROADBAND AB"
    },
    {
      "Entreprise": "Accellion Inc. (Kiteworks)"
    },
    {
      "Entreprise": "Accent Equity AB"
    },
    {
      "Entreprise": "Accenture PLC"
    },
    {
      "Entreprise": "ACCIONA S.A."
    },
    {
      "Entreprise": "Accolade Wines"
    },
    {
      "Entreprise": "Accor S.A."
    },
    {
      "Entreprise": "AccorInvest Group S.A."
    },
    {
      "Entreprise": "Ace & Tate Holding B.V."
    },
    {
      "Entreprise": "Ace Technologies Co.,Ltd."
    },
    {
      "Entreprise": "Acea SpA"
    },
    {
      "Entreprise": "Acensi"
    },
    {
      "Entreprise": "Acer Inc."
    },
    {
      "Entreprise": "Acerinox,S.A."
    },
    {
      "Entreprise": "Aceros AZA S.A."
    },
    {
      "Entreprise": "ACO Technologies Ltd"
    },
    {
      "Entreprise": "AÇO VERDE DO BRASIL.S.A"
    },
    {
      "Entreprise": "Acque Bresciane"
    },
    {
      "Entreprise": "ACRE"
    },
    {
      "Entreprise": "ACROX TECHNOLOGIES CO., LTD."
    },
    {
      "Entreprise": "ACS Dobfar S.p.A."
    },
    {
      "Entreprise": "Actavo (Group) Limited"
    },
    {
      "Entreprise": "Actiam NV"
    },
    {
      "Entreprise": "Action Sustainability (Trading) Ltd"
    },
    {
      "Entreprise": "Active Brands"
    },
    {
      "Entreprise": "Acturis Limited"
    },
    {
      "Entreprise": "Acuity Brands"
    },
    {
      "Entreprise": "Acuity Knowledge Services (India) Private Limited"
    },
    {
      "Entreprise": "AD-II ENGINEERING INC."
    },
    {
      "Entreprise": "Adani Green Energy Ltd."
    },
    {
      "Entreprise": "Adani Ports and Special Economic Zone Limited"
    },
    {
      "Entreprise": "Adani Transmission Limited"
    },
    {
      "Entreprise": "Addtech AB"
    },
    {
      "Entreprise": "Adecco Group AG"
    },
    {
      "Entreprise": "Aden Contracting Ltd"
    },
    {
      "Entreprise": "ADEN SERVICES CHINA (GROUP)"
    },
    {
      "Entreprise": "Aderen Consulting SL"
    },
    {
      "Entreprise": "Adidas AG"
    },
    {
      "Entreprise": "ADIENT plc"
    },
    {
      "Entreprise": "ADM"
    },
    {
      "Entreprise": "adm Group Limited"
    },
    {
      "Entreprise": "Adobe, Inc."
    },
    {
      "Entreprise": "ADTRAN, Inc."
    },
    {
      "Entreprise": "Adva Optical Networking SE"
    },
    {
      "Entreprise": "Advance Auto Parts, Inc"
    },
    {
      "Entreprise": "Advance Residence Investment Corporation"
    },
    {
      "Entreprise": "Advanced Chemistry Development, Inc. (ACD/Labs)"
    },
    {
      "Entreprise": "Advanced Drainage Systems, Inc."
    },
    {
      "Entreprise": "Advanced Micro Devices, Inc"
    },
    {
      "Entreprise": "Advania Ísland ehf."
    },
    {
      "Entreprise": "Advania Sweden AB"
    },
    {
      "Entreprise": "Advantech Co., Ltd."
    },
    {
      "Entreprise": "Advantest Corporation"
    },
    {
      "Entreprise": "AECOM"
    },
    {
      "Entreprise": "Aecon Group Inc."
    },
    {
      "Entreprise": "Aegon Nederland N.V."
    },
    {
      "Entreprise": "AENA S.M.E. S.A."
    },
    {
      "Entreprise": "Aeon Co., Ltd."
    },
    {
      "Entreprise": "AEON MALL Co., Ltd."
    },
    {
      "Entreprise": "AEROPORTO GUGLIELMO MARCONI DI BOLOGNA S.P.A."
    },
    {
      "Entreprise": "Aéroports de Paris SA"
    },
    {
      "Entreprise": "AFRY (ÅF Pöyry)"
    },
    {
      "Entreprise": "AGC Inc."
    },
    {
      "Entreprise": "Agder Energi"
    },
    {
      "Entreprise": "Agendi Inc"
    },
    {
      "Entreprise": "Agilent Technologies, Inc"
    },
    {
      "Entreprise": "Agility"
    },
    {
      "Entreprise": "AGRANA Beteiligungs-AG"
    },
    {
      "Entreprise": "Agrial"
    },
    {
      "Entreprise": "Agromaks Sp. z o.o."
    },
    {
      "Entreprise": "AGROMILLORA GROUP"
    },
    {
      "Entreprise": "Agropur Cooperative"
    },
    {
      "Entreprise": "Aguas Andinas S.A."
    },
    {
      "Entreprise": "Ahlstrom-Munksjö Oyj"
    },
    {
      "Entreprise": "AIA Group Limited"
    },
    {
      "Entreprise": "AIB Group Plc"
    },
    {
      "Entreprise": "Aichi Hoist Industry Co., Ltd."
    },
    {
      "Entreprise": "Aico"
    },
    {
      "Entreprise": "Aigle International SA"
    },
    {
      "Entreprise": "Aigües de Barcelona, Empresa Metropolitana de Gestió del Cicle Integral de l'Aigua, S.A."
    },
    {
      "Entreprise": "Aile CO.Ltd."
    },
    {
      "Entreprise": "Air France - KLM Group"
    },
    {
      "Entreprise": "Air France Group"
    },
    {
      "Entreprise": "Air Liquide Group S.A."
    },
    {
      "Entreprise": "Air New Zealand"
    },
    {
      "Entreprise": "Airbnb, Inc"
    },
    {
      "Entreprise": "Airbus"
    },
    {
      "Entreprise": "AIRINC"
    },
    {
      "Entreprise": "Airsys Refrigeration Engineering Technology (Beijing) Co., Ltd."
    },
    {
      "Entreprise": "Airties Group S.A.S."
    },
    {
      "Entreprise": "AISACHI Co.,Ltd."
    },
    {
      "Entreprise": "AISIN CORPORATION"
    },
    {
      "Entreprise": "Aitken Spence PLC"
    },
    {
      "Entreprise": "AJE GROUP"
    },
    {
      "Entreprise": "Ajinomoto Co., Inc."
    },
    {
      "Entreprise": "Akamai Technologies INC"
    },
    {
      "Entreprise": "Akçansa Çimento Sanayi ve Ticaret A. Ş."
    },
    {
      "Entreprise": "AKDAŞ DÖKÜM A.Ş."
    },
    {
      "Entreprise": "Aker Carbon Capture"
    },
    {
      "Entreprise": "Aker Horizons ASA"
    },
    {
      "Entreprise": "Aker Solutions"
    },
    {
      "Entreprise": "Akila"
    },
    {
      "Entreprise": "AKISTEEL CO.LTD"
    },
    {
      "Entreprise": "Akplas"
    },
    {
      "Entreprise": "AKT II Limited"
    },
    {
      "Entreprise": "AkzoNobel"
    },
    {
      "Entreprise": "Al-Karam Textile Mills (Pvt) Ltd"
    },
    {
      "Entreprise": "AL-RAHIM TEXTILE INDUSTRIES"
    },
    {
      "Entreprise": "Alaya Consulting Ltd."
    },
    {
      "Entreprise": "Albaad Massuot Yitzhak Ltd."
    },
    {
      "Entreprise": "Albaraka Türk Participation Bank"
    },
    {
      "Entreprise": "Albert & Hummel GmbH"
    },
    {
      "Entreprise": "Albert Bartlett and Sons (Airdrie) Ltd."
    },
    {
      "Entreprise": "Albertsons Companies, Inc"
    },
    {
      "Entreprise": "Alchem International Private Limited"
    },
    {
      "Entreprise": "Alcumus"
    },
    {
      "Entreprise": "ALD"
    },
    {
      "Entreprise": "ALDI Einkauf SE & Co. oHG"
    },
    {
      "Entreprise": "ALDI SOUTH Group"
    },
    {
      "Entreprise": "ALDO Group Inc."
    },
    {
      "Entreprise": "ALE INTERNATIONAL SASU (GROUP)"
    },
    {
      "Entreprise": "Alfa Laval AB"
    },
    {
      "Entreprise": "Alfen N.V."
    },
    {
      "Entreprise": "Alfred Kärcher SE & Co. KG"
    },
    {
      "Entreprise": "Alfred Ritter GmbH & Co. KG"
    },
    {
      "Entreprise": "Algar Telecom"
    },
    {
      "Entreprise": "Alibaba Group Holding Limited"
    },
    {
      "Entreprise": "ALIMAC s.r.l."
    },
    {
      "Entreprise": "Alison Hayes"
    },
    {
      "Entreprise": "ALK-Abelló"
    },
    {
      "Entreprise": "Alkaram Towel Industries (Pvt.) Ltd."
    },
    {
      "Entreprise": "All for One Group SE"
    },
    {
      "Entreprise": "Allbirds"
    },
    {
      "Entreprise": "Allegro"
    },
    {
      "Entreprise": "Alleima"
    },
    {
      "Entreprise": "Allen & Overy LLP"
    },
    {
      "Entreprise": "Allens"
    },
    {
      "Entreprise": "Allford Hall Monaghan Morris Limited"
    },
    {
      "Entreprise": "Allglass Windscreens Repair Ltd"
    },
    {
      "Entreprise": "Alliance Construction Materials Limited"
    },
    {
      "Entreprise": "Alliance One Apparel Co.,Ltd"
    },
    {
      "Entreprise": "Allianz Investment Management SE"
    },
    {
      "Entreprise": "Allied Sustainability and Environmental Consultants Group Limited"
    },
    {
      "Entreprise": "Alltech, Inc."
    },
    {
      "Entreprise": "Alma Media"
    },
    {
      "Entreprise": "Almax Co.,Ltd"
    },
    {
      "Entreprise": "ALMETAX MANUFACTURING CO.,LTD."
    },
    {
      "Entreprise": "Almhaga AB"
    },
    {
      "Entreprise": "Alpek Polyester"
    },
    {
      "Entreprise": "Alpek S.A.B. de C.V."
    },
    {
      "Entreprise": "Alperia SpA"
    },
    {
      "Entreprise": "ALPHA INDO NUSA"
    },
    {
      "Entreprise": "Alphabet Inc."
    },
    {
      "Entreprise": "Alpin Çorap San. Ve Tic. A.Ş"
    },
    {
      "Entreprise": "Alpkit"
    },
    {
      "Entreprise": "ALPLA Werke Alvin Lehner GmbH & Co KG"
    },
    {
      "Entreprise": "Alsico Group"
    },
    {
      "Entreprise": "Alstom"
    },
    {
      "Entreprise": "alstria office REIT-AG"
    },
    {
      "Entreprise": "Altavia"
    },
    {
      "Entreprise": "Altech Co.,Ltd."
    },
    {
      "Entreprise": "ALTEN"
    },
    {
      "Entreprise": "Alterra Mountain Company"
    },
    {
      "Entreprise": "Altice Portugal"
    },
    {
      "Entreprise": "Altor Equity Partners"
    },
    {
      "Entreprise": "Altri SGPS S.A."
    },
    {
      "Entreprise": "Altria Group, Inc."
    },
    {
      "Entreprise": "Alun Griffiths (Contractors) Ltd"
    },
    {
      "Entreprise": "Alvinesa Natural Ingredients"
    },
    {
      "Entreprise": "AM Værktøj Odense A/S"
    },
    {
      "Entreprise": "AMA SA"
    },
    {
      "Entreprise": "AMADA CO.,LTD."
    },
    {
      "Entreprise": "Amadeus IT Group"
    },
    {
      "Entreprise": "AMAG Group"
    },
    {
      "Entreprise": "AMAGGI"
    },
    {
      "Entreprise": "Amalgamated Bank"
    },
    {
      "Entreprise": "Amalgamated Construction Ltd"
    },
    {
      "Entreprise": "Amarant Bakkersholding B.V."
    },
    {
      "Entreprise": "Amazon"
    },
    {
      "Entreprise": "Ambev S.A."
    },
    {
      "Entreprise": "Ambu"
    },
    {
      "Entreprise": "Ambuja Cement Ltd"
    },
    {
      "Entreprise": "AMC Natural Drinks"
    },
    {
      "Entreprise": "Amcor plc"
    },
    {
      "Entreprise": "Amdocs Ltd."
    },
    {
      "Entreprise": "Amer Sports Corporation"
    },
    {
      "Entreprise": "America Movil, S.A.B. de C.V."
    },
    {
      "Entreprise": "American Airlines"
    },
    {
      "Entreprise": "American Axle & Manufacturing, Inc."
    },
    {
      "Entreprise": "American Eagle Outfitters, Inc."
    },
    {
      "Entreprise": "American Express Company"
    },
    {
      "Entreprise": "American Express Global Business Travel"
    },
    {
      "Entreprise": "American Packaging Corporation"
    },
    {
      "Entreprise": "American Tower Corporation"
    },
    {
      "Entreprise": "Americanas S.A."
    },
    {
      "Entreprise": "Americold Realty Trust"
    },
    {
      "Entreprise": "AmerisourceBergen Corporation"
    },
    {
      "Entreprise": "Amey UK plc"
    },
    {
      "Entreprise": "AMF FASTIGHETER AB"
    },
    {
      "Entreprise": "Amgen Inc."
    },
    {
      "Entreprise": "AMICULUM Limited"
    },
    {
      "Entreprise": "Ammper Energía S.A.P.I de C.V"
    },
    {
      "Entreprise": "AMOREPACIFIC CORPORATION"
    },
    {
      "Entreprise": "AMP Wealth Management New Zealand"
    },
    {
      "Entreprise": "AMS"
    },
    {
      "Entreprise": "An Post"
    },
    {
      "Entreprise": "ANA Holdings Inc."
    },
    {
      "Entreprise": "Ana Luisa"
    },
    {
      "Entreprise": "Anabas UK2 Ltd"
    },
    {
      "Entreprise": "ANADOLU ISUZU OTOMOTİV SAN. VE TİC. A.Ş."
    },
    {
      "Entreprise": "Analog Devices, Inc."
    },
    {
      "Entreprise": "Anchor Glass Container Corporation"
    },
    {
      "Entreprise": "Andechser Molkerei Scheitz GmbH"
    },
    {
      "Entreprise": "Andera Partners"
    },
    {
      "Entreprise": "Andrew Scott Ltd"
    },
    {
      "Entreprise": "ANDRITZ"
    },
    {
      "Entreprise": "Anhui Yugong wear resistant material technology Co., Ltd."
    },
    {
      "Entreprise": "Anora Group Plc"
    },
    {
      "Entreprise": "Anritsu Corporation"
    },
    {
      "Entreprise": "ANTA Sports Products Limited"
    },
    {
      "Entreprise": "Antea Nederland B.V."
    },
    {
      "Entreprise": "Anthem, Inc."
    },
    {
      "Entreprise": "Anthesis Group"
    },
    {
      "Entreprise": "Anticimex Group AB"
    },
    {
      "Entreprise": "Anxi Changxin Mining Machinery Parts Manufacturing Co., Ltd"
    },
    {
      "Entreprise": "AnyJunk Limited"
    },
    {
      "Entreprise": "aoito soken Co., Ltd."
    },
    {
      "Entreprise": "Aon, plc"
    },
    {
      "Entreprise": "APACHE FOOTWEAR LIMITED"
    },
    {
      "Entreprise": "APERAM S.A."
    },
    {
      "Entreprise": "apetito (UK) Limited"
    },
    {
      "Entreprise": "APG|SGA Allgemeine Plakatgesellschaft AG"
    },
    {
      "Entreprise": "API Restauration"
    },
    {
      "Entreprise": "APL Apollo Tubes Limited"
    },
    {
      "Entreprise": "APL Logistics LTD"
    },
    {
      "Entreprise": "Apotea"
    },
    {
      "Entreprise": "Apoteket AB"
    },
    {
      "Entreprise": "APP Sinar Mas"
    },
    {
      "Entreprise": "Appen Limited"
    },
    {
      "Entreprise": "Apple, Inc."
    },
    {
      "Entreprise": "Applied Materials"
    },
    {
      "Entreprise": "Applus Services, S.A"
    },
    {
      "Entreprise": "Apraava Energy Private Limited"
    },
    {
      "Entreprise": "AptarGroup Inc."
    },
    {
      "Entreprise": "APTIM"
    },
    {
      "Entreprise": "Aptiv"
    },
    {
      "Entreprise": "Aqua America"
    },
    {
      "Entreprise": "Arab Printing Press"
    },
    {
      "Entreprise": "Aragen Life Sciences Private Limited"
    },
    {
      "Entreprise": "Aramark"
    },
    {
      "Entreprise": "Aramex Group"
    },
    {
      "Entreprise": "Arauco"
    },
    {
      "Entreprise": "Arburg GmbH + Co KG"
    },
    {
      "Entreprise": "ARC Alternative and Renewable Construction LLC"
    },
    {
      "Entreprise": "ARC CO., LTD."
    },
    {
      "Entreprise": "Arc Legal Group"
    },
    {
      "Entreprise": "Arc'teryx Equipment Inc."
    },
    {
      "Entreprise": "Arca Continental S.A.B. de C.V"
    },
    {
      "Entreprise": "Arcade Beauty"
    },
    {
      "Entreprise": "Arcadis NV"
    },
    {
      "Entreprise": "Arcadyan Technology Corporation"
    },
    {
      "Entreprise": "ARÇELİK A.Ş."
    },
    {
      "Entreprise": "Arcelor Mittal"
    },
    {
      "Entreprise": "Archroma International Ltd"
    },
    {
      "Entreprise": "Arcus FM Limited"
    },
    {
      "Entreprise": "Ardagh Glass Packaging Holdings Sarl"
    },
    {
      "Entreprise": "Ardagh Metal Packaging S.A."
    },
    {
      "Entreprise": "Arendals Fossekompani ASA"
    },
    {
      "Entreprise": "ARESTI CHILE WINE S.A."
    },
    {
      "Entreprise": "Arezzo & Co"
    },
    {
      "Entreprise": "ARGOS WITYU PARTNERS S.A."
    },
    {
      "Entreprise": "Aristocrat Leisure Limited"
    },
    {
      "Entreprise": "Aritzia LP"
    },
    {
      "Entreprise": "Arjeplog Hotel Silverhatten AB"
    },
    {
      "Entreprise": "Arjo AB"
    },
    {
      "Entreprise": "Arkema"
    },
    {
      "Entreprise": "Arkhangelsk Pulp and Paper Mill"
    },
    {
      "Entreprise": "Arla Foods"
    },
    {
      "Entreprise": "Arm Holdings"
    },
    {
      "Entreprise": "Armada Supply Chain Solutions, LLC"
    },
    {
      "Entreprise": "Armando Alvarez Group"
    },
    {
      "Entreprise": "Armstrong Engineering Limited"
    },
    {
      "Entreprise": "Armstrong World Industries, Inc."
    },
    {
      "Entreprise": "AROC･SANWA Co.,Ltd."
    },
    {
      "Entreprise": "ARROW-M CO., LTD."
    },
    {
      "Entreprise": "Arteche"
    },
    {
      "Entreprise": "Artelia"
    },
    {
      "Entreprise": "Arthur Cox LLP"
    },
    {
      "Entreprise": "Arthur D. Little"
    },
    {
      "Entreprise": "Artistic Fabric Mills (Pvt.) Ltd."
    },
    {
      "Entreprise": "Artistic Garment Industries (AGI Denim)"
    },
    {
      "Entreprise": "Artistic Milliners"
    },
    {
      "Entreprise": "Artwell Holdings Ltd"
    },
    {
      "Entreprise": "Arup Group Ltd."
    },
    {
      "Entreprise": "Arvid Nordquist HAB"
    },
    {
      "Entreprise": "Arvind Limited"
    },
    {
      "Entreprise": "As Çelik Döküm Işleme San. ve Tic. A.S."
    },
    {
      "Entreprise": "AS&K Group Ltd"
    },
    {
      "Entreprise": "Asahi Europe & International"
    },
    {
      "Entreprise": "ASAHI FIBER INDUSTRY CO., LTD."
    },
    {
      "Entreprise": "Asahi Group Company Limited"
    },
    {
      "Entreprise": "Asahi Group Holdings"
    },
    {
      "Entreprise": "Asahi Woodtec Co., Ltd."
    },
    {
      "Entreprise": "AsahiKasei Co.Ltd."
    },
    {
      "Entreprise": "Ascentech K.K."
    },
    {
      "Entreprise": "Ascot Services UK Ltd"
    },
    {
      "Entreprise": "Asda Group Limited"
    },
    {
      "Entreprise": "ASE Technology Holding, Co., Ltd."
    },
    {
      "Entreprise": "ASGN Incorporated"
    },
    {
      "Entreprise": "Ashland LLC"
    },
    {
      "Entreprise": "Asia Air Survey Co.,Ltd."
    },
    {
      "Entreprise": "Asia Cement Corporation"
    },
    {
      "Entreprise": "Asia Pacific Rayon"
    },
    {
      "Entreprise": "Asia Specific Enterprises Ltd."
    },
    {
      "Entreprise": "Asia Vital Components (Shenzhen) Co., Ltd."
    },
    {
      "Entreprise": "Asian Apparels ltd"
    },
    {
      "Entreprise": "Asian Power Devices Inc."
    },
    {
      "Entreprise": "ASICS Corporation"
    },
    {
      "Entreprise": "Asker Healthcare Group AB"
    },
    {
      "Entreprise": "ASKON DEMIR CELIK SANAYI TICARET AS"
    },
    {
      "Entreprise": "ASKUL Corporation"
    },
    {
      "Entreprise": "ASL Global Limited"
    },
    {
      "Entreprise": "ASM International N.V."
    },
    {
      "Entreprise": "ASM Technologies"
    },
    {
      "Entreprise": "ASML Holdings"
    },
    {
      "Entreprise": "ASOS plc"
    },
    {
      "Entreprise": "Asper Investment Management"
    },
    {
      "Entreprise": "ASR Group International Inc."
    },
    {
      "Entreprise": "Assa Abloy AB"
    },
    {
      "Entreprise": "ASSYSTEM"
    },
    {
      "Entreprise": "Astellas Pharma Inc."
    },
    {
      "Entreprise": "ASTM S.p.A."
    },
    {
      "Entreprise": "Aston Martin Lagonda Global Holdings PLC"
    },
    {
      "Entreprise": "Astorg"
    },
    {
      "Entreprise": "AstraZeneca"
    },
    {
      "Entreprise": "Asuene Inc."
    },
    {
      "Entreprise": "ASUSTEK COMPUTER INC."
    },
    {
      "Entreprise": "ASX Limited"
    },
    {
      "Entreprise": "AT & S (Austria Technologie und Systemtechnik AG)"
    },
    {
      "Entreprise": "AT&T Inc."
    },
    {
      "Entreprise": "Atea"
    },
    {
      "Entreprise": "Ateme"
    },
    {
      "Entreprise": "Atlantia S.p.A."
    },
    {
      "Entreprise": "Atlantic Corporation of Wilmington, Inc."
    },
    {
      "Entreprise": "Atlantic Packaging"
    },
    {
      "Entreprise": "Atlantica Sustainable Infrastructure PLC"
    },
    {
      "Entreprise": "Atlas Copco AB"
    },
    {
      "Entreprise": "Atlas Export Enterprises"
    },
    {
      "Entreprise": "Atlas Honda Limited"
    },
    {
      "Entreprise": "Atlassian Corporation Plc"
    },
    {
      "Entreprise": "ATOM LIVIN TECH Co., Ltd."
    },
    {
      "Entreprise": "Atomic Austria GmbH"
    },
    {
      "Entreprise": "Atos SE"
    },
    {
      "Entreprise": "Atresmedia"
    },
    {
      "Entreprise": "Atria plc"
    },
    {
      "Entreprise": "Attacq Limited"
    },
    {
      "Entreprise": "Aubay"
    },
    {
      "Entreprise": "Auchan Retail"
    },
    {
      "Entreprise": "Auckland Airport"
    },
    {
      "Entreprise": "Audley Travel"
    },
    {
      "Entreprise": "AUGA group, AB"
    },
    {
      "Entreprise": "Auger Site Investigations Limited"
    },
    {
      "Entreprise": "AUO Corporation"
    },
    {
      "Entreprise": "Aurisco Pharmaceutical Co., Ltd"
    },
    {
      "Entreprise": "Aurubis AG"
    },
    {
      "Entreprise": "Ausgrid"
    },
    {
      "Entreprise": "Australian Broadcasting Corporation"
    },
    {
      "Entreprise": "Australian Ethical Investment"
    },
    {
      "Entreprise": "Australian Postal Corporation"
    },
    {
      "Entreprise": "Austria Glas Recycling GmbH"
    },
    {
      "Entreprise": "Austrian Post"
    },
    {
      "Entreprise": "Auto Trader Group plc"
    },
    {
      "Entreprise": "Auto Windscreens"
    },
    {
      "Entreprise": "AutoCorp S.A"
    },
    {
      "Entreprise": "Autodesk, Inc."
    },
    {
      "Entreprise": "Autoliv Inc"
    },
    {
      "Entreprise": "Automatismes du Centre Est"
    },
    {
      "Entreprise": "Autoneum Holding Ltd"
    },
    {
      "Entreprise": "AutoScout24 GmbH"
    },
    {
      "Entreprise": "Autostrade per l’Italia"
    },
    {
      "Entreprise": "AvalonBay Communities, Inc."
    },
    {
      "Entreprise": "AVANISTA GROUP"
    },
    {
      "Entreprise": "Avanti West Coast"
    },
    {
      "Entreprise": "Avanza Bank Holding AB"
    },
    {
      "Entreprise": "Avara Foods Ltd"
    },
    {
      "Entreprise": "Avarn Security Group Holding AS"
    },
    {
      "Entreprise": "Avaya"
    },
    {
      "Entreprise": "Avery Dennison Corporation"
    },
    {
      "Entreprise": "AVEVA Group"
    },
    {
      "Entreprise": "Aviatur S.A.S."
    },
    {
      "Entreprise": "Avícola Coliumo"
    },
    {
      "Entreprise": "Avieco"
    },
    {
      "Entreprise": "Avison Young (UK) Limited"
    },
    {
      "Entreprise": "Aviva PLC"
    },
    {
      "Entreprise": "AVRIL SCA"
    },
    {
      "Entreprise": "AXA Group"
    },
    {
      "Entreprise": "Axcel Management"
    },
    {
      "Entreprise": "Axel Springer SE"
    },
    {
      "Entreprise": "Axfood AB"
    },
    {
      "Entreprise": "Axiata Group Berhad"
    },
    {
      "Entreprise": "Axion Biosystems"
    },
    {
      "Entreprise": "Axionable"
    },
    {
      "Entreprise": "Axis Communications AB"
    },
    {
      "Entreprise": "Ayala Land Inc"
    },
    {
      "Entreprise": "AYDEM YENİLENEBİLİR ENERJİ A.Ş."
    },
    {
      "Entreprise": "AYYILDIZ DOKUMA KUMAS PAZ. SAN VE TIC. A.S."
    },
    {
      "Entreprise": "Azbil Corporation"
    },
    {
      "Entreprise": "Azul S.A"
    },
    {
      "Entreprise": "AZURA Group"
    },
    {
      "Entreprise": "Azzurri Central Limited"
    },
    {
      "Entreprise": "B&M European Value Retail S.A"
    },
    {
      "Entreprise": "B&S Group S.A."
    },
    {
      "Entreprise": "B2Holding ASA"
    },
    {
      "Entreprise": "B2R Local No.1 Pty Ltd"
    },
    {
      "Entreprise": "BA GLASS B.V."
    },
    {
      "Entreprise": "Babcock International Group PLC"
    },
    {
      "Entreprise": "Bacardi Limited"
    },
    {
      "Entreprise": "Bachy Soletanche Limited"
    },
    {
      "Entreprise": "Back Market"
    },
    {
      "Entreprise": "BADER GmbH & Co. kG"
    },
    {
      "Entreprise": "BAE Systems PLC"
    },
    {
      "Entreprise": "Bain & Company"
    },
    {
      "Entreprise": "BAIT AL -HIKMA LTD."
    },
    {
      "Entreprise": "Baker McKenzie"
    },
    {
      "Entreprise": "Balfour Beatty Plc"
    },
    {
      "Entreprise": "Ball Corporation"
    },
    {
      "Entreprise": "BALLY SCHUHFABRIKEN AG"
    },
    {
      "Entreprise": "Bally's Corporation"
    },
    {
      "Entreprise": "Balsam laboratory (Shanghai) Co., Ltd"
    },
    {
      "Entreprise": "Baluarte Cultura"
    },
    {
      "Entreprise": "Balwin Properties"
    },
    {
      "Entreprise": "BAMA Foods AB"
    },
    {
      "Entreprise": "Bama Fresh Cuts AB"
    },
    {
      "Entreprise": "BAMA Gruppen AS"
    },
    {
      "Entreprise": "Banco do Brasil S.A."
    },
    {
      "Entreprise": "BanColombia SA"
    },
    {
      "Entreprise": "Bang & Olufsen"
    },
    {
      "Entreprise": "Bangladesh Export Import Company Limited"
    },
    {
      "Entreprise": "Bank Australia"
    },
    {
      "Entreprise": "Bank J. Safra Sarasin AG"
    },
    {
      "Entreprise": "Bank Ochrony Środowiska S.A."
    },
    {
      "Entreprise": "Bank of Ireland Group"
    },
    {
      "Entreprise": "Barco NV"
    },
    {
      "Entreprise": "Bari Textile Mills Pvt. Limited."
    },
    {
      "Entreprise": "Barilla G.R. Fratelli SpA"
    },
    {
      "Entreprise": "Baringa Partners LLP"
    },
    {
      "Entreprise": "BARLOG Plastics GmbH"
    },
    {
      "Entreprise": "BARRATT DEVELOPMENTS PLC"
    },
    {
      "Entreprise": "Barry Callebaut"
    },
    {
      "Entreprise": "Bates IT Ltd"
    },
    {
      "Entreprise": "Bath & Body Works"
    },
    {
      "Entreprise": "BauMont Real Estate Capital"
    },
    {
      "Entreprise": "BayCurrent Consulting, Inc."
    },
    {
      "Entreprise": "Bayer AG"
    },
    {
      "Entreprise": "Bayerische Milchindustrie eG"
    },
    {
      "Entreprise": "BayWa Global Produce GmbH"
    },
    {
      "Entreprise": "Bboxx Ltd."
    },
    {
      "Entreprise": "BBVA"
    },
    {
      "Entreprise": "BCB Group"
    },
    {
      "Entreprise": "BCD Travel USA, LLC"
    },
    {
      "Entreprise": "BCE inc."
    },
    {
      "Entreprise": "BD (Becton, Dickinson & Company)"
    },
    {
      "Entreprise": "BDB Pitmans LLP"
    },
    {
      "Entreprise": "BDO LLP"
    },
    {
      "Entreprise": "BDO USA, LLP"
    },
    {
      "Entreprise": "BDP"
    },
    {
      "Entreprise": "BearingPoint"
    },
    {
      "Entreprise": "Beaulieu International Group"
    },
    {
      "Entreprise": "Beauty Manufacturing Solutions Corp"
    },
    {
      "Entreprise": "Beautycounter"
    },
    {
      "Entreprise": "Beck & Jørgensen A/S"
    },
    {
      "Entreprise": "BEFIMMO SA"
    },
    {
      "Entreprise": "BEHARI LAL ISPAT PVT LTD"
    },
    {
      "Entreprise": "Behn Meyer Holding AG"
    },
    {
      "Entreprise": "Beiersdorf AG"
    },
    {
      "Entreprise": "Beijer Ref AB"
    },
    {
      "Entreprise": "BekaertDeslee"
    },
    {
      "Entreprise": "BEL S.A."
    },
    {
      "Entreprise": "Belcan International Ltd"
    },
    {
      "Entreprise": "Belfius Bank SA"
    },
    {
      "Entreprise": "BELFOR (UK) Limited"
    },
    {
      "Entreprise": "Belgotex Floorcoverings (Pty) Ltd"
    },
    {
      "Entreprise": "BELLSYSTEM24 HOLDINGS, INC."
    },
    {
      "Entreprise": "Bellway Homes Limited"
    },
    {
      "Entreprise": "BelOrta"
    },
    {
      "Entreprise": "Belron®"
    },
    {
      "Entreprise": "Belu Water Ltd"
    },
    {
      "Entreprise": "Ben & Jerry's"
    },
    {
      "Entreprise": "Bendigo and Adelaide Bank Limited"
    },
    {
      "Entreprise": "Benesse Corporation Co., Ltd."
    },
    {
      "Entreprise": "Benetton Group Srl"
    },
    {
      "Entreprise": "Bennetts Associates"
    },
    {
      "Entreprise": "BENTELER Group"
    },
    {
      "Entreprise": "Bergfreunde GmbH"
    },
    {
      "Entreprise": "BergHOFF Belgium"
    },
    {
      "Entreprise": "Berglandmilch eGen"
    },
    {
      "Entreprise": "Bergzeit GmbH"
    },
    {
      "Entreprise": "BERICAP HOLDING GMBH (BERICAP GROUP)"
    },
    {
      "Entreprise": "Berlin Packaging, LLC"
    },
    {
      "Entreprise": "Berner Ltd"
    },
    {
      "Entreprise": "Berry Global Group, Inc."
    },
    {
      "Entreprise": "Bertegruppen AB"
    },
    {
      "Entreprise": "Bertelsmann SE & Co. KGaA"
    },
    {
      "Entreprise": "Beryl"
    },
    {
      "Entreprise": "Berylls Group GmbH"
    },
    {
      "Entreprise": "BES Engineering Corporation"
    },
    {
      "Entreprise": "BES Group (British Engineering Services Ltd)"
    },
    {
      "Entreprise": "Best Buy Co., Inc."
    },
    {
      "Entreprise": "BESTSELLER A/S"
    },
    {
      "Entreprise": "Bestudy (Shanghai) Medical Technology Co., Ltd."
    },
    {
      "Entreprise": "Betsson AB"
    },
    {
      "Entreprise": "Betterect (Pty) Ltd"
    },
    {
      "Entreprise": "Betterfly"
    },
    {
      "Entreprise": "Betz Holding GmbH"
    },
    {
      "Entreprise": "Beurer GmbH"
    },
    {
      "Entreprise": "BGH Edelstahlwerke GmbH"
    },
    {
      "Entreprise": "BGIS"
    },
    {
      "Entreprise": "Bharat Forge"
    },
    {
      "Entreprise": "Bharti Airtel Limited"
    },
    {
      "Entreprise": "BHC Ltd"
    },
    {
      "Entreprise": "BHG Group"
    },
    {
      "Entreprise": "BHJ"
    },
    {
      "Entreprise": "BI NEWVISION"
    },
    {
      "Entreprise": "BIAL"
    },
    {
      "Entreprise": "Bibby Marine Limited"
    },
    {
      "Entreprise": "BIC Services Pty Limited"
    },
    {
      "Entreprise": "Bidfood"
    },
    {
      "Entreprise": "BIF Co.,Ltd."
    },
    {
      "Entreprise": "Biffa Limited"
    },
    {
      "Entreprise": "Big Yellow"
    },
    {
      "Entreprise": "Bilecik Demir Çelik"
    },
    {
      "Entreprise": "Bilfinger SE"
    },
    {
      "Entreprise": "BillerudKorsnäs"
    },
    {
      "Entreprise": "Bio Pappel S.A. de C.V."
    },
    {
      "Entreprise": "bio-familia"
    },
    {
      "Entreprise": "Biofuel Express"
    },
    {
      "Entreprise": "BioGaia AB"
    },
    {
      "Entreprise": "Biogen Inc."
    },
    {
      "Entreprise": "BIOIBERICA SAU"
    },
    {
      "Entreprise": "BioMar Group"
    },
    {
      "Entreprise": "bioMerieux"
    },
    {
      "Entreprise": "BioNTech SE"
    },
    {
      "Entreprise": "Bioregional Development Group"
    },
    {
      "Entreprise": "BIPROGY Inc."
    },
    {
      "Entreprise": "Bird & Bird LLP"
    },
    {
      "Entreprise": "BİRİKİM MÜHENDİSLİK VE ENDÜSTRİYEL YÜKLENİM LTD ŞTİ"
    },
    {
      "Entreprise": "BITĖ Group"
    },
    {
      "Entreprise": "BizLink Holding"
    },
    {
      "Entreprise": "BJSS"
    },
    {
      "Entreprise": "BKI foods a/s"
    },
    {
      "Entreprise": "BKUK Group Ltd"
    },
    {
      "Entreprise": "BLB CORPORATION"
    },
    {
      "Entreprise": "Blentagruppen AB"
    },
    {
      "Entreprise": "BLG LOGISTICS GROUP AG & Co. KG"
    },
    {
      "Entreprise": "Block, Inc."
    },
    {
      "Entreprise": "Bloom & Wild group"
    },
    {
      "Entreprise": "Bloomberg LP"
    },
    {
      "Entreprise": "Bloomsbury Publishing Plc."
    },
    {
      "Entreprise": "Blue Apron LLC"
    },
    {
      "Entreprise": "Blue Sky Botanics"
    },
    {
      "Entreprise": "Bluebird.inc"
    },
    {
      "Entreprise": "BMC Software"
    },
    {
      "Entreprise": "BMT"
    },
    {
      "Entreprise": "BMW Group"
    },
    {
      "Entreprise": "BNG Bank"
    },
    {
      "Entreprise": "BNK Financial Group Inc."
    },
    {
      "Entreprise": "BNP Paribas"
    },
    {
      "Entreprise": "BNSF Railway"
    },
    {
      "Entreprise": "BOBST GROUP SA"
    },
    {
      "Entreprise": "Bocar Group"
    },
    {
      "Entreprise": "BoConcept A/S"
    },
    {
      "Entreprise": "Bodenmann Metzgerei AG"
    },
    {
      "Entreprise": "Bodycote plc"
    },
    {
      "Entreprise": "Boehringer Ingelheim"
    },
    {
      "Entreprise": "Boemos SpA Industria Calzature"
    },
    {
      "Entreprise": "Boliden AB (publ)"
    },
    {
      "Entreprise": "Bollé Brands"
    },
    {
      "Entreprise": "Bolloré Logistics"
    },
    {
      "Entreprise": "Bolsa Mexicana de Valores"
    },
    {
      "Entreprise": "Boma Global"
    },
    {
      "Entreprise": "Bonava AB"
    },
    {
      "Entreprise": "Bonduelle Group"
    },
    {
      "Entreprise": "Bonnier Books"
    },
    {
      "Entreprise": "Bonnier News"
    },
    {
      "Entreprise": "Bontaz Group"
    },
    {
      "Entreprise": "Boohoo Group PLC"
    },
    {
      "Entreprise": "Booking Holdings Inc."
    },
    {
      "Entreprise": "Boom Supersonic"
    },
    {
      "Entreprise": "Boortmalt Group"
    },
    {
      "Entreprise": "Booz Allen Hamilton Holding Corporation"
    },
    {
      "Entreprise": "Boozt"
    },
    {
      "Entreprise": "Boral Limited"
    },
    {
      "Entreprise": "BORALEX Inc."
    },
    {
      "Entreprise": "Borchers Transportlogistik NordWest GmbH"
    },
    {
      "Entreprise": "BorgWarner Inc."
    },
    {
      "Entreprise": "Borregaard AS"
    },
    {
      "Entreprise": "Bose"
    },
    {
      "Entreprise": "Boston Consulting Group"
    },
    {
      "Entreprise": "Boston Properties"
    },
    {
      "Entreprise": "Boston Scientific Corporation"
    },
    {
      "Entreprise": "Boujyokenkyusyo Co.,Ltd."
    },
    {
      "Entreprise": "Bourne Group"
    },
    {
      "Entreprise": "Bourns, Inc."
    },
    {
      "Entreprise": "BOUYGUES CONSTRUCTION"
    },
    {
      "Entreprise": "Bouygues Immobilier"
    },
    {
      "Entreprise": "BOUYGUES TELECOM"
    },
    {
      "Entreprise": "Boyd (Shenzhen) Thermal Systems Ltd"
    },
    {
      "Entreprise": "Boyd Plastic and Metal Parts (Shenzhen) Co. Ltd"
    },
    {
      "Entreprise": "Boyd Vietnam Company Ltd"
    },
    {
      "Entreprise": "bpost SA"
    },
    {
      "Entreprise": "bpostgroup"
    },
    {
      "Entreprise": "BPR Group"
    },
    {
      "Entreprise": "Braathens Regional Airlines (BRA) AB"
    },
    {
      "Entreprise": "Brambles"
    },
    {
      "Entreprise": "Bramming Plast-Industri A/S"
    },
    {
      "Entreprise": "Brandix Lanka Limited"
    },
    {
      "Entreprise": "Branston Ltd"
    },
    {
      "Entreprise": "Bravida Holding AB"
    },
    {
      "Entreprise": "Brd. Hartmann A/S"
    },
    {
      "Entreprise": "BREEDON GROUP plc"
    },
    {
      "Entreprise": "Bregal Investments"
    },
    {
      "Entreprise": "Breitling"
    },
    {
      "Entreprise": "Brenntag SE"
    },
    {
      "Entreprise": "BRF S.A."
    },
    {
      "Entreprise": "Bridge Farm"
    },
    {
      "Entreprise": "Bridgestone Corporation"
    },
    {
      "Entreprise": "Bright Blue Foods (BBF) Ltd"
    },
    {
      "Entreprise": "BrightWolves"
    },
    {
      "Entreprise": "Brillio"
    },
    {
      "Entreprise": "Brisa - Auto-estradas de Portugal,SA"
    },
    {
      "Entreprise": "BRISA BRIDGESTONE SABANCI TYRE MANUFACTURING AND TRADING INC."
    },
    {
      "Entreprise": "Bristlecone Inc"
    },
    {
      "Entreprise": "Bristol Myers Squibb"
    },
    {
      "Entreprise": "British American Tobacco (BAT)"
    },
    {
      "Entreprise": "British Broadcasting Corporation"
    },
    {
      "Entreprise": "British Business Bank plc"
    },
    {
      "Entreprise": "British Steel Limited"
    },
    {
      "Entreprise": "BRITVIC PLC"
    },
    {
      "Entreprise": "Brixmor Property Group"
    },
    {
      "Entreprise": "Broadridge Financial Solutions, Inc."
    },
    {
      "Entreprise": "Brompton Bicycle Limited"
    },
    {
      "Entreprise": "Brookfield India Real Estate Trust"
    },
    {
      "Entreprise": "Brooks Running"
    },
    {
      "Entreprise": "Brother Industries, Ltd."
    },
    {
      "Entreprise": "Brown Knight & Truscott Limited"
    },
    {
      "Entreprise": "Brown Thomas Arnotts"
    },
    {
      "Entreprise": "Browns Food Group"
    },
    {
      "Entreprise": "Brundtland Consulting"
    },
    {
      "Entreprise": "Brunello Cucinelli SpA"
    },
    {
      "Entreprise": "Brunswick Group"
    },
    {
      "Entreprise": "Bruun & Hjejle Advokatpartnerselskab"
    },
    {
      "Entreprise": "Bruynzeel Storage Group BV"
    },
    {
      "Entreprise": "Bryt Energy"
    },
    {
      "Entreprise": "BSL CASTINGS PVT LTD."
    },
    {
      "Entreprise": "BSP Pharmaceuticals spa"
    },
    {
      "Entreprise": "BT plc"
    },
    {
      "Entreprise": "BTS Group AB (publ)"
    },
    {
      "Entreprise": "Buckingham Group Contracting Ltd"
    },
    {
      "Entreprise": "Buckley Gray Yeoman"
    },
    {
      "Entreprise": "Bufab AB"
    },
    {
      "Entreprise": "Bugaboo International"
    },
    {
      "Entreprise": "BuildingLink.com LLC"
    },
    {
      "Entreprise": "Bulten AB"
    },
    {
      "Entreprise": "Bundaberg Sugar LTD"
    },
    {
      "Entreprise": "Bunge Limited"
    },
    {
      "Entreprise": "Bunka Shutter Co., Ltd."
    },
    {
      "Entreprise": "bunq B.V."
    },
    {
      "Entreprise": "Bunzl plc"
    },
    {
      "Entreprise": "Bupa"
    },
    {
      "Entreprise": "Burberry Limited"
    },
    {
      "Entreprise": "BUREAU VERITAS"
    },
    {
      "Entreprise": "Burg Groep B.V."
    },
    {
      "Entreprise": "Burges Salmon LLP"
    },
    {
      "Entreprise": "BURGO GROUP"
    },
    {
      "Entreprise": "Buro Happold"
    },
    {
      "Entreprise": "Bursa Malaysia Berhad"
    },
    {
      "Entreprise": "Business Integration Partners SpA"
    },
    {
      "Entreprise": "Buyer’s Edge Platform"
    },
    {
      "Entreprise": "Buzzi Unicem"
    },
    {
      "Entreprise": "BWI Group"
    },
    {
      "Entreprise": "Byggmax Group AB"
    },
    {
      "Entreprise": "C&A"
    },
    {
      "Entreprise": "C&C Group plc"
    },
    {
      "Entreprise": "C.T. POINT S.P.A."
    },
    {
      "Entreprise": "C.V.O. International"
    },
    {
      "Entreprise": "Cabify"
    },
    {
      "Entreprise": "Cabletica S.A."
    },
    {
      "Entreprise": "Cabonline Group Holding AB (publ)"
    },
    {
      "Entreprise": "Cadence Design Systems, Inc."
    },
    {
      "Entreprise": "Caesars Entertainment"
    },
    {
      "Entreprise": "CAF Group"
    },
    {
      "Entreprise": "Café Bar Sverige AB"
    },
    {
      "Entreprise": "Cafedirect plc"
    },
    {
      "Entreprise": "Cafédirect plc"
    },
    {
      "Entreprise": "CAGLA, Inc."
    },
    {
      "Entreprise": "Cairn Homes Plc"
    },
    {
      "Entreprise": "Caixa Geral de Depósitos"
    },
    {
      "Entreprise": "Califia Farms"
    },
    {
      "Entreprise": "Caljan A/S"
    },
    {
      "Entreprise": "Calyx"
    },
    {
      "Entreprise": "Cambridge Healthcare Research Limited"
    },
    {
      "Entreprise": "Camlin Limited"
    },
    {
      "Entreprise": "Campbell Soup Company"
    },
    {
      "Entreprise": "Camper S.L."
    },
    {
      "Entreprise": "CAMUSAT HOLDING"
    },
    {
      "Entreprise": "Canada Goose"
    },
    {
      "Entreprise": "Canada Post | Postes Canada"
    },
    {
      "Entreprise": "Canadian National Railway Company"
    },
    {
      "Entreprise": "Canadian Pacific Railway Company"
    },
    {
      "Entreprise": "Canary Marketing"
    },
    {
      "Entreprise": "Canary Wharf Group Plc"
    },
    {
      "Entreprise": "Cancer Research Horizons Limited"
    },
    {
      "Entreprise": "Cancer Research UK Trading Limited"
    },
    {
      "Entreprise": "Canfor"
    },
    {
      "Entreprise": "CANGZHOU YONGXING FOUNDRY CO.,LTD"
    },
    {
      "Entreprise": "CANON INC."
    },
    {
      "Entreprise": "CANPACK Group"
    },
    {
      "Entreprise": "Canyon Bicycles GmbH"
    },
    {
      "Entreprise": "CAP HOLDING SpA"
    },
    {
      "Entreprise": "Capella Hotel Group Pte. Ltd."
    },
    {
      "Entreprise": "Capgemini SE"
    },
    {
      "Entreprise": "Capita Plc"
    },
    {
      "Entreprise": "Capital & Counties Properties PLC"
    },
    {
      "Entreprise": "CapitaLand"
    },
    {
      "Entreprise": "Capitas Finance Limited"
    },
    {
      "Entreprise": "CapMan Plc"
    },
    {
      "Entreprise": "Cappelen Damm Holding AS"
    },
    {
      "Entreprise": "Capri Holdings Limited"
    },
    {
      "Entreprise": "Capricórnio Têxtil"
    },
    {
      "Entreprise": "CAPSUM"
    },
    {
      "Entreprise": "Carbon Free Consulting Corporation"
    },
    {
      "Entreprise": "Carbon Free Network, Inc."
    },
    {
      "Entreprise": "Carbon Intelligence"
    },
    {
      "Entreprise": "Carbon+Alt+Delete"
    },
    {
      "Entreprise": "Carbonbit Ltd"
    },
    {
      "Entreprise": "Cardinal Health, Inc."
    },
    {
      "Entreprise": "Cardo Systems Ltd."
    },
    {
      "Entreprise": "Cargill, Inc."
    },
    {
      "Entreprise": "Cargojet Airways Ltd."
    },
    {
      "Entreprise": "Cargotec"
    },
    {
      "Entreprise": "Carib Glassworks Limited"
    },
    {
      "Entreprise": "Carlisle Companies Incorporated"
    },
    {
      "Entreprise": "Carlsberg Group"
    },
    {
      "Entreprise": "CARMILA"
    },
    {
      "Entreprise": "Carmo A/S"
    },
    {
      "Entreprise": "Carnegie Fonder AB"
    },
    {
      "Entreprise": "Carpenters Holdings Limited"
    },
    {
      "Entreprise": "Carrefour"
    },
    {
      "Entreprise": "Carrier Global Corporation"
    },
    {
      "Entreprise": "Cartaseta AG"
    },
    {
      "Entreprise": "Carter Thermal Industries Group Ltd"
    },
    {
      "Entreprise": "Carter's, Inc."
    },
    {
      "Entreprise": "CARTIER"
    },
    {
      "Entreprise": "Cary Group Holding AB"
    },
    {
      "Entreprise": "Casa Rica Mercado Gourmet - ALES S.A"
    },
    {
      "Entreprise": "CASALUKER S.A"
    },
    {
      "Entreprise": "Cascades Inc."
    },
    {
      "Entreprise": "Casday (Thailand) Corporation Limited"
    },
    {
      "Entreprise": "Casino Guichard Perrachon SA"
    },
    {
      "Entreprise": "CASIO COMPUTER CO., LTD."
    },
    {
      "Entreprise": "CASSINA IXC.Ltd."
    },
    {
      "Entreprise": "Cast & Crew"
    },
    {
      "Entreprise": "Castellum AB"
    },
    {
      "Entreprise": "Castlemead Insurance Brokers"
    },
    {
      "Entreprise": "Castrén & Snellman Attorneys Ltd"
    },
    {
      "Entreprise": "Catalent Pharma Solutions"
    },
    {
      "Entreprise": "Catena AB"
    },
    {
      "Entreprise": "Cathay Financial Holding Co., Ltd"
    },
    {
      "Entreprise": "Caverion Corporation"
    },
    {
      "Entreprise": "CBCL Limited"
    },
    {
      "Entreprise": "CBRE"
    },
    {
      "Entreprise": "CCL Industries, Inc."
    },
    {
      "Entreprise": "CECONOMY AG"
    },
    {
      "Entreprise": "Celestica"
    },
    {
      "Entreprise": "CELLNEX TELECOM S.A."
    },
    {
      "Entreprise": "Celonis"
    },
    {
      "Entreprise": "CELSA Group"
    },
    {
      "Entreprise": "Celxpert Energy Corporation"
    },
    {
      "Entreprise": "CEMAsys.com AS"
    },
    {
      "Entreprise": "Cement Australia Pty Ltd"
    },
    {
      "Entreprise": "Cementir Holding N.V."
    },
    {
      "Entreprise": "CEMENTOS ARGOS"
    },
    {
      "Entreprise": "CEMEX, S.A.B de C.V."
    },
    {
      "Entreprise": "Cemminerals"
    },
    {
      "Entreprise": "CERATIZIT S.A."
    },
    {
      "Entreprise": "Cerba Healthcare"
    },
    {
      "Entreprise": "Cermaq Group"
    },
    {
      "Entreprise": "CES Consulting Engineers Salzgitter GmbH"
    },
    {
      "Entreprise": "CEWE Stiftung & Co. KGaA"
    },
    {
      "Entreprise": "CEZ Group"
    },
    {
      "Entreprise": "CGI IT UK LTD"
    },
    {
      "Entreprise": "CH&CO CATERING GROUP LIMITED"
    },
    {
      "Entreprise": "Chaity Composite Ltd"
    },
    {
      "Entreprise": "CHALCO Ruimin Co., Ltd."
    },
    {
      "Entreprise": "Chalhoub Group"
    },
    {
      "Entreprise": "Chambers Federation"
    },
    {
      "Entreprise": "CHANEL"
    },
    {
      "Entreprise": "CHANG HWA COMMERCIAL BANK, LTD."
    },
    {
      "Entreprise": "Changzhou New Wide Knitting & Dyeing Co., Ltd."
    },
    {
      "Entreprise": "Changzhou Wuitu Smart Technology Co.,Ltd."
    },
    {
      "Entreprise": "Channel 4"
    },
    {
      "Entreprise": "Charles Komar & Sons"
    },
    {
      "Entreprise": "Charles River Laboratories, Inc."
    },
    {
      "Entreprise": "Charles Taylor"
    },
    {
      "Entreprise": "Charlie Bigham's"
    },
    {
      "Entreprise": "Charoen Pokphand Foods Public Company Limited"
    },
    {
      "Entreprise": "Charoen Pokphand Group Co., Ltd."
    },
    {
      "Entreprise": "Chemisches Laboratorium Dr. Kurt Richter GmbH"
    },
    {
      "Entreprise": "Chemonics International"
    },
    {
      "Entreprise": "Cheng Uei Precision Industry Co., Ltd (Foxlink)"
    },
    {
      "Entreprise": "Chevron Traffic Management"
    },
    {
      "Entreprise": "Chicony Electronics Co. Ltd."
    },
    {
      "Entreprise": "Chicony Power Technology Co., Ltd."
    },
    {
      "Entreprise": "Chiesi Farmaceutici S.p.A."
    },
    {
      "Entreprise": "Chilexpress S.A."
    },
    {
      "Entreprise": "Chime Communications"
    },
    {
      "Entreprise": "CHIMEI CORPORATION"
    },
    {
      "Entreprise": "China Airlines"
    },
    {
      "Entreprise": "China Development Financial Holding Corporation"
    },
    {
      "Entreprise": "China Shengmu Organic Milk Limited"
    },
    {
      "Entreprise": "Chinachem Group"
    },
    {
      "Entreprise": "CHINALCO-SWA CO.,LTD."
    },
    {
      "Entreprise": "Chindata Group"
    },
    {
      "Entreprise": "Chipotle Mexican Grill, Inc."
    },
    {
      "Entreprise": "Chiquita Brands International Sàrl"
    },
    {
      "Entreprise": "CHIRON Group SE"
    },
    {
      "Entreprise": "Chocoladefabriken Lindt & Sprüngli AG"
    },
    {
      "Entreprise": "Choice Properties REIT"
    },
    {
      "Entreprise": "Chongqing BOE Optoelectronics Technology Co., Ltd"
    },
    {
      "Entreprise": "Chopard Holding SA"
    },
    {
      "Entreprise": "Chorus New Zealand Limited"
    },
    {
      "Entreprise": "Chr. Hansen A/S"
    },
    {
      "Entreprise": "Christie's International plc"
    },
    {
      "Entreprise": "CHS Agency"
    },
    {
      "Entreprise": "CHT Group represented by CHT Germany GmbH as headquarters"
    },
    {
      "Entreprise": "CHUBU TEPRO CO.,LTD"
    },
    {
      "Entreprise": "Chug, Inc"
    },
    {
      "Entreprise": "Chugai Pharmaceutical Co., Ltd."
    },
    {
      "Entreprise": "Chuko Electric Co., Ltd."
    },
    {
      "Entreprise": "Chung Hwa Pulp Corporation"
    },
    {
      "Entreprise": "Chunghwa Telecom Co. Ltd."
    },
    {
      "Entreprise": "Church & Dwight Co. Inc."
    },
    {
      "Entreprise": "Churchill Contract Services Group Holdings Limited"
    },
    {
      "Entreprise": "ChuSanRen (Central Japan Industries Association)"
    },
    {
      "Entreprise": "chutex international CO.,LTD."
    },
    {
      "Entreprise": "CIE Automotive"
    },
    {
      "Entreprise": "CIECH S.A."
    },
    {
      "Entreprise": "Ciena Corporation"
    },
    {
      "Entreprise": "CIeNET"
    },
    {
      "Entreprise": "Cikautxo"
    },
    {
      "Entreprise": "CIMPOR-Indústria de Cimentos, SA"
    },
    {
      "Entreprise": "Çimsa Çimento Sanayi ve Ticaret A.S."
    },
    {
      "Entreprise": "Cisco Systems, Inc."
    },
    {
      "Entreprise": "Citation Group"
    },
    {
      "Entreprise": "CITIZEN WATCH CO., LTD."
    },
    {
      "Entreprise": "Citrix Systems, Inc."
    },
    {
      "Entreprise": "Citrosuco Agroindustria S.A."
    },
    {
      "Entreprise": "City Developments Limited"
    },
    {
      "Entreprise": "City Facilities Management Holdings Ltd (UK)"
    },
    {
      "Entreprise": "Citycon Oyj"
    },
    {
      "Entreprise": "CityFibre Limited"
    },
    {
      "Entreprise": "CJCHT Groups"
    },
    {
      "Entreprise": "CK Hutchison Group Telecom Holdings Limited"
    },
    {
      "Entreprise": "Clariant AG"
    },
    {
      "Entreprise": "Clario"
    },
    {
      "Entreprise": "Clarivate, PLC"
    },
    {
      "Entreprise": "Clarke Telecom"
    },
    {
      "Entreprise": "Clarke Willmott"
    },
    {
      "Entreprise": "Clas Ohlson AB (publ)"
    },
    {
      "Entreprise": "Classic Fashion Apparel Industry Ltd. Co."
    },
    {
      "Entreprise": "Clayco"
    },
    {
      "Entreprise": "CLAYENS NP"
    },
    {
      "Entreprise": "Clays Ltd."
    },
    {
      "Entreprise": "Clear Channel International Holdings BV"
    },
    {
      "Entreprise": "Clear Insurance Management Ltd."
    },
    {
      "Entreprise": "Clearvision (CM) 2005 Limited"
    },
    {
      "Entreprise": "Cleary Gottlieb Steen & Hamilton LLP"
    },
    {
      "Entreprise": "Clever"
    },
    {
      "Entreprise": "Clif Bar & Company"
    },
    {
      "Entreprise": "Clifford Chance LLP"
    },
    {
      "Entreprise": "CLIMACT"
    },
    {
      "Entreprise": "ClimatePartner GmbH"
    },
    {
      "Entreprise": "Clipper Logistics Plc"
    },
    {
      "Entreprise": "Cloetta AB"
    },
    {
      "Entreprise": "CloudBuy Limited"
    },
    {
      "Entreprise": "Cloudfm Group Limited"
    },
    {
      "Entreprise": "CLP Holdings Limited"
    },
    {
      "Entreprise": "CLS Holdings PLC"
    },
    {
      "Entreprise": "Clyde & Co LLP"
    },
    {
      "Entreprise": "CMA CGM S.A."
    },
    {
      "Entreprise": "CMPC"
    },
    {
      "Entreprise": "CMS Cameron McKenna Nabarro Olswang LLP"
    },
    {
      "Entreprise": "CNH Industrial N.V."
    },
    {
      "Entreprise": "CNP Assurances"
    },
    {
      "Entreprise": "CNS Co.,Ltd."
    },
    {
      "Entreprise": "CO2nnsulting Limited"
    },
    {
      "Entreprise": "Coats Group plc"
    },
    {
      "Entreprise": "Cobalt Fashion Holding Limited"
    },
    {
      "Entreprise": "COBANA GmbH & Co. KG"
    },
    {
      "Entreprise": "Coca Cola European Partners"
    },
    {
      "Entreprise": "Coca-Cola FEMSA"
    },
    {
      "Entreprise": "Coca-Cola HBC AG"
    },
    {
      "Entreprise": "Cofinimmo"
    },
    {
      "Entreprise": "COFRA Holding AG"
    },
    {
      "Entreprise": "Cogeco Inc."
    },
    {
      "Entreprise": "Cognizant Technology Solutions Corporation"
    },
    {
      "Entreprise": "Coillte CGA"
    },
    {
      "Entreprise": "COLAS Ltd"
    },
    {
      "Entreprise": "COLAS SA"
    },
    {
      "Entreprise": "Colgate Palmolive Company"
    },
    {
      "Entreprise": "Colisée Group"
    },
    {
      "Entreprise": "ColliCare Logistics AS"
    },
    {
      "Entreprise": "Colliers International"
    },
    {
      "Entreprise": "Coloplast A/S"
    },
    {
      "Entreprise": "Colruyt Group"
    },
    {
      "Entreprise": "Colt Group Holdings Limited"
    },
    {
      "Entreprise": "Columbia Garments Ltd."
    },
    {
      "Entreprise": "Comany Inc."
    },
    {
      "Entreprise": "ComBio Energia S.A."
    },
    {
      "Entreprise": "Comcast"
    },
    {
      "Entreprise": "ComfortDelGro Corporation Limited"
    },
    {
      "Entreprise": "Commercial Corporate Services Limited"
    },
    {
      "Entreprise": "Commercial International Bank Egypt (SAE) CIB"
    },
    {
      "Entreprise": "Commerzbank AG"
    },
    {
      "Entreprise": "Common keiso Ltd."
    },
    {
      "Entreprise": "CommonWealth Partners"
    },
    {
      "Entreprise": "Communisis Limited"
    },
    {
      "Entreprise": "Community Services.net Pty Ltd (CSnet)"
    },
    {
      "Entreprise": "Compagnie Financière Richemont SA"
    },
    {
      "Entreprise": "Compagnie Fruitière"
    },
    {
      "Entreprise": "COMPAL ELECTRONICS, INC."
    },
    {
      "Entreprise": "Companhia Brasileira de Aluminio"
    },
    {
      "Entreprise": "Companhia Energética de Minas Gerais - Cemig"
    },
    {
      "Entreprise": "Companhia Paranaense de Energia - COPEL"
    },
    {
      "Entreprise": "COMPAÑÍA HULERA TORNEL SA DE CV., MEXICO"
    },
    {
      "Entreprise": "Compass Group Nederland Holding B.V"
    },
    {
      "Entreprise": "Compass Group PLC"
    },
    {
      "Entreprise": "Compass Group UK&I"
    },
    {
      "Entreprise": "Computacenter PLC"
    },
    {
      "Entreprise": "COMSYS Holdings Corporation"
    },
    {
      "Entreprise": "Comvita Limited"
    },
    {
      "Entreprise": "Conagra Brands, Inc."
    },
    {
      "Entreprise": "Concentrix Corporation"
    },
    {
      "Entreprise": "Condé Nast"
    },
    {
      "Entreprise": "Connectria, Inc."
    },
    {
      "Entreprise": "Consid AB"
    },
    {
      "Entreprise": "Consilient Health"
    },
    {
      "Entreprise": "Consolidated Property Services (Australia) Pty Ltd"
    },
    {
      "Entreprise": "CONSOLIS GROUP SAS"
    },
    {
      "Entreprise": "Constantia Flexibles International GmbH"
    },
    {
      "Entreprise": "Construction Marine Ltd"
    },
    {
      "Entreprise": "Consum S. Coop. V."
    },
    {
      "Entreprise": "Contact Energy"
    },
    {
      "Entreprise": "Content Chemistry Ltd"
    },
    {
      "Entreprise": "Continental"
    },
    {
      "Entreprise": "Contour Design Nordic A/S"
    },
    {
      "Entreprise": "Contraf-Nicotex-Tobacco GmbH (CNT)"
    },
    {
      "Entreprise": "ConvaTec"
    },
    {
      "Entreprise": "Conversio"
    },
    {
      "Entreprise": "Convoy"
    },
    {
      "Entreprise": "Coolfinity International B.V."
    },
    {
      "Entreprise": "Coop amba"
    },
    {
      "Entreprise": "Coop Sverige AB"
    },
    {
      "Entreprise": "Coop-Gruppe Genossenschaft"
    },
    {
      "Entreprise": "Coor Service Management"
    },
    {
      "Entreprise": "Copart UK Ltd"
    },
    {
      "Entreprise": "Copps Industries, Inc."
    },
    {
      "Entreprise": "Corbion"
    },
    {
      "Entreprise": "Corden Pharma"
    },
    {
      "Entreprise": "Cordenka GmbH & Co. KG"
    },
    {
      "Entreprise": "CORDM"
    },
    {
      "Entreprise": "Coretronic Corporation"
    },
    {
      "Entreprise": "Corialis"
    },
    {
      "Entreprise": "Corning Incorporated"
    },
    {
      "Entreprise": "Corporacion Favorita C.A."
    },
    {
      "Entreprise": "Corteva Agriscience"
    },
    {
      "Entreprise": "Corvaglia Closures Eschlikon AG"
    },
    {
      "Entreprise": "COSCO SHIPPING LOGISTICS(CHONGQING) CO.,LTD"
    },
    {
      "Entreprise": "Cosmosol S.r.l."
    },
    {
      "Entreprise": "cosnova beauty GmbH"
    },
    {
      "Entreprise": "Costa Coffee"
    },
    {
      "Entreprise": "Costain Group Plc"
    },
    {
      "Entreprise": "COSTER TECNOLOGIE SPECIALE, SPA"
    },
    {
      "Entreprise": "Cosun Beet Company"
    },
    {
      "Entreprise": "Coty Inc."
    },
    {
      "Entreprise": "Country Style Foods Ltd"
    },
    {
      "Entreprise": "Countryside Properties"
    },
    {
      "Entreprise": "Coupa Software"
    },
    {
      "Entreprise": "Coveris S.A"
    },
    {
      "Entreprise": "Covivio"
    },
    {
      "Entreprise": "COWI Holding A/S"
    },
    {
      "Entreprise": "CP ALL Public Company Limited"
    },
    {
      "Entreprise": "CPC Project Services LLP"
    },
    {
      "Entreprise": "CPI Property Group S.A."
    },
    {
      "Entreprise": "CR3-Kaffeeveredelung M. Hermsen GmbH"
    },
    {
      "Entreprise": "Cranial Technologies, Inc."
    },
    {
      "Entreprise": "Cranswick plc"
    },
    {
      "Entreprise": "Crayon Group Holding ASA"
    },
    {
      "Entreprise": "Craze"
    },
    {
      "Entreprise": "Creative Design Ltd."
    },
    {
      "Entreprise": "Credit Agricole"
    },
    {
      "Entreprise": "Credit Suisse Group"
    },
    {
      "Entreprise": "Crescent Bahuman Limited (CBL)"
    },
    {
      "Entreprise": "Crest Lifts Ltd"
    },
    {
      "Entreprise": "Crest Nicholson plc"
    },
    {
      "Entreprise": "CRH plc"
    },
    {
      "Entreprise": "Criotec, S.A. de C.V."
    },
    {
      "Entreprise": "Cristal Union"
    },
    {
      "Entreprise": "Critical Start, Inc."
    },
    {
      "Entreprise": "Croda International Plc"
    },
    {
      "Entreprise": "CRONIMET Holding GmbH"
    },
    {
      "Entreprise": "Crowe U.K. LLP"
    },
    {
      "Entreprise": "Crowley Maritime Corporation"
    },
    {
      "Entreprise": "Crown Holdings, Inc"
    },
    {
      "Entreprise": "Crystal Claire Cosmetics Inc."
    },
    {
      "Entreprise": "Crystal International Group Limited"
    },
    {
      "Entreprise": "CSX Corporation"
    },
    {
      "Entreprise": "CT Engineering Group"
    },
    {
      "Entreprise": "CTBC Financial Holding Co., Ltd."
    },
    {
      "Entreprise": "CTCI Corporation"
    },
    {
      "Entreprise": "CTEK AB"
    },
    {
      "Entreprise": "CTT - Correios de Portugal SA"
    },
    {
      "Entreprise": "Cultivo Land PBC"
    },
    {
      "Entreprise": "Cummins"
    },
    {
      "Entreprise": "Cundall Johnston and Partners LLP"
    },
    {
      "Entreprise": "Currys plc"
    },
    {
      "Entreprise": "Cushman & Wakefield"
    },
    {
      "Entreprise": "CV De Bandt Advocaten – Avocats Attorneys Rechtsanwalte"
    },
    {
      "Entreprise": "CVC"
    },
    {
      "Entreprise": "CVENT Inc."
    },
    {
      "Entreprise": "CVS Health"
    },
    {
      "Entreprise": "CWT"
    },
    {
      "Entreprise": "Cybercom Group AB"
    },
    {
      "Entreprise": "Cymmetrik (Shenzhen) Printing Co., Ltd."
    },
    {
      "Entreprise": "CyrusOne Inc."
    },
    {
      "Entreprise": "Cytel Inc."
    },
    {
      "Entreprise": "D'decor Home Fabrics Pvt Ltd"
    },
    {
      "Entreprise": "D'Ieteren Automotive"
    },
    {
      "Entreprise": "D'Ieteren Group"
    },
    {
      "Entreprise": "d-fine"
    },
    {
      "Entreprise": "Dai Global LLC"
    },
    {
      "Entreprise": "Dai Nippon Printing Co., Ltd."
    },
    {
      "Entreprise": "DAIDO TRADING CO.,LTD"
    },
    {
      "Entreprise": "Daiichi Sankyo Co., Ltd."
    },
    {
      "Entreprise": "DaikoSeisakusyo Inc."
    },
    {
      "Entreprise": "Dairy Farmers of America, Inc."
    },
    {
      "Entreprise": "Dairygold Food Ingredients UK Ltd."
    },
    {
      "Entreprise": "Daiseki Co., Ltd."
    },
    {
      "Entreprise": "Daito Trust Construction Co., Ltd."
    },
    {
      "Entreprise": "Daitomiunyu Co.Ltd."
    },
    {
      "Entreprise": "Daiwa House Industry Co., Ltd."
    },
    {
      "Entreprise": "Daiwa House REIT Investment Corporation"
    },
    {
      "Entreprise": "Daiwatech Co., Ltd."
    },
    {
      "Entreprise": "Dalberg"
    },
    {
      "Entreprise": "Daled BidCo SAS"
    },
    {
      "Entreprise": "Dalmia Bharat Limited"
    },
    {
      "Entreprise": "Daming Heavy Industry Co., Ltd"
    },
    {
      "Entreprise": "Dana Incorporated"
    },
    {
      "Entreprise": "Dana Lim A/S"
    },
    {
      "Entreprise": "Danfoss"
    },
    {
      "Entreprise": "Danieli Group"
    },
    {
      "Entreprise": "Danish Crown A/S"
    },
    {
      "Entreprise": "Danish Technological Institute"
    },
    {
      "Entreprise": "Danoffice IT"
    },
    {
      "Entreprise": "Danone"
    },
    {
      "Entreprise": "Danske Bank"
    },
    {
      "Entreprise": "Danæg Holding A/S"
    },
    {
      "Entreprise": "DARFON Electronics Corp."
    },
    {
      "Entreprise": "Darktrace plc"
    },
    {
      "Entreprise": "Darling Ingredients Inc."
    },
    {
      "Entreprise": "Dassault Systemes"
    },
    {
      "Entreprise": "Data Communications Management Corp."
    },
    {
      "Entreprise": "Data4 services"
    },
    {
      "Entreprise": "Datagraphic"
    },
    {
      "Entreprise": "Datatec Limited"
    },
    {
      "Entreprise": "David Brown Santasalo"
    },
    {
      "Entreprise": "Davidson Consulting"
    },
    {
      "Entreprise": "Davies Group Limited"
    },
    {
      "Entreprise": "Davines S.p.A."
    },
    {
      "Entreprise": "DaVita"
    },
    {
      "Entreprise": "Dawn Farm Foods Ltd."
    },
    {
      "Entreprise": "Dawn Meats Group UC"
    },
    {
      "Entreprise": "Daxner & Merl GmbH"
    },
    {
      "Entreprise": "DAYDO CO., LTD."
    },
    {
      "Entreprise": "DB Cargo (UK) Limited"
    },
    {
      "Entreprise": "dbramante1928"
    },
    {
      "Entreprise": "De Beers plc"
    },
    {
      "Entreprise": "De La Rue plc"
    },
    {
      "Entreprise": "De-Metal a.s."
    },
    {
      "Entreprise": "Decathlon"
    },
    {
      "Entreprise": "Deceuninck"
    },
    {
      "Entreprise": "Dechra Pharmaceuticals PLC"
    },
    {
      "Entreprise": "Deckers Brands"
    },
    {
      "Entreprise": "Decor (Suzhou) Co.,Ltd"
    },
    {
      "Entreprise": "Deere & Company"
    },
    {
      "Entreprise": "Definity Financial Corporation"
    },
    {
      "Entreprise": "Dekkers International"
    },
    {
      "Entreprise": "DEKRA SE"
    },
    {
      "Entreprise": "Del Monte Foods, Inc."
    },
    {
      "Entreprise": "Delete Group Oyj"
    },
    {
      "Entreprise": "DELFINGEN"
    },
    {
      "Entreprise": "delfortgroup AG"
    },
    {
      "Entreprise": "Delivery Hero SE"
    },
    {
      "Entreprise": "Dell Technologies"
    },
    {
      "Entreprise": "Della Toffola Group"
    },
    {
      "Entreprise": "Dellner Couplers AB"
    },
    {
      "Entreprise": "Delmar International Inc"
    },
    {
      "Entreprise": "Deloitte (Deloitte Global and Deloitte member firms)"
    },
    {
      "Entreprise": "Delphi Technologies"
    },
    {
      "Entreprise": "Delta Air Lines"
    },
    {
      "Entreprise": "Delta Capita Group"
    },
    {
      "Entreprise": "Delta Carbon"
    },
    {
      "Entreprise": "Delta Display Limited"
    },
    {
      "Entreprise": "Delta Electronics"
    },
    {
      "Entreprise": "Delta-Simons Environmental Consultants Limited"
    },
    {
      "Entreprise": "Demant A/S"
    },
    {
      "Entreprise": "Demcointer"
    },
    {
      "Entreprise": "Denim-E (Pvt.) Limited."
    },
    {
      "Entreprise": "denkstatt GmbH"
    },
    {
      "Entreprise": "Denner AG"
    },
    {
      "Entreprise": "DentalXChange"
    },
    {
      "Entreprise": "Dentons"
    },
    {
      "Entreprise": "Dentsu Inc."
    },
    {
      "Entreprise": "Dentsu International"
    },
    {
      "Entreprise": "Derwent London Plc"
    },
    {
      "Entreprise": "Desigual"
    },
    {
      "Entreprise": "Desjardins Group"
    },
    {
      "Entreprise": "deSter"
    },
    {
      "Entreprise": "Destia Oy"
    },
    {
      "Entreprise": "Deuman"
    },
    {
      "Entreprise": "Deutsche Bahn"
    },
    {
      "Entreprise": "Deutsche Börse Group"
    },
    {
      "Entreprise": "Deutsche Gesellschaft fur Internationale Zusammenarbeit\r\nGmbH (GIZ)"
    },
    {
      "Entreprise": "Deutsche Glasfaser Group GmbH"
    },
    {
      "Entreprise": "Deutsche Post DHL Group"
    },
    {
      "Entreprise": "Deutsche Telekom AG"
    },
    {
      "Entreprise": "Develey Polska Sp. z o.o."
    },
    {
      "Entreprise": "Devgiri Group"
    },
    {
      "Entreprise": "Devo, Inc"
    },
    {
      "Entreprise": "DeVolksbank N.V."
    },
    {
      "Entreprise": "Devoteam"
    },
    {
      "Entreprise": "Devro Plc"
    },
    {
      "Entreprise": "Dexus"
    },
    {
      "Entreprise": "DFI Retail Group Holdings Limited"
    },
    {
      "Entreprise": "DFS Furniture PLC"
    },
    {
      "Entreprise": "DGB FINANCIAL GROUP"
    },
    {
      "Entreprise": "Di Luca & Di Luca AB"
    },
    {
      "Entreprise": "Diab International AB"
    },
    {
      "Entreprise": "Diageo Plc"
    },
    {
      "Entreprise": "Dialight Plc"
    },
    {
      "Entreprise": "Diam"
    },
    {
      "Entreprise": "Diamond Energy Pty Ltd."
    },
    {
      "Entreprise": "DIC Corporation"
    },
    {
      "Entreprise": "diemietwaesche.de GmbH & Co. KG"
    },
    {
      "Entreprise": "Digital Edge (Singapore) Holdings Pte. Ltd."
    },
    {
      "Entreprise": "DIGITAL GRID Corporation"
    },
    {
      "Entreprise": "Digital Realty"
    },
    {
      "Entreprise": "Digital Space Group Limited"
    },
    {
      "Entreprise": "DigitalBridge"
    },
    {
      "Entreprise": "Dilmah Ceylon Tea Company PLC"
    },
    {
      "Entreprise": "DIN HAN ENTERPRISE CO., LTD"
    },
    {
      "Entreprise": "DIN LING GARMENT CO., LTD"
    },
    {
      "Entreprise": "Din Sen Viet Nam Enterprise Co., LTD"
    },
    {
      "Entreprise": "Diös Fastigheter"
    },
    {
      "Entreprise": "Diploma PLC"
    },
    {
      "Entreprise": "Direct Line Insurance Group plc"
    },
    {
      "Entreprise": "Direct Wines"
    },
    {
      "Entreprise": "discoverIE Group plc"
    },
    {
      "Entreprise": "Ditrolic Energy Holdings Sdn. Bhd"
    },
    {
      "Entreprise": "Diversey"
    },
    {
      "Entreprise": "DK Company A/S"
    },
    {
      "Entreprise": "DKV SEGUROS Y REASEGUROS S.A.E."
    },
    {
      "Entreprise": "DLA Piper International"
    },
    {
      "Entreprise": "DLG Group"
    },
    {
      "Entreprise": "DMG MORI AKTIENGESELLSCHAFT"
    },
    {
      "Entreprise": "DMG Mori Co., Ltd."
    },
    {
      "Entreprise": "DMK Deutsches Milchkontor GmbH"
    },
    {
      "Entreprise": "DNV AS"
    },
    {
      "Entreprise": "DO & CO AG"
    },
    {
      "Entreprise": "DocuSign"
    },
    {
      "Entreprise": "Dôen"
    },
    {
      "Entreprise": "Döhler Group SE"
    },
    {
      "Entreprise": "Dolby Laboratories, Inc."
    },
    {
      "Entreprise": "Domino's Pizza Enterprises Ltd"
    },
    {
      "Entreprise": "Domino's Pizza Group plc"
    },
    {
      "Entreprise": "Domino's Pizza, LLC"
    },
    {
      "Entreprise": "Don't Cry Wolf Limited"
    },
    {
      "Entreprise": "Dongguan city O.T. Composite"
    },
    {
      "Entreprise": "Dongguan Fast Grow Industrial Company Limited"
    },
    {
      "Entreprise": "DONGGUAN KENNEX CERAMIC LTD."
    },
    {
      "Entreprise": "Dongguan NVT Technology Co.,Ltd."
    },
    {
      "Entreprise": "Dongguan Well Shin Electronic Products Co., Ltd"
    },
    {
      "Entreprise": "Dorada Foods"
    },
    {
      "Entreprise": "dormakaba"
    },
    {
      "Entreprise": "Dott"
    },
    {
      "Entreprise": "Dover Corporation"
    },
    {
      "Entreprise": "DOVISTA A/S"
    },
    {
      "Entreprise": "Downer EDI Limited"
    },
    {
      "Entreprise": "DP World"
    },
    {
      "Entreprise": "Dr. BABOR GmbH & Co. KG"
    },
    {
      "Entreprise": "Dr. Ing. h.c. F. Porsche AG"
    },
    {
      "Entreprise": "Dr. Otto Suwelack Nachf. GmbH&Co.KG"
    },
    {
      "Entreprise": "Dr. Reddy’s Laboratories Ltd."
    },
    {
      "Entreprise": "Dr.Martens plc"
    },
    {
      "Entreprise": "Drax Group plc"
    },
    {
      "Entreprise": "Drees & Sommer SE"
    },
    {
      "Entreprise": "Drop Inc."
    },
    {
      "Entreprise": "DRT (A Company of the Firmenich Group)"
    },
    {
      "Entreprise": "Drylock Technologies NV"
    },
    {
      "Entreprise": "DS Smith"
    },
    {
      "Entreprise": "DSB"
    },
    {
      "Entreprise": "DSV A / S"
    },
    {
      "Entreprise": "DT Global"
    },
    {
      "Entreprise": "DTS CORPORATION"
    },
    {
      "Entreprise": "Dufry International AG"
    },
    {
      "Entreprise": "Duke Realty"
    },
    {
      "Entreprise": "Dunelm Group PLC"
    },
    {
      "Entreprise": "Duni Group"
    },
    {
      "Entreprise": "Dunlop Protective Footwear B.V."
    },
    {
      "Entreprise": "DuPont"
    },
    {
      "Entreprise": "Dura Vermeer Groep N.V."
    },
    {
      "Entreprise": "Dürr AG"
    },
    {
      "Entreprise": "Dutch Flower Group"
    },
    {
      "Entreprise": "Dutch-Bangla Pack Ltd."
    },
    {
      "Entreprise": "DWF Group PLC"
    },
    {
      "Entreprise": "DWS Group GmbH & Co. KGaA"
    },
    {
      "Entreprise": "DXC Technology"
    },
    {
      "Entreprise": "Dycem"
    },
    {
      "Entreprise": "Dyer & Butler"
    },
    {
      "Entreprise": "Dynapack Asia"
    },
    {
      "Entreprise": "Dynapack Electronic Technology (Suzhou) Co., Ltd."
    },
    {
      "Entreprise": "E Ink Holdings Inc."
    },
    {
      "Entreprise": "e-hoch-3 eco impact experts GmbH & Co. KG"
    },
    {
      "Entreprise": "E-Konzal Co., Ltd"
    },
    {
      "Entreprise": "e.l.f. Beauty"
    },
    {
      "Entreprise": "E.ON SE"
    },
    {
      "Entreprise": "E.SUN Financial Holding Co., Ltd."
    },
    {
      "Entreprise": "EAE AYDINLATMA A.Ş."
    },
    {
      "Entreprise": "Earls Court Development Company"
    },
    {
      "Entreprise": "EARP Distribution"
    },
    {
      "Entreprise": "Earth Matters APS / Living Flowers"
    },
    {
      "Entreprise": "Earth Support Corporation Co., LTD"
    },
    {
      "Entreprise": "EASTMAN EXPORTS GLOBAL CLOTHING PVT LTD"
    },
    {
      "Entreprise": "easyJet plc"
    },
    {
      "Entreprise": "Eaton"
    },
    {
      "Entreprise": "eBay Inc."
    },
    {
      "Entreprise": "EBP Schweiz AG"
    },
    {
      "Entreprise": "Echosens SA"
    },
    {
      "Entreprise": "Eckes-Granini Group GmbH"
    },
    {
      "Entreprise": "Eco Plan Co., Ltd."
    },
    {
      "Entreprise": "Eco Style Co., Ltd."
    },
    {
      "Entreprise": "ECO WORKS co.,ltd."
    },
    {
      "Entreprise": "ECOALF RECYCLED FABRICS S.L."
    },
    {
      "Entreprise": "Ecolab"
    },
    {
      "Entreprise": "Ecolean"
    },
    {
      "Entreprise": "ECOM Agroindustrial Corp Ltd"
    },
    {
      "Entreprise": "ecominami co., ltd."
    },
    {
      "Entreprise": "ECONOMIC-LEGAL RESEARCH INSTITUTE（KEIZAI-HOUREI　KENKYUKAI）"
    },
    {
      "Entreprise": "Ecora Resources PLC"
    },
    {
      "Entreprise": "ECOS"
    },
    {
      "Entreprise": "Ecovadis"
    },
    {
      "Entreprise": "ECS Corporate NV"
    },
    {
      "Entreprise": "Eddie Stobart"
    },
    {
      "Entreprise": "EDEKA Zentrale Stiftung &Co.KG  (Netto Marken-Discount Stiftung & Co. KG, BUDNI Handels & Service GmbH)"
    },
    {
      "Entreprise": "Edelman"
    },
    {
      "Entreprise": "Edelmann Group"
    },
    {
      "Entreprise": "Eden McCallum LLP"
    },
    {
      "Entreprise": "Edenred SE"
    },
    {
      "Entreprise": "EDF Group"
    },
    {
      "Entreprise": "Edgard & Cooper"
    },
    {
      "Entreprise": "EDGE"
    },
    {
      "Entreprise": "Edge Chile"
    },
    {
      "Entreprise": "Edge Environment Pty Ltd"
    },
    {
      "Entreprise": "EDOA Corp"
    },
    {
      "Entreprise": "EDP - Energias de Portugal S.A."
    },
    {
      "Entreprise": "EDP Energias do Brasil S.A."
    },
    {
      "Entreprise": "Edwards Lifesciences"
    },
    {
      "Entreprise": "Efacec Power Solutions, SGPS, S.A."
    },
    {
      "Entreprise": "Efficold, S.A."
    },
    {
      "Entreprise": "EFG EUROPEAN FURNITURE GROUP LTD"
    },
    {
      "Entreprise": "EFL"
    },
    {
      "Entreprise": "Ege Carpets A/S"
    },
    {
      "Entreprise": "EGISS"
    },
    {
      "Entreprise": "eGroup Holding GmbH"
    },
    {
      "Entreprise": "Eiffage"
    },
    {
      "Entreprise": "EILEEN FISHER"
    },
    {
      "Entreprise": "Einar Mattsson AB"
    },
    {
      "Entreprise": "EirGrid Group"
    },
    {
      "Entreprise": "Eisai Co., Ltd."
    },
    {
      "Entreprise": "Eisai Europe Limited"
    },
    {
      "Entreprise": "EISHIRO KAWARA CO., LTD."
    },
    {
      "Entreprise": "EIZO Corporation"
    },
    {
      "Entreprise": "ekaterra BV"
    },
    {
      "Entreprise": "Ekoten Tekstil Sanayi ve Ticaret A.S."
    },
    {
      "Entreprise": "Eland Cables Limited"
    },
    {
      "Entreprise": "Elecon Engineering Co. Ltd"
    },
    {
      "Entreprise": "Electricity North West Ltd"
    },
    {
      "Entreprise": "Electricity Supply Board (ESB)"
    },
    {
      "Entreprise": "ELECTRO AÇO ALTONA S A"
    },
    {
      "Entreprise": "ELECTRO DEPOT"
    },
    {
      "Entreprise": "Electrocomponents"
    },
    {
      "Entreprise": "Electrolux"
    },
    {
      "Entreprise": "Elekta AB"
    },
    {
      "Entreprise": "Elektro-Isola A/S"
    },
    {
      "Entreprise": "Element Materials Technology"
    },
    {
      "Entreprise": "Elementis"
    },
    {
      "Entreprise": "Elements"
    },
    {
      "Entreprise": "Elenia Oy and Elenia Verkko Oyj"
    },
    {
      "Entreprise": "Elevate Textiles, Inc."
    },
    {
      "Entreprise": "Elia Group"
    },
    {
      "Entreprise": "ELIS"
    },
    {
      "Entreprise": "Elisa Corporation"
    },
    {
      "Entreprise": "Ella's Kitchen (Brands) Limited"
    },
    {
      "Entreprise": "Ellab A/S"
    },
    {
      "Entreprise": "Ellerhold Oldenburg GmbH"
    },
    {
      "Entreprise": "EllisDon Corporation"
    },
    {
      "Entreprise": "Elma Electronic"
    },
    {
      "Entreprise": "Elopak AS"
    },
    {
      "Entreprise": "ELSEWEDY ELECTRIC"
    },
    {
      "Entreprise": "Eltel AB"
    },
    {
      "Entreprise": "emagine"
    },
    {
      "Entreprise": "Emblem Solutions LLC"
    },
    {
      "Entreprise": "Embotelladoras Bolivianas Unidas S.A."
    },
    {
      "Entreprise": "Embracer Group"
    },
    {
      "Entreprise": "EMCOR Group, Inc."
    },
    {
      "Entreprise": "Emerson Electric Co."
    },
    {
      "Entreprise": "EMINLAGA S.R.L. - Mamut"
    },
    {
      "Entreprise": "Emira Property Fund Ltd"
    },
    {
      "Entreprise": "EMIRATES TELECOMMUNICATIONS GROUP COMPANY PJSC (ETISALAT GROUP, e&)"
    },
    {
      "Entreprise": "Emmi Group"
    },
    {
      "Entreprise": "Emperor Design Consultants Limited"
    },
    {
      "Entreprise": "Empire Company Limited and Sobeys Inc."
    },
    {
      "Entreprise": "Empire State Realty Trust, Inc."
    },
    {
      "Entreprise": "Emtec Group"
    },
    {
      "Entreprise": "En+ Group"
    },
    {
      "Entreprise": "ENAV Group"
    },
    {
      "Entreprise": "EnBW Energie Baden-Württemberg AG"
    },
    {
      "Entreprise": "Encon NV"
    },
    {
      "Entreprise": "Endava plc"
    },
    {
      "Entreprise": "Endress+Hauser AG"
    },
    {
      "Entreprise": "ENECLOUD, Inc."
    },
    {
      "Entreprise": "ENEIDA.IO"
    },
    {
      "Entreprise": "Enel SpA"
    },
    {
      "Entreprise": "Energetics Pty Ltd"
    },
    {
      "Entreprise": "Energia Group"
    },
    {
      "Entreprise": "Energise Ltd"
    },
    {
      "Entreprise": "Energy Solution Japan Co., Ltd."
    },
    {
      "Entreprise": "EnerKey Oy"
    },
    {
      "Entreprise": "ENERLIS"
    },
    {
      "Entreprise": "engcon AB"
    },
    {
      "Entreprise": "Engelhardt-Druck GmbH"
    },
    {
      "Entreprise": "ENGIE"
    },
    {
      "Entreprise": "Ensinger GmbH, Germany"
    },
    {
      "Entreprise": "ENTAIN PLC"
    },
    {
      "Entreprise": "Envases Europe"
    },
    {
      "Entreprise": "Envases Universales de México"
    },
    {
      "Entreprise": "Envision Digital International"
    },
    {
      "Entreprise": "Envision Group"
    },
    {
      "Entreprise": "Envu"
    },
    {
      "Entreprise": "EPAL - Empresa Portugesa das Aguas Livres, S.A."
    },
    {
      "Entreprise": "EPAM Systems Inc."
    },
    {
      "Entreprise": "Epiroc AB"
    },
    {
      "Entreprise": "EPL Ltd."
    },
    {
      "Entreprise": "EQT AB"
    },
    {
      "Entreprise": "EQUANS UK & IRELAND"
    },
    {
      "Entreprise": "Equiniti Group Limited"
    },
    {
      "Entreprise": "Equinix, Inc."
    },
    {
      "Entreprise": "EQUIPOS MÓVILES DE CAMPAÑA ARPA"
    },
    {
      "Entreprise": "Equity Residential"
    },
    {
      "Entreprise": "ERAMET"
    },
    {
      "Entreprise": "Erevista Inc"
    },
    {
      "Entreprise": "ERG spa"
    },
    {
      "Entreprise": "Ergonomic Solutions Manufacturing A/S"
    },
    {
      "Entreprise": "ERI"
    },
    {
      "Entreprise": "Eric Wright Water Ltd"
    },
    {
      "Entreprise": "Ericsson Group"
    },
    {
      "Entreprise": "Erith"
    },
    {
      "Entreprise": "ERM"
    },
    {
      "Entreprise": "Ermenegildo Zegna NV"
    },
    {
      "Entreprise": "Ernst Sutter AG"
    },
    {
      "Entreprise": "ES Co., Ltd"
    },
    {
      "Entreprise": "ESG Book GmbH"
    },
    {
      "Entreprise": "ESKA BV"
    },
    {
      "Entreprise": "Esmaltec S.A."
    },
    {
      "Entreprise": "ESPEC Corp."
    },
    {
      "Entreprise": "Espresso House"
    },
    {
      "Entreprise": "Essentra"
    },
    {
      "Entreprise": "Essex Furukawa Magnet Wire"
    },
    {
      "Entreprise": "EssilorLuxottica"
    },
    {
      "Entreprise": "Essinge Rail AB"
    },
    {
      "Entreprise": "Essity AB"
    },
    {
      "Entreprise": "ETAP Lighting International"
    },
    {
      "Entreprise": "Eternis Fine Chemicals"
    },
    {
      "Entreprise": "Ethias"
    },
    {
      "Entreprise": "Ethos Facilities Ltd"
    },
    {
      "Entreprise": "Etivoet"
    },
    {
      "Entreprise": "Eton Group AB"
    },
    {
      "Entreprise": "Etsy, Inc."
    },
    {
      "Entreprise": "euNetworks Group Ltd"
    },
    {
      "Entreprise": "Eunomia Research & Consulting Ltd"
    },
    {
      "Entreprise": "Eurazeo"
    },
    {
      "Entreprise": "Euro Centra Company Limited"
    },
    {
      "Entreprise": "Euro Packaging UK Limited"
    },
    {
      "Entreprise": "Eurocash S.A."
    },
    {
      "Entreprise": "Euroclear SA/NV"
    },
    {
      "Entreprise": "Eurofiber Netherlands BV"
    },
    {
      "Entreprise": "Euronext"
    },
    {
      "Entreprise": "Europcar Mobility Group"
    },
    {
      "Entreprise": "European Filter Corporation"
    },
    {
      "Entreprise": "European Metal Recycling Limited"
    },
    {
      "Entreprise": "Europris ASA"
    },
    {
      "Entreprise": "Eurostar International Ltd"
    },
    {
      "Entreprise": "Eurovia UK Ltd"
    },
    {
      "Entreprise": "EV Cargo"
    },
    {
      "Entreprise": "EV Logistik GmbH"
    },
    {
      "Entreprise": "EV Private Equity"
    },
    {
      "Entreprise": "EVA AIRWAYS CORPORATION"
    },
    {
      "Entreprise": "Evergreen Garden Care"
    },
    {
      "Entreprise": "everis Portugal"
    },
    {
      "Entreprise": "Everlane"
    },
    {
      "Entreprise": "Eversheds Sutherland (International) LLP"
    },
    {
      "Entreprise": "Eversource"
    },
    {
      "Entreprise": "Evervan International Cambodia ,Limited"
    },
    {
      "Entreprise": "EVERVAN INTERNATIONAL LIMITED"
    },
    {
      "Entreprise": "Evervan International Vietnam , Limited"
    },
    {
      "Entreprise": "Eviny AS"
    },
    {
      "Entreprise": "EVN AG"
    },
    {
      "Entreprise": "EVOCA S.p.a."
    },
    {
      "Entreprise": "Evonik Industries AG"
    },
    {
      "Entreprise": "Evoqua Water Technologies"
    },
    {
      "Entreprise": "Evotec SE"
    },
    {
      "Entreprise": "EWE AG"
    },
    {
      "Entreprise": "Exabeam, Inc."
    },
    {
      "Entreprise": "Excellerate Services UK"
    },
    {
      "Entreprise": "Exigere Project Services Limited"
    },
    {
      "Entreprise": "ExlService Holdings, Inc."
    },
    {
      "Entreprise": "Expanscience"
    },
    {
      "Entreprise": "Experian"
    },
    {
      "Entreprise": "EXPLEO GROUP"
    },
    {
      "Entreprise": "Extra Light (Guangzhou) Electrical Co. Ltd."
    },
    {
      "Entreprise": "Exyte GMBH"
    },
    {
      "Entreprise": "EY"
    },
    {
      "Entreprise": "E・J Holdings Inc."
    },
    {
      "Entreprise": "F. Hoffmann-La Roche Ltd"
    },
    {
      "Entreprise": "F.C. Osaka Co.,Ltd"
    },
    {
      "Entreprise": "F9 Distribution Oy"
    },
    {
      "Entreprise": "Fabasoft AG"
    },
    {
      "Entreprise": "Fabege AB"
    },
    {
      "Entreprise": "Facebook, Inc."
    },
    {
      "Entreprise": "FACIL Corporate BV"
    },
    {
      "Entreprise": "FactSet Research Systems Inc"
    },
    {
      "Entreprise": "Faerch A/S"
    },
    {
      "Entreprise": "Fagron NV"
    },
    {
      "Entreprise": "Fairphone B.V"
    },
    {
      "Entreprise": "Falck A/S"
    },
    {
      "Entreprise": "Familia Torres"
    },
    {
      "Entreprise": "FamilyMart Co.,Ltd."
    },
    {
      "Entreprise": "Fanuc Corporation"
    },
    {
      "Entreprise": "Far Eastern New Century Corporation"
    },
    {
      "Entreprise": "Far EasTone Telecommunications Co., Ltd."
    },
    {
      "Entreprise": "FARFETCH Limited"
    },
    {
      "Entreprise": "Farm Frites"
    },
    {
      "Entreprise": "Farmaceutici Procemsa spa"
    },
    {
      "Entreprise": "Farmax"
    },
    {
      "Entreprise": "Farmer Bros. Co"
    },
    {
      "Entreprise": "FashionCube"
    },
    {
      "Entreprise": "FAST RETAILING CO., LTD."
    },
    {
      "Entreprise": "Fastighets AB Balder"
    },
    {
      "Entreprise": "Fastighets AB Regio"
    },
    {
      "Entreprise": "Fastweb S.p.A."
    },
    {
      "Entreprise": "Fater S.p.A."
    },
    {
      "Entreprise": "Faurecia S.A."
    },
    {
      "Entreprise": "Fazer Group"
    },
    {
      "Entreprise": "FBA International USA Inc."
    },
    {
      "Entreprise": "FDM Group (Holdings) plc"
    },
    {
      "Entreprise": "Federal Realty Investment Trust"
    },
    {
      "Entreprise": "Fedrigoni Group"
    },
    {
      "Entreprise": "Feldmuehle GmbH"
    },
    {
      "Entreprise": "Fenergo Ltd."
    },
    {
      "Entreprise": "Fenmarc Produce Ltd"
    },
    {
      "Entreprise": "Feroze1888 Mills Limited"
    },
    {
      "Entreprise": "Ferrari N.V."
    },
    {
      "Entreprise": "Ferrero International S.A."
    },
    {
      "Entreprise": "Ferrocarrils de la Generalitat de Catalunya"
    },
    {
      "Entreprise": "Ferrovial"
    },
    {
      "Entreprise": "Ferrovie dello Stato Italiane SpA"
    },
    {
      "Entreprise": "Fetzer Vineyards"
    },
    {
      "Entreprise": "Fever-Tree"
    },
    {
      "Entreprise": "FGV Holdings Berhad"
    },
    {
      "Entreprise": "Fiba Yenilenebilir Enerji Holding A.S."
    },
    {
      "Entreprise": "FibraHotel"
    },
    {
      "Entreprise": "Ficosa International, S.A."
    },
    {
      "Entreprise": "Fidocar"
    },
    {
      "Entreprise": "Finastra"
    },
    {
      "Entreprise": "Findel"
    },
    {
      "Entreprise": "Fine Grain Property (Ireland) Limited"
    },
    {
      "Entreprise": "FineToday Co., Ltd."
    },
    {
      "Entreprise": "Finisterre UK Limited"
    },
    {
      "Entreprise": "Finnair Plc"
    },
    {
      "Entreprise": "Finsbury Glover Hering"
    },
    {
      "Entreprise": "FIRMENICH SA"
    },
    {
      "Entreprise": "First Capital REIT"
    },
    {
      "Entreprise": "First Financial Holding Co., Ltd."
    },
    {
      "Entreprise": "First Greater Western Ltd"
    },
    {
      "Entreprise": "First MTR South Western Trains Limited"
    },
    {
      "Entreprise": "First Solar Inc"
    },
    {
      "Entreprise": "FirstGroup PLC"
    },
    {
      "Entreprise": "Fisher & Paykel Healthcare Corporation Limited"
    },
    {
      "Entreprise": "Fiskars Corporation"
    },
    {
      "Entreprise": "FIVE Holdings (BVI) Limited"
    },
    {
      "Entreprise": "Fleischtrocknerei Churwalden AG"
    },
    {
      "Entreprise": "Flender International GmbH"
    },
    {
      "Entreprise": "Fletcher Building Limited"
    },
    {
      "Entreprise": "Flex Ltd."
    },
    {
      "Entreprise": "Flexential Corp."
    },
    {
      "Entreprise": "Flexport"
    },
    {
      "Entreprise": "Flight Centre Travel Group"
    },
    {
      "Entreprise": "Flint Group"
    },
    {
      "Entreprise": "Flipkart Group"
    },
    {
      "Entreprise": "Flix SE"
    },
    {
      "Entreprise": "Flooglebinder"
    },
    {
      "Entreprise": "Florin AG"
    },
    {
      "Entreprise": "FLOTILLA GROUP LIMITED"
    },
    {
      "Entreprise": "FLOURISH THRIVE DEVELOPMENTS LIMITED TAIWAN BRANCH"
    },
    {
      "Entreprise": "FlowCon International ApS"
    },
    {
      "Entreprise": "FLSmidth"
    },
    {
      "Entreprise": "Fluid Branding Ltd"
    },
    {
      "Entreprise": "Flutter Entertainment plc"
    },
    {
      "Entreprise": "FM Logistic"
    },
    {
      "Entreprise": "FMC Corporation"
    },
    {
      "Entreprise": "Fnac Darty"
    },
    {
      "Entreprise": "FNZ Ltd"
    },
    {
      "Entreprise": "FOCCHI SPA UNIPERSONALE"
    },
    {
      "Entreprise": "Fogel de Centroamerica, S.A."
    },
    {
      "Entreprise": "Fokus Zukunft GmbH & Co. KG"
    },
    {
      "Entreprise": "Fonterra Co-operative Group Limited"
    },
    {
      "Entreprise": "Foodmark AB"
    },
    {
      "Entreprise": "Foot Locker, Inc."
    },
    {
      "Entreprise": "Forace Polymers Pvt. Ltd."
    },
    {
      "Entreprise": "Ford Motor Company"
    },
    {
      "Entreprise": "Ford Otomotiv Sanayi A.S ( Ford Otosan)"
    },
    {
      "Entreprise": "Foremost Farms USA"
    },
    {
      "Entreprise": "Forest Carbon Ltd."
    },
    {
      "Entreprise": "Formosa Advanced Technologies Corporation"
    },
    {
      "Entreprise": "Formosa Chemicals and Fibre Corporation"
    },
    {
      "Entreprise": "Formosa Climate Smart Service"
    },
    {
      "Entreprise": "Formosa Plastics Corporation (FPC)"
    },
    {
      "Entreprise": "Formosa Sumco Technology Corporation"
    },
    {
      "Entreprise": "Formosa Taffeta Co. LTD."
    },
    {
      "Entreprise": "Formula E Championship"
    },
    {
      "Entreprise": "FORMULARIOS EUROPEOS, S.A."
    },
    {
      "Entreprise": "Fors Marsh Group"
    },
    {
      "Entreprise": "Forsters LLP"
    },
    {
      "Entreprise": "Forterra PLC"
    },
    {
      "Entreprise": "Fortescue Metals Group Ltd"
    },
    {
      "Entreprise": "Fortinet"
    },
    {
      "Entreprise": "Forto Logistics AG & Co. KG"
    },
    {
      "Entreprise": "Fortune Parts Industry Public Company Limited"
    },
    {
      "Entreprise": "Forvia"
    },
    {
      "Entreprise": "Foseco India Limited"
    },
    {
      "Entreprise": "Fossil Group, Inc."
    },
    {
      "Entreprise": "Foundever"
    },
    {
      "Entreprise": "Fourfront Group Ltd"
    },
    {
      "Entreprise": "Foxway Group AB"
    },
    {
      "Entreprise": "Foyle Food Group"
    },
    {
      "Entreprise": "FPA Multifamily LLC"
    },
    {
      "Entreprise": "Fr. Schiettinger KG - Werk Brand"
    },
    {
      "Entreprise": "Fractal Analytics Private Limited"
    },
    {
      "Entreprise": "Framery Trade Oy"
    },
    {
      "Entreprise": "Franke Group"
    },
    {
      "Entreprise": "Franz Kaldewei GmbH & Co. KG"
    },
    {
      "Entreprise": "Frasers Centrepoint Trust"
    },
    {
      "Entreprise": "Frasers Group plc"
    },
    {
      "Entreprise": "Frasers Logistics and Commercial Asset Management Pte Ltd"
    },
    {
      "Entreprise": "FRASERS PROPERTY AUSTRALIA"
    },
    {
      "Entreprise": "Frasers Property Commercial Management Pte Ltd"
    },
    {
      "Entreprise": "FRASERS PROPERTY DEVELOPMENT SERVICES (VIETNAM) CO., LTD."
    },
    {
      "Entreprise": "Frasers Property Industrial"
    },
    {
      "Entreprise": "Frasers Property Retail Management Pte Ltd"
    },
    {
      "Entreprise": "Frasers Property Singapore (Development& Projects)"
    },
    {
      "Entreprise": "Frasers Property UK"
    },
    {
      "Entreprise": "Frazer-Nash Consultancy Ltd."
    },
    {
      "Entreprise": "Freddie's Flowers"
    },
    {
      "Entreprise": "FREE NOW"
    },
    {
      "Entreprise": "Freeport-McMoRan Inc."
    },
    {
      "Entreprise": "FREITAG"
    },
    {
      "Entreprise": "Fresh Del Monte Produce Inc."
    },
    {
      "Entreprise": "Freshfields Bruckhaus Deringer"
    },
    {
      "Entreprise": "FRIGOGLASS S.A.I.C."
    },
    {
      "Entreprise": "Fripa Papierfabrik Albert Friedrich KG"
    },
    {
      "Entreprise": "frischli Milchwerke GmbH"
    },
    {
      "Entreprise": "Fritz Hansen A/S"
    },
    {
      "Entreprise": "fritz-kulturgüter gmbh"
    },
    {
      "Entreprise": "Fruit of the Loom, Inc."
    },
    {
      "Entreprise": "FSN Capital Partners"
    },
    {
      "Entreprise": "FSP Technology Inc."
    },
    {
      "Entreprise": "FTI Consulting, Inc."
    },
    {
      "Entreprise": "Fu Hsun Fiber Industries Co., Ltd."
    },
    {
      "Entreprise": "Fubon Financial Holdings"
    },
    {
      "Entreprise": "Fugro NV"
    },
    {
      "Entreprise": "FUJI BAKING GROUP CO., LTD."
    },
    {
      "Entreprise": "FUJI ELECTRIC CO., LTD."
    },
    {
      "Entreprise": "FUJI OIL HOLDINGS INC."
    },
    {
      "Entreprise": "FUJI SASH CO.,LTD."
    },
    {
      "Entreprise": "Fuji Seal International, INC."
    },
    {
      "Entreprise": "Fujian Huajin Industrial Co. Ltd"
    },
    {
      "Entreprise": "FUJIFILM Holdings Corporation"
    },
    {
      "Entreprise": "Fujikura Ltd"
    },
    {
      "Entreprise": "FUJIKYU LOGISTICS CO., LTD."
    },
    {
      "Entreprise": "FUJIMOTO CHEMICALS CO., LTD."
    },
    {
      "Entreprise": "FUJINO KOUGYOU Co., Ltd."
    },
    {
      "Entreprise": "Fujitoppan Printing CO., LTD."
    },
    {
      "Entreprise": "Fujitsu Limited"
    },
    {
      "Entreprise": "Fukumoto Co.,Ltd."
    },
    {
      "Entreprise": "FullCycle"
    },
    {
      "Entreprise": "Fuller, Smith & Turner P.L.C."
    },
    {
      "Entreprise": "Fumiso Co.,Ltd"
    },
    {
      "Entreprise": "Fundição Moreno Ltda"
    },
    {
      "Entreprise": "Funfer Fundição de Ferro LTDA"
    },
    {
      "Entreprise": "FUNO"
    },
    {
      "Entreprise": "Furukawa Electric Co., Ltd."
    },
    {
      "Entreprise": "Fuss & O'Neill, Inc."
    },
    {
      "Entreprise": "Futur Pension Försäkringsaktiebolag (publ)"
    },
    {
      "Entreprise": "Futurice Oy"
    },
    {
      "Entreprise": "Fyffes"
    },
    {
      "Entreprise": "Føroya Tele Samtakið (Faroese Telecom)"
    },
    {
      "Entreprise": "G's Fresh"
    },
    {
      "Entreprise": "G-Star RAW C.V."
    },
    {
      "Entreprise": "G. Güldenpfennig GmbH"
    },
    {
      "Entreprise": "G4S UK & Ireland"
    },
    {
      "Entreprise": "Galaxy Surfactants Limited"
    },
    {
      "Entreprise": "Galliford Try Holdings Plc"
    },
    {
      "Entreprise": "Galliker Transport AG"
    },
    {
      "Entreprise": "Gamko"
    },
    {
      "Entreprise": "Gamma Telecom Ltd"
    },
    {
      "Entreprise": "Gammon Group"
    },
    {
      "Entreprise": "Gamuda Berhad"
    },
    {
      "Entreprise": "GANGA TOURIST INDIA PRIVATE LIMITED"
    },
    {
      "Entreprise": "GANT AB"
    },
    {
      "Entreprise": "Gap Inc."
    },
    {
      "Entreprise": "Garan Inc."
    },
    {
      "Entreprise": "Garden Trade International"
    },
    {
      "Entreprise": "Gartner, Inc."
    },
    {
      "Entreprise": "Gattaca PLC"
    },
    {
      "Entreprise": "Gattefossé SAS"
    },
    {
      "Entreprise": "Gaysha Limited"
    },
    {
      "Entreprise": "GB Railfreight Ltd"
    },
    {
      "Entreprise": "GCC S.A.B de C.V"
    },
    {
      "Entreprise": "GE Healthcare"
    },
    {
      "Entreprise": "GEA Group"
    },
    {
      "Entreprise": "Gebhardt-Stahl GmbH"
    },
    {
      "Entreprise": "Gebr. Dürrbeck Kunststoffe GmbH"
    },
    {
      "Entreprise": "Gebr. Heinemann SE & Co. KG"
    },
    {
      "Entreprise": "Gebrüder Weiss GmbH"
    },
    {
      "Entreprise": "Gecina"
    },
    {
      "Entreprise": "Geelen Counterflow"
    },
    {
      "Entreprise": "GeelongPort"
    },
    {
      "Entreprise": "Geely Automobile Holdings Limited"
    },
    {
      "Entreprise": "Gefco"
    },
    {
      "Entreprise": "Geia Food A/S"
    },
    {
      "Entreprise": "GEKA"
    },
    {
      "Entreprise": "Gelal Socks Company- Cankiri Facility"
    },
    {
      "Entreprise": "Gelopar Refrigeração Paranaense Ltda"
    },
    {
      "Entreprise": "General Interface Solution (GIS) Holding Limited"
    },
    {
      "Entreprise": "General Mills Inc."
    },
    {
      "Entreprise": "General Motors"
    },
    {
      "Entreprise": "GenerationHope, Inc."
    },
    {
      "Entreprise": "Genesee & Wyoming Inc."
    },
    {
      "Entreprise": "Genesis Energy Ltd"
    },
    {
      "Entreprise": "GENESIS FASHIONS LIMITED"
    },
    {
      "Entreprise": "Genesta Property Nordics AB"
    },
    {
      "Entreprise": "Genesys Cloud Services, Inc."
    },
    {
      "Entreprise": "Genossenschaft ZFV-Unternehmungen"
    },
    {
      "Entreprise": "Genpact"
    },
    {
      "Entreprise": "GENUI"
    },
    {
      "Entreprise": "Genuit Group plc"
    },
    {
      "Entreprise": "GEODIS"
    },
    {
      "Entreprise": "Geomatikk Holding AS"
    },
    {
      "Entreprise": "GeoPost"
    },
    {
      "Entreprise": "Georg Fischer AG"
    },
    {
      "Entreprise": "Geotab"
    },
    {
      "Entreprise": "Geovent A/S"
    },
    {
      "Entreprise": "Gestamp"
    },
    {
      "Entreprise": "GET-IT CO., LTD."
    },
    {
      "Entreprise": "Getinge AB"
    },
    {
      "Entreprise": "GETLINK"
    },
    {
      "Entreprise": "GFT Technologies"
    },
    {
      "Entreprise": "GHD Group Limited"
    },
    {
      "Entreprise": "Ghelamco Poland"
    },
    {
      "Entreprise": "Giesecke+Devrient GmbH"
    },
    {
      "Entreprise": "Gifu Sanken Kogyo Co,.Ltd"
    },
    {
      "Entreprise": "Gildan Activewear Inc."
    },
    {
      "Entreprise": "Gilead Sciences, Inc."
    },
    {
      "Entreprise": "Gina Tricot"
    },
    {
      "Entreprise": "Givaudan SA"
    },
    {
      "Entreprise": "Gjensidige Insurance ASA"
    },
    {
      "Entreprise": "GK Gruppen AS"
    },
    {
      "Entreprise": "GKN Aerospace Services Ltd"
    },
    {
      "Entreprise": "GKN Automotive"
    },
    {
      "Entreprise": "Glamox"
    },
    {
      "Entreprise": "Glanbia Ireland DAC"
    },
    {
      "Entreprise": "Glanbia PLC"
    },
    {
      "Entreprise": "Glaston Corporation"
    },
    {
      "Entreprise": "GlaxoSmithKline"
    },
    {
      "Entreprise": "Gleeds Corporate Services Limited"
    },
    {
      "Entreprise": "Glenmark Pharmaceuticals Limited"
    },
    {
      "Entreprise": "Glenveagh Properties Plc"
    },
    {
      "Entreprise": "Global Fashion Group S.A."
    },
    {
      "Entreprise": "Global Via Infraestructuras S.A."
    },
    {
      "Entreprise": "GlobalConnect (Nordic Connectivity AB)"
    },
    {
      "Entreprise": "GlobalData"
    },
    {
      "Entreprise": "GLOBALWORTH REAL ESTATE INVESTMENTS LIMITED"
    },
    {
      "Entreprise": "Globant España S.A."
    },
    {
      "Entreprise": "Globe Telecom, Inc."
    },
    {
      "Entreprise": "Globe-ing Inc."
    },
    {
      "Entreprise": "Glovo"
    },
    {
      "Entreprise": "Gluth Systemtechnik GmbH"
    },
    {
      "Entreprise": "GN Store Nord A/S"
    },
    {
      "Entreprise": "Go-Ahead Holdings Limited"
    },
    {
      "Entreprise": "GoCardless"
    },
    {
      "Entreprise": "GODA Co.,Ltd."
    },
    {
      "Entreprise": "Godrej & Boyce Mfg. Co. Ltd."
    },
    {
      "Entreprise": "Godrej AgroveT Limited"
    },
    {
      "Entreprise": "Godrej Consumer Products Limited"
    },
    {
      "Entreprise": "Godrej Industries"
    },
    {
      "Entreprise": "Godrej Properties Limited"
    },
    {
      "Entreprise": "Godsinlösen Nordic AB"
    },
    {
      "Entreprise": "Godt Smil Holding ApS"
    },
    {
      "Entreprise": "GOJO Industries"
    },
    {
      "Entreprise": "GOL (GOL Linhas Aéreas S.A.)"
    },
    {
      "Entreprise": "Gold Creek Foods, LLC / Gold Creek Processing, LLC"
    },
    {
      "Entreprise": "Gold Fields"
    },
    {
      "Entreprise": "Golden Goose S.p.A."
    },
    {
      "Entreprise": "Golden State Foods"
    },
    {
      "Entreprise": "Gonvarri Industries"
    },
    {
      "Entreprise": "Good Energy"
    },
    {
      "Entreprise": "GoodDr Marketing&Consulting Co.,Ltd"
    },
    {
      "Entreprise": "Goodman CE"
    },
    {
      "Entreprise": "Goodman Group"
    },
    {
      "Entreprise": "GoodWay Technology Co.,Ltd."
    },
    {
      "Entreprise": "GORON"
    },
    {
      "Entreprise": "GoTo"
    },
    {
      "Entreprise": "Gottfried Stiller GmbH | MEGABAD"
    },
    {
      "Entreprise": "Gowling WLG (UK) Ltd"
    },
    {
      "Entreprise": "GRAHAM"
    },
    {
      "Entreprise": "Graham Packaging"
    },
    {
      "Entreprise": "Gränges AB"
    },
    {
      "Entreprise": "Granlund Group"
    },
    {
      "Entreprise": "Grant Thornton LLP"
    },
    {
      "Entreprise": "Grant Thornton UK LLP"
    },
    {
      "Entreprise": "Graphic Packaging International, LLC"
    },
    {
      "Entreprise": "Grayce"
    },
    {
      "Entreprise": "Graylaw International Freight Group"
    },
    {
      "Entreprise": "Great British Communications Ltd"
    },
    {
      "Entreprise": "Great Portland Estates plc"
    },
    {
      "Entreprise": "Great Southern Bank"
    },
    {
      "Entreprise": "Green Element Group"
    },
    {
      "Entreprise": "Green Plains Inc."
    },
    {
      "Entreprise": "GREEN TOURIST SERVICES PVT. LTD."
    },
    {
      "Entreprise": "green4T"
    },
    {
      "Entreprise": "GreenA Consultants Pte Ltd"
    },
    {
      "Entreprise": "Greenalia S.A."
    },
    {
      "Entreprise": "Greencore Group plc"
    },
    {
      "Entreprise": "Greene King Limited"
    },
    {
      "Entreprise": "Greenfish SA"
    },
    {
      "Entreprise": "GreenFlex"
    },
    {
      "Entreprise": "Greenfood AB"
    },
    {
      "Entreprise": "Greenstone+"
    },
    {
      "Entreprise": "Greenyard NV"
    },
    {
      "Entreprise": "GREGGS PLC"
    },
    {
      "Entreprise": "Gregory Distribution (Holdings) Limited"
    },
    {
      "Entreprise": "Greif Holding GmbH & Co. KG"
    },
    {
      "Entreprise": "Greiner AG"
    },
    {
      "Entreprise": "GRI Renewable Industries"
    },
    {
      "Entreprise": "Grieg Seafood ASA"
    },
    {
      "Entreprise": "Griesson – de Beukelaer GmbH & Co. KG"
    },
    {
      "Entreprise": "Griffith Foods Worldwide Inc."
    },
    {
      "Entreprise": "Grimshaw"
    },
    {
      "Entreprise": "GripGrab ApS"
    },
    {
      "Entreprise": "Grolman Group"
    },
    {
      "Entreprise": "Gromax Agri Equipment Limited"
    },
    {
      "Entreprise": "Grönsaksmästarna Nordic AB"
    },
    {
      "Entreprise": "Grosvenor Europe Limited"
    },
    {
      "Entreprise": "Grosvenor Property UK"
    },
    {
      "Entreprise": "Ground Control Ltd"
    },
    {
      "Entreprise": "Group Fu Plastic Co., LTD"
    },
    {
      "Entreprise": "Group IMV Technologies"
    },
    {
      "Entreprise": "Group O Inc."
    },
    {
      "Entreprise": "Group One"
    },
    {
      "Entreprise": "Groupe Barbier"
    },
    {
      "Entreprise": "Groupe Bruxelles Lambert"
    },
    {
      "Entreprise": "Groupe Etam"
    },
    {
      "Entreprise": "Groupe iliad"
    },
    {
      "Entreprise": "Groupe Pierre et Vacances Center Parcs"
    },
    {
      "Entreprise": "Groupe Public Ferroviaire (GPF) – SNCF"
    },
    {
      "Entreprise": "Groupe Qualiconsult"
    },
    {
      "Entreprise": "GROUPE RENAULT"
    },
    {
      "Entreprise": "Groupe RG"
    },
    {
      "Entreprise": "Groupe SEB"
    },
    {
      "Entreprise": "GROUPE SERVICES FRANCE (GSF)"
    },
    {
      "Entreprise": "Groupe VIVESCIA"
    },
    {
      "Entreprise": "Grove Collaborative"
    },
    {
      "Entreprise": "Growthpoint Properties"
    },
    {
      "Entreprise": "Grundfos Holding A/S"
    },
    {
      "Entreprise": "GRUPO ACOTRAL"
    },
    {
      "Entreprise": "Grupo Antolin Irausa S.A.U."
    },
    {
      "Entreprise": "Grupo Bimbo SAB de CV"
    },
    {
      "Entreprise": "Grupo CCR"
    },
    {
      "Entreprise": "Grupo Cooperativo Cajamar"
    },
    {
      "Entreprise": "Grupo Cosentino SL"
    },
    {
      "Entreprise": "GRUPO ELECNOR"
    },
    {
      "Entreprise": "Grupo Ferrer Internacional SA"
    },
    {
      "Entreprise": "Grupo Fertiberia"
    },
    {
      "Entreprise": "Grupo Financiero Banorte SAB de CV"
    },
    {
      "Entreprise": "Grupo Forma 5"
    },
    {
      "Entreprise": "Grupo Iren Fruits"
    },
    {
      "Entreprise": "Grupo Malwee"
    },
    {
      "Entreprise": "Grupo Rotoplas S.A.B. de C.V."
    },
    {
      "Entreprise": "Grupo Sesé"
    },
    {
      "Entreprise": "Grupo SOMA"
    },
    {
      "Entreprise": "Grupo Televisa, S.A.B."
    },
    {
      "Entreprise": "GRUPO TRANSFESA LOGISTICS"
    },
    {
      "Entreprise": "Gruppo Amadori_GESCO Sca"
    },
    {
      "Entreprise": "Gruppo Armani"
    },
    {
      "Entreprise": "Gruppo La Doria S.P.A."
    },
    {
      "Entreprise": "Gruppo Veronesi"
    },
    {
      "Entreprise": "GSL – Global Star Logistics"
    },
    {
      "Entreprise": "GT Incorporated Company"
    },
    {
      "Entreprise": "GUALA CLOSURES S.P.A."
    },
    {
      "Entreprise": "Guangdong Gaoyi Packaging Technology Co., Ltd. "
    },
    {
      "Entreprise": "Guangdong Textiles Imp. & Exp. Co., Ltd."
    },
    {
      "Entreprise": "Guangzhou Battsys Co., Ltd."
    },
    {
      "Entreprise": "Guangzhou Non-ferrous Metals Research Institute Xinfeng Wear Resistant Alloy Material Co., LTD."
    },
    {
      "Entreprise": "Guardian Media Group plc"
    },
    {
      "Entreprise": "Guava Amenities Pte Ltd"
    },
    {
      "Entreprise": "Guayaki Yerba Mate"
    },
    {
      "Entreprise": "GUBI A/S"
    },
    {
      "Entreprise": "Guerbet"
    },
    {
      "Entreprise": "Guerlain"
    },
    {
      "Entreprise": "Guess?, Inc."
    },
    {
      "Entreprise": "Gugler GmbH"
    },
    {
      "Entreprise": "Guidewire Software Inc."
    },
    {
      "Entreprise": "Gujarat Fluorochemicals Ltd. (GFL)"
    },
    {
      "Entreprise": "GUJARAT TECHNOCASTINGS PVT. LTD"
    },
    {
      "Entreprise": "Gul Ahmed Textile Mills Limited"
    },
    {
      "Entreprise": "Gulermak Steel Construction Ind. & Trade Co. Inc."
    },
    {
      "Entreprise": "Gustav Spiess AG"
    },
    {
      "Entreprise": "GUUN Co., Ltd."
    },
    {
      "Entreprise": "GY-TAL Shoes"
    },
    {
      "Entreprise": "Gymshark"
    },
    {
      "Entreprise": "H&M Group"
    },
    {
      "Entreprise": "H&R GmbH & Co. KGaA"
    },
    {
      "Entreprise": "H&T Presspart"
    },
    {
      "Entreprise": "h&z Unternehmensberatung"
    },
    {
      "Entreprise": "H+H International A/S"
    },
    {
      "Entreprise": "H.U. Group Holdings, Inc."
    },
    {
      "Entreprise": "Haberkorn Holding AG"
    },
    {
      "Entreprise": "Hachette UK LTD"
    },
    {
      "Entreprise": "Hager SE"
    },
    {
      "Entreprise": "Haglunds Bygg & Entreprenad AB"
    },
    {
      "Entreprise": "Haiyan Dingsheng Machinery Co., Ltd"
    },
    {
      "Entreprise": "Haldex"
    },
    {
      "Entreprise": "Haldor Topsøe"
    },
    {
      "Entreprise": "Haleon plc"
    },
    {
      "Entreprise": "Halfords Group PLC"
    },
    {
      "Entreprise": "Hallmark, Incorporated"
    },
    {
      "Entreprise": "HALO Branded Solutions, Inc."
    },
    {
      "Entreprise": "Hamada Co"
    },
    {
      "Entreprise": "Hamamatsu Photonics K.K."
    },
    {
      "Entreprise": "HAMELIN GROUP"
    },
    {
      "Entreprise": "Hamilton Bonaduz AG & Hamilton Medical AG"
    },
    {
      "Entreprise": "Han Yin (Shanghai) Eco-Materials Technology Co., Ltd."
    },
    {
      "Entreprise": "Hana Financial Group"
    },
    {
      "Entreprise": "HANACANS JOINT STOCK COMPANY"
    },
    {
      "Entreprise": "Hanesbrands Inc."
    },
    {
      "Entreprise": "Hang Lung Properties Ltd."
    },
    {
      "Entreprise": "Hang Seng Bank Limited"
    },
    {
      "Entreprise": "Hangzhou Hengli Metal Processing Co., Ltd"
    },
    {
      "Entreprise": "Hankook Tire & Technology Co., Ltd."
    },
    {
      "Entreprise": "Hannon Armstrong"
    },
    {
      "Entreprise": "Hanon Systems"
    },
    {
      "Entreprise": "Hansa Byggpartner AB"
    },
    {
      "Entreprise": "Hansgrohe Group"
    },
    {
      "Entreprise": "Hansoll Textile Ltd."
    },
    {
      "Entreprise": "HARA TRADING CO., LTD."
    },
    {
      "Entreprise": "Harch Inc."
    },
    {
      "Entreprise": "Hardscape Group Limited"
    },
    {
      "Entreprise": "Harita Metal Co.,Ltd."
    },
    {
      "Entreprise": "Harith General Partners"
    },
    {
      "Entreprise": "Harley-Davidson Inc."
    },
    {
      "Entreprise": "Harmony Gold Mining Company Limited"
    },
    {
      "Entreprise": "Harris Tea Company"
    },
    {
      "Entreprise": "Harro Höfliger Verpackungsmaschinen GmbH"
    },
    {
      "Entreprise": "Hart Miller Design Ltd / MARK Product"
    },
    {
      "Entreprise": "Harvest House"
    },
    {
      "Entreprise": "Hasbro, Inc."
    },
    {
      "Entreprise": "Haseko Corporation"
    },
    {
      "Entreprise": "HASHIMOTO METAL CO.,LTD"
    },
    {
      "Entreprise": "Hastings Group Holdings (HGH)"
    },
    {
      "Entreprise": "Hauser & Wirth"
    },
    {
      "Entreprise": "Havea Group"
    },
    {
      "Entreprise": "Hawaiian Electric"
    },
    {
      "Entreprise": "Haworth Inc."
    },
    {
      "Entreprise": "Hayley Group Ltd"
    },
    {
      "Entreprise": "Hayleys Fabric PLC"
    },
    {
      "Entreprise": "Hays plc"
    },
    {
      "Entreprise": "HAZAMA ANDO CORPORATION"
    },
    {
      "Entreprise": "HCL Technologies"
    },
    {
      "Entreprise": "HeadFirst Group"
    },
    {
      "Entreprise": "Healeys Printers Limited"
    },
    {
      "Entreprise": "HEALTH AND HAPPINESS (H&H) INTERNATIONAL HOLDINGS LIMITED"
    },
    {
      "Entreprise": "Healthpeak Properties, Inc."
    },
    {
      "Entreprise": "Heart with Smart Group"
    },
    {
      "Entreprise": "Heathrow Airport"
    },
    {
      "Entreprise": "Heba Fastighets AB"
    },
    {
      "Entreprise": "Hebei Chengxin Co. Ltd"
    },
    {
      "Entreprise": "Heidelberg Materials"
    },
    {
      "Entreprise": "Heimstaden Bostad AB"
    },
    {
      "Entreprise": "HEINEKEN N.V."
    },
    {
      "Entreprise": "Heinz Glas Dzialdowo Sp Z.o.o.c"
    },
    {
      "Entreprise": "Heinzel Holding GmbH"
    },
    {
      "Entreprise": "HEISEI INDUSTRY CO., LTD"
    },
    {
      "Entreprise": "Heiwa Real Estate Co., Ltd."
    },
    {
      "Entreprise": "Hela Clothing"
    },
    {
      "Entreprise": "Helen Ltd"
    },
    {
      "Entreprise": "Helen of Troy Limited"
    },
    {
      "Entreprise": "Hellenic Cables"
    },
    {
      "Entreprise": "HelloFresh SE"
    },
    {
      "Entreprise": "HEM Denmark A/S"
    },
    {
      "Entreprise": "Hemnet AB"
    },
    {
      "Entreprise": "Hempel A/S"
    },
    {
      "Entreprise": "Henan Hengfeng Top Leisure Co.,LTD"
    },
    {
      "Entreprise": "Henderson Land Development Company Limited"
    },
    {
      "Entreprise": "Henkel AG & Co. KGaA"
    },
    {
      "Entreprise": "Henri Hutin"
    },
    {
      "Entreprise": "Henry Schein, Inc."
    },
    {
      "Entreprise": "HEPPNER"
    },
    {
      "Entreprise": "Hera"
    },
    {
      "Entreprise": "Heraeus Precious Metals"
    },
    {
      "Entreprise": "Herbert Smith Freehills"
    },
    {
      "Entreprise": "HERIGE"
    },
    {
      "Entreprise": "heristo aktiengesellschaft"
    },
    {
      "Entreprise": "Hermès International"
    },
    {
      "Entreprise": "Hero Group"
    },
    {
      "Entreprise": "Herschel Supply Company Ltd."
    },
    {
      "Entreprise": "Hersha Hospitality Trust"
    },
    {
      "Entreprise": "Hertz"
    },
    {
      "Entreprise": "Hewlett Packard Enterprise Company"
    },
    {
      "Entreprise": "Hexagon AB"
    },
    {
      "Entreprise": "Hexagon Composites ASA"
    },
    {
      "Entreprise": "HEXPOL AB"
    },
    {
      "Entreprise": "Hg Capital"
    },
    {
      "Entreprise": "HGF Ltd"
    },
    {
      "Entreprise": "HH Global"
    },
    {
      "Entreprise": "Hiflux Filtration A/S"
    },
    {
      "Entreprise": "High Speed Two Ltd."
    },
    {
      "Entreprise": "Highland Spring Group"
    },
    {
      "Entreprise": "HIGUCHI MANUFACTURING CO., LTD."
    },
    {
      "Entreprise": "Hill & Smith Holdings PLC"
    },
    {
      "Entreprise": "Hill Dickinson LLP"
    },
    {
      "Entreprise": "Hilti Corporation"
    },
    {
      "Entreprise": "Hilton"
    },
    {
      "Entreprise": "Hilton Food Group"
    },
    {
      "Entreprise": "Hindalco Industries Limited"
    },
    {
      "Entreprise": "Hindustan Zinc Limited"
    },
    {
      "Entreprise": "Hines"
    },
    {
      "Entreprise": "Hinojosa Packaging Group"
    },
    {
      "Entreprise": "Hinomaru Jidousya Co.Ltd"
    },
    {
      "Entreprise": "Hirdaramani International Exports (Pvt) Ltd"
    },
    {
      "Entreprise": "Hirschvogel Holding GmbH"
    },
    {
      "Entreprise": "Hitachi Astemo, Ltd"
    },
    {
      "Entreprise": "Hitachi Construction Machinery Co. LTD"
    },
    {
      "Entreprise": "Hitachi Energy Ltd"
    },
    {
      "Entreprise": "Hitachi, Ltd."
    },
    {
      "Entreprise": "HK Electric Investments (HKEI)"
    },
    {
      "Entreprise": "HKScan Corporation"
    },
    {
      "Entreprise": "HL Display AB"
    },
    {
      "Entreprise": "HLD Global Limited"
    },
    {
      "Entreprise": "HMD Global OY"
    },
    {
      "Entreprise": "HNI Corporation"
    },
    {
      "Entreprise": "Hoare Lea LLP"
    },
    {
      "Entreprise": "Hobbs the Printers Limited"
    },
    {
      "Entreprise": "Hochland Deutschland GmbH"
    },
    {
      "Entreprise": "Höegh Autoliners"
    },
    {
      "Entreprise": "Hogan Lovells"
    },
    {
      "Entreprise": "Höganäs AB"
    },
    {
      "Entreprise": "Hoi Meng Sourcing (Macao Commercial Offshore) Ltd"
    },
    {
      "Entreprise": "HOK"
    },
    {
      "Entreprise": "HOKUBEI SANGYO INC"
    },
    {
      "Entreprise": "HOKUSAN COMPANY LIMITED"
    },
    {
      "Entreprise": "Hokutaku Co.,LTD"
    },
    {
      "Entreprise": "Holaluz"
    },
    {
      "Entreprise": "Holcim Ltd."
    },
    {
      "Entreprise": "Holdit AB"
    },
    {
      "Entreprise": "Holmen AB"
    },
    {
      "Entreprise": "Holocene UG (haftungsbeschränkt)"
    },
    {
      "Entreprise": "Holt, Renfrew & Co., Limited"
    },
    {
      "Entreprise": "HOME PRODUCT CENTER PUBLIC COMPANY LIMITED"
    },
    {
      "Entreprise": "Home search Co.,Ltd."
    },
    {
      "Entreprise": "HomeServe plc"
    },
    {
      "Entreprise": "Hon Hai Precision Inc. Co., Ltd."
    },
    {
      "Entreprise": "Honeywell International Inc."
    },
    {
      "Entreprise": "Hong Kong Air Cargo Terminals Limited"
    },
    {
      "Entreprise": "Hong Kong Science & Technology Parks Corporation"
    },
    {
      "Entreprise": "Hongkong Land Holdings Limited"
    },
    {
      "Entreprise": "Hop Lun"
    },
    {
      "Entreprise": "Hopkins Architects Limited"
    },
    {
      "Entreprise": "Horana Plantations PLC"
    },
    {
      "Entreprise": "Hormel Foods Corporation"
    },
    {
      "Entreprise": "Horwich Farrelly Limited"
    },
    {
      "Entreprise": "HOSEA PRECISION CO., LTD."
    },
    {
      "Entreprise": "Hoso Industry co.,ltd"
    },
    {
      "Entreprise": "Host Hotels & Resorts, Inc."
    },
    {
      "Entreprise": "HOU-TECH CO., LTD"
    },
    {
      "Entreprise": "House of Baukjen"
    },
    {
      "Entreprise": "Housemesh Inc."
    },
    {
      "Entreprise": "Howdens Joinery Ltd"
    },
    {
      "Entreprise": "HoWe Wurstwaren KG"
    },
    {
      "Entreprise": "Hoyer Handel GmbH"
    },
    {
      "Entreprise": "HP Inc"
    },
    {
      "Entreprise": "HP-Hrvatska pošta d.d."
    },
    {
      "Entreprise": "HS1 Ltd"
    },
    {
      "Entreprise": "HSB Riksförbund ekonomisk förening"
    },
    {
      "Entreprise": "HSS HIRE GROUP PLC"
    },
    {
      "Entreprise": "HTC Corporation"
    },
    {
      "Entreprise": "HUBER+SUHNER Group"
    },
    {
      "Entreprise": "HubSpot Inc"
    },
    {
      "Entreprise": "Hudson Pacific Properties, Inc."
    },
    {
      "Entreprise": "Hufvudstaden AB"
    },
    {
      "Entreprise": "Huge-Bamboo Enterprise Co., Ltd"
    },
    {
      "Entreprise": "Hugh Lowe Farms Ltd"
    },
    {
      "Entreprise": "Hugo Boss AG"
    },
    {
      "Entreprise": "Huhtamäki Oyj"
    },
    {
      "Entreprise": "Huizhou TCL Mobile Communication Co,Ltd."
    },
    {
      "Entreprise": "Hulamin"
    },
    {
      "Entreprise": "Hulic Co., Ltd."
    },
    {
      "Entreprise": "Humana Inc."
    },
    {
      "Entreprise": "Humanscale"
    },
    {
      "Entreprise": "Humlegården Fastigheter AB"
    },
    {
      "Entreprise": "hummel A/S"
    },
    {
      "Entreprise": "HUNG HING METAL MANUFACTORY LIMITED"
    },
    {
      "Entreprise": "Huntapac Produce Ltd"
    },
    {
      "Entreprise": "Hurst Peirce & Malcolm LLP"
    },
    {
      "Entreprise": "Hurtigruten Expeditions"
    },
    {
      "Entreprise": "Hurtigruten Group"
    },
    {
      "Entreprise": "Husqvarna AB"
    },
    {
      "Entreprise": "Hutchison Port Holdings Limited"
    },
    {
      "Entreprise": "Hwa Meei Optical Co., Ltd"
    },
    {
      "Entreprise": "Hyatt"
    },
    {
      "Entreprise": "Hydrock Consultants Ltd"
    },
    {
      "Entreprise": "Hyosung Advanced Materials Corporation"
    },
    {
      "Entreprise": "HYPER Inc."
    },
    {
      "Entreprise": "HYUNDAI Engineering & Construction"
    },
    {
      "Entreprise": "HYUNDAI MOBIS Co.,Ltd."
    },
    {
      "Entreprise": "i engineering Group"
    },
    {
      "Entreprise": "I Job depot consultancy services Private limited"
    },
    {
      "Entreprise": "IA Interior Architects"
    },
    {
      "Entreprise": "Ib Andresen Industri A/S"
    },
    {
      "Entreprise": "Iberdrola SA"
    },
    {
      "Entreprise": "IBERIA, Líneas Aéreas de España, S.A"
    },
    {
      "Entreprise": "Iberostar Hotels and Resorts"
    },
    {
      "Entreprise": "ICA Gruppen"
    },
    {
      "Entreprise": "Icade"
    },
    {
      "Entreprise": "ICF"
    },
    {
      "Entreprise": "ICHIKAWA IRONWORKS CO., LTD"
    },
    {
      "Entreprise": "ICL Group LTD"
    },
    {
      "Entreprise": "Icon Construction"
    },
    {
      "Entreprise": "IDE Group Manage Ltd"
    },
    {
      "Entreprise": "Ideal Modular Homes"
    },
    {
      "Entreprise": "IDEALISTA S.A.U."
    },
    {
      "Entreprise": "Identity Holdings Ltd."
    },
    {
      "Entreprise": "Idneo Technologies, SAU"
    },
    {
      "Entreprise": "IFCO Systems"
    },
    {
      "Entreprise": "IFS"
    },
    {
      "Entreprise": "IG Group Holdings PLC"
    },
    {
      "Entreprise": "IG International Private Limited"
    },
    {
      "Entreprise": "IGM Resins B.V."
    },
    {
      "Entreprise": "Ignition DG Ltd"
    },
    {
      "Entreprise": "Ignitis Group"
    },
    {
      "Entreprise": "iGO4 Limited"
    },
    {
      "Entreprise": "Iguá Saneamento S.A."
    },
    {
      "Entreprise": "IK Investment Partners Limited"
    },
    {
      "Entreprise": "IKEA"
    },
    {
      "Entreprise": "Ikedagiken Kougyou Co., Ltd."
    },
    {
      "Entreprise": "ILJIN CO.,LTD"
    },
    {
      "Entreprise": "ILJIN Global"
    },
    {
      "Entreprise": "Illumina, Inc."
    },
    {
      "Entreprise": "ILUNION Hotels"
    },
    {
      "Entreprise": "Imagination Technologies"
    },
    {
      "Entreprise": "IMBERA S.A DE C.V."
    },
    {
      "Entreprise": "Imerys"
    },
    {
      "Entreprise": "iMicron CO., LTD."
    },
    {
      "Entreprise": "Imperial Brands"
    },
    {
      "Entreprise": "Implement Consulting Group P/S"
    },
    {
      "Entreprise": "Impressions Services Private Limited"
    },
    {
      "Entreprise": "INABAYA REINETSU SANGYOU CO.,LTD."
    },
    {
      "Entreprise": "INALCA S.p.A."
    },
    {
      "Entreprise": "Indian Hotels Company Limited"
    },
    {
      "Entreprise": "Inditex"
    },
    {
      "Entreprise": "Indo Count"
    },
    {
      "Entreprise": "Indorama Ventures PCL"
    },
    {
      "Entreprise": "Indra"
    },
    {
      "Entreprise": "INDURA"
    },
    {
      "Entreprise": "Industrial & Infrastructure Fund Investment Corporation"
    },
    {
      "Entreprise": "Industrial Bank of Korea (IBK)"
    },
    {
      "Entreprise": "INDUSTRIALIZADORA OLEOFINOS S.A DE C.V."
    },
    {
      "Entreprise": "Indutrade AB"
    },
    {
      "Entreprise": "Infarm"
    },
    {
      "Entreprise": "Infomed Fluids s.r.l."
    },
    {
      "Entreprise": "Informa plc"
    },
    {
      "Entreprise": "Informed Solutions Ltd"
    },
    {
      "Entreprise": "Infosys Limited"
    },
    {
      "Entreprise": "InfoVision Electronics (Kunshan) Co., Ltd."
    },
    {
      "Entreprise": "INFRA Group"
    },
    {
      "Entreprise": "Infrabel n.v."
    },
    {
      "Entreprise": "Infraconcepts Netherlands B.V."
    },
    {
      "Entreprise": "Infraestruturas de Portugal, S.A."
    },
    {
      "Entreprise": "Infratil Limited"
    },
    {
      "Entreprise": "ING Group"
    },
    {
      "Entreprise": "Inghams Group Ltd"
    },
    {
      "Entreprise": "Ingka Group"
    },
    {
      "Entreprise": "Inglewood Co., Ltd."
    },
    {
      "Entreprise": "Ingram Micro"
    },
    {
      "Entreprise": "Ingredion Incorporated"
    },
    {
      "Entreprise": "Inizio Group Limited"
    },
    {
      "Entreprise": "Inkia Energy Group (Nautilus Energy Holdings LLC)"
    },
    {
      "Entreprise": "Inmarsat Global Limited"
    },
    {
      "Entreprise": "Inmobiliaria Colonial, SOCIMI, S.A."
    },
    {
      "Entreprise": "Inner Mongolia Yili Industrial Group Co.,Ltd."
    },
    {
      "Entreprise": "INNIO Group Holding GmbH"
    },
    {
      "Entreprise": "innocent drinks"
    },
    {
      "Entreprise": "Innolux Corporation"
    },
    {
      "Entreprise": "Innovation Group Holdings Limited"
    },
    {
      "Entreprise": "InPost S.A"
    },
    {
      "Entreprise": "InQube Global (Pvt) Ltd,"
    },
    {
      "Entreprise": "Inside Ideas Group Ltd"
    },
    {
      "Entreprise": "Inspired PLC"
    },
    {
      "Entreprise": "INSPUR"
    },
    {
      "Entreprise": "Institutional Shareholder Services"
    },
    {
      "Entreprise": "Instone Real Estate Group SE"
    },
    {
      "Entreprise": "INTEGRA Biosciences AG"
    },
    {
      "Entreprise": "Integrated Workforce Solutions Private Limited"
    },
    {
      "Entreprise": "Inter Cars SA"
    },
    {
      "Entreprise": "InterContinental Hotels Group PLC"
    },
    {
      "Entreprise": "Interface"
    },
    {
      "Entreprise": "Intergamma"
    },
    {
      "Entreprise": "Interloop Limited"
    },
    {
      "Entreprise": "Intermediate Capital Group"
    },
    {
      "Entreprise": "International Automotive Components Group, S.A."
    },
    {
      "Entreprise": "International Conflict and Security Consulting Ltd."
    },
    {
      "Entreprise": "International Consolidated Airlines Group (IAG)"
    },
    {
      "Entreprise": "International Flavors & Fragrances Inc."
    },
    {
      "Entreprise": "International Game Technology PLC"
    },
    {
      "Entreprise": "International Paper Company"
    },
    {
      "Entreprise": "International Post Corporation (IPC)"
    },
    {
      "Entreprise": "Internet Fusion Ltd"
    },
    {
      "Entreprise": "Interplex Precision Technology (S) Pte Ltd"
    },
    {
      "Entreprise": "Interpublic Group of Companies, Inc."
    },
    {
      "Entreprise": "InterRent REIT"
    },
    {
      "Entreprise": "Intersnack Group GmbH & Co. KG"
    },
    {
      "Entreprise": "Intertape Polymer Group Inc."
    },
    {
      "Entreprise": "Intertek Group plc"
    },
    {
      "Entreprise": "Intesa Sanpaolo"
    },
    {
      "Entreprise": "Intouch Group, LLC"
    },
    {
      "Entreprise": "Intrepid Travel"
    },
    {
      "Entreprise": "Intuit"
    },
    {
      "Entreprise": "Inventec (Chongqing) Corporation"
    },
    {
      "Entreprise": "Investa Office Management Pty Limited"
    },
    {
      "Entreprise": "Investindustrial"
    },
    {
      "Entreprise": "INVIVO GROUP"
    },
    {
      "Entreprise": "Inwido AB"
    },
    {
      "Entreprise": "INWIT (Infrastrutture Wireless Italiane SpA)"
    },
    {
      "Entreprise": "io oil & gas UK LLP"
    },
    {
      "Entreprise": "IOI Corporation Berhad"
    },
    {
      "Entreprise": "IOL chemcials and pharmaceuticals Ltd"
    },
    {
      "Entreprise": "Ipackchem Group"
    },
    {
      "Entreprise": "IPEC PTY LTD (TEAM GLOBAL EXPRESS)"
    },
    {
      "Entreprise": "iPoint-systems GmbH"
    },
    {
      "Entreprise": "IPS-Integrated Project Services"
    },
    {
      "Entreprise": "Ipsen SA"
    },
    {
      "Entreprise": "IPUT Plc"
    },
    {
      "Entreprise": "IQE plc"
    },
    {
      "Entreprise": "IQVIA Holdings Inc"
    },
    {
      "Entreprise": "Irdeto B.V."
    },
    {
      "Entreprise": "IREC Co.,Ltd."
    },
    {
      "Entreprise": "Iren  Group"
    },
    {
      "Entreprise": "Iress Limited"
    },
    {
      "Entreprise": "Irie System Incorporation"
    },
    {
      "Entreprise": "Iron Mountain"
    },
    {
      "Entreprise": "Irwin Mitchell Holdings Limited"
    },
    {
      "Entreprise": "ISDIN S.A."
    },
    {
      "Entreprise": "ISHIZUKA GLASS CO., LTD."
    },
    {
      "Entreprise": "ISIS Inc"
    },
    {
      "Entreprise": "ISKO Denim"
    },
    {
      "Entreprise": "Íslandsbanki"
    },
    {
      "Entreprise": "ISS A/S"
    },
    {
      "Entreprise": "Isuzu Motors Limited"
    },
    {
      "Entreprise": "ITALBRONZE LTDA"
    },
    {
      "Entreprise": "Italmatch Chemicals spa"
    },
    {
      "Entreprise": "Italmobiliare"
    },
    {
      "Entreprise": "ITL Holdings Limited"
    },
    {
      "Entreprise": "Itochu Techno-Solutions"
    },
    {
      "Entreprise": "ITP Aero"
    },
    {
      "Entreprise": "ITR Concession Company LLC"
    },
    {
      "Entreprise": "Itron, inc."
    },
    {
      "Entreprise": "ITV"
    },
    {
      "Entreprise": "ITW Hi-Cone"
    },
    {
      "Entreprise": "Ivanhoé Cambridge"
    },
    {
      "Entreprise": "IVC Evidensia"
    },
    {
      "Entreprise": "Iveco Group N.V."
    },
    {
      "Entreprise": "Iver Management AB"
    },
    {
      "Entreprise": "Iwaki co.,ltd."
    },
    {
      "Entreprise": "IWATA&CO.,LTD"
    },
    {
      "Entreprise": "IWATANI JUUKEN Co.,Ltd."
    },
    {
      "Entreprise": "IWATSU ELECTRIC CO.,LTD."
    },
    {
      "Entreprise": "J Barbour & Sons Ltd"
    },
    {
      "Entreprise": "J C Bamford Excavators Ltd (JCB)"
    },
    {
      "Entreprise": "J McCann & Co Limited"
    },
    {
      "Entreprise": "J Murphy & Sons Ltd"
    },
    {
      "Entreprise": "J Sainsbury plc"
    },
    {
      "Entreprise": "J. FRONT RETAILING Co., Ltd."
    },
    {
      "Entreprise": "J.Crew Group"
    },
    {
      "Entreprise": "J.K. Cement Ltd."
    },
    {
      "Entreprise": "JA Solar Technology Co., Ltd."
    },
    {
      "Entreprise": "JAB Holding Company"
    },
    {
      "Entreprise": "Jabil Inc."
    },
    {
      "Entreprise": "Jack Henry and Associates, Inc."
    },
    {
      "Entreprise": "Jackson Family Holdings Limited"
    },
    {
      "Entreprise": "Jackson Family Wines"
    },
    {
      "Entreprise": "JACKY PERRENOT"
    },
    {
      "Entreprise": "Jacobs"
    },
    {
      "Entreprise": "Jacques Moret, Inc."
    },
    {
      "Entreprise": "Jacquet Brossard Distribution"
    },
    {
      "Entreprise": "Jacuzzi Brands"
    },
    {
      "Entreprise": "Jaguar Land Rover Automotive plc"
    },
    {
      "Entreprise": "JAI Overfladebehandling"
    },
    {
      "Entreprise": "James Tech Co., Ltd."
    },
    {
      "Entreprise": "Jamestown"
    },
    {
      "Entreprise": "Jan De Nul Group"
    },
    {
      "Entreprise": "Japan Airlines Co., Ltd."
    },
    {
      "Entreprise": "Japan Carbon Management Co., Ltd."
    },
    {
      "Entreprise": "Japan Elevator Service Holdings Co., Ltd."
    },
    {
      "Entreprise": "Japan Logistics Fund, Inc."
    },
    {
      "Entreprise": "Japan Prime Realty Investment Corporation"
    },
    {
      "Entreprise": "Japan Real Estate Investment Corporation"
    },
    {
      "Entreprise": "Japan Tobacco Inc."
    },
    {
      "Entreprise": "JAPAN.DELIVERY.SYSTEM"
    },
    {
      "Entreprise": "JB Financial Group Co., Ltd."
    },
    {
      "Entreprise": "JBA Group Limited"
    },
    {
      "Entreprise": "JBS"
    },
    {
      "Entreprise": "JCDecaux SA."
    },
    {
      "Entreprise": "JD Components Co., Ltd."
    },
    {
      "Entreprise": "JD Logistics"
    },
    {
      "Entreprise": "JD Sports Fashion PLC"
    },
    {
      "Entreprise": "JDC CORPORATION"
    },
    {
      "Entreprise": "JDE Peet’s N.V."
    },
    {
      "Entreprise": "JDR Cable Systems Limited"
    },
    {
      "Entreprise": "JENEX CO., LTD."
    },
    {
      "Entreprise": "Jerónimo Martins - SGPS, S.A."
    },
    {
      "Entreprise": "JetBlue Airways Corporation"
    },
    {
      "Entreprise": "Jia Hsin Co., Ltd"
    },
    {
      "Entreprise": "Jiangsu Bono Casting        Co., Ltd."
    },
    {
      "Entreprise": "JIANGSU HONGBANG CHEMICAL TECHNOLOGY CO., LTD"
    },
    {
      "Entreprise": "Jiangsu Pacific Quartz Co., Ltd."
    },
    {
      "Entreprise": "Jiangyin Boway Machinery Complete Equipment Co., Ltd"
    },
    {
      "Entreprise": "Jigsaw Systems Ltd"
    },
    {
      "Entreprise": "Jinan Faithcast Machinery Co.,Ltd."
    },
    {
      "Entreprise": "JinkoSolar Co., Ltd"
    },
    {
      "Entreprise": "Jintuo Technology Co.,Ltd."
    },
    {
      "Entreprise": "JK Lakshmi Cement Limited"
    },
    {
      "Entreprise": "JK Tyre & Industries Ltd"
    },
    {
      "Entreprise": "JLL"
    },
    {
      "Entreprise": "JM Baxi Ports & Logistics Limited"
    },
    {
      "Entreprise": "JMB Wind Engineering"
    },
    {
      "Entreprise": "Johannes Pedersen a/s"
    },
    {
      "Entreprise": "John F Hunt Ltd"
    },
    {
      "Entreprise": "John Lewis Partnership"
    },
    {
      "Entreprise": "John Mattson Fastighetsföretagen AB"
    },
    {
      "Entreprise": "John Menzies plc"
    },
    {
      "Entreprise": "John Sisk & Son"
    },
    {
      "Entreprise": "John Wiley & Son, Inc."
    },
    {
      "Entreprise": "Johnson & Johnson"
    },
    {
      "Entreprise": "Johnson Controls International plc"
    },
    {
      "Entreprise": "Johnson Electric"
    },
    {
      "Entreprise": "Johnson Matthey Plc"
    },
    {
      "Entreprise": "Johnsonville LLC"
    },
    {
      "Entreprise": "Jokey SE"
    },
    {
      "Entreprise": "JORTON A/S"
    },
    {
      "Entreprise": "José Combalia, S.A."
    },
    {
      "Entreprise": "Joshin Denki Co.,Ltd."
    },
    {
      "Entreprise": "JP/Politikens Hus A/S"
    },
    {
      "Entreprise": "JSW Cement"
    },
    {
      "Entreprise": "JSW Energy Limited"
    },
    {
      "Entreprise": "JT Group Limited"
    },
    {
      "Entreprise": "Juan José Albarracin S.A."
    },
    {
      "Entreprise": "Jules"
    },
    {
      "Entreprise": "Julie Sandlau Vietnam. ltd"
    },
    {
      "Entreprise": "Julius Baer Group Ltd."
    },
    {
      "Entreprise": "Julius Rutherfoord & Co Ltd"
    },
    {
      "Entreprise": "Jumbo"
    },
    {
      "Entreprise": "Jungbunzlauer International AG"
    },
    {
      "Entreprise": "Jungheinrich AG"
    },
    {
      "Entreprise": "Jupiter Bach"
    },
    {
      "Entreprise": "Just Group Plc"
    },
    {
      "Entreprise": "Juustoportti Group"
    },
    {
      "Entreprise": "Jysk Display A/S"
    },
    {
      "Entreprise": "K-9 Internacional"
    },
    {
      "Entreprise": "K-tronics(Su Zhou)  Technology Co.,LTD"
    },
    {
      "Entreprise": "K2A Knaust & Andersson"
    },
    {
      "Entreprise": "Kabbara LLC."
    },
    {
      "Entreprise": "Kagome Co., Ltd."
    },
    {
      "Entreprise": "Kährs Group"
    },
    {
      "Entreprise": "KAIHO INDUSTRY CO., LTD.,"
    },
    {
      "Entreprise": "Kainos Group plc"
    },
    {
      "Entreprise": "Kajikei Iron Works Co.,Ltd."
    },
    {
      "Entreprise": "Kajima Corporation"
    },
    {
      "Entreprise": "Kakao"
    },
    {
      "Entreprise": "Kalkancı Pres Döküm ve Kalıp San. Tic. A.Ş."
    },
    {
      "Entreprise": "Kallista Energy"
    },
    {
      "Entreprise": "Kalsec, Inc."
    },
    {
      "Entreprise": "Kaluza Ltd"
    },
    {
      "Entreprise": "Kamstrup A/S"
    },
    {
      "Entreprise": "Kanda Printing Industry Co., Ltd."
    },
    {
      "Entreprise": "Kaneyoshi Corporation"
    },
    {
      "Entreprise": "Kankyo Shuzo Co., LTD."
    },
    {
      "Entreprise": "Kansai Nerolac Paints Limited"
    },
    {
      "Entreprise": "Kansas City Southern"
    },
    {
      "Entreprise": "Kanto Construction Co., Ltd."
    },
    {
      "Entreprise": "KANUC CO.,LTD"
    },
    {
      "Entreprise": "KAO Corporation"
    },
    {
      "Entreprise": "Kappahl AB"
    },
    {
      "Entreprise": "Karndean Holdings Limited"
    },
    {
      "Entreprise": "Kartikeya International"
    },
    {
      "Entreprise": "Kasugai material transportation ltd."
    },
    {
      "Entreprise": "KATAGIRI MEIMOKU KOGYO CO.,LTD"
    },
    {
      "Entreprise": "Kaufman & Broad"
    },
    {
      "Entreprise": "Kautex Textron"
    },
    {
      "Entreprise": "Kawada Feather Co.,Ltd."
    },
    {
      "Entreprise": "Kawamura Sangyo Co.,Ltd."
    },
    {
      "Entreprise": "Kawasaki Kisen Kaisha, Ltd."
    },
    {
      "Entreprise": "Kawase Plastic Industry Co.,Ltd."
    },
    {
      "Entreprise": "KAWASHIMA CO.,LTD."
    },
    {
      "Entreprise": "Kay & Emms (Pvt) Ltd"
    },
    {
      "Entreprise": "Kayahan Makine Hidrolik A.Ş."
    },
    {
      "Entreprise": "Kayama Kogyo Co.,Ltd."
    },
    {
      "Entreprise": "Kayser Automotive Group"
    },
    {
      "Entreprise": "KAYSERİ ULAŞIM A.Ş."
    },
    {
      "Entreprise": "KB Financial Group"
    },
    {
      "Entreprise": "KB Home"
    },
    {
      "Entreprise": "KBC Bank NV incl. consolidated entities"
    },
    {
      "Entreprise": "KBR, Inc."
    },
    {
      "Entreprise": "KDC CORPORATION"
    },
    {
      "Entreprise": "KDDI Corporation"
    },
    {
      "Entreprise": "KDS GARMENTS INDUSTRIES LTD."
    },
    {
      "Entreprise": "Kearney"
    },
    {
      "Entreprise": "Keelings"
    },
    {
      "Entreprise": "Keepmoat Homes"
    },
    {
      "Entreprise": "Keflico A/S"
    },
    {
      "Entreprise": "Keihanshin Building Co.,Ltd."
    },
    {
      "Entreprise": "Kekén"
    },
    {
      "Entreprise": "KELAG-Kärntner Elektrizitäts-Aktiengesellschaft"
    },
    {
      "Entreprise": "Kelani Valley Plantations"
    },
    {
      "Entreprise": "Kellogg Company"
    },
    {
      "Entreprise": "Keltbray Group"
    },
    {
      "Entreprise": "Kemin Industries, Inc."
    },
    {
      "Entreprise": "Kemira Oyj"
    },
    {
      "Entreprise": "Kenedix Office Investment Corporation"
    },
    {
      "Entreprise": "Kennedys Law LLP"
    },
    {
      "Entreprise": "Kenya Electricity Generating Company PLC"
    },
    {
      "Entreprise": "Keolis"
    },
    {
      "Entreprise": "Kepak Group"
    },
    {
      "Entreprise": "Keppel Land"
    },
    {
      "Entreprise": "Kering"
    },
    {
      "Entreprise": "Kerry Airport PLC"
    },
    {
      "Entreprise": "Kerry Group PLC"
    },
    {
      "Entreprise": "Kerry Properties Limited"
    },
    {
      "Entreprise": "Kerschgens Werkstoffe & Mehr GmbH"
    },
    {
      "Entreprise": "Kersia"
    },
    {
      "Entreprise": "Kesko Corporation"
    },
    {
      "Entreprise": "Kettle Produce Limited"
    },
    {
      "Entreprise": "Keurig Dr Pepper"
    },
    {
      "Entreprise": "Keysight Technologies"
    },
    {
      "Entreprise": "KFC UK & Ireland"
    },
    {
      "Entreprise": "Kid ASA"
    },
    {
      "Entreprise": "Kier Group plc"
    },
    {
      "Entreprise": "Kier Highways Limited"
    },
    {
      "Entreprise": "Kiilto"
    },
    {
      "Entreprise": "Kikkoman Corporation"
    },
    {
      "Entreprise": "KILOUTOU"
    },
    {
      "Entreprise": "Kilroy Realty Corporation"
    },
    {
      "Entreprise": "Kimberly-Clark Corporation"
    },
    {
      "Entreprise": "Kimco Realty Corporation"
    },
    {
      "Entreprise": "Kindred Group plc"
    },
    {
      "Entreprise": "King & Wood Mallesons, Australia"
    },
    {
      "Entreprise": "Kingfisher"
    },
    {
      "Entreprise": "KINGS INTERNATIONAL LTD"
    },
    {
      "Entreprise": "Kingspan Group Plc"
    },
    {
      "Entreprise": "Kinsale Bay Food Company"
    },
    {
      "Entreprise": "KIRCHHOFF Automotive GmbH"
    },
    {
      "Entreprise": "Kirin Holdings Co Ltd"
    },
    {
      "Entreprise": "KIRKBI A/S"
    },
    {
      "Entreprise": "KISO A/S"
    },
    {
      "Entreprise": "Kisyou Co., Ltd."
    },
    {
      "Entreprise": "KIWAGUMI Co.,Ltd."
    },
    {
      "Entreprise": "Kiwi Property Group"
    },
    {
      "Entreprise": "Kizilay İçecek"
    },
    {
      "Entreprise": "Klabin S.A."
    },
    {
      "Entreprise": "Klépierre"
    },
    {
      "Entreprise": "Klimasan AŞ"
    },
    {
      "Entreprise": "KLM Royal Dutch Airlines"
    },
    {
      "Entreprise": "Klöckner & Co"
    },
    {
      "Entreprise": "Klockner Pentaplast"
    },
    {
      "Entreprise": "KLP"
    },
    {
      "Entreprise": "KME Germany GmbH"
    },
    {
      "Entreprise": "KMEW Co.,Ltd"
    },
    {
      "Entreprise": "Knight Frank LLP (UK)"
    },
    {
      "Entreprise": "Knights Brown"
    },
    {
      "Entreprise": "Knowit Group"
    },
    {
      "Entreprise": "KO2 Consulting LLC"
    },
    {
      "Entreprise": "KOBAYASHI PHARMACEUTICAL CO., LTD."
    },
    {
      "Entreprise": "KOCEL MACHINERY LIMITED"
    },
    {
      "Entreprise": "KOCEL STEEL FOUNDRY CO., LTD"
    },
    {
      "Entreprise": "Koei Shoji Co., Ltd."
    },
    {
      "Entreprise": "Kohl's, Inc."
    },
    {
      "Entreprise": "KOKUBO-HD CO., LTD."
    },
    {
      "Entreprise": "Kokufu Printing Co., Ltd."
    },
    {
      "Entreprise": "Kokusai Kogyo Co., Ltd"
    },
    {
      "Entreprise": "Kolektor Mobility d.o.o."
    },
    {
      "Entreprise": "Kollergang nv"
    },
    {
      "Entreprise": "Kolon Industries, INC."
    },
    {
      "Entreprise": "Komatsu Ltd."
    },
    {
      "Entreprise": "kondou tekkin CO., LTD."
    },
    {
      "Entreprise": "KONE Corporation"
    },
    {
      "Entreprise": "Konecranes Oyj"
    },
    {
      "Entreprise": "Kongsberg Gruppen ASA"
    },
    {
      "Entreprise": "Konica Minolta, Inc."
    },
    {
      "Entreprise": "Koninklijke Ahold Delhaize N.V."
    },
    {
      "Entreprise": "Koninklijke KPN NV (Royal KPN)"
    },
    {
      "Entreprise": "Koninklijke Paardekooper Group"
    },
    {
      "Entreprise": "Koninklijke Vezet B.V."
    },
    {
      "Entreprise": "Kontoor Brands"
    },
    {
      "Entreprise": "Körber AG"
    },
    {
      "Entreprise": "Kordsa Teknik Tekstil A.Ş"
    },
    {
      "Entreprise": "Korea Agro-Fisheries & Food Trade Corporation"
    },
    {
      "Entreprise": "KOSÉ Corporation"
    },
    {
      "Entreprise": "Koskela Pty Limited"
    },
    {
      "Entreprise": "Kowa Seisakusyo Co.,Ltd."
    },
    {
      "Entreprise": "KOYOSHA INC."
    },
    {
      "Entreprise": "KPMG Holding"
    },
    {
      "Entreprise": "KPMG International Limited"
    },
    {
      "Entreprise": "KPMG Ireland"
    },
    {
      "Entreprise": "KPMG UK LLP"
    },
    {
      "Entreprise": "Kraiburg Austria"
    },
    {
      "Entreprise": "Krones AG"
    },
    {
      "Entreprise": "KronosNet Topco, SL"
    },
    {
      "Entreprise": "Krummen Kerzers AG"
    },
    {
      "Entreprise": "KT&G Corporation"
    },
    {
      "Entreprise": "Kubrick Group Limited"
    },
    {
      "Entreprise": "Kuehne + Nagel International AG"
    },
    {
      "Entreprise": "Kumagai Gumi Co., Ltd."
    },
    {
      "Entreprise": "Kumho Tire Co., Inc."
    },
    {
      "Entreprise": "Kungsleden AB"
    },
    {
      "Entreprise": "KUNSHAN GAUCHEN PRECISION MACHINERY&ELECTRICAL CO., LTD."
    },
    {
      "Entreprise": "Kunshan JC Industrial Technology Co., Ltd."
    },
    {
      "Entreprise": "Kvadrat A/S"
    },
    {
      "Entreprise": "Kyndryl"
    },
    {
      "Entreprise": "KYOAI Corporation"
    },
    {
      "Entreprise": "KYOCERA Corporation"
    },
    {
      "Entreprise": "Kyodo Denshi Kogyo Inc."
    },
    {
      "Entreprise": "KYOHATSU INDUSTRY Co., Ltd."
    },
    {
      "Entreprise": "KYOTECH Co., Ltd."
    },
    {
      "Entreprise": "Kyushu Electric Power Company, Incorporated"
    },
    {
      "Entreprise": "L&T Technology Services Limited (LTTS)"
    },
    {
      "Entreprise": "L'OCCITANE INTERNATIONAL SA"
    },
    {
      "Entreprise": "L'Oréal"
    },
    {
      "Entreprise": "L. Priebs GmbH & Co. KG"
    },
    {
      "Entreprise": "L.E. Vegetables Company Aktiebolag"
    },
    {
      "Entreprise": "L.E.K. Consulting"
    },
    {
      "Entreprise": "La Banque Postale"
    },
    {
      "Entreprise": "La Coop Conseil"
    },
    {
      "Entreprise": "La Française des jeux (FDJ)"
    },
    {
      "Entreprise": "La Lorraine Bakery Group"
    },
    {
      "Entreprise": "La Poste SA"
    },
    {
      "Entreprise": "La-Z-Boy Incorporated"
    },
    {
      "Entreprise": "Labcorp"
    },
    {
      "Entreprise": "Labelium"
    },
    {
      "Entreprise": "Labelmakers Group Australia"
    },
    {
      "Entreprise": "Labeyrie Fine Foods"
    },
    {
      "Entreprise": "Lacoste"
    },
    {
      "Entreprise": "LACROIX GROUP"
    },
    {
      "Entreprise": "Lactalis"
    },
    {
      "Entreprise": "Lactoprot Deutschland GmbH"
    },
    {
      "Entreprise": "Lagan Aviation & Infrastructure"
    },
    {
      "Entreprise": "LAIQON AG"
    },
    {
      "Entreprise": "Lam Research Corporation"
    },
    {
      "Entreprise": "Lamb Weston / Meijer vof"
    },
    {
      "Entreprise": "Lamb Weston Holdings"
    },
    {
      "Entreprise": "Lami Packaging（Kunshan）Co., Ltd."
    },
    {
      "Entreprise": "Lamington Group"
    },
    {
      "Entreprise": "Lancer Corporation"
    },
    {
      "Entreprise": "Land O'Lakes, Inc."
    },
    {
      "Entreprise": "Landgard Obst & Gemüse GmbH & Co.KG"
    },
    {
      "Entreprise": "Landis+Gyr Group AG"
    },
    {
      "Entreprise": "Landmark Information Group"
    },
    {
      "Entreprise": "Landsbankinn hf."
    },
    {
      "Entreprise": "Landsec"
    },
    {
      "Entreprise": "Lansinoh Laboratories Inc"
    },
    {
      "Entreprise": "Lantmännen Cerealia"
    },
    {
      "Entreprise": "Lantmännen Unibake"
    },
    {
      "Entreprise": "LANXESS AG"
    },
    {
      "Entreprise": "Lars Partners"
    },
    {
      "Entreprise": "Larsen & Toubro Infotech Ltd."
    },
    {
      "Entreprise": "Las Vegas Sands Corp"
    },
    {
      "Entreprise": "Lassila & Tikanoja plc"
    },
    {
      "Entreprise": "LATAM Airlines Group S.A."
    },
    {
      "Entreprise": "Latham & Watkins LLP"
    },
    {
      "Entreprise": "Lawson,Inc."
    },
    {
      "Entreprise": "LC Packaging International BV"
    },
    {
      "Entreprise": "LCL NV"
    },
    {
      "Entreprise": "Le Bélier"
    },
    {
      "Entreprise": "League, Inc."
    },
    {
      "Entreprise": "Leap Media LTD"
    },
    {
      "Entreprise": "Lear Corporation"
    },
    {
      "Entreprise": "LeasePlan Corporation N.V."
    },
    {
      "Entreprise": "LEAX Group AB"
    },
    {
      "Entreprise": "LEDVANCE"
    },
    {
      "Entreprise": "Leeson Claims Services Ltd"
    },
    {
      "Entreprise": "LEG Immobilien SE"
    },
    {
      "Entreprise": "Legacy Vacation Resorts"
    },
    {
      "Entreprise": "Legal & General America (Banner Life Assurance Company)"
    },
    {
      "Entreprise": "Legal & General Assurance Society"
    },
    {
      "Entreprise": "Legal & General Capital Investments Limited"
    },
    {
      "Entreprise": "Legal & General Reinsurance"
    },
    {
      "Entreprise": "LEGERO Schuhfabrik Gesellschaft m.b.H."
    },
    {
      "Entreprise": "Legrand"
    },
    {
      "Entreprise": "Leipziger Logistik & Lagerhaus Südwest GmbH"
    },
    {
      "Entreprise": "Lemvigh Müller"
    },
    {
      "Entreprise": "Lendlease"
    },
    {
      "Entreprise": "Lennox International Inc."
    },
    {
      "Entreprise": "Lenovo Group Limited"
    },
    {
      "Entreprise": "Lenzing AG"
    },
    {
      "Entreprise": "Leo Group LTD"
    },
    {
      "Entreprise": "LEO Pharma A/S"
    },
    {
      "Entreprise": "Leoch International Technology Limited"
    },
    {
      "Entreprise": "Leonardo"
    },
    {
      "Entreprise": "Leroy Merlin Companhia Brasileira de Bricolagem"
    },
    {
      "Entreprise": "Lerøy Seafood Group ASA"
    },
    {
      "Entreprise": "Leverage Limited"
    },
    {
      "Entreprise": "Levi Strauss & Co."
    },
    {
      "Entreprise": "Leviat Limited"
    },
    {
      "Entreprise": "Lewis Silkin"
    },
    {
      "Entreprise": "Lexmark International, Inc."
    },
    {
      "Entreprise": "LF Logistics Management Limited"
    },
    {
      "Entreprise": "LG Chem"
    },
    {
      "Entreprise": "LG Electronics Inc."
    },
    {
      "Entreprise": "LG Innotek"
    },
    {
      "Entreprise": "Li & Fung Trading Limited"
    },
    {
      "Entreprise": "Lianhe Chemical Technology(Taizhou) Co.,Ltd."
    },
    {
      "Entreprise": "Libeert Belgian Chocolate Creators"
    },
    {
      "Entreprise": "Liberty Global"
    },
    {
      "Entreprise": "Liberty Mills Limited"
    },
    {
      "Entreprise": "Lidl Belgium GmbH. & Co. KG"
    },
    {
      "Entreprise": "Lifestraw"
    },
    {
      "Entreprise": "Lightsource bp"
    },
    {
      "Entreprise": "Lime (Neutron Holdings dba Lime)"
    },
    {
      "Entreprise": "LINAK"
    },
    {
      "Entreprise": "Linbrooke Services Ltd"
    },
    {
      "Entreprise": "Lincolnshire Co-operative Limited"
    },
    {
      "Entreprise": "Lindab International AB"
    },
    {
      "Entreprise": "Linde plc"
    },
    {
      "Entreprise": "Linden Foods"
    },
    {
      "Entreprise": "Lindström Group"
    },
    {
      "Entreprise": "Lineas NV"
    },
    {
      "Entreprise": "Link Logistics Real Estate"
    },
    {
      "Entreprise": "Link Real Estate Investment Trust"
    },
    {
      "Entreprise": "Linklaters LLP"
    },
    {
      "Entreprise": "Lintex AB"
    },
    {
      "Entreprise": "Linyi Lingong Machinery Group"
    },
    {
      "Entreprise": "Lion Corporation"
    },
    {
      "Entreprise": "Lionbridge Financing Leasing (China) Co., Ltd"
    },
    {
      "Entreprise": "LITE-ON technology corp."
    },
    {
      "Entreprise": "Litens Automotive Group"
    },
    {
      "Entreprise": "Livent"
    },
    {
      "Entreprise": "LIVEO RESEARCH AG"
    },
    {
      "Entreprise": "Living Tomorrow NV"
    },
    {
      "Entreprise": "LIXIL Group Corporation"
    },
    {
      "Entreprise": "LKQ Corporation"
    },
    {
      "Entreprise": "LLC \"GREEN COOL\" (UBC Group)"
    },
    {
      "Entreprise": "Lloyd’s Register"
    },
    {
      "Entreprise": "Loblaw Companies Limited"
    },
    {
      "Entreprise": "Lockton Companies LLP"
    },
    {
      "Entreprise": "Lockton Re LLP"
    },
    {
      "Entreprise": "Logicalis Group Limited"
    },
    {
      "Entreprise": "Logicor Europe PLC"
    },
    {
      "Entreprise": "Logista"
    },
    {
      "Entreprise": "Logitech International"
    },
    {
      "Entreprise": "LOGO tape Vertrieb GmbH"
    },
    {
      "Entreprise": "Logoplaste"
    },
    {
      "Entreprise": "Lojas Renner S.A."
    },
    {
      "Entreprise": "Lojas Riachuelo S/A"
    },
    {
      "Entreprise": "LOM Architecture"
    },
    {
      "Entreprise": "London Metal Exchange"
    },
    {
      "Entreprise": "London Stock Exchange Group PLC"
    },
    {
      "Entreprise": "LONG WAY ENTERPRISE CO., LTD."
    },
    {
      "Entreprise": "Lonsdale"
    },
    {
      "Entreprise": "Lopez Foods"
    },
    {
      "Entreprise": "Lorenz Group"
    },
    {
      "Entreprise": "Los Angeles Department of Water and Power"
    },
    {
      "Entreprise": "LOTTE CO., LTD."
    },
    {
      "Entreprise": "LOTTE SHOPPING Co., Ltd."
    },
    {
      "Entreprise": "Lotus Bakeries NV"
    },
    {
      "Entreprise": "Louis Vuitton Malletier"
    },
    {
      "Entreprise": "Lowe's Companies, Inc."
    },
    {
      "Entreprise": "Loxam"
    },
    {
      "Entreprise": "LOYALTEXTILE MILLS LIMITED"
    },
    {
      "Entreprise": "Lozier Corporation"
    },
    {
      "Entreprise": "lpm production"
    },
    {
      "Entreprise": "LPP S.A."
    },
    {
      "Entreprise": "LSTH Svenska Handelsfastigheter AB"
    },
    {
      "Entreprise": "LTP Group A/S"
    },
    {
      "Entreprise": "LTS Lohmann Therapie-Systeme AG"
    },
    {
      "Entreprise": "Luceco plc"
    },
    {
      "Entreprise": "Lucky Textile Mills Ltd"
    },
    {
      "Entreprise": "Lufthansa Group"
    },
    {
      "Entreprise": "Luis Simões, S.G.P.S., S.A."
    },
    {
      "Entreprise": "LUKER AGRÍCOLA"
    },
    {
      "Entreprise": "lululemon"
    },
    {
      "Entreprise": "Lumen Technologies, Inc."
    },
    {
      "Entreprise": "Lumentum Holdings Inc"
    },
    {
      "Entreprise": "Luminor Bank AS"
    },
    {
      "Entreprise": "Lundbeck A/S"
    },
    {
      "Entreprise": "LUSH Handmade Cosmetics"
    },
    {
      "Entreprise": "Lux Research, Inc."
    },
    {
      "Entreprise": "Luxshare Precision Industry Co.,Ltd"
    },
    {
      "Entreprise": "LVMH"
    },
    {
      "Entreprise": "Lyft, Inc."
    },
    {
      "Entreprise": "LYMI, Inc. DBA Reformation"
    },
    {
      "Entreprise": "LyondellBasell Industries N.V."
    },
    {
      "Entreprise": "Lyons & Annoot Limited"
    },
    {
      "Entreprise": "LYRECO"
    },
    {
      "Entreprise": "M Group Services Ltd"
    },
    {
      "Entreprise": "M&C Saatchi PLC."
    },
    {
      "Entreprise": "M/s Recruitment Cell"
    },
    {
      "Entreprise": "M1 Limited"
    },
    {
      "Entreprise": "Ma'aden Aluminum"
    },
    {
      "Entreprise": "MAAL Associates, LLC"
    },
    {
      "Entreprise": "MacArthur Green"
    },
    {
      "Entreprise": "MaCher (USA) Inc."
    },
    {
      "Entreprise": "Machi Mirai Seisakusyo Co., Ltd."
    },
    {
      "Entreprise": "Macintyre Hudson LLP"
    },
    {
      "Entreprise": "Macmillan Publishers Inc."
    },
    {
      "Entreprise": "Macrotech Developers Limited"
    },
    {
      "Entreprise": "Macy's, Inc."
    },
    {
      "Entreprise": "Mäder Group"
    },
    {
      "Entreprise": "Maeda Corporation"
    },
    {
      "Entreprise": "Maersk"
    },
    {
      "Entreprise": "Magazine de Bijenkorf B.V."
    },
    {
      "Entreprise": "Magna International"
    },
    {
      "Entreprise": "Magnit Global"
    },
    {
      "Entreprise": "Magnolia Bostad AB"
    },
    {
      "Entreprise": "Magyar Telekom Plc."
    },
    {
      "Entreprise": "Mahindra & Mahindra Financial Services Limited"
    },
    {
      "Entreprise": "Mahindra & Mahindra Limited"
    },
    {
      "Entreprise": "Mahindra Accelo"
    },
    {
      "Entreprise": "Mahindra Automotive Australia Pty Ltd"
    },
    {
      "Entreprise": "Mahindra Automotive North America"
    },
    {
      "Entreprise": "Mahindra Electric Mobility Limited"
    },
    {
      "Entreprise": "Mahindra EPC Irrigation Limited"
    },
    {
      "Entreprise": "Mahindra First Choice Services Ltd."
    },
    {
      "Entreprise": "Mahindra Heavy Engines Ltd"
    },
    {
      "Entreprise": "Mahindra Holidays and Resorts India Limited"
    },
    {
      "Entreprise": "Mahindra Lifespaces Developers Limited"
    },
    {
      "Entreprise": "Mahindra Logistics Ltd."
    },
    {
      "Entreprise": "Mahindra Sanyo Special Steel"
    },
    {
      "Entreprise": "Mahindra USA, Inc."
    },
    {
      "Entreprise": "Mahindra World City (Jaipur) Ltd."
    },
    {
      "Entreprise": "Mahindra World City Developers Ltd"
    },
    {
      "Entreprise": "MAHLE GmbH"
    },
    {
      "Entreprise": "Mahmood Group"
    },
    {
      "Entreprise": "Maintel Holdings Plc"
    },
    {
      "Entreprise": "Maisons du Monde"
    },
    {
      "Entreprise": "Majid Al Futtaim LEC"
    },
    {
      "Entreprise": "Majid Al Futtaim Lifestyle"
    },
    {
      "Entreprise": "Majid Al Futtaim Properties"
    },
    {
      "Entreprise": "Majid Al Futtaim Retail"
    },
    {
      "Entreprise": "MAKE UP FOR EVER"
    },
    {
      "Entreprise": "MAKROCHEM S.A."
    },
    {
      "Entreprise": "Malaysian Resources Corporation Berhad"
    },
    {
      "Entreprise": "MALHERBE"
    },
    {
      "Entreprise": "Malmö Lastbilcentral AB"
    },
    {
      "Entreprise": "Mambu"
    },
    {
      "Entreprise": "Mammut Sports Group"
    },
    {
      "Entreprise": "MAN Truck & Bus SE"
    },
    {
      "Entreprise": "Mandai Wildlife Group"
    },
    {
      "Entreprise": "MANE"
    },
    {
      "Entreprise": "Mango Punto Fa, SL"
    },
    {
      "Entreprise": "Manitou Group"
    },
    {
      "Entreprise": "Mann & Schröder GmbH"
    },
    {
      "Entreprise": "Mannheimer Swartling"
    },
    {
      "Entreprise": "Manni Group SpA"
    },
    {
      "Entreprise": "Mannion Daniels Limited"
    },
    {
      "Entreprise": "ManoMano (Colibri SAS)"
    },
    {
      "Entreprise": "ManpowerGroup Inc."
    },
    {
      "Entreprise": "Mantis World Ltd"
    },
    {
      "Entreprise": "Mantu"
    },
    {
      "Entreprise": "Manuchar NV"
    },
    {
      "Entreprise": "Manulife Financial Corporation"
    },
    {
      "Entreprise": "Manutan International"
    },
    {
      "Entreprise": "Maple Leaf Foods Inc."
    },
    {
      "Entreprise": "Marel"
    },
    {
      "Entreprise": "Marfrig Global Foods S.A."
    },
    {
      "Entreprise": "Marimekko Corporation"
    },
    {
      "Entreprise": "Maritime Transport Ltd"
    },
    {
      "Entreprise": "Marks & Spencer"
    },
    {
      "Entreprise": "Marmon Foodservice Technologies, Inc."
    },
    {
      "Entreprise": "Marriott International"
    },
    {
      "Entreprise": "Mars"
    },
    {
      "Entreprise": "Marsh McLennan"
    },
    {
      "Entreprise": "Marshalls plc"
    },
    {
      "Entreprise": "Martin & Servera-gruppen"
    },
    {
      "Entreprise": "MARTO Co.,Ltd."
    },
    {
      "Entreprise": "MARUI GROUP CO.,LTD."
    },
    {
      "Entreprise": "MARUICHI SELLING INC."
    },
    {
      "Entreprise": "MARUKI SANGYO Co.,LTD."
    },
    {
      "Entreprise": "MARUTOU CO., LTD."
    },
    {
      "Entreprise": "Maruwa Co., Ltd."
    },
    {
      "Entreprise": "Maruyou Kensetu Co., Ltd."
    },
    {
      "Entreprise": "Marvell Technologies"
    },
    {
      "Entreprise": "MAS Capital Ptv Ltd."
    },
    {
      "Entreprise": "MASISA"
    },
    {
      "Entreprise": "Masood Roomi"
    },
    {
      "Entreprise": "Mass General Brigham"
    },
    {
      "Entreprise": "Mastercard"
    },
    {
      "Entreprise": "Masterpiece Valuation Advisory Limited"
    },
    {
      "Entreprise": "Masudaki Co.,Ltd."
    },
    {
      "Entreprise": "Match Group"
    },
    {
      "Entreprise": "Material Bank"
    },
    {
      "Entreprise": "Materialise N.V."
    },
    {
      "Entreprise": "Matkahuolto"
    },
    {
      "Entreprise": "MATSEN CHEMIE AG"
    },
    {
      "Entreprise": "MATSUDA SANGYO Co.,Ltd."
    },
    {
      "Entreprise": "Matsuoka Special Steel Co., Ltd."
    },
    {
      "Entreprise": "Mattos Filho, Veiga Filho, Marrey Jr and Quiroga Advogados"
    },
    {
      "Entreprise": "Mavi Giyim Sanayi ve Ticaret A.Ş."
    },
    {
      "Entreprise": "Max Fordham LLP"
    },
    {
      "Entreprise": "MAXIMA GRUPE, UAB"
    },
    {
      "Entreprise": "May You Corporation"
    },
    {
      "Entreprise": "Mayer-network"
    },
    {
      "Entreprise": "Mayr-Melnhof Karton AG"
    },
    {
      "Entreprise": "Mazars SC"
    },
    {
      "Entreprise": "mBank S.A"
    },
    {
      "Entreprise": "MBH Corporation Plc"
    },
    {
      "Entreprise": "MC Retail, SGPS S.A."
    },
    {
      "Entreprise": "McAleer & Rushe Contracts UK Ltd"
    },
    {
      "Entreprise": "MCC Label"
    },
    {
      "Entreprise": "McCain Foods Limited"
    },
    {
      "Entreprise": "McCann Worldgroup"
    },
    {
      "Entreprise": "McCormick & Company, Incorporated"
    },
    {
      "Entreprise": "McDonald's Corporation"
    },
    {
      "Entreprise": "McGinley Support Services (Infrastructure) Limited"
    },
    {
      "Entreprise": "MCH Group AG"
    },
    {
      "Entreprise": "McKesson Corporation"
    },
    {
      "Entreprise": "McKinsey & Company, Inc."
    },
    {
      "Entreprise": "McLaren Racing Limited"
    },
    {
      "Entreprise": "MCM"
    },
    {
      "Entreprise": "MDT technologies GmbH"
    },
    {
      "Entreprise": "Meadow Foods Limited"
    },
    {
      "Entreprise": "MEANINGS CAPITAL PARTNERS"
    },
    {
      "Entreprise": "Meat For You S.A."
    },
    {
      "Entreprise": "MEC Mountain Equipment Company"
    },
    {
      "Entreprise": "MECC Maastricht"
    },
    {
      "Entreprise": "Media6"
    },
    {
      "Entreprise": "Mediabrands Limited"
    },
    {
      "Entreprise": "Mediahuis"
    },
    {
      "Entreprise": "Mediaset España Comunicación S.A."
    },
    {
      "Entreprise": "medmix Group AG"
    },
    {
      "Entreprise": "Medtronic PLC"
    },
    {
      "Entreprise": "Mega Financial Holding Company"
    },
    {
      "Entreprise": "Meggitt PLC"
    },
    {
      "Entreprise": "MEIDENSHA CORPORATION"
    },
    {
      "Entreprise": "Meiji Holdings Co., Ltd.f"
    },
    {
      "Entreprise": "Meikou Co.,Ltd."
    },
    {
      "Entreprise": "Meinhardt Group International Limited"
    },
    {
      "Entreprise": "Meira Oy"
    },
    {
      "Entreprise": "MEKO AB"
    },
    {
      "Entreprise": "Melia Hotels International SA"
    },
    {
      "Entreprise": "Melita Limited"
    },
    {
      "Entreprise": "Menzies Distribution Ltd."
    },
    {
      "Entreprise": "Mercado Libre"
    },
    {
      "Entreprise": "Mercadona"
    },
    {
      "Entreprise": "Mercari, Inc."
    },
    {
      "Entreprise": "Mercedes-Benz AG"
    },
    {
      "Entreprise": "Mercedes-Benz Grand Prix Ltd"
    },
    {
      "Entreprise": "Mercer International"
    },
    {
      "Entreprise": "MERCIALYS"
    },
    {
      "Entreprise": "Merck & Co., Inc., Rahway, NJ USA,  which is known as MSD outside the U.S. and Canada"
    },
    {
      "Entreprise": "Merck KGaA"
    },
    {
      "Entreprise": "Mercury Engineering"
    },
    {
      "Entreprise": "Meridian Energy"
    },
    {
      "Entreprise": "MERINO INDUSTRIES LTD."
    },
    {
      "Entreprise": "Merkur Andelskasse"
    },
    {
      "Entreprise": "MERLIN Properties SOCIMI, S.A."
    },
    {
      "Entreprise": "MERLIN Properties SOCIMI, SA"
    },
    {
      "Entreprise": "Metalfrio Solutions S.A."
    },
    {
      "Entreprise": "Metalsa S.A.P.I. de C.V."
    },
    {
      "Entreprise": "MetLife, Inc."
    },
    {
      "Entreprise": "Metlifecare"
    },
    {
      "Entreprise": "Metrics Credit Partners"
    },
    {
      "Entreprise": "Metro AG"
    },
    {
      "Entreprise": "Metrolina Greenhouses Inc"
    },
    {
      "Entreprise": "Metsä Board Corporation"
    },
    {
      "Entreprise": "Metso Outotec"
    },
    {
      "Entreprise": "Mettler-Toledo International Inc."
    },
    {
      "Entreprise": "Metz A/S"
    },
    {
      "Entreprise": "Meyers A/S"
    },
    {
      "Entreprise": "MFP INDUSTRY SAS DI LUDMILA LUNGU & C."
    },
    {
      "Entreprise": "MGM Resorts International"
    },
    {
      "Entreprise": "MHI Vestas Offshore Wind A/S"
    },
    {
      "Entreprise": "MIC Co., Ltd"
    },
    {
      "Entreprise": "MICHEL TRANSPORTEURS ASSOCIES (MTA)"
    },
    {
      "Entreprise": "Michelin"
    },
    {
      "Entreprise": "Micro Matic A/S"
    },
    {
      "Entreprise": "Micro Technic A/S"
    },
    {
      "Entreprise": "MICROGREAT CASTING CO., LTD."
    },
    {
      "Entreprise": "MICROplásticos S.A."
    },
    {
      "Entreprise": "Microsoft Corporation"
    },
    {
      "Entreprise": "Midas Safety, Pakistan"
    },
    {
      "Entreprise": "Midfield Meat International"
    },
    {
      "Entreprise": "Midsona AB"
    },
    {
      "Entreprise": "Midwestern Group Ltd."
    },
    {
      "Entreprise": "Mie EneWood, LTD."
    },
    {
      "Entreprise": "Miele & Cie. KG"
    },
    {
      "Entreprise": "Migros Group"
    },
    {
      "Entreprise": "Migros Ticaret A.Ş."
    },
    {
      "Entreprise": "MIKUNI KIKO CO., LTD"
    },
    {
      "Entreprise": "Milarex"
    },
    {
      "Entreprise": "Mile Hi Bakery Inc."
    },
    {
      "Entreprise": "Mile Hi Foods Co."
    },
    {
      "Entreprise": "Milestone Technologies, Inc"
    },
    {
      "Entreprise": "Mileway"
    },
    {
      "Entreprise": "MiljöMatematik Malmö AB"
    },
    {
      "Entreprise": "Millennium & Copthorne Hotels plc."
    },
    {
      "Entreprise": "MillerKnoll"
    },
    {
      "Entreprise": "Millicom International Cellular S.A."
    },
    {
      "Entreprise": "Milliken & Company"
    },
    {
      "Entreprise": "Mills & Reeve"
    },
    {
      "Entreprise": "Mills AS"
    },
    {
      "Entreprise": "Minconsult Sdn. Bhd."
    },
    {
      "Entreprise": "Minor International Public Company Limited"
    },
    {
      "Entreprise": "Mintel Group Limited"
    },
    {
      "Entreprise": "Minto Apartment REIT"
    },
    {
      "Entreprise": "Minto Properties Inc"
    },
    {
      "Entreprise": "Mips AB"
    },
    {
      "Entreprise": "Mirae Asset Securities"
    },
    {
      "Entreprise": "MIRAIT ONE Corporation"
    },
    {
      "Entreprise": "MIROW & CO. DO BRASIL CONSULTORIA LTDA"
    },
    {
      "Entreprise": "Mirvac Group"
    },
    {
      "Entreprise": "Mishcon de Reya LLP"
    },
    {
      "Entreprise": "Mistral Home"
    },
    {
      "Entreprise": "MITAKA KANKYO SERVICE CO."
    },
    {
      "Entreprise": "Mitchells & Butlers plc"
    },
    {
      "Entreprise": "MITCON Consultancy & Engineering Services Limited"
    },
    {
      "Entreprise": "Mitie"
    },
    {
      "Entreprise": "Mitr Phol Group"
    },
    {
      "Entreprise": "Mitsubishi Electric Corporation"
    },
    {
      "Entreprise": "MITSUBISHI ESTATE CO., LTD."
    },
    {
      "Entreprise": "Mitsubishi HC Capital UK PLC"
    },
    {
      "Entreprise": "Mitsubishi Materials Co."
    },
    {
      "Entreprise": "MITSUBOSHI KEITO Co.,Ltd."
    },
    {
      "Entreprise": "MITSUI FUDOSAN CO., LTD."
    },
    {
      "Entreprise": "MIWATECH CO., LTD."
    },
    {
      "Entreprise": "MIYABI co.,ltd."
    },
    {
      "Entreprise": "MIYAGI EISEI KANKYO KOSHA, INC."
    },
    {
      "Entreprise": "Miyako Printing Ink Co., Ltd."
    },
    {
      "Entreprise": "Miyakoda Construction Co., Ltd"
    },
    {
      "Entreprise": "MIYOSHI KASEI, INC."
    },
    {
      "Entreprise": "MIZSEI MFG CO., LTD."
    },
    {
      "Entreprise": "MIZUNO CORPORATION"
    },
    {
      "Entreprise": "MIZUTANI VALVE M.F.G.Co.,Ltd"
    },
    {
      "Entreprise": "MKS PAMP SA"
    },
    {
      "Entreprise": "MMTC-PAMP India Private Limited"
    },
    {
      "Entreprise": "Mobile Telecommunications Company (Zain)"
    },
    {
      "Entreprise": "Mobsta Ltd"
    },
    {
      "Entreprise": "Model HOLDING AG"
    },
    {
      "Entreprise": "Moderna, Inc."
    },
    {
      "Entreprise": "Modino"
    },
    {
      "Entreprise": "Modulaire Group"
    },
    {
      "Entreprise": "Moët Hennessy"
    },
    {
      "Entreprise": "Molkerei Ammerland eG"
    },
    {
      "Entreprise": "Molkerei Gropper"
    },
    {
      "Entreprise": "Mölnlycke Health Care"
    },
    {
      "Entreprise": "Molson Coors Brewing Company"
    },
    {
      "Entreprise": "MOMENI Group"
    },
    {
      "Entreprise": "momo.com Inc."
    },
    {
      "Entreprise": "Moncler Group"
    },
    {
      "Entreprise": "Mondelez International Inc"
    },
    {
      "Entreprise": "Mondi plc"
    },
    {
      "Entreprise": "Moneysupermarket.com Group PLC"
    },
    {
      "Entreprise": "Monstercat Inc."
    },
    {
      "Entreprise": "Montagu"
    },
    {
      "Entreprise": "Montea NV"
    },
    {
      "Entreprise": "Moody's Corporation"
    },
    {
      "Entreprise": "Moonpig Group plc"
    },
    {
      "Entreprise": "Moore Concrete Products Ltd"
    },
    {
      "Entreprise": "Moose Toys"
    },
    {
      "Entreprise": "Morgan Advanced Materials"
    },
    {
      "Entreprise": "Morgan Sindall Group plc"
    },
    {
      "Entreprise": "Mori Building Co., Ltd."
    },
    {
      "Entreprise": "MORIMURA METAL Co.,Ltd."
    },
    {
      "Entreprise": "Morrison & Co"
    },
    {
      "Entreprise": "Morrisons"
    },
    {
      "Entreprise": "Motability Operations Group PLC"
    },
    {
      "Entreprise": "Mott MacDonald Group Limited"
    },
    {
      "Entreprise": "Movida"
    },
    {
      "Entreprise": "Mowi"
    },
    {
      "Entreprise": "Moy Park Limited"
    },
    {
      "Entreprise": "Moya Holdings Asia Limited"
    },
    {
      "Entreprise": "MP Pension"
    },
    {
      "Entreprise": "MRV Engenharia e Participações S.A"
    },
    {
      "Entreprise": "MS Direct AG"
    },
    {
      "Entreprise": "MS&AD Insurance Group Holdings, Inc."
    },
    {
      "Entreprise": "MSCI Inc."
    },
    {
      "Entreprise": "MSM MALAYSIA HOLDINGS BERHAD"
    },
    {
      "Entreprise": "MSQ Partners Group Limited"
    },
    {
      "Entreprise": "MTD KB"
    },
    {
      "Entreprise": "MTN Group Limited"
    },
    {
      "Entreprise": "MTR Corporation Limited"
    },
    {
      "Entreprise": "MTR Nordic Group"
    },
    {
      "Entreprise": "Muhr und Bender KG"
    },
    {
      "Entreprise": "Mulberry Group plc"
    },
    {
      "Entreprise": "Multeral AB"
    },
    {
      "Entreprise": "Multiconsult ASA"
    },
    {
      "Entreprise": "Multimek Oy"
    },
    {
      "Entreprise": "Multiplex Construction Canada"
    },
    {
      "Entreprise": "Multiplex Construction Europe"
    },
    {
      "Entreprise": "Multiplex Constructions, Middle East"
    },
    {
      "Entreprise": "MULTIVISTA GLOBAL PVT LTD - PRINT HOUSE"
    },
    {
      "Entreprise": "Muntons"
    },
    {
      "Entreprise": "Murakami Lumber Co., Ltd."
    },
    {
      "Entreprise": "Murata Manufacturing Co., Ltd."
    },
    {
      "Entreprise": "MURONAKA INDUSTRIES CO.LTD"
    },
    {
      "Entreprise": "Murray Birrell Limited"
    },
    {
      "Entreprise": "Musgrave Group"
    },
    {
      "Entreprise": "MVV Energie AG"
    },
    {
      "Entreprise": "Mycronic"
    },
    {
      "Entreprise": "MyMobility"
    },
    {
      "Entreprise": "MYOPLA"
    },
    {
      "Entreprise": "MYTILINEOS S.A."
    },
    {
      "Entreprise": "N Brown Group Plc"
    },
    {
      "Entreprise": "N. V. Eneco"
    },
    {
      "Entreprise": "NA-KD"
    },
    {
      "Entreprise": "Naabtaler Milchwerke GmbH & Co. KG Privatmolkerei Bechtel"
    },
    {
      "Entreprise": "Nabtesco Corporation"
    },
    {
      "Entreprise": "Nahar Industrial Enterprises Limited"
    },
    {
      "Entreprise": "Nairn's Oatcakes Ltd."
    },
    {
      "Entreprise": "Naito Construction Service Co.,Ltd."
    },
    {
      "Entreprise": "NAKAI HOLDINGS INC."
    },
    {
      "Entreprise": "NAKANIHON CASTING Co.,LTD."
    },
    {
      "Entreprise": "Nakashimada Engineering Works, Ltd."
    },
    {
      "Entreprise": "NAKAYAMASEIKO　CO.,LTD"
    },
    {
      "Entreprise": "Nampak Limited"
    },
    {
      "Entreprise": "Nan Fung Development Holdings Limited"
    },
    {
      "Entreprise": "Nan Fung Development Limited"
    },
    {
      "Entreprise": "Nan Fung Property Management Holdings Limited"
    },
    {
      "Entreprise": "Nan Shan Life Insurance Company, Ltd."
    },
    {
      "Entreprise": "Nan Ya Plastics Corporation"
    },
    {
      "Entreprise": "Nan Ya Printed Circuit Board Corporation"
    },
    {
      "Entreprise": "Nando's Australia Pty Ltd"
    },
    {
      "Entreprise": "Nando's Chicken Land Limited"
    },
    {
      "Entreprise": "Nanya Technology Corporation"
    },
    {
      "Entreprise": "Nasdaq, Inc."
    },
    {
      "Entreprise": "Nathaniel Lichfield & Partners Ltd"
    },
    {
      "Entreprise": "National Grid Electricity System Operator (ESO)"
    },
    {
      "Entreprise": "National Grid Electricity Transmission plc (NGET)"
    },
    {
      "Entreprise": "National Grid PLC"
    },
    {
      "Entreprise": "National Highways"
    },
    {
      "Entreprise": "National Windscreens"
    },
    {
      "Entreprise": "Nativa Srl SB"
    },
    {
      "Entreprise": "Native Shoes"
    },
    {
      "Entreprise": "NATS Holdings Limited"
    },
    {
      "Entreprise": "Natura & Co"
    },
    {
      "Entreprise": "Natural Power Consultants Ltd"
    },
    {
      "Entreprise": "Nature's Management"
    },
    {
      "Entreprise": "Nature's Way Co., Ltd"
    },
    {
      "Entreprise": "NatWest Group plc"
    },
    {
      "Entreprise": "NAVAHITA KARANA, PT"
    },
    {
      "Entreprise": "Navitas Semiconductor Ltd."
    },
    {
      "Entreprise": "NBN Co Limited"
    },
    {
      "Entreprise": "Ndevr Environmental"
    },
    {
      "Entreprise": "Neapco Holdings LLC"
    },
    {
      "Entreprise": "NEC Corporation"
    },
    {
      "Entreprise": "Nechi Group"
    },
    {
      "Entreprise": "Nectar Sleep Ltd"
    },
    {
      "Entreprise": "Nederlandse Waterschapsbank N.V."
    },
    {
      "Entreprise": "Needle Craft for Clothing Industry"
    },
    {
      "Entreprise": "Neinor Homes"
    },
    {
      "Entreprise": "Nemak, S.A.B. de C.V."
    },
    {
      "Entreprise": "NEMERA"
    },
    {
      "Entreprise": "NEMO Equipment, Inc."
    },
    {
      "Entreprise": "NENT Group"
    },
    {
      "Entreprise": "Neptuno Pumps"
    },
    {
      "Entreprise": "Nestlé"
    },
    {
      "Entreprise": "NetApp Inc."
    },
    {
      "Entreprise": "Netel Holding AB (publ)"
    },
    {
      "Entreprise": "Netflix"
    },
    {
      "Entreprise": "Network Plus Services Limited"
    },
    {
      "Entreprise": "Network Rail plc"
    },
    {
      "Entreprise": "Neumarkter Lammsbräu Gebr. Ehrnsperger KG"
    },
    {
      "Entreprise": "New Balance Athelics, Inc"
    },
    {
      "Entreprise": "New Kinpo Group"
    },
    {
      "Entreprise": "New Look Retailers Ltd"
    },
    {
      "Entreprise": "New River REIT plc"
    },
    {
      "Entreprise": "NEW WIDE (VIETNAM) ENTERPRISE CO., LTD."
    },
    {
      "Entreprise": "New World Development Company Limited"
    },
    {
      "Entreprise": "New York State Metropolitan Transportation Authority"
    },
    {
      "Entreprise": "New Zealand Post"
    },
    {
      "Entreprise": "Newmont Corporation"
    },
    {
      "Entreprise": "News Corp"
    },
    {
      "Entreprise": "NEXANS"
    },
    {
      "Entreprise": "Nexi SpA"
    },
    {
      "Entreprise": "Nexii Building Solutions Inc."
    },
    {
      "Entreprise": "Nexity SA"
    },
    {
      "Entreprise": "Next plc"
    },
    {
      "Entreprise": "NEXTEAM"
    },
    {
      "Entreprise": "NG Bailey Group Ltd"
    },
    {
      "Entreprise": "NGK INSULATORS, LTD."
    },
    {
      "Entreprise": "NGK SPARK PLUG CO., LTD."
    },
    {
      "Entreprise": "NGW Energia SpA SB"
    },
    {
      "Entreprise": "NH Hotel Group"
    },
    {
      "Entreprise": "nib holdings limited (nib Group)"
    },
    {
      "Entreprise": "Nice Group Holding Corp., Limited"
    },
    {
      "Entreprise": "Nichirin Co., Ltd."
    },
    {
      "Entreprise": "NIDEC ARISA S.L.U."
    },
    {
      "Entreprise": "Nidec Corporation"
    },
    {
      "Entreprise": "NIHON CHUOU JUHAN Co., Ltd."
    },
    {
      "Entreprise": "Nihon Dengyo Kosaku Co., Ltd."
    },
    {
      "Entreprise": "Nihon Yamamura Glass Co., Ltd."
    },
    {
      "Entreprise": "NIKE, Inc."
    },
    {
      "Entreprise": "Nikkoh Confectionery Co., Ltd."
    },
    {
      "Entreprise": "Nikon Corporation"
    },
    {
      "Entreprise": "Nilfisk A/S"
    },
    {
      "Entreprise": "Ningbo Great Group Co.,Ltd."
    },
    {
      "Entreprise": "Ningbo Orient Wires & Cables Co. Ltd"
    },
    {
      "Entreprise": "NIO Holdings Co., Ltd."
    },
    {
      "Entreprise": "NIPPON ALUTEC CORPORATION"
    },
    {
      "Entreprise": "Nippon Building Fund Inc."
    },
    {
      "Entreprise": "NIPPON ENGINE Co., Ltd."
    },
    {
      "Entreprise": "Nippon PS Co., Ltd"
    },
    {
      "Entreprise": "Nippon Sheet Glass, Co., Ltd. (NSG Group)."
    },
    {
      "Entreprise": "Nippon Shokubai Europe NV"
    },
    {
      "Entreprise": "Nippon Weston Co.,Ltd"
    },
    {
      "Entreprise": "Nippon Yusen Kabushiki Kaisha"
    },
    {
      "Entreprise": "Nishat Mills Ltd. (Apparel Division)"
    },
    {
      "Entreprise": "Nishikawa Communications Co. Ltd."
    },
    {
      "Entreprise": "Nishimatsu Construction Co., Ltd"
    },
    {
      "Entreprise": "Nissan Motor Co., Ltd."
    },
    {
      "Entreprise": "Nissin Electric Co., Ltd."
    },
    {
      "Entreprise": "Nissin Foods Holdings Co., Ltd."
    },
    {
      "Entreprise": "Nito A/S"
    },
    {
      "Entreprise": "NITTON93 NORGE AS"
    },
    {
      "Entreprise": "NKT Cables Group A/S"
    },
    {
      "Entreprise": "NNIT"
    },
    {
      "Entreprise": "NOABRANDS"
    },
    {
      "Entreprise": "Nobia AB"
    },
    {
      "Entreprise": "Nobian"
    },
    {
      "Entreprise": "Nobina AB"
    },
    {
      "Entreprise": "Noblis"
    },
    {
      "Entreprise": "NODA CONSTRUCTION LTD."
    },
    {
      "Entreprise": "Noda Crane Co.,Ltd."
    },
    {
      "Entreprise": "Nokia Group"
    },
    {
      "Entreprise": "Nokian Tyres plc"
    },
    {
      "Entreprise": "Nolato AB"
    },
    {
      "Entreprise": "Nomad Foods Ltd.d"
    },
    {
      "Entreprise": "Nominet UK"
    },
    {
      "Entreprise": "Nomura Real Estate Holdings, Inc."
    },
    {
      "Entreprise": "Nomura Real Estate Private REIT, Inc."
    },
    {
      "Entreprise": "Nomura Research Institute, Ltd."
    },
    {
      "Entreprise": "Nonghyup Financial Group Inc."
    },
    {
      "Entreprise": "Nordex SE"
    },
    {
      "Entreprise": "Nordic Milk OÜ"
    },
    {
      "Entreprise": "Nordic Semiconductor ASA"
    },
    {
      "Entreprise": "Nordiq Group A/S"
    },
    {
      "Entreprise": "Nordlo Group AB"
    },
    {
      "Entreprise": "Nordstrom, Inc."
    },
    {
      "Entreprise": "Nordzucker"
    },
    {
      "Entreprise": "Norfolk Southern Corporation"
    },
    {
      "Entreprise": "Norican Group"
    },
    {
      "Entreprise": "Norlund A/S"
    },
    {
      "Entreprise": "Norlys"
    },
    {
      "Entreprise": "Normec"
    },
    {
      "Entreprise": "Norrmejerier"
    },
    {
      "Entreprise": "Norrmejerier Ekonomisk förening"
    },
    {
      "Entreprise": "Norron Asset Management"
    },
    {
      "Entreprise": "Norsk Gjenvinning"
    },
    {
      "Entreprise": "Norstedts Förlagsgrupp AB"
    },
    {
      "Entreprise": "Norstella"
    },
    {
      "Entreprise": "Northern Ireland Electricity Networks"
    },
    {
      "Entreprise": "Northern Ireland Water"
    },
    {
      "Entreprise": "Northern Powergrid"
    },
    {
      "Entreprise": "Northern Trust"
    },
    {
      "Entreprise": "Northwest Commonwealth, LLC"
    },
    {
      "Entreprise": "Northwest Permanente, PC"
    },
    {
      "Entreprise": "Norton Rose Fulbright LLP"
    },
    {
      "Entreprise": "NOS, SPGS, S.A."
    },
    {
      "Entreprise": "NOSOPLAS"
    },
    {
      "Entreprise": "Nova Sea AS"
    },
    {
      "Entreprise": "Novartis"
    },
    {
      "Entreprise": "NovaTech Automation"
    },
    {
      "Entreprise": "Novenco Building & Industry A/S"
    },
    {
      "Entreprise": "Novo Banco, SA"
    },
    {
      "Entreprise": "Novo Holdings A/S"
    },
    {
      "Entreprise": "Novo Nordisk A/S"
    },
    {
      "Entreprise": "Novozymes A/S"
    },
    {
      "Entreprise": "NOZAWA CORPORATION"
    },
    {
      "Entreprise": "NR Instant Produce Co., Ltd"
    },
    {
      "Entreprise": "NREP"
    },
    {
      "Entreprise": "NRG Energy Inc"
    },
    {
      "Entreprise": "NS"
    },
    {
      "Entreprise": "NSW Land Registry Services"
    },
    {
      "Entreprise": "Nth Degree, Inc."
    },
    {
      "Entreprise": "NTT DATA Corporation"
    },
    {
      "Entreprise": "NTT Docomo Inc."
    },
    {
      "Entreprise": "NTT Group"
    },
    {
      "Entreprise": "NTT Ltd."
    },
    {
      "Entreprise": "NTT Urban Solutions, Inc."
    },
    {
      "Entreprise": "NUMBER THREE, INC."
    },
    {
      "Entreprise": "Nutreco"
    },
    {
      "Entreprise": "Nutrien Ltd."
    },
    {
      "Entreprise": "Nutrition&Santé"
    },
    {
      "Entreprise": "NV Bekaert SA"
    },
    {
      "Entreprise": "NW Commonwealth, LLC (dba Wyld & Wyld CBD)"
    },
    {
      "Entreprise": "NX Filtration"
    },
    {
      "Entreprise": "NXP Semiconductors"
    },
    {
      "Entreprise": "Nykredit"
    },
    {
      "Entreprise": "Nyskördade Morötter i Fjälkinge AB"
    },
    {
      "Entreprise": "NØIE"
    },
    {
      "Entreprise": "O'Brien Fine Foods"
    },
    {
      "Entreprise": "O'right"
    },
    {
      "Entreprise": "O-I Glass"
    },
    {
      "Entreprise": "O. Kavli AB (Kavli Sweden) & Kavli Oy (Kavli Finland)"
    },
    {
      "Entreprise": "O.T. Sports Manufacture Co., Ltd."
    },
    {
      "Entreprise": "o9 Solutions, Inc."
    },
    {
      "Entreprise": "Oakland International Ltd."
    },
    {
      "Entreprise": "Obayashi Corporation"
    },
    {
      "Entreprise": "OBAYASHI SEIKO CO.,LTD"
    },
    {
      "Entreprise": "Oberbank AG"
    },
    {
      "Entreprise": "Obrascón Huarte Laín, S. A"
    },
    {
      "Entreprise": "OC&C Strategy Consultants"
    },
    {
      "Entreprise": "OCEA Smart Building"
    },
    {
      "Entreprise": "Oceania Healthcare Limited"
    },
    {
      "Entreprise": "OCHSNER Wärmepumpen GmbH"
    },
    {
      "Entreprise": "OCP Group"
    },
    {
      "Entreprise": "OCS Group UK Limited"
    },
    {
      "Entreprise": "Octopus Energy Group Limited"
    },
    {
      "Entreprise": "Odata Brasil S.A."
    },
    {
      "Entreprise": "Oddbox Delivery Ltd"
    },
    {
      "Entreprise": "Odgers Berndtson"
    },
    {
      "Entreprise": "ODINSA S.A."
    },
    {
      "Entreprise": "OECHSLER"
    },
    {
      "Entreprise": "Oesse srl"
    },
    {
      "Entreprise": "Office 2000 Solutions Private Limited"
    },
    {
      "Entreprise": "Ogier"
    },
    {
      "Entreprise": "Oh My Greens AB"
    },
    {
      "Entreprise": "Ohkawa Printing Co., Ltd."
    },
    {
      "Entreprise": "OHKUMA.Co.,Ltd."
    },
    {
      "Entreprise": "OIA Global"
    },
    {
      "Entreprise": "Oilon Group Oy"
    },
    {
      "Entreprise": "OKA Direct Ltd"
    },
    {
      "Entreprise": "Okabe Co.,Ltd"
    },
    {
      "Entreprise": "OKAMOTOKOKI Co.,LTD"
    },
    {
      "Entreprise": "Okamura Corporation"
    },
    {
      "Entreprise": "Okartek Oy"
    },
    {
      "Entreprise": "OKI Electric Industry Co., Ltd."
    },
    {
      "Entreprise": "Okta, Inc"
    },
    {
      "Entreprise": "Okuji kensan Co.,Ltd"
    },
    {
      "Entreprise": "Okumura Corporation"
    },
    {
      "Entreprise": "Olam"
    },
    {
      "Entreprise": "olam food ingredients (ofi)"
    },
    {
      "Entreprise": "Oleter Group AB"
    },
    {
      "Entreprise": "Ölgerðin Egill Skallagrímsson"
    },
    {
      "Entreprise": "Olive Apparel (Cambodia) Co., Ltd."
    },
    {
      "Entreprise": "Olle Nyberg Chark AB"
    },
    {
      "Entreprise": "Ololo Farming Company"
    },
    {
      "Entreprise": "Olvi Plc"
    },
    {
      "Entreprise": "Omni Facilities Management"
    },
    {
      "Entreprise": "Omnicom Group"
    },
    {
      "Entreprise": "OMRON Corporation"
    },
    {
      "Entreprise": "On Running"
    },
    {
      "Entreprise": "OneCo AS"
    },
    {
      "Entreprise": "OneTrust"
    },
    {
      "Entreprise": "onewoom GmbH"
    },
    {
      "Entreprise": "ONO PHARMACEUTICAL CO., LTD."
    },
    {
      "Entreprise": "onsemi"
    },
    {
      "Entreprise": "Ontex"
    },
    {
      "Entreprise": "OONO CONSTRUCTION CO.,LTD"
    },
    {
      "Entreprise": "Opain S.A"
    },
    {
      "Entreprise": "Opal Cosmetics (Hong Kong) Limited"
    },
    {
      "Entreprise": "Open Air Group"
    },
    {
      "Entreprise": "Open Farm Inc."
    },
    {
      "Entreprise": "OPEN Health Group"
    },
    {
      "Entreprise": "OpenX Technologies Inc. (and its operating affiliates)"
    },
    {
      "Entreprise": "Optima Facility, S.L."
    },
    {
      "Entreprise": "OPTIMA packaging group GmbH"
    },
    {
      "Entreprise": "Optimised Energy"
    },
    {
      "Entreprise": "Optimised Group"
    },
    {
      "Entreprise": "Opus Trust Marketing Ltd"
    },
    {
      "Entreprise": "ORANGE"
    },
    {
      "Entreprise": "Orbia Advance Corporation S.A.B."
    },
    {
      "Entreprise": "Ordina"
    },
    {
      "Entreprise": "Oriental Aromatics Ltd"
    },
    {
      "Entreprise": "Oriental Industries (Suzhou) LTD."
    },
    {
      "Entreprise": "Orifarm Group A/S"
    },
    {
      "Entreprise": "Oriflame Cosmetics"
    },
    {
      "Entreprise": "Origin Energy"
    },
    {
      "Entreprise": "Origin Enterprises plc"
    },
    {
      "Entreprise": "Orion Corporation"
    },
    {
      "Entreprise": "Orkla ASA"
    },
    {
      "Entreprise": "Orluna LED Technologies Limited"
    },
    {
      "Entreprise": "Orms Designers and Architects Ltd"
    },
    {
      "Entreprise": "Ornua Co-operative Limited"
    },
    {
      "Entreprise": "ORTEC GROUP"
    },
    {
      "Entreprise": "Orthex"
    },
    {
      "Entreprise": "ORYZA OIL & FAT CHEMICAL CO., LTD."
    },
    {
      "Entreprise": "OSAKA KOTETSU Co.,Ltd"
    },
    {
      "Entreprise": "Osawa Wax Co.,Ltd."
    },
    {
      "Entreprise": "OSB Group PLC"
    },
    {
      "Entreprise": "Osborne Clarke LLP"
    },
    {
      "Entreprise": "Osborne Infrastructure Limited"
    },
    {
      "Entreprise": "Oscar Mayer Ltd"
    },
    {
      "Entreprise": "Oshkosh Corporation"
    },
    {
      "Entreprise": "OSI Group LLC"
    },
    {
      "Entreprise": "OSS Nordic AB"
    },
    {
      "Entreprise": "Össur hf."
    },
    {
      "Entreprise": "Österreichische Post AG"
    },
    {
      "Entreprise": "OSW Corporation"
    },
    {
      "Entreprise": "OTB"
    },
    {
      "Entreprise": "Oterra A/S"
    },
    {
      "Entreprise": "OTSUKA CORPORATION"
    },
    {
      "Entreprise": "Otsuka Pharmaceutical Co., Ltd."
    },
    {
      "Entreprise": "OTTO FUCHS"
    },
    {
      "Entreprise": "Otto Group"
    },
    {
      "Entreprise": "Ottobock SE & Co. KGaA"
    },
    {
      "Entreprise": "Outokumpu Oyj"
    },
    {
      "Entreprise": "Outright Games Ltd"
    },
    {
      "Entreprise": "Ovako AB"
    },
    {
      "Entreprise": "OVO Energy"
    },
    {
      "Entreprise": "OVS S.p.A"
    },
    {
      "Entreprise": "Owen Mumford Ltd"
    },
    {
      "Entreprise": "Owens Corning"
    },
    {
      "Entreprise": "Oxford PharmaGenesis"
    },
    {
      "Entreprise": "Oxwash Ltd"
    },
    {
      "Entreprise": "OY Prevex Ab"
    },
    {
      "Entreprise": "OYAK Cement"
    },
    {
      "Entreprise": "Ozaki Co.,Ltd."
    },
    {
      "Entreprise": "P&C Insurance Holding Ltd. (publ)"
    },
    {
      "Entreprise": "PA Consulting"
    },
    {
      "Entreprise": "Pacage center fukujuu Co.,Ltd."
    },
    {
      "Entreprise": "PACCAR Inc"
    },
    {
      "Entreprise": "PACIFIC CONSULTANTS CO.,LTD."
    },
    {
      "Entreprise": "Pacific Rundum Co., Ltd."
    },
    {
      "Entreprise": "Pactiv Evergreen Inc."
    },
    {
      "Entreprise": "Pakistan Cables Limited"
    },
    {
      "Entreprise": "Pakistan Services Limited"
    },
    {
      "Entreprise": "Pal International"
    },
    {
      "Entreprise": "Palantir Technologies Inc."
    },
    {
      "Entreprise": "Palcut A/S"
    },
    {
      "Entreprise": "PALFINGER AG"
    },
    {
      "Entreprise": "Palladium Group Holdings Pty Ltd"
    },
    {
      "Entreprise": "Palo Alto Networks"
    },
    {
      "Entreprise": "PAMA MECANICA E FUNDIÇÃO LTDA"
    },
    {
      "Entreprise": "Panasonic Holdings Corporation"
    },
    {
      "Entreprise": "Pandora A/S"
    },
    {
      "Entreprise": "Pandox AB"
    },
    {
      "Entreprise": "Panera Bread"
    },
    {
      "Entreprise": "PANEX"
    },
    {
      "Entreprise": "Pangaea Laboratories Limited"
    },
    {
      "Entreprise": "Pangolin Associates Pty Ltd"
    },
    {
      "Entreprise": "Pantas Software Sdn. Bhd."
    },
    {
      "Entreprise": "Panther Packaging GmbH & Co. KG"
    },
    {
      "Entreprise": "PANZANI"
    },
    {
      "Entreprise": "Parade"
    },
    {
      "Entreprise": "Paragon Films, Inc."
    },
    {
      "Entreprise": "PARAGON TRANSACTION"
    },
    {
      "Entreprise": "Paramount Global"
    },
    {
      "Entreprise": "Parexel International Corporation"
    },
    {
      "Entreprise": "Parfums Christian Dior’s"
    },
    {
      "Entreprise": "Parker Hannifin Corporation"
    },
    {
      "Entreprise": "Parkeray Limited"
    },
    {
      "Entreprise": "Parmacotto spa"
    },
    {
      "Entreprise": "Parque Arauco S.A"
    },
    {
      "Entreprise": "Parques Reunidos Group"
    },
    {
      "Entreprise": "Parsons"
    },
    {
      "Entreprise": "Partners in Performance"
    },
    {
      "Entreprise": "Pas Normal Studios"
    },
    {
      "Entreprise": "Pascall+Watson"
    },
    {
      "Entreprise": "Patagonia Works"
    },
    {
      "Entreprise": "Patria Oyj"
    },
    {
      "Entreprise": "Pattern S.P.A."
    },
    {
      "Entreprise": "Paulig Group"
    },
    {
      "Entreprise": "PayPal"
    },
    {
      "Entreprise": "PCI Pharma Services"
    },
    {
      "Entreprise": "PDSVISION Group AB"
    },
    {
      "Entreprise": "Peak Design"
    },
    {
      "Entreprise": "Peak Performance Production AB"
    },
    {
      "Entreprise": "Pearson PLC"
    },
    {
      "Entreprise": "Peco Foods, Inc."
    },
    {
      "Entreprise": "Pegasystems Inc"
    },
    {
      "Entreprise": "Pegatron Corporation"
    },
    {
      "Entreprise": "Peking Handicraft Inc."
    },
    {
      "Entreprise": "Pelorus Consulting"
    },
    {
      "Entreprise": "PennEngineering"
    },
    {
      "Entreprise": "Penningtons Manches Cooper LLP"
    },
    {
      "Entreprise": "Pennon Group"
    },
    {
      "Entreprise": "PensionDanmark"
    },
    {
      "Entreprise": "Penta-Ocean Construction CO., LTD"
    },
    {
      "Entreprise": "Pentland Brands"
    },
    {
      "Entreprise": "PepsiCo, Inc."
    },
    {
      "Entreprise": "Perfetti Van Melle"
    },
    {
      "Entreprise": "PerkinElmer"
    },
    {
      "Entreprise": "Perkins & Will UK Ltd."
    },
    {
      "Entreprise": "Pernod Ricard"
    },
    {
      "Entreprise": "Persimmon PLC"
    },
    {
      "Entreprise": "Perstorp Holding AB"
    },
    {
      "Entreprise": "PET STAR HOLDING"
    },
    {
      "Entreprise": "Petainer"
    },
    {
      "Entreprise": "Peter Herres Wein- und Sektkellerei GmbH"
    },
    {
      "Entreprise": "Pets at Home Group"
    },
    {
      "Entreprise": "Pfeifer & Langen GmbH & Co KG"
    },
    {
      "Entreprise": "Pfeiffer Vacuum Technology AG"
    },
    {
      "Entreprise": "Pfizer Inc."
    },
    {
      "Entreprise": "PG&E Corporation"
    },
    {
      "Entreprise": "PGP Glass Pvt. Ltd."
    },
    {
      "Entreprise": "PH-CH SAS : PIPER-HEIDSIECK, CHARLES HEIDSIECK, RARE CHAMPAGNE"
    },
    {
      "Entreprise": "Pharma Mar"
    },
    {
      "Entreprise": "Pharmanovia"
    },
    {
      "Entreprise": "Pharmaron Beijing Co., Ltd."
    },
    {
      "Entreprise": "PharmLog Pharma Logistik GmbH"
    },
    {
      "Entreprise": "Phihong Technology Co., Ltd."
    },
    {
      "Entreprise": "Philip Morris International"
    },
    {
      "Entreprise": "Phoenix Group Holdings plc"
    },
    {
      "Entreprise": "Phoenix Zementwerke Krogbeumker GmbH & Co. KG"
    },
    {
      "Entreprise": "Physicians Realty Trust"
    },
    {
      "Entreprise": "Pi Group Ltd"
    },
    {
      "Entreprise": "Pick n Pay"
    },
    {
      "Entreprise": "Pictet Group"
    },
    {
      "Entreprise": "Pihl Holding A/S"
    },
    {
      "Entreprise": "Pilgrim’s Pride Ltd."
    },
    {
      "Entreprise": "PILOT KNIT SPORT WEAR (CAMBODIA) CO., LTD"
    },
    {
      "Entreprise": "Pine Tree Company For Textile Manufacturing PSC"
    },
    {
      "Entreprise": "Pinsent Masons LLP"
    },
    {
      "Entreprise": "Pinterest, Inc."
    },
    {
      "Entreprise": "Pip & Nut"
    },
    {
      "Entreprise": "Piraeus Financial Holdings S.A."
    },
    {
      "Entreprise": "Pirelli & C. S.p.A"
    },
    {
      "Entreprise": "PJSC Uralkali"
    },
    {
      "Entreprise": "PlanA.Earth GmbH"
    },
    {
      "Entreprise": "Planson International Corporation"
    },
    {
      "Entreprise": "Plantasjen Group AS"
    },
    {
      "Entreprise": "Planwerkstatt GmbH"
    },
    {
      "Entreprise": "Plasser UK LLP"
    },
    {
      "Entreprise": "Plastic Omnium SE"
    },
    {
      "Entreprise": "Plastigaur"
    },
    {
      "Entreprise": "Plastipak"
    },
    {
      "Entreprise": "Platcorp Holdings Limited"
    },
    {
      "Entreprise": "Platzer Fastigheter Holding AB (publ)"
    },
    {
      "Entreprise": "Playtech plc"
    },
    {
      "Entreprise": "Plenish Drinks"
    },
    {
      "Entreprise": "Plus Pack"
    },
    {
      "Entreprise": "Plus-Project Ltd"
    },
    {
      "Entreprise": "PNZ-Produkte GmbH"
    },
    {
      "Entreprise": "Pocoloco Company Limited"
    },
    {
      "Entreprise": "Point B"
    },
    {
      "Entreprise": "POLA ORBIS HOLDINGS INC"
    },
    {
      "Entreprise": "Polivouga - Indústria de Plásticos, S.A"
    },
    {
      "Entreprise": "Polpaico BSA"
    },
    {
      "Entreprise": "Polygenta Technologies Limited"
    },
    {
      "Entreprise": "Polygon Group AB"
    },
    {
      "Entreprise": "Polymetal International plc"
    },
    {
      "Entreprise": "Pöppelmann Holding GmbH & Co. KG"
    },
    {
      "Entreprise": "Port International GmbH"
    },
    {
      "Entreprise": "Port of Aarhus"
    },
    {
      "Entreprise": "Port of Newcastle"
    },
    {
      "Entreprise": "Port of Rotterdam Authority"
    },
    {
      "Entreprise": "PortAventura World"
    },
    {
      "Entreprise": "Ports of Auckland Limited"
    },
    {
      "Entreprise": "POSCO E&C"
    },
    {
      "Entreprise": "Posten Norge AS"
    },
    {
      "Entreprise": "Posti Group Ltd."
    },
    {
      "Entreprise": "PostNL"
    },
    {
      "Entreprise": "PostNord AB"
    },
    {
      "Entreprise": "PPF Telecom Group B.V."
    },
    {
      "Entreprise": "PPG Industries, Inc."
    },
    {
      "Entreprise": "Prada Group"
    },
    {
      "Entreprise": "PredictX Ltd"
    },
    {
      "Entreprise": "Premier Energy Services Ltd"
    },
    {
      "Entreprise": "Premier Foods PLC"
    },
    {
      "Entreprise": "Premier Is A/S"
    },
    {
      "Entreprise": "Premier Lotteries Ireland DAC"
    },
    {
      "Entreprise": "Preqin"
    },
    {
      "Entreprise": "Presto Holding AB"
    },
    {
      "Entreprise": "PricewaterhouseCoopers International Limited (PwC IL)"
    },
    {
      "Entreprise": "Primark Limited"
    },
    {
      "Entreprise": "Primax Electronics (CQ) Corp., LTD."
    },
    {
      "Entreprise": "Primax Electronics (KS) Corp.,Ltd."
    },
    {
      "Entreprise": "Prime Forest Products LLC"
    },
    {
      "Entreprise": "Primeo Holding AG"
    },
    {
      "Entreprise": "Primient"
    },
    {
      "Entreprise": "Primonial REIM"
    },
    {
      "Entreprise": "Princes Limited"
    },
    {
      "Entreprise": "Princess Polly Online Pty Ltd"
    },
    {
      "Entreprise": "Principal Financial Group, Inc."
    },
    {
      "Entreprise": "PRINCIPIUM SRL"
    },
    {
      "Entreprise": "Principle Cleaning Services"
    },
    {
      "Entreprise": "Privi Speciality Chemicals Limited"
    },
    {
      "Entreprise": "Pro-Pac Packaging Limited"
    },
    {
      "Entreprise": "proALPHA Group GmbH"
    },
    {
      "Entreprise": "Probi"
    },
    {
      "Entreprise": "PROCAFECOL S.A."
    },
    {
      "Entreprise": "ProCredit Holding AG & Co. KGaA"
    },
    {
      "Entreprise": "Procter & Gamble Company"
    },
    {
      "Entreprise": "Producción, Industrialización, Comercialización y Asesoría de Hule Natural, S. A."
    },
    {
      "Entreprise": "Product Cia de Importaciones Asiaticas, S.L.."
    },
    {
      "Entreprise": "Profile Security Services Ltd"
    },
    {
      "Entreprise": "Progress-Werk Oberkirch AG"
    },
    {
      "Entreprise": "Prologis"
    },
    {
      "Entreprise": "Promax Textile Co., Ltd."
    },
    {
      "Entreprise": "PROSE Technologies (Suzhou) Co.Ltd"
    },
    {
      "Entreprise": "Provident Financial plc"
    },
    {
      "Entreprise": "Proxima"
    },
    {
      "Entreprise": "Proximus"
    },
    {
      "Entreprise": "Proyecta Spa"
    },
    {
      "Entreprise": "Prysmian Group"
    },
    {
      "Entreprise": "PSA Automobiles SA"
    },
    {
      "Entreprise": "PT Austindo Nusantara Jaya Tbk."
    },
    {
      "Entreprise": "PT Ecogreen Oleochemicals"
    },
    {
      "Entreprise": "PT INDESSO AROMA"
    },
    {
      "Entreprise": "PT KAHATEX"
    },
    {
      "Entreprise": "PT PAKUWON JATI TBK"
    },
    {
      "Entreprise": "PT Pan Brothers Tbk"
    },
    {
      "Entreprise": "PT PRIMA SEJATI SEJAHTERA"
    },
    {
      "Entreprise": "PT Samora Usaha Makmur"
    },
    {
      "Entreprise": "PT Semen Indonesia (Persero) Tbk."
    },
    {
      "Entreprise": "PT. EVER SHINE TEX,TBK"
    },
    {
      "Entreprise": "PT. Indo Oil Perkasa Tbk"
    },
    {
      "Entreprise": "PT. Karya Indah Multiguna"
    },
    {
      "Entreprise": "PT. Lawangmas Primapack Indonesia"
    },
    {
      "Entreprise": "PT. Parkland World Indonesia"
    },
    {
      "Entreprise": "PT. Sugar Labinta"
    },
    {
      "Entreprise": "PT. United Can"
    },
    {
      "Entreprise": "Public Power Corporations"
    },
    {
      "Entreprise": "Public Service Enterprise Group Inc.  (PSEG)"
    },
    {
      "Entreprise": "Publicis Groupe"
    },
    {
      "Entreprise": "Puffin Produce Ltd"
    },
    {
      "Entreprise": "Puig S.L."
    },
    {
      "Entreprise": "Pukka Herbs"
    },
    {
      "Entreprise": "Pulsant Limited"
    },
    {
      "Entreprise": "PUMA SE"
    },
    {
      "Entreprise": "PunaMusta Media PLC"
    },
    {
      "Entreprise": "PUNGKOOK SAI GON TWO COPORATION - PUNGKOOK SAIGON III FACTORY"
    },
    {
      "Entreprise": "Pura Aventura"
    },
    {
      "Entreprise": "Pure Storage, Inc."
    },
    {
      "Entreprise": "PureHealth Holding LLC"
    },
    {
      "Entreprise": "Purmo Group Plc"
    },
    {
      "Entreprise": "Purolator Inc."
    },
    {
      "Entreprise": "PVH Corp."
    },
    {
      "Entreprise": "Pyxus International, INC"
    },
    {
      "Entreprise": "Q-lite"
    },
    {
      "Entreprise": "Qalaa Holdings"
    },
    {
      "Entreprise": "QBS Technology Group"
    },
    {
      "Entreprise": "QIAGEN N.V."
    },
    {
      "Entreprise": "Qinetiq"
    },
    {
      "Entreprise": "Qingdao Haier Special Freezer"
    },
    {
      "Entreprise": "Qingdao Hanhe Cable., Ltd."
    },
    {
      "Entreprise": "Qingdao Reliance Machinery Co., Ltd"
    },
    {
      "Entreprise": "Qisda Corporation"
    },
    {
      "Entreprise": "Qontigo GmbH"
    },
    {
      "Entreprise": "QTS Group Limited"
    },
    {
      "Entreprise": "Quadrangle Architects Limited"
    },
    {
      "Entreprise": "Qualcomm Incorporated"
    },
    {
      "Entreprise": "Quálitas Controladora S.A.B. de C.V."
    },
    {
      "Entreprise": "Quanta Computer Inc."
    },
    {
      "Entreprise": "Quattro Plant Ltd"
    },
    {
      "Entreprise": "Quess Corp Limited"
    },
    {
      "Entreprise": "Quzhou Oriental Special Steel Co. Ltd."
    },
    {
      "Entreprise": "R.E.A. Holdings plc"
    },
    {
      "Entreprise": "Raben Group N.V."
    },
    {
      "Entreprise": "Radiaant Expovision Pvt. Ltd."
    },
    {
      "Entreprise": "Radiate Holdco, LLC"
    },
    {
      "Entreprise": "Radio Flyer Inc."
    },
    {
      "Entreprise": "Radisson Hotel Group"
    },
    {
      "Entreprise": "Radius Systems Limited"
    },
    {
      "Entreprise": "RADNIK EXPORTS"
    },
    {
      "Entreprise": "RADWARE LTD"
    },
    {
      "Entreprise": "Raiffeisen Bank International AG"
    },
    {
      "Entreprise": "Railpool"
    },
    {
      "Entreprise": "Raj Overseas"
    },
    {
      "Entreprise": "Rakuten Group, Inc."
    },
    {
      "Entreprise": "Ralf Bohle GmbH | SCHWALBE"
    },
    {
      "Entreprise": "Ralph Lauren Corporation"
    },
    {
      "Entreprise": "Ramatex"
    },
    {
      "Entreprise": "Ramboll Group A/S"
    },
    {
      "Entreprise": "Ramon Sabater"
    },
    {
      "Entreprise": "Ramsay Health Care Limited"
    },
    {
      "Entreprise": "Randstad N.V."
    },
    {
      "Entreprise": "Rapha Racing Ltd"
    },
    {
      "Entreprise": "Rathbones Group Plc"
    },
    {
      "Entreprise": "RATP"
    },
    {
      "Entreprise": "Rawstone Consulting"
    },
    {
      "Entreprise": "Raymond (PanYu NanSha) Electrical Appliance Development Co., Ltd."
    },
    {
      "Entreprise": "Razer Inc."
    },
    {
      "Entreprise": "RCP LLC"
    },
    {
      "Entreprise": "Re:CS Co.,Ltd."
    },
    {
      "Entreprise": "ReAcción / Alva"
    },
    {
      "Entreprise": "RealTyme, S.A."
    },
    {
      "Entreprise": "Recipharm"
    },
    {
      "Entreprise": "Reckitt Benckiser Group plc"
    },
    {
      "Entreprise": "Reconomy Group"
    },
    {
      "Entreprise": "Recreational Equipment, Inc"
    },
    {
      "Entreprise": "Recruit Holdings Co., Ltd."
    },
    {
      "Entreprise": "RECRUITERS.IE"
    },
    {
      "Entreprise": "RECTICEL"
    },
    {
      "Entreprise": "Recycling Lives Holdings Limited"
    },
    {
      "Entreprise": "Red Avenue New Materials Group Co., Ltd."
    },
    {
      "Entreprise": "Red Bull GmbH"
    },
    {
      "Entreprise": "Red Electrica de España (Grupo Red Eléctrica) (redeia)"
    },
    {
      "Entreprise": "Red Glead Discovery AB"
    },
    {
      "Entreprise": "Red-Inc ltd"
    },
    {
      "Entreprise": "REDEVCO B.V."
    },
    {
      "Entreprise": "Redrow plc"
    },
    {
      "Entreprise": "Redstor"
    },
    {
      "Entreprise": "Reed & Mackay Travel"
    },
    {
      "Entreprise": "Refinitiv"
    },
    {
      "Entreprise": "Reform"
    },
    {
      "Entreprise": "Reformo Co., Ltd."
    },
    {
      "Entreprise": "Refurb A/S"
    },
    {
      "Entreprise": "Regal Rexnord Corporation"
    },
    {
      "Entreprise": "Regency Centers Corporation"
    },
    {
      "Entreprise": "Regent Electron (Chongqing) Co.,Ltd."
    },
    {
      "Entreprise": "Regina Miracle International ( Group ) Limited"
    },
    {
      "Entreprise": "Reichle & De-Massari AG"
    },
    {
      "Entreprise": "Reima Group Oy"
    },
    {
      "Entreprise": "Reinert Logistic GmbH & Co. KG"
    },
    {
      "Entreprise": "REINOWA Holdings Inc."
    },
    {
      "Entreprise": "Reitan Convenience Sweden AB"
    },
    {
      "Entreprise": "Reka Cables Ltd."
    },
    {
      "Entreprise": "RELAXSHOE SRL"
    },
    {
      "Entreprise": "Reliance Chemical Products Ltd."
    },
    {
      "Entreprise": "Reliance Jio Infocomm Limited"
    },
    {
      "Entreprise": "RelineEurope GmbH"
    },
    {
      "Entreprise": "REMA 1000 NORGE AS"
    },
    {
      "Entreprise": "REMATEC Holdings Corporation"
    },
    {
      "Entreprise": "REMONDIS A/S"
    },
    {
      "Entreprise": "REMONDIS Recycling GmbH & Co. KG"
    },
    {
      "Entreprise": "Rémy Cointreau"
    },
    {
      "Entreprise": "REN – Redes Energéticas Nacionais"
    },
    {
      "Entreprise": "Renesas Electronics Corporation"
    },
    {
      "Entreprise": "ReNew Energy Global PLC"
    },
    {
      "Entreprise": "Rengo Co., Ltd."
    },
    {
      "Entreprise": "Renishaw plc"
    },
    {
      "Entreprise": "RENK Group"
    },
    {
      "Entreprise": "Rentschler Biopharma SE"
    },
    {
      "Entreprise": "Republic Services"
    },
    {
      "Entreprise": "RES Group"
    },
    {
      "Entreprise": "ResMed Inc"
    },
    {
      "Entreprise": "Resolute Forest Products"
    },
    {
      "Entreprise": "Resonate Group Limited"
    },
    {
      "Entreprise": "Restaurant Brands International Inc."
    },
    {
      "Entreprise": "RETAL"
    },
    {
      "Entreprise": "Retelit Group"
    },
    {
      "Entreprise": "Revenga Smart Solution"
    },
    {
      "Entreprise": "Revolution Bars Group plc"
    },
    {
      "Entreprise": "Rexel"
    },
    {
      "Entreprise": "Reykjavik Energy (OR)"
    },
    {
      "Entreprise": "Reynaers Group"
    },
    {
      "Entreprise": "Reynaldi SRL SB"
    },
    {
      "Entreprise": "Reynders Etiketten N.V."
    },
    {
      "Entreprise": "Reynolds Consumer Products Inc."
    },
    {
      "Entreprise": "Ricardo PLC"
    },
    {
      "Entreprise": "Ricoh Co., Ltd."
    },
    {
      "Entreprise": "Rightmove plc"
    },
    {
      "Entreprise": "RIKO Industrial Co., Ltd."
    },
    {
      "Entreprise": "Riksbyggen"
    },
    {
      "Entreprise": "Rikshem AB"
    },
    {
      "Entreprise": "RINA S.p.A."
    },
    {
      "Entreprise": "Rinchem Company, Inc."
    },
    {
      "Entreprise": "Ring Automotive Ltd"
    },
    {
      "Entreprise": "Ringway Jacobs Ltd"
    },
    {
      "Entreprise": "RioCan Management Inc."
    },
    {
      "Entreprise": "Rise Co.Ltd."
    },
    {
      "Entreprise": "RISE Research Institutes of Sweden AB"
    },
    {
      "Entreprise": "Riskory Consultancy Limited"
    },
    {
      "Entreprise": "Rituals Cosmetics Enterprise B.V."
    },
    {
      "Entreprise": "River Island Clothing Co. Limited"
    },
    {
      "Entreprise": "Riverside Natural Foods Ltd."
    },
    {
      "Entreprise": "Rizhao Cangyu"
    },
    {
      "Entreprise": "RJ McLeod (Contractors) Ltd"
    },
    {
      "Entreprise": "RKW SE"
    },
    {
      "Entreprise": "ROADIS Transportation Holding, SL"
    },
    {
      "Entreprise": "RoadRunner Recycling"
    },
    {
      "Entreprise": "Robert Bird Group"
    },
    {
      "Entreprise": "Robert Bosch GmbH"
    },
    {
      "Entreprise": "Robert Half"
    },
    {
      "Entreprise": "Roberts Group Ltd"
    },
    {
      "Entreprise": "Roca Group"
    },
    {
      "Entreprise": "Rock Paint Co., Ltd"
    },
    {
      "Entreprise": "Rockwool Group"
    },
    {
      "Entreprise": "Rodan + Fields"
    },
    {
      "Entreprise": "Rogers & Company Limited"
    },
    {
      "Entreprise": "Rogers Communications Inc."
    },
    {
      "Entreprise": "ROHM Co., Ltd."
    },
    {
      "Entreprise": "Rokkyo Co., Ltd."
    },
    {
      "Entreprise": "Roland Berger"
    },
    {
      "Entreprise": "Rolls-Royce plc"
    },
    {
      "Entreprise": "Rolls-Royce Power Systems AG"
    },
    {
      "Entreprise": "Romaco Holding GmbH"
    },
    {
      "Entreprise": "RONAL AG"
    },
    {
      "Entreprise": "Ronald Lu & Partners"
    },
    {
      "Entreprise": "Roquette S.A."
    },
    {
      "Entreprise": "Rosenbauer International AG"
    },
    {
      "Entreprise": "Ross-shire Engineering Limited"
    },
    {
      "Entreprise": "Rotork plc"
    },
    {
      "Entreprise": "Rovensa Group"
    },
    {
      "Entreprise": "Rovio Entertainment Corporation"
    },
    {
      "Entreprise": "Royal A-ware"
    },
    {
      "Entreprise": "Royal BAM Group"
    },
    {
      "Entreprise": "Royal DSM"
    },
    {
      "Entreprise": "Royal FrieslandCampina N.V."
    },
    {
      "Entreprise": "Royal HaskoningDHV"
    },
    {
      "Entreprise": "Royal Mail Group UK"
    },
    {
      "Entreprise": "Royal Philips"
    },
    {
      "Entreprise": "Royal Schiphol Group"
    },
    {
      "Entreprise": "Royal Swinkels Family Brewers"
    },
    {
      "Entreprise": "Royal Unibrew"
    },
    {
      "Entreprise": "Royal Vopak"
    },
    {
      "Entreprise": "RPS Group plc"
    },
    {
      "Entreprise": "RSK Group Ltd"
    },
    {
      "Entreprise": "RSS Infrastructure Ltd"
    },
    {
      "Entreprise": "RT Knits Ltd"
    },
    {
      "Entreprise": "RTS Transport Service GmbH"
    },
    {
      "Entreprise": "Rubel & Ménasché"
    },
    {
      "Entreprise": "Rubicon Technologies, LLC"
    },
    {
      "Entreprise": "Rügenwalder Mühle Carl Müller GmbH und Co. KG"
    },
    {
      "Entreprise": "RugVista AB"
    },
    {
      "Entreprise": "Russell Reynolds Associates"
    },
    {
      "Entreprise": "RWE AG"
    },
    {
      "Entreprise": "RWS Holdings plc"
    },
    {
      "Entreprise": "Ryanair Holdings plc"
    },
    {
      "Entreprise": "Ryde Technology AS"
    },
    {
      "Entreprise": "Ryman Healthcare Limited"
    },
    {
      "Entreprise": "S&P Global"
    },
    {
      "Entreprise": "S-BIC COMPANY, LTD."
    },
    {
      "Entreprise": "S.C.IPROMET S.R.L."
    },
    {
      "Entreprise": "s.Oliver Group"
    },
    {
      "Entreprise": "S2S Electronics Ltd"
    },
    {
      "Entreprise": "S4 Capital PLC"
    },
    {
      "Entreprise": "Saab AB"
    },
    {
      "Entreprise": "Sabará Participações"
    },
    {
      "Entreprise": "Sabey Data Centers"
    },
    {
      "Entreprise": "Sacyr S.A."
    },
    {
      "Entreprise": "Safaricom Limited"
    },
    {
      "Entreprise": "Saferoad Group"
    },
    {
      "Entreprise": "Safran"
    },
    {
      "Entreprise": "SAGAR CEMENTS LIMITED"
    },
    {
      "Entreprise": "SAGAWA EXPRESS CO.,LTD"
    },
    {
      "Entreprise": "Sage"
    },
    {
      "Entreprise": "SAGEMCOM"
    },
    {
      "Entreprise": "Sahashi Tokushuko Kabushikigaisha"
    },
    {
      "Entreprise": "SAICA GROUP"
    },
    {
      "Entreprise": "SAINT-GOBAIN"
    },
    {
      "Entreprise": "Saitex International Dong Nai"
    },
    {
      "Entreprise": "Sakakibara Industry Co., Ltd."
    },
    {
      "Entreprise": "SAKAKIBARA SEIKI CO., LTD"
    },
    {
      "Entreprise": "Salcomp"
    },
    {
      "Entreprise": "Salesforce.com, Inc."
    },
    {
      "Entreprise": "Salling Group A/S"
    },
    {
      "Entreprise": "SalMar ASA"
    },
    {
      "Entreprise": "Salmones Austral"
    },
    {
      "Entreprise": "Salom Electric (Xiamen) Co., Ltd."
    },
    {
      "Entreprise": "Salomon"
    },
    {
      "Entreprise": "SALUS Haus Dr. med. Otto Greither Nachf. GmbH & Co. KG"
    },
    {
      "Entreprise": "Salvatore Ferragamo Group"
    },
    {
      "Entreprise": "Salzgitter AG"
    },
    {
      "Entreprise": "Sama"
    },
    {
      "Entreprise": "Samhällsbyggnadsbolaget i Norden AB"
    },
    {
      "Entreprise": "Samsara Inc."
    },
    {
      "Entreprise": "Samskip B.V."
    },
    {
      "Entreprise": "Samson Corporation Ltd"
    },
    {
      "Entreprise": "Samworth Brothers Limited"
    },
    {
      "Entreprise": "SANDEN CORPORATION"
    },
    {
      "Entreprise": "SANDEN Group"
    },
    {
      "Entreprise": "Sanderson Solutions Group PLC"
    },
    {
      "Entreprise": "Sandvik Group"
    },
    {
      "Entreprise": "Sanki Kosakusho Co., Ltd"
    },
    {
      "Entreprise": "SANKO RECYCLE Co.,Ltd."
    },
    {
      "Entreprise": "SanMar Corporation"
    },
    {
      "Entreprise": "SANO TOKOUTEN CO.,LTD"
    },
    {
      "Entreprise": "SANOFI"
    },
    {
      "Entreprise": "Sanoma Corporation"
    },
    {
      "Entreprise": "SANSHIN Inc."
    },
    {
      "Entreprise": "SANSHUZEN INDUSTRIAL MFG., INC."
    },
    {
      "Entreprise": "Santa Rita Estates"
    },
    {
      "Entreprise": "Santen Pharmaceutical Co., Ltd"
    },
    {
      "Entreprise": "SANWA INDUSTRY"
    },
    {
      "Entreprise": "SANXIN HEAVY INDUSTRY MACHINERY Co., Ltd."
    },
    {
      "Entreprise": "Sanyo Paper Co., Ltd."
    },
    {
      "Entreprise": "SAP SE"
    },
    {
      "Entreprise": "Sapphire Finishing Mills Limited"
    },
    {
      "Entreprise": "Sapphire Textile Mills Limited"
    },
    {
      "Entreprise": "Sapphire Utility Solutions"
    },
    {
      "Entreprise": "Sappi Limited"
    },
    {
      "Entreprise": "SAPPORO HOLDINGS LTD."
    },
    {
      "Entreprise": "Sarawak Energy Berhad"
    },
    {
      "Entreprise": "Sarena Textile Industries (Pvt.) Ltd."
    },
    {
      "Entreprise": "SAS Institute"
    },
    {
      "Entreprise": "Sasa Polyester Sanayi A.S."
    },
    {
      "Entreprise": "SATS Ltd."
    },
    {
      "Entreprise": "Saudi Telecom Company"
    },
    {
      "Entreprise": "Saur"
    },
    {
      "Entreprise": "Save The Duck S.p.A."
    },
    {
      "Entreprise": "SAVENCIA Fromage & Dairy"
    },
    {
      "Entreprise": "SAVERGLASS"
    },
    {
      "Entreprise": "Savills Plc"
    },
    {
      "Entreprise": "SBA Communications Corporation"
    },
    {
      "Entreprise": "SBAB"
    },
    {
      "Entreprise": "SBS Insurance Services Limited"
    },
    {
      "Entreprise": "SCA Investments LTD T/A Gousto"
    },
    {
      "Entreprise": "Scan Global Logistics A/S"
    },
    {
      "Entreprise": "ScandBook Holding AB"
    },
    {
      "Entreprise": "Scandi Standard AB"
    },
    {
      "Entreprise": "Scandinavian Airlines System Denmark-Norway-Sweden"
    },
    {
      "Entreprise": "Scandinavian Tobacco Group A/S"
    },
    {
      "Entreprise": "Scanfil Oyj"
    },
    {
      "Entreprise": "SCANIA CV"
    },
    {
      "Entreprise": "Scapa Inter AB"
    },
    {
      "Entreprise": "Scatec ASA"
    },
    {
      "Entreprise": "SCB X Public Company Limited"
    },
    {
      "Entreprise": "SCC Plc"
    },
    {
      "Entreprise": "SCG Packaging Public Company Limited"
    },
    {
      "Entreprise": "Schaeffler AG"
    },
    {
      "Entreprise": "Schindler Group"
    },
    {
      "Entreprise": "Schneider Electric"
    },
    {
      "Entreprise": "Scholle IPN Netherlands B.V."
    },
    {
      "Entreprise": "SCHRÉDER SA"
    },
    {
      "Entreprise": "Schreiber Foods"
    },
    {
      "Entreprise": "Schreiner Group GmbH & Co. KG"
    },
    {
      "Entreprise": "Schroders"
    },
    {
      "Entreprise": "Schüco International KG"
    },
    {
      "Entreprise": "Schülke & Mayr GmbH"
    },
    {
      "Entreprise": "Schuller Eh'klar Nordic ApS"
    },
    {
      "Entreprise": "Schwäbische Werkzeugmaschinen GmbH"
    },
    {
      "Entreprise": "Schwan STABILO Cosmetics GmbH & Co. KG"
    },
    {
      "Entreprise": "Schwarz Gruppe (Kaufland Stiftung, Lidl Stiftung, PreZero Stiftung, Schwarz Produktion)"
    },
    {
      "Entreprise": "Schweizer Zucker AG"
    },
    {
      "Entreprise": "Schweizerische Bundesbahnen SBB"
    },
    {
      "Entreprise": "SCI Environmental Group Ltd"
    },
    {
      "Entreprise": "SCM Garments PVT Limited"
    },
    {
      "Entreprise": "Scott Logic Limited"
    },
    {
      "Entreprise": "Scottish Hydro Electric Transmission Plc"
    },
    {
      "Entreprise": "Scottish Leather Group"
    },
    {
      "Entreprise": "Scottish Shellfish Marketing Group"
    },
    {
      "Entreprise": "ScottishPower"
    },
    {
      "Entreprise": "SCR-Sibelco NV"
    },
    {
      "Entreprise": "SCREEN Holdings Co., Ltd."
    },
    {
      "Entreprise": "SCSK Corporation"
    },
    {
      "Entreprise": "SDS CO LTD"
    },
    {
      "Entreprise": "Seaflower (Shanghai) Marine Co.,Ltd"
    },
    {
      "Entreprise": "Seagate Technology"
    },
    {
      "Entreprise": "Sealed Air Corp."
    },
    {
      "Entreprise": "Seasalt Limited"
    },
    {
      "Entreprise": "SEASONS (HK) LTD."
    },
    {
      "Entreprise": "SECAN INVESCAST INDIA PRIVATE LIMITED"
    },
    {
      "Entreprise": "Séché Environnement"
    },
    {
      "Entreprise": "SECIL – COMPANHIA GERAL DE CAL E CIMENTO, SA"
    },
    {
      "Entreprise": "SECOM Co., Ltd."
    },
    {
      "Entreprise": "SECURECORP PTY LTD"
    },
    {
      "Entreprise": "SecuriGroup Limited"
    },
    {
      "Entreprise": "Securitas AB"
    },
    {
      "Entreprise": "Sedgwick International UK"
    },
    {
      "Entreprise": "See Group"
    },
    {
      "Entreprise": "SEE Holding GmbH"
    },
    {
      "Entreprise": "SEEDWORKS INTERNATIONAL PRIVATE LIMITED"
    },
    {
      "Entreprise": "SeenThis AB"
    },
    {
      "Entreprise": "SEGRO plc,"
    },
    {
      "Entreprise": "Seifert Logistics GmbH"
    },
    {
      "Entreprise": "SEIKI INDUSTRY Co.,Ltd"
    },
    {
      "Entreprise": "SEIKI SHOKAI CO.LTD."
    },
    {
      "Entreprise": "SEIKITOKYU KOGYO CO., LTD."
    },
    {
      "Entreprise": "Seiko Epson Corporation"
    },
    {
      "Entreprise": "Seismic Change Sustainability Limited"
    },
    {
      "Entreprise": "Şekerbank T.A.Ş."
    },
    {
      "Entreprise": "SEKISUI CHEMICAL CO., LTD"
    },
    {
      "Entreprise": "Sekisui House, LTD"
    },
    {
      "Entreprise": "Selfridges Retail Ltd."
    },
    {
      "Entreprise": "SEMBA CORPORATION"
    },
    {
      "Entreprise": "Semcon AB"
    },
    {
      "Entreprise": "SEMIKRON Elektronik GmbH & Co. KG"
    },
    {
      "Entreprise": "Semler Gruppen"
    },
    {
      "Entreprise": "Sengenics Corporate Pte Ltd"
    },
    {
      "Entreprise": "Senior Plc"
    },
    {
      "Entreprise": "Serco Group Plc"
    },
    {
      "Entreprise": "Sergel Group"
    },
    {
      "Entreprise": "ServiceNow Inc."
    },
    {
      "Entreprise": "SERVIER"
    },
    {
      "Entreprise": "SES S.A."
    },
    {
      "Entreprise": "Seven & i Holdings Co., Ltd."
    },
    {
      "Entreprise": "Seventh Generation, Inc."
    },
    {
      "Entreprise": "Severfield plc"
    },
    {
      "Entreprise": "Severn Trent"
    },
    {
      "Entreprise": "SGS SA"
    },
    {
      "Entreprise": "SGV International LLC"
    },
    {
      "Entreprise": "Shaftesbury PLC"
    },
    {
      "Entreprise": "Shandong Innovation Metal Technology Co.,Ltd."
    },
    {
      "Entreprise": "SHANDONG NHU PHARMACEUTICAL CO., LTD."
    },
    {
      "Entreprise": "shandong yinying cooking machinery Co. Ltd"
    },
    {
      "Entreprise": "Shanghai Shenzhong Electric Integration Co., Ltd."
    },
    {
      "Entreprise": "Shanghai Sunrise Medical Technology Co., Ltd."
    },
    {
      "Entreprise": "Shanghai Sunwin Industry Group Co.,Ltd"
    },
    {
      "Entreprise": "Shanghai Zhijie Architectural Design Consulting Co., Ltd."
    },
    {
      "Entreprise": "Shanghai Zijiang Color Printing&Packing CO ., LTD"
    },
    {
      "Entreprise": "Shanying International Holdings Co., Ltd."
    },
    {
      "Entreprise": "Sharp Corporation"
    },
    {
      "Entreprise": "SHENMA INDUSTRIAL CO.,LTD."
    },
    {
      "Entreprise": "Shenzhen Bromake New Material Co.,Ltd."
    },
    {
      "Entreprise": "Shenzhen Horn Audio Co,.Ltd"
    },
    {
      "Entreprise": "SHI International Corp"
    },
    {
      "Entreprise": "Shields Environmental Group"
    },
    {
      "Entreprise": "Shilpa Alloys Private Limited"
    },
    {
      "Entreprise": "shimada INDUSTRIAL co.,ltd"
    },
    {
      "Entreprise": "SHIMADZU CORPORATION"
    },
    {
      "Entreprise": "Shimizu Corporation"
    },
    {
      "Entreprise": "Shin Kong Financial Holding Co., Ltd."
    },
    {
      "Entreprise": "Shinhan Financial Group"
    },
    {
      "Entreprise": "Shinku Ceramics Co.,Ltd."
    },
    {
      "Entreprise": "Shinnihon Printing, Inc."
    },
    {
      "Entreprise": "SHINNIHON-KINZOKU"
    },
    {
      "Entreprise": "Shinoda Co., Ltd."
    },
    {
      "Entreprise": "shinozaki mokko Co.,Ltd"
    },
    {
      "Entreprise": "Shinseinihonkinzoku Co., Ltd."
    },
    {
      "Entreprise": "SHINTAKUKOUSAN Co.,Ltd."
    },
    {
      "Entreprise": "SHINWA CONSTRUCTION CO., LTD"
    },
    {
      "Entreprise": "Shinwon Corporation"
    },
    {
      "Entreprise": "Shionogi & Co.,Ltd"
    },
    {
      "Entreprise": "Shiseido Company Limited"
    },
    {
      "Entreprise": "SHL Medical"
    },
    {
      "Entreprise": "Shoe Premier II (Cambodia) CO. Limited"
    },
    {
      "Entreprise": "Shoosmiths LLP"
    },
    {
      "Entreprise": "Shoprite Holdings (Pty) Ltd"
    },
    {
      "Entreprise": "Showcase Interiors"
    },
    {
      "Entreprise": "Shoyodenko Co.,Ltd."
    },
    {
      "Entreprise": "Shree Cement Ltd."
    },
    {
      "Entreprise": "SHS - Stahl - Holding - Saar"
    },
    {
      "Entreprise": "Shui On Land Limited"
    },
    {
      "Entreprise": "SHYANG SHIN BAO INDUSTRIAL CO., LTD"
    },
    {
      "Entreprise": "Sia Partners"
    },
    {
      "Entreprise": "Siam Cement Public Company Limited (SCG)"
    },
    {
      "Entreprise": "Sibanye-Stillwater"
    },
    {
      "Entreprise": "SICAL"
    },
    {
      "Entreprise": "Sichuan Yongxiang Co., LTD."
    },
    {
      "Entreprise": "Sichuan Zhongguang Lightning Protection Technologies Co., Ltd."
    },
    {
      "Entreprise": "Siddiqsons Limited"
    },
    {
      "Entreprise": "SIDEL Group"
    },
    {
      "Entreprise": "SIDENOR ACEROS ESPECIALES S.L.U"
    },
    {
      "Entreprise": "Sidi Kerir Petrochemicals Co. (SIDPEC)"
    },
    {
      "Entreprise": "Siegfried Holding AG"
    },
    {
      "Entreprise": "Siegwerk Druckfarben AG & Co. KGaA"
    },
    {
      "Entreprise": "Siemens AG"
    },
    {
      "Entreprise": "Siemens Energy"
    },
    {
      "Entreprise": "Siemens Gamesa Renewable Energy, S.A."
    },
    {
      "Entreprise": "Siemens Healthineers AG"
    },
    {
      "Entreprise": "Siemon"
    },
    {
      "Entreprise": "SIG Combibloc"
    },
    {
      "Entreprise": "Sigma Alimentos, S. A. de C. V."
    },
    {
      "Entreprise": "SIGMA Corporation"
    },
    {
      "Entreprise": "SigmaRoc"
    },
    {
      "Entreprise": "Signal Agency Ltd"
    },
    {
      "Entreprise": "Signify"
    },
    {
      "Entreprise": "SIK MAKAS GIYIM SAN VE TIC A.S"
    },
    {
      "Entreprise": "Sika AG"
    },
    {
      "Entreprise": "SILAB"
    },
    {
      "Entreprise": "Silentnight Group"
    },
    {
      "Entreprise": "Silgan Closures"
    },
    {
      "Entreprise": "Silgan Plastics"
    },
    {
      "Entreprise": "Siltronic AG"
    },
    {
      "Entreprise": "Silver Fern Farms Limited"
    },
    {
      "Entreprise": "SILVERA"
    },
    {
      "Entreprise": "Simarco International Limited"
    },
    {
      "Entreprise": "Sime Darby Plantation Berhad"
    },
    {
      "Entreprise": "Simmons & Simmons"
    },
    {
      "Entreprise": "Simões, Lda"
    },
    {
      "Entreprise": "Simon Property Group"
    },
    {
      "Entreprise": "Simon, Kucher & Co. Holding GmbH"
    },
    {
      "Entreprise": "Simplo Technology Co., Ltd."
    },
    {
      "Entreprise": "Singapore Exchange Limited"
    },
    {
      "Entreprise": "Singapore Telecommunications Limited (Singtel)"
    },
    {
      "Entreprise": "Sinituote Oy"
    },
    {
      "Entreprise": "Sino Land Company Limited"
    },
    {
      "Entreprise": "SinoPac Financial Holdings Company Limited"
    },
    {
      "Entreprise": "Sinova GmbH"
    },
    {
      "Entreprise": "Sinyi Realty Inc."
    },
    {
      "Entreprise": "Sipsmith"
    },
    {
      "Entreprise": "Sir Robert McAlphine"
    },
    {
      "Entreprise": "SIRO DAC"
    },
    {
      "Entreprise": "SITA"
    },
    {
      "Entreprise": "SIX"
    },
    {
      "Entreprise": "SK CHEMICALS CO.,LTD."
    },
    {
      "Entreprise": "SK ecoplant"
    },
    {
      "Entreprise": "SK Inc."
    },
    {
      "Entreprise": "SK Networks Co., Ltd."
    },
    {
      "Entreprise": "SK Securities, Co., Ltd"
    },
    {
      "Entreprise": "SK Telecom"
    },
    {
      "Entreprise": "Skanska AB"
    },
    {
      "Entreprise": "Skidmore, Owings and Merrill LLP"
    },
    {
      "Entreprise": "Skipton Building Society"
    },
    {
      "Entreprise": "SKIS ROSSIGNOL SAS"
    },
    {
      "Entreprise": "Skunkfunk"
    },
    {
      "Entreprise": "Sky Group"
    },
    {
      "Entreprise": "SkyCell AG"
    },
    {
      "Entreprise": "SKYCITY Entertainment Group Limited"
    },
    {
      "Entreprise": "Skymark PromoPrints"
    },
    {
      "Entreprise": "SkyPower Global"
    },
    {
      "Entreprise": "SL Green Realty Corp."
    },
    {
      "Entreprise": "Slalom"
    },
    {
      "Entreprise": "Slaughter and May"
    },
    {
      "Entreprise": "SLR Global Ltd"
    },
    {
      "Entreprise": "Smart Energy Co., Ltd."
    },
    {
      "Entreprise": "Smart Phases Inc. (DBA Novacab)"
    },
    {
      "Entreprise": "SMCP GROUP"
    },
    {
      "Entreprise": "SMEC ANZ"
    },
    {
      "Entreprise": "Smithfield Foods"
    },
    {
      "Entreprise": "Smiths Group PLC"
    },
    {
      "Entreprise": "Smoore International Holdings Limited"
    },
    {
      "Entreprise": "Smurfit Kappa Group"
    },
    {
      "Entreprise": "Snap Inc."
    },
    {
      "Entreprise": "SNC-LAVALIN GROUP INC."
    },
    {
      "Entreprise": "Soane Britain"
    },
    {
      "Entreprise": "SOCAPS"
    },
    {
      "Entreprise": "Société Foncière Lyonnaise"
    },
    {
      "Entreprise": "Sodexo"
    },
    {
      "Entreprise": "Sodexo Limited"
    },
    {
      "Entreprise": "Sodexo Pass Belgium"
    },
    {
      "Entreprise": "Sodexo Pass International SAS"
    },
    {
      "Entreprise": "Sodiaal Union"
    },
    {
      "Entreprise": "Södra Skogsägarna ekonomisk förening"
    },
    {
      "Entreprise": "Sofidel S.p.A."
    },
    {
      "Entreprise": "SoftBank Corp."
    },
    {
      "Entreprise": "Softcat plc"
    },
    {
      "Entreprise": "SOGIRI Co., Ltd."
    },
    {
      "Entreprise": "Soil Engineering Geoservices Limited"
    },
    {
      "Entreprise": "Soitec"
    },
    {
      "Entreprise": "SOK Corporation"
    },
    {
      "Entreprise": "SOL-PLUS CO.,LTD"
    },
    {
      "Entreprise": "Solactive AG"
    },
    {
      "Entreprise": "Solar A/S"
    },
    {
      "Entreprise": "SOLARIA ENERGIA Y MEDIO AMBIENTE"
    },
    {
      "Entreprise": "SOLARPACK CORPORACIÓN TECNOLÓGICA S.A.U."
    },
    {
      "Entreprise": "Solera Holdings"
    },
    {
      "Entreprise": "Solita Oy"
    },
    {
      "Entreprise": "Solo LLC"
    },
    {
      "Entreprise": "Solvay"
    },
    {
      "Entreprise": "Solverminds Solutions & Technologies Pvt Ltd"
    },
    {
      "Entreprise": "SOMFY"
    },
    {
      "Entreprise": "Sompo Holdings, Inc."
    },
    {
      "Entreprise": "Sonepar"
    },
    {
      "Entreprise": "Songan Printing (Shenzhen) Co., Ltd"
    },
    {
      "Entreprise": "Sonoco Products Company"
    },
    {
      "Entreprise": "Sonova Holding AG"
    },
    {
      "Entreprise": "Sony Group Corporation"
    },
    {
      "Entreprise": "Soorty Enterprises (Pvt) Ltd."
    },
    {
      "Entreprise": "Sopra Steria Group"
    },
    {
      "Entreprise": "Sörby Handelsträdgård Aktiebolag"
    },
    {
      "Entreprise": "South Asia Textiles Limited"
    },
    {
      "Entreprise": "South East Water"
    },
    {
      "Entreprise": "South Pole"
    },
    {
      "Entreprise": "SP Energy Networks"
    },
    {
      "Entreprise": "Space Group"
    },
    {
      "Entreprise": "Space Matrix Design Consultants Pte Ltd"
    },
    {
      "Entreprise": "SPADEL SA"
    },
    {
      "Entreprise": "SpareBank 1 Østlandet"
    },
    {
      "Entreprise": "Sparebanken Vest"
    },
    {
      "Entreprise": "Spark New Zealand"
    },
    {
      "Entreprise": "Sparks Marketing LLC"
    },
    {
      "Entreprise": "Specialfastigheter Sverige AB"
    },
    {
      "Entreprise": "Specialist Lines Ltd"
    },
    {
      "Entreprise": "Spectris plc"
    },
    {
      "Entreprise": "Speed Global Transportation Limited."
    },
    {
      "Entreprise": "Speedy Asset Services Ltd"
    },
    {
      "Entreprise": "Speira"
    },
    {
      "Entreprise": "Spendrups Bryggeri AB"
    },
    {
      "Entreprise": "Sphera"
    },
    {
      "Entreprise": "SPIE"
    },
    {
      "Entreprise": "Spinko Ltd"
    },
    {
      "Entreprise": "Spirax-Sarco Engineering plc"
    },
    {
      "Entreprise": "SPL Powerlines UK Ltd"
    },
    {
      "Entreprise": "Splunk Inc."
    },
    {
      "Entreprise": "Sponda Ltd"
    },
    {
      "Entreprise": "Sportler S.p.a."
    },
    {
      "Entreprise": "Spreafico Francesco & F.lli S.p.A."
    },
    {
      "Entreprise": "Springer Nature"
    },
    {
      "Entreprise": "Sprout Europ ApS"
    },
    {
      "Entreprise": "SQM"
    },
    {
      "Entreprise": "SQUARE"
    },
    {
      "Entreprise": "SquareTrade Europe Limited"
    },
    {
      "Entreprise": "Squire Patton Boggs UK LLP"
    },
    {
      "Entreprise": "SRI SPK INTERNATIONAL"
    },
    {
      "Entreprise": "SSAB"
    },
    {
      "Entreprise": "SSE"
    },
    {
      "Entreprise": "SSEN Distribution"
    },
    {
      "Entreprise": "SSOE Group"
    },
    {
      "Entreprise": "SSP Group plc"
    },
    {
      "Entreprise": "St. James's Place"
    },
    {
      "Entreprise": "St. Modwen Properties PLC"
    },
    {
      "Entreprise": "STAG Industrial, Inc."
    },
    {
      "Entreprise": "Stagecoach Group plc"
    },
    {
      "Entreprise": "Stahl Holdings B.V."
    },
    {
      "Entreprise": "Standard Chartered Bank"
    },
    {
      "Entreprise": "Stanhope Plc"
    },
    {
      "Entreprise": "Stanley Black & Decker"
    },
    {
      "Entreprise": "Stantec Inc."
    },
    {
      "Entreprise": "Stanton Williams"
    },
    {
      "Entreprise": "Staples Inc."
    },
    {
      "Entreprise": "Star Asia Trading Pte.Ltd"
    },
    {
      "Entreprise": "Starboard, Airush & SOMWR"
    },
    {
      "Entreprise": "Starbucks Coffee Company"
    },
    {
      "Entreprise": "StarHub Ltd"
    },
    {
      "Entreprise": "STARK Group"
    },
    {
      "Entreprise": "Starling Bank"
    },
    {
      "Entreprise": "Starzen Co., Ltd."
    },
    {
      "Entreprise": "Statik"
    },
    {
      "Entreprise": "Statnett SF"
    },
    {
      "Entreprise": "Staycity"
    },
    {
      "Entreprise": "Staycold Export Ltd"
    },
    {
      "Entreprise": "STCH INTEGRATED MARKETING SOLUTION PRIVATE LIMITED"
    },
    {
      "Entreprise": "Steelcase Inc."
    },
    {
      "Entreprise": "Steengoed Projecten CV"
    },
    {
      "Entreprise": "Steffco Limited t/a Resource"
    },
    {
      "Entreprise": "Stella McCartney"
    },
    {
      "Entreprise": "Stena Aluminium AB"
    },
    {
      "Entreprise": "Stena Recycling AB"
    },
    {
      "Entreprise": "Stena Recycling Group"
    },
    {
      "Entreprise": "Stephen Webster Ltd"
    },
    {
      "Entreprise": "Sterlite Technologies"
    },
    {
      "Entreprise": "STERNE GROUP"
    },
    {
      "Entreprise": "STHREE PLC"
    },
    {
      "Entreprise": "Stibo Software Group A/S"
    },
    {
      "Entreprise": "Stillfront Group AB (publ)"
    },
    {
      "Entreprise": "STMicroelectronics NV"
    },
    {
      "Entreprise": "Sto NV"
    },
    {
      "Entreprise": "Stockland Corporation Limited and Stockland Trust"
    },
    {
      "Entreprise": "Stockmann Oyj Abp"
    },
    {
      "Entreprise": "Stoelzle Glass Group"
    },
    {
      "Entreprise": "Stokke AS"
    },
    {
      "Entreprise": "Stonemen Crafts India Pvt. Ltd."
    },
    {
      "Entreprise": "Stonyfield"
    },
    {
      "Entreprise": "Stora Enso"
    },
    {
      "Entreprise": "Storable"
    },
    {
      "Entreprise": "Storebrand ASA"
    },
    {
      "Entreprise": "Storskogen Group"
    },
    {
      "Entreprise": "Story Contracting Ltd"
    },
    {
      "Entreprise": "Storytel AB (publ)"
    },
    {
      "Entreprise": "STP Holding GmbH"
    },
    {
      "Entreprise": "STRATEC SE"
    },
    {
      "Entreprise": "Strategic Sports Ltd."
    },
    {
      "Entreprise": "Straub-Verpackungen GmbH"
    },
    {
      "Entreprise": "Straumann Holding AG"
    },
    {
      "Entreprise": "Stretchline Holdings Limited"
    },
    {
      "Entreprise": "Stryhns AS"
    },
    {
      "Entreprise": "Stuart Delivery"
    },
    {
      "Entreprise": "STUDIO ONION CO., Ltd."
    },
    {
      "Entreprise": "Studio XAG"
    },
    {
      "Entreprise": "STV Group plc"
    },
    {
      "Entreprise": "Style Textile (Pvt.) Ltd."
    },
    {
      "Entreprise": "Stylers International Limited"
    },
    {
      "Entreprise": "SUCHEME Groupe"
    },
    {
      "Entreprise": "Sucocítrico Cutrale"
    },
    {
      "Entreprise": "SÜDPACK Holding GmbH"
    },
    {
      "Entreprise": "Südzucker AG (Group)"
    },
    {
      "Entreprise": "SUEZ"
    },
    {
      "Entreprise": "Suichang Dexin Casting Steel Co.,Ltd."
    },
    {
      "Entreprise": "Sulzer Management AG"
    },
    {
      "Entreprise": "SUMIDA CORPORATION"
    },
    {
      "Entreprise": "SUMITOMO CHEMICAL Co., Ltd."
    },
    {
      "Entreprise": "Sumitomo Electric Industries, Ltd."
    },
    {
      "Entreprise": "Sumitomo Forestry Co., Ltd"
    },
    {
      "Entreprise": "Sumitomo Pharma Co., Ltd."
    },
    {
      "Entreprise": "SUMITOMO RUBBER INDUSTRIES,LTD."
    },
    {
      "Entreprise": "Summa Equity"
    },
    {
      "Entreprise": "Sun King"
    },
    {
      "Entreprise": "SUND Holding GmbH + Co. KG"
    },
    {
      "Entreprise": "Sunny Wheel Industrial Co., Ltd."
    },
    {
      "Entreprise": "SUNREX TECHNOLOGY CORP."
    },
    {
      "Entreprise": "SunRice (listed as RiceGrowers Limited)"
    },
    {
      "Entreprise": "Sunrise GmbH"
    },
    {
      "Entreprise": "Sunrock Investments B.V."
    },
    {
      "Entreprise": "Sunrun Inc."
    },
    {
      "Entreprise": "Suntory Beverage & Food Limited"
    },
    {
      "Entreprise": "Suntory Holdings Limited"
    },
    {
      "Entreprise": "Sunway Berhad"
    },
    {
      "Entreprise": "Sunway REIT"
    },
    {
      "Entreprise": "Super Micro Computer, Inc."
    },
    {
      "Entreprise": "Superdry plc"
    },
    {
      "Entreprise": "Superior Essex International LP"
    },
    {
      "Entreprise": "Supporting Education Group"
    },
    {
      "Entreprise": "Surge Alloys Pvt Ltd"
    },
    {
      "Entreprise": "SURTECO Group SE"
    },
    {
      "Entreprise": "SUSE"
    },
    {
      "Entreprise": "sustainable AG"
    },
    {
      "Entreprise": "Sustainable Harvest Coffee Importers"
    },
    {
      "Entreprise": "Sustana"
    },
    {
      "Entreprise": "Suzaki Kogyosho Co., Ltd."
    },
    {
      "Entreprise": "Suzano S/A"
    },
    {
      "Entreprise": "Suzhou Bearing Factory Co Ltd.（SBF）"
    },
    {
      "Entreprise": "Suzhou Dongshan Precision Manufacturing Co., Ltd."
    },
    {
      "Entreprise": "Suzuki Special Steel Co., Ltd"
    },
    {
      "Entreprise": "SUZUSHO TRANSPORT"
    },
    {
      "Entreprise": "SV Group AG"
    },
    {
      "Entreprise": "Sveaskog AB"
    },
    {
      "Entreprise": "Svenska Handelsbanken publ."
    },
    {
      "Entreprise": "Svenska spel"
    },
    {
      "Entreprise": "SVOLT Energy Technology"
    },
    {
      "Entreprise": "SW Bruce & Co. Ltd"
    },
    {
      "Entreprise": "Swaraj Engines Limited"
    },
    {
      "Entreprise": "Swarovski"
    },
    {
      "Entreprise": "Sweaty Betty Limited"
    },
    {
      "Entreprise": "Sweco"
    },
    {
      "Entreprise": "Swedbank AB"
    },
    {
      "Entreprise": "Swedish Match"
    },
    {
      "Entreprise": "SWIFT"
    },
    {
      "Entreprise": "Swire Coca-Cola Limited"
    },
    {
      "Entreprise": "Swire Properties Limited"
    },
    {
      "Entreprise": "Swiss Post"
    },
    {
      "Entreprise": "Swiss Re"
    },
    {
      "Entreprise": "Swiss Steel Holding AG"
    },
    {
      "Entreprise": "SwissChem AG"
    },
    {
      "Entreprise": "Swisscom"
    },
    {
      "Entreprise": "Switch Mobility Limited"
    },
    {
      "Entreprise": "Sycomore Asset Management"
    },
    {
      "Entreprise": "Sycomp A Technology Company, Inc."
    },
    {
      "Entreprise": "SydGrönt Ekonomisk Förening"
    },
    {
      "Entreprise": "Sylvamo Corporation"
    },
    {
      "Entreprise": "Symrise AG"
    },
    {
      "Entreprise": "Syneos Health, Inc."
    },
    {
      "Entreprise": "Synergy Global Housing"
    },
    {
      "Entreprise": "SYNETIQ Ltd"
    },
    {
      "Entreprise": "Syngenta"
    },
    {
      "Entreprise": "Synlait Milk Limited"
    },
    {
      "Entreprise": "Synopsys, Inc."
    },
    {
      "Entreprise": "Synpulse International AG"
    },
    {
      "Entreprise": "Syntegon Technology GmbH"
    },
    {
      "Entreprise": "Synthomer plc"
    },
    {
      "Entreprise": "Sysco Corporation"
    },
    {
      "Entreprise": "SYSMEX CORPORATION"
    },
    {
      "Entreprise": "System Standex A/S"
    },
    {
      "Entreprise": "Systemair AB"
    },
    {
      "Entreprise": "Systembolaget AB"
    },
    {
      "Entreprise": "SYSTRA Limited"
    },
    {
      "Entreprise": "Szerelmey Ltd"
    },
    {
      "Entreprise": "Søstrene Grenes Holding ApS"
    },
    {
      "Entreprise": "T-Mobile Nederland B.V."
    },
    {
      "Entreprise": "T-Mobile USA, Inc."
    },
    {
      "Entreprise": "T.GARANT_ BANKASI A._."
    },
    {
      "Entreprise": "Tactus Group"
    },
    {
      "Entreprise": "Tag Worldwide Holdings Ltd (UK)"
    },
    {
      "Entreprise": "Tai Wah Garment Industry Sdn. Bhd."
    },
    {
      "Entreprise": "Taiga Apparel (Pvt.) Limited"
    },
    {
      "Entreprise": "TAIHO PHARMACEUTICAL CO., LTD"
    },
    {
      "Entreprise": "Taisei Corporation"
    },
    {
      "Entreprise": "Taishin Financial Holdings"
    },
    {
      "Entreprise": "Taiwan Cement Corporation"
    },
    {
      "Entreprise": "Taiwan Cooperative Financial Holding Company, Ltd."
    },
    {
      "Entreprise": "Taiwan Mobile Co., Ltd"
    },
    {
      "Entreprise": "TAIWAN PAIHO LIMITED"
    },
    {
      "Entreprise": "Taiyo Co., Ltd."
    },
    {
      "Entreprise": "Takachiho Shirasu Corp."
    },
    {
      "Entreprise": "TAKAHASHI METAL CO.,LTD."
    },
    {
      "Entreprise": "Takasago International Corporation"
    },
    {
      "Entreprise": "Takasago Thermal Engineering"
    },
    {
      "Entreprise": "Takeda Pharmaceutical Company"
    },
    {
      "Entreprise": "TAKENAKA CORPORATION"
    },
    {
      "Entreprise": "takeuchimokuzaikougyou Co.,Ltd"
    },
    {
      "Entreprise": "TAL Apparel Ltd"
    },
    {
      "Entreprise": "TALAWAKELLE TEA ESTATES PLC"
    },
    {
      "Entreprise": "TalkTalk"
    },
    {
      "Entreprise": "Talodyn Networks Private Limited"
    },
    {
      "Entreprise": "Tammer Brands"
    },
    {
      "Entreprise": "Tangshan Dongya Heavy-Industry Equipment Co.,Ltd."
    },
    {
      "Entreprise": "Tanihata Co., Ltd.,"
    },
    {
      "Entreprise": "Taos Ski Valley Inc."
    },
    {
      "Entreprise": "Tapestry, Inc."
    },
    {
      "Entreprise": "Target Corporation"
    },
    {
      "Entreprise": "Tarkett"
    },
    {
      "Entreprise": "TATA AIG GENERAL INSURANCE COMPANY LIMITED"
    },
    {
      "Entreprise": "TATA CHEMICALS LIMITED"
    },
    {
      "Entreprise": "Tata Communications Limited"
    },
    {
      "Entreprise": "Tata Consultancy Services Limited"
    },
    {
      "Entreprise": "TATA GLOBAL BEVERAGES Ltd."
    },
    {
      "Entreprise": "Tata Motors Limited"
    },
    {
      "Entreprise": "Tate & Lyle PLC"
    },
    {
      "Entreprise": "Taylor Project Services"
    },
    {
      "Entreprise": "Taylor Wimpey"
    },
    {
      "Entreprise": "Taylors Wines"
    },
    {
      "Entreprise": "Taziker Industrial Ltd"
    },
    {
      "Entreprise": "TAZO"
    },
    {
      "Entreprise": "TBM Co., Ltd."
    },
    {
      "Entreprise": "TCE Jeans Co., Ltd"
    },
    {
      "Entreprise": "TCE Vina Denim Joint Stock Company"
    },
    {
      "Entreprise": "Tchibo GmbH"
    },
    {
      "Entreprise": "TCI Co., Ltd."
    },
    {
      "Entreprise": "TCL King Electrical Appliance (HuiZhou) CO.,Ltd."
    },
    {
      "Entreprise": "TCS Group Holding plc"
    },
    {
      "Entreprise": "TCT-Speditions GmbH"
    },
    {
      "Entreprise": "TD SYNNEX"
    },
    {
      "Entreprise": "TDC NET A/S"
    },
    {
      "Entreprise": "TDK Corporation"
    },
    {
      "Entreprise": "TE Connectivity Ltd"
    },
    {
      "Entreprise": "Teachers Mutual Bank"
    },
    {
      "Entreprise": "TeamViewer AG"
    },
    {
      "Entreprise": "Teamwork"
    },
    {
      "Entreprise": "TEAMWORK Agentur für angewandtes Marketing"
    },
    {
      "Entreprise": "Tecan Group Ltd."
    },
    {
      "Entreprise": "Tech Mahindra"
    },
    {
      "Entreprise": "Technicolor S.A."
    },
    {
      "Entreprise": "Techtronic Industries Company Limited"
    },
    {
      "Entreprise": "Técnicas Reunidas S.A."
    },
    {
      "Entreprise": "Tecnova Preparação de Materiais"
    },
    {
      "Entreprise": "Ted Baker"
    },
    {
      "Entreprise": "Teddy Group"
    },
    {
      "Entreprise": "Tediber"
    },
    {
      "Entreprise": "Teejay India Private Limited"
    },
    {
      "Entreprise": "Teejay Lanka PLC"
    },
    {
      "Entreprise": "Teejay Lanka Prints Private Limited"
    },
    {
      "Entreprise": "Teijin limited"
    },
    {
      "Entreprise": "TeKaNet GmbH Telekommunikationsservice"
    },
    {
      "Entreprise": "TEKKEN CORPORATION"
    },
    {
      "Entreprise": "Teknikum Group Ltd."
    },
    {
      "Entreprise": "Teknion Limited"
    },
    {
      "Entreprise": "Tektro Technology Corp."
    },
    {
      "Entreprise": "Tele2 AB"
    },
    {
      "Entreprise": "Teleflex"
    },
    {
      "Entreprise": "TELEFÓNICA"
    },
    {
      "Entreprise": "Telehouse Corporation of Europe"
    },
    {
      "Entreprise": "Telenet Group NV"
    },
    {
      "Entreprise": "Telenor Group"
    },
    {
      "Entreprise": "Telent Technology Services Ltd"
    },
    {
      "Entreprise": "Teleperformance"
    },
    {
      "Entreprise": "Telia Company AB"
    },
    {
      "Entreprise": "Telkom SA SOC Limited"
    },
    {
      "Entreprise": "Telstra"
    },
    {
      "Entreprise": "TELUS Corporation"
    },
    {
      "Entreprise": "Temenos AG"
    },
    {
      "Entreprise": "Temsa Skoda Sabancı Ulaşım Araçları A.Ş."
    },
    {
      "Entreprise": "Ten Tree International Inc"
    },
    {
      "Entreprise": "Tencent Holding Limited"
    },
    {
      "Entreprise": "Tendam Retail S.A."
    },
    {
      "Entreprise": "Tennant Company"
    },
    {
      "Entreprise": "TenneT Holding B.V."
    },
    {
      "Entreprise": "TERADA CO.,Ltd"
    },
    {
      "Entreprise": "TERAO HOLDINGS Co.,Ltd."
    },
    {
      "Entreprise": "TERENGGANU SILICA CONSORTIUM SDN BHD"
    },
    {
      "Entreprise": "TEREOS"
    },
    {
      "Entreprise": "Terna S.p.A."
    },
    {
      "Entreprise": "Terra Alpha Investments LLC"
    },
    {
      "Entreprise": "Terratech Group AB"
    },
    {
      "Entreprise": "Terumo Corporatio"
    },
    {
      "Entreprise": "TES 2000 Ltd"
    },
    {
      "Entreprise": "Tesco"
    },
    {
      "Entreprise": "Tesla Inc."
    },
    {
      "Entreprise": "TETRA PAK"
    },
    {
      "Entreprise": "Tetra Tech"
    },
    {
      "Entreprise": "Teva Pharmaceutical Industries Ltd."
    },
    {
      "Entreprise": "TEXEN"
    },
    {
      "Entreprise": "TF Architecture Ltd"
    },
    {
      "Entreprise": "TF Value-Mart Sdn. Bhd."
    },
    {
      "Entreprise": "TFG Brands (London) Limited"
    },
    {
      "Entreprise": "Thai Beverage PLC"
    },
    {
      "Entreprise": "Thai Union Group Public Company Limited"
    },
    {
      "Entreprise": "Thales SA"
    },
    {
      "Entreprise": "Thalys"
    },
    {
      "Entreprise": "The Anderson-DuBose Company"
    },
    {
      "Entreprise": "The ANSCO Co., Ltd."
    },
    {
      "Entreprise": "The Arnotts Group"
    },
    {
      "Entreprise": "The AZEK Company"
    },
    {
      "Entreprise": "The Berkeley Group Holdings plc"
    },
    {
      "Entreprise": "The British Land Company PLC"
    },
    {
      "Entreprise": "The British Standards Institution (BSI)"
    },
    {
      "Entreprise": "The Cadmus Group LLC"
    },
    {
      "Entreprise": "The Carbon Trust"
    },
    {
      "Entreprise": "The Carey Group Ltd"
    },
    {
      "Entreprise": "The Central America Bottling Corporation (cbc)"
    },
    {
      "Entreprise": "The Cheesecake Factory"
    },
    {
      "Entreprise": "The Chemours Company"
    },
    {
      "Entreprise": "The Children's Place, Inc."
    },
    {
      "Entreprise": "The Clorox Company"
    },
    {
      "Entreprise": "The Co-operative Group Ltd."
    },
    {
      "Entreprise": "The Coca-Cola Company"
    },
    {
      "Entreprise": "The Compleat Food Group"
    },
    {
      "Entreprise": "The Contact Company Limited"
    },
    {
      "Entreprise": "The Economist Group"
    },
    {
      "Entreprise": "The Edrington Group Limited"
    },
    {
      "Entreprise": "The Encore Group (Envelopes & Packaging) Limited"
    },
    {
      "Entreprise": "The Energy Saving Trust Limited"
    },
    {
      "Entreprise": "The Estée Lauder Companies"
    },
    {
      "Entreprise": "The Financial Conduct Authority"
    },
    {
      "Entreprise": "The Financial Times Limited"
    },
    {
      "Entreprise": "The GDM Group Limited"
    },
    {
      "Entreprise": "The Goodyear Tire & Rubber Company"
    },
    {
      "Entreprise": "The Gym Group plc"
    },
    {
      "Entreprise": "The Hain Celestial Group, Inc."
    },
    {
      "Entreprise": "The HAVI Group, LP"
    },
    {
      "Entreprise": "The Hershey Company"
    },
    {
      "Entreprise": "The Home Depot"
    },
    {
      "Entreprise": "The Hongkong & Shanghai Hotels, Limited"
    },
    {
      "Entreprise": "The Howard de Walden Estate"
    },
    {
      "Entreprise": "The Howard Hughes Corporation"
    },
    {
      "Entreprise": "The iLUKA Collective Ltd"
    },
    {
      "Entreprise": "The J.M. Smucker Company"
    },
    {
      "Entreprise": "The Keystone Group"
    },
    {
      "Entreprise": "The Kroger Co."
    },
    {
      "Entreprise": "The Lego Group"
    },
    {
      "Entreprise": "The Lift Consultancy"
    },
    {
      "Entreprise": "The Lux Collective Ltd"
    },
    {
      "Entreprise": "The LYCRA Company"
    },
    {
      "Entreprise": "The Macerich Company"
    },
    {
      "Entreprise": "The Martin-Brower Company, L.C.C."
    },
    {
      "Entreprise": "The Midcounties Co-operative"
    },
    {
      "Entreprise": "The MISSION Group PLC"
    },
    {
      "Entreprise": "the nature network / MB-Holding (MartinBauer, Finzelberg, PhytoLab, Europlant Group)"
    },
    {
      "Entreprise": "The Navigator Company, S.A."
    },
    {
      "Entreprise": "The ODP Corporation"
    },
    {
      "Entreprise": "The Packaging Group GmbH"
    },
    {
      "Entreprise": "The Port Authority of New York and New Jersey"
    },
    {
      "Entreprise": "The Positive Thinking Company S.A."
    },
    {
      "Entreprise": "The Renewables Infrastructure Group Limited"
    },
    {
      "Entreprise": "The RMR Group LLC"
    },
    {
      "Entreprise": "The Royal Mint Limited"
    },
    {
      "Entreprise": "The Schneider Group"
    },
    {
      "Entreprise": "The Shanghai Commercial & Savings Bank, Ltd."
    },
    {
      "Entreprise": "The Southern Co-operative"
    },
    {
      "Entreprise": "The Straits Network Limited"
    },
    {
      "Entreprise": "The Student Hotel"
    },
    {
      "Entreprise": "The Tata Power Company Limited"
    },
    {
      "Entreprise": "The Travel Chapter Limited"
    },
    {
      "Entreprise": "The Travel Corporation"
    },
    {
      "Entreprise": "The VELUX Group"
    },
    {
      "Entreprise": "The Very Group"
    },
    {
      "Entreprise": "The Wendy's Company"
    },
    {
      "Entreprise": "The Wilderness Group"
    },
    {
      "Entreprise": "Thermo Fisher Scientific Inc."
    },
    {
      "Entreprise": "Thermoplan AG"
    },
    {
      "Entreprise": "THESIZE SURFACES S.L."
    },
    {
      "Entreprise": "THG PLC"
    },
    {
      "Entreprise": "Thinkproject Holding GmbH"
    },
    {
      "Entreprise": "thinkstep-anz"
    },
    {
      "Entreprise": "Third Rock Finland Oy"
    },
    {
      "Entreprise": "Thise Mejeri AmbA"
    },
    {
      "Entreprise": "Thompson Cole Ltd"
    },
    {
      "Entreprise": "Thomson Reuters"
    },
    {
      "Entreprise": "Thong Thai Textile Group"
    },
    {
      "Entreprise": "Thor Industries, Inc."
    },
    {
      "Entreprise": "ThoughtWorks, Inc."
    },
    {
      "Entreprise": "Thrace Group"
    },
    {
      "Entreprise": "Thrust Carbon Ltd"
    },
    {
      "Entreprise": "Thule Group"
    },
    {
      "Entreprise": "thyssenkrupp AG"
    },
    {
      "Entreprise": "thyssenkrupp Steel Europe AG"
    },
    {
      "Entreprise": "Tianjin Heavy Steel Mechanical Equipment Co.,Ltd."
    },
    {
      "Entreprise": "TIER Mobility SE"
    },
    {
      "Entreprise": "TietoEVRY"
    },
    {
      "Entreprise": "Tiffany & Co."
    },
    {
      "Entreprise": "TIM Group"
    },
    {
      "Entreprise": "Timberlink Australia | New Zealand"
    },
    {
      "Entreprise": "Tintex Textiles, S.A"
    },
    {
      "Entreprise": "TIS Inc."
    },
    {
      "Entreprise": "TITAN Cement Group"
    },
    {
      "Entreprise": "TK Elevator GmbH"
    },
    {
      "Entreprise": "TKF"
    },
    {
      "Entreprise": "TLT LLP"
    },
    {
      "Entreprise": "TMB Logistik GmbH"
    },
    {
      "Entreprise": "TMG Automotive"
    },
    {
      "Entreprise": "TMS Consultancy t/a Antaris Consulting"
    },
    {
      "Entreprise": "TNG Stadtnetz GmbH"
    },
    {
      "Entreprise": "TOA Corporation"
    },
    {
      "Entreprise": "Tobermore"
    },
    {
      "Entreprise": "Tobishima Corporation"
    },
    {
      "Entreprise": "Tochishu Co., Ltd."
    },
    {
      "Entreprise": "TOCLAS CORPORATION"
    },
    {
      "Entreprise": "TODA Corporation"
    },
    {
      "Entreprise": "Tofaş A.Ş"
    },
    {
      "Entreprise": "Toitū Envirocare"
    },
    {
      "Entreprise": "Tokai Maintenace Control Co.,ltd"
    },
    {
      "Entreprise": "TOKAI SHOHAN CO.,LTD"
    },
    {
      "Entreprise": "Tokio Marine Holdings, Inc."
    },
    {
      "Entreprise": "TOKIUM, Inc."
    },
    {
      "Entreprise": "Tokmanni Oy"
    },
    {
      "Entreprise": "TOKUKURA Co.,Ltd."
    },
    {
      "Entreprise": "Tokuyama Corporation"
    },
    {
      "Entreprise": "Tokyo Electron Limited"
    },
    {
      "Entreprise": "Tokyo Steel Manufacturing Co.,Ltd."
    },
    {
      "Entreprise": "Tokyo Tatemono Co., Ltd."
    },
    {
      "Entreprise": "Tokyu Construction Co., Ltd."
    },
    {
      "Entreprise": "Tokyu Fudosan Holdings Corporation"
    },
    {
      "Entreprise": "Toly Group International"
    },
    {
      "Entreprise": "Tom Tailor GmbH"
    },
    {
      "Entreprise": "TOMISHIN CO., Ltd."
    },
    {
      "Entreprise": "TOMRA Systems ASA"
    },
    {
      "Entreprise": "Toms Gruppen A/S"
    },
    {
      "Entreprise": "Tongwei Solar (Hefei) Co., Ltd."
    },
    {
      "Entreprise": "Top Sports Textile Limited"
    },
    {
      "Entreprise": "TOPCO SCIENTIFIC CO., LTD."
    },
    {
      "Entreprise": "Topdanmark A/S"
    },
    {
      "Entreprise": "TÖPFER Kulmbach GmbH"
    },
    {
      "Entreprise": "TOPPAN PRINTING CO., LTD."
    },
    {
      "Entreprise": "TopWin srl"
    },
    {
      "Entreprise": "Toshiba Corporation"
    },
    {
      "Entreprise": "TOTAL CREATE CO.,LTD."
    },
    {
      "Entreprise": "TOTO LTD."
    },
    {
      "Entreprise": "Tourlane"
    },
    {
      "Entreprise": "Toyo Sangyo Co.,Ltd."
    },
    {
      "Entreprise": "Toyo Seikan Group Holdings, Ltd."
    },
    {
      "Entreprise": "TOYOBO CO., LTD."
    },
    {
      "Entreprise": "Toyoda Electrical Co.,Ltd."
    },
    {
      "Entreprise": "TOYOKOKA Co., Ltd."
    },
    {
      "Entreprise": "TOYOTA BOSHOKU CORPORATION"
    },
    {
      "Entreprise": "Toyota Industries Corporation"
    },
    {
      "Entreprise": "Toyota Material Handling Europe"
    },
    {
      "Entreprise": "Toyota Motor Corporation"
    },
    {
      "Entreprise": "TP Aerospace"
    },
    {
      "Entreprise": "TP Management GmbH (Transporeon Group)"
    },
    {
      "Entreprise": "TPG Telecom Limited"
    },
    {
      "Entreprise": "TPK Glass Solutions (Xiamen) Inc. Jimei Branch"
    },
    {
      "Entreprise": "TPV Technology Limited"
    },
    {
      "Entreprise": "TPXimpact"
    },
    {
      "Entreprise": "TRAC Intermodal"
    },
    {
      "Entreprise": "TRAC International Ltd"
    },
    {
      "Entreprise": "Traditional Medicinals"
    },
    {
      "Entreprise": "Traffi Safe Ltd"
    },
    {
      "Entreprise": "Trainline plc"
    },
    {
      "Entreprise": "Trane Technologies Plc."
    },
    {
      "Entreprise": "TransAlta Corporation"
    },
    {
      "Entreprise": "Transart Graphics Co., Ltd."
    },
    {
      "Entreprise": "Transflo"
    },
    {
      "Entreprise": "Translink"
    },
    {
      "Entreprise": "Transpennine Express"
    },
    {
      "Entreprise": "TransPerfect"
    },
    {
      "Entreprise": "Transportes J. Amaral, S.A."
    },
    {
      "Entreprise": "TRANSPORTES LOGISTICOS ESPECIALIZADOS"
    },
    {
      "Entreprise": "Transtema Group AB"
    },
    {
      "Entreprise": "Transurban Group"
    },
    {
      "Entreprise": "TransWest NV"
    },
    {
      "Entreprise": "TravelPerk"
    },
    {
      "Entreprise": "Travis Perkins"
    },
    {
      "Entreprise": "Trax Apparel (Cambodia) Co., Ltd."
    },
    {
      "Entreprise": "Trayton Furniture(Jiaxing) Co., Ltd"
    },
    {
      "Entreprise": "Tre (Hi3G Access AB)"
    },
    {
      "Entreprise": "Trek Bicycle Corporation"
    },
    {
      "Entreprise": "Trelleborg AB"
    },
    {
      "Entreprise": "Trench High Voltage Products Ltd., Shenyang"
    },
    {
      "Entreprise": "Tribe Impact Capital LLP"
    },
    {
      "Entreprise": "Triciclos"
    },
    {
      "Entreprise": "Tricon Energy"
    },
    {
      "Entreprise": "Tricorona Climate Partner AB"
    },
    {
      "Entreprise": "Trident Building Consultancy"
    },
    {
      "Entreprise": "TRIDENT LIMITED"
    },
    {
      "Entreprise": "Trimble Inc"
    },
    {
      "Entreprise": "Trina Solar Co., Ltd."
    },
    {
      "Entreprise": "Trinity Partners, LLC d/b/a Trinity Life Sciences"
    },
    {
      "Entreprise": "Triodos Bank N.V."
    },
    {
      "Entreprise": "Trioworld"
    },
    {
      "Entreprise": "Trischel Fabric (Pvt) Ltd."
    },
    {
      "Entreprise": "Triton Investment Management Limited"
    },
    {
      "Entreprise": "Trivium Packaging B.V."
    },
    {
      "Entreprise": "Trossa AB"
    },
    {
      "Entreprise": "Troup Bywaters + Anders"
    },
    {
      "Entreprise": "True Corporation Public Company Limited"
    },
    {
      "Entreprise": "True."
    },
    {
      "Entreprise": "TRUMPF GmbH & Co. KG"
    },
    {
      "Entreprise": "Trust International"
    },
    {
      "Entreprise": "Trustonic Limited"
    },
    {
      "Entreprise": "Trustpilot Group Plc"
    },
    {
      "Entreprise": "TSB Bank"
    },
    {
      "Entreprise": "TSI HOLDINGS CO., LTD."
    },
    {
      "Entreprise": "TSK CO.,LTD"
    },
    {
      "Entreprise": "TSKB"
    },
    {
      "Entreprise": "Tsujiseiki.Co., Ltd."
    },
    {
      "Entreprise": "TSUYAKIN, Inc."
    },
    {
      "Entreprise": "Tubacex, S.A."
    },
    {
      "Entreprise": "Tubex Tubenfabrik Wolfsberg GmbH"
    },
    {
      "Entreprise": "TUI Group"
    },
    {
      "Entreprise": "Tunas Sawa Erma (TSE) Group"
    },
    {
      "Entreprise": "TUNG MUNG INTERNATIONAL PTE. LTD"
    },
    {
      "Entreprise": "Türk Traktör ve Ziraat Makineleri A.S."
    },
    {
      "Entreprise": "Turkcell Iletisim Hizmetleri A.S"
    },
    {
      "Entreprise": "Türkiye Halk Bankası A.Ş."
    },
    {
      "Entreprise": "Türkiye İş Bankası"
    },
    {
      "Entreprise": "Türmerleim GmbH"
    },
    {
      "Entreprise": "Turner & Townsend Ltd"
    },
    {
      "Entreprise": "TÜV SÜD"
    },
    {
      "Entreprise": "TVS Motor Company Limited"
    },
    {
      "Entreprise": "TVS Supply Chain Solutions Limited"
    },
    {
      "Entreprise": "TWE Group"
    },
    {
      "Entreprise": "Twilio"
    },
    {
      "Entreprise": "Twitter Inc"
    },
    {
      "Entreprise": "Tyman plc"
    },
    {
      "Entreprise": "Tyson Foods, Inc."
    },
    {
      "Entreprise": "U&We AB"
    },
    {
      "Entreprise": "UAB Putoksnis (Trademark Doloop)"
    },
    {
      "Entreprise": "UBE Corporation"
    },
    {
      "Entreprise": "Uber Technologies, Inc."
    },
    {
      "Entreprise": "Ubisoft Entertainment"
    },
    {
      "Entreprise": "UCB"
    },
    {
      "Entreprise": "Udaipur Cement Works Limited"
    },
    {
      "Entreprise": "UDR"
    },
    {
      "Entreprise": "Ueda Shokai Co., Ltd."
    },
    {
      "Entreprise": "Ugur Cooling Inc. Co."
    },
    {
      "Entreprise": "Uhlmann Group Holding GmbH & Co. KG"
    },
    {
      "Entreprise": "Uhuru Corporation"
    },
    {
      "Entreprise": "UK Greetings Limited"
    },
    {
      "Entreprise": "UK Power Networks Holdings Limited"
    },
    {
      "Entreprise": "UKG"
    },
    {
      "Entreprise": "UL Solutions Inc."
    },
    {
      "Entreprise": "Ulta Beauty, Inc."
    },
    {
      "Entreprise": "UltraTech Cement Limited"
    },
    {
      "Entreprise": "Uludağ İçecek"
    },
    {
      "Entreprise": "Umicore"
    },
    {
      "Entreprise": "Uncommon"
    },
    {
      "Entreprise": "Under Armour, Inc."
    },
    {
      "Entreprise": "Uni-technology A/S"
    },
    {
      "Entreprise": "Unibail-Rodamco-Westfield SE"
    },
    {
      "Entreprise": "Unicharm Corporation"
    },
    {
      "Entreprise": "Unidas S/A"
    },
    {
      "Entreprise": "Unilever plc"
    },
    {
      "Entreprise": "Unilin Group"
    },
    {
      "Entreprise": "Union Pacific Corporation"
    },
    {
      "Entreprise": "Union Pacific Railroad"
    },
    {
      "Entreprise": "UNION PROJETOS INDUSTRIAIS LTDA"
    },
    {
      "Entreprise": "Unipart Group Limited"
    },
    {
      "Entreprise": "Uniphar Plc"
    },
    {
      "Entreprise": "UNIQA Insurance Group AG"
    },
    {
      "Entreprise": "Uniserve"
    },
    {
      "Entreprise": "Unisteel"
    },
    {
      "Entreprise": "Unisys Corporation"
    },
    {
      "Entreprise": "Unite Students"
    },
    {
      "Entreprise": "United Airlines, Inc."
    },
    {
      "Entreprise": "United Dairymen of Arizona"
    },
    {
      "Entreprise": "United Group B.V."
    },
    {
      "Entreprise": "United Microelectronics Corporation"
    },
    {
      "Entreprise": "United Natural Foods, Inc."
    },
    {
      "Entreprise": "United Utilities Group PLC"
    },
    {
      "Entreprise": "UnitedHealth Group"
    },
    {
      "Entreprise": "Unity Software Inc"
    },
    {
      "Entreprise": "Univar Solutions"
    },
    {
      "Entreprise": "Universal Computer System Co.,Ltd."
    },
    {
      "Entreprise": "Universal Corporation"
    },
    {
      "Entreprise": "Universal Music Group N.V."
    },
    {
      "Entreprise": "University Partnerships Programme"
    },
    {
      "Entreprise": "Unternehmensgruppe Theo Müller S.e.c.s.]"
    },
    {
      "Entreprise": "Up2You S.r.l. SB"
    },
    {
      "Entreprise": "UPDATER SERVICES LIMITED"
    },
    {
      "Entreprise": "UPL Limited"
    },
    {
      "Entreprise": "UPM-Kymmene Corporation"
    },
    {
      "Entreprise": "Uponor Corporation"
    },
    {
      "Entreprise": "Upswing Solutions Inc."
    },
    {
      "Entreprise": "Urenco Limited"
    },
    {
      "Entreprise": "US Apparel & Textiles"
    },
    {
      "Entreprise": "US Foods Holding Corp."
    },
    {
      "Entreprise": "Useful Simple Limited"
    },
    {
      "Entreprise": "USG Corporation"
    },
    {
      "Entreprise": "Usha Yarns Limited"
    },
    {
      "Entreprise": "USHIO INC."
    },
    {
      "Entreprise": "USIMECA USINAGEM INDUSTRIAL"
    },
    {
      "Entreprise": "USM U.Schaerer Sons ltd."
    },
    {
      "Entreprise": "UST Global Inc"
    },
    {
      "Entreprise": "UTSUMI CO.,LTD."
    },
    {
      "Entreprise": "Vacse AB (publ)"
    },
    {
      "Entreprise": "Vaillant GmbH"
    },
    {
      "Entreprise": "VAIO Corporation"
    },
    {
      "Entreprise": "Vaisala"
    },
    {
      "Entreprise": "Vakifbank"
    },
    {
      "Entreprise": "Vakrangee Limited"
    },
    {
      "Entreprise": "Valdese Weavers"
    },
    {
      "Entreprise": "Vale S.A."
    },
    {
      "Entreprise": "Valeo"
    },
    {
      "Entreprise": "Valeo Foods"
    },
    {
      "Entreprise": "Valio Ltd."
    },
    {
      "Entreprise": "VALL COMPANYS GROUP"
    },
    {
      "Entreprise": "VALLOUREC"
    },
    {
      "Entreprise": "Valmet"
    },
    {
      "Entreprise": "Valmet Automotive"
    },
    {
      "Entreprise": "Valmont SM"
    },
    {
      "Entreprise": "Valora Sustainability & Innovation"
    },
    {
      "Entreprise": "Valtech"
    },
    {
      "Entreprise": "Value Frontier"
    },
    {
      "Entreprise": "Valuence Holdings Inc."
    },
    {
      "Entreprise": "VAN ELLE HOLDINGS PLC"
    },
    {
      "Entreprise": "Van Oord"
    },
    {
      "Entreprise": "Vandemoortele NV"
    },
    {
      "Entreprise": "Varma Mutual Pension Insurance Company"
    },
    {
      "Entreprise": "Varner AS"
    },
    {
      "Entreprise": "VARTA AG"
    },
    {
      "Entreprise": "Vasakronan AB"
    },
    {
      "Entreprise": "Vattenfall AB"
    },
    {
      "Entreprise": "VAUDE Sport"
    },
    {
      "Entreprise": "VCCP Group LLP"
    },
    {
      "Entreprise": "vdk bank"
    },
    {
      "Entreprise": "Vector Technologies (Australia) Pty Ltd"
    },
    {
      "Entreprise": "Veidekke ASA"
    },
    {
      "Entreprise": "Veikkaus Oy"
    },
    {
      "Entreprise": "Velliv"
    },
    {
      "Entreprise": "VelocityEHS"
    },
    {
      "Entreprise": "Ventas, Inc."
    },
    {
      "Entreprise": "Ventia Services Group Limited"
    },
    {
      "Entreprise": "Veolia Environnement S.A."
    },
    {
      "Entreprise": "Verallia"
    },
    {
      "Entreprise": "Veramaris VOF"
    },
    {
      "Entreprise": "Verdani Partners"
    },
    {
      "Entreprise": "Vereinigte Papierwarenfabriken GmbH"
    },
    {
      "Entreprise": "Verescence"
    },
    {
      "Entreprise": "Veris Residential"
    },
    {
      "Entreprise": "Veritas Asset Managment LLP"
    },
    {
      "Entreprise": "Veritas Technologies, LLC"
    },
    {
      "Entreprise": "Verizon"
    },
    {
      "Entreprise": "VERMEG"
    },
    {
      "Entreprise": "Version 1"
    },
    {
      "Entreprise": "Verstegen Spices & Sauces"
    },
    {
      "Entreprise": "Vestas Wind Systems"
    },
    {
      "Entreprise": "Vestel Beyaz Esya Sanayi ve Ticaret A.S."
    },
    {
      "Entreprise": "Vestel Elektronik Sanayi ve Ticaret A.S."
    },
    {
      "Entreprise": "Vestiaire Collective"
    },
    {
      "Entreprise": "Vestre AS"
    },
    {
      "Entreprise": "Vestum"
    },
    {
      "Entreprise": "Vetropack Holding AG"
    },
    {
      "Entreprise": "Vextrix"
    },
    {
      "Entreprise": "VF Corporation"
    },
    {
      "Entreprise": "ViaCon"
    },
    {
      "Entreprise": "Viaplay Group AB"
    },
    {
      "Entreprise": "Viatris Inc."
    },
    {
      "Entreprise": "Vibrantcar Rentals Private Limited"
    },
    {
      "Entreprise": "Vibro Menard Limited"
    },
    {
      "Entreprise": "Vicinity Centres"
    },
    {
      "Entreprise": "Victrex plc"
    },
    {
      "Entreprise": "Videndum plc"
    },
    {
      "Entreprise": "Vidia Equity"
    },
    {
      "Entreprise": "Vidrala"
    },
    {
      "Entreprise": "Vidroporto S.A."
    },
    {
      "Entreprise": "Viegand Maagøe A/S"
    },
    {
      "Entreprise": "Viessmann Group"
    },
    {
      "Entreprise": "Viet Nam Samho Company Limited"
    },
    {
      "Entreprise": "ViewSonic Corporation"
    },
    {
      "Entreprise": "Viking Malt"
    },
    {
      "Entreprise": "Vikrant Forge Pvt Ltd"
    },
    {
      "Entreprise": "Viña Casa Silva"
    },
    {
      "Entreprise": "VIÑA CONCHA Y TORO"
    },
    {
      "Entreprise": "Viña Montes"
    },
    {
      "Entreprise": "Vina Polkura SA"
    },
    {
      "Entreprise": "Viña Requingua"
    },
    {
      "Entreprise": "VINCI Construction UK Ltd"
    },
    {
      "Entreprise": "VINCI SA"
    },
    {
      "Entreprise": "Viñedos Emiliana S.A."
    },
    {
      "Entreprise": "Vinted limitied"
    },
    {
      "Entreprise": "Vion Food Group"
    },
    {
      "Entreprise": "Virgin Media Ireland"
    },
    {
      "Entreprise": "Virgin Media O2"
    },
    {
      "Entreprise": "Virgin Wines"
    },
    {
      "Entreprise": "Viridor"
    },
    {
      "Entreprise": "Virtusa Corporation"
    },
    {
      "Entreprise": "VIRUTEX ILKO S.A"
    },
    {
      "Entreprise": "Visa Inc."
    },
    {
      "Entreprise": "VISTEON CORPORATION"
    },
    {
      "Entreprise": "Vistra Corp."
    },
    {
      "Entreprise": "Vistry Group"
    },
    {
      "Entreprise": "Vita Group Unlimited"
    },
    {
      "Entreprise": "Vita Health Group"
    },
    {
      "Entreprise": "Vitacress Limited"
    },
    {
      "Entreprise": "Vital Energi Utilities Limited"
    },
    {
      "Entreprise": "Vital Human Resources Ltd"
    },
    {
      "Entreprise": "Vitalink Group"
    },
    {
      "Entreprise": "Vitamin Well AB"
    },
    {
      "Entreprise": "Vitesco Technologies Group AG"
    },
    {
      "Entreprise": "Vivendi SE"
    },
    {
      "Entreprise": "Vizion Network Limited"
    },
    {
      "Entreprise": "VLS ENDUSTRIYEL SATIS LTD STI"
    },
    {
      "Entreprise": "VMware, Inc"
    },
    {
      "Entreprise": "VNET Group Inc."
    },
    {
      "Entreprise": "Vodafone Group Plc"
    },
    {
      "Entreprise": "VodafoneZiggo"
    },
    {
      "Entreprise": "voestalpine AG"
    },
    {
      "Entreprise": "Voi Technology AB"
    },
    {
      "Entreprise": "Volex"
    },
    {
      "Entreprise": "VolkerWessels UK"
    },
    {
      "Entreprise": "Volkswagen AG"
    },
    {
      "Entreprise": "Volution Group plc"
    },
    {
      "Entreprise": "Volvo Car Group"
    },
    {
      "Entreprise": "Von Bundit Co., Ltd"
    },
    {
      "Entreprise": "Vontier Corporation"
    },
    {
      "Entreprise": "Vornado Realty Trust"
    },
    {
      "Entreprise": "Vöslauer Mineralwasser GmbH"
    },
    {
      "Entreprise": "Votorantim Cimentos"
    },
    {
      "Entreprise": "VP Capital"
    },
    {
      "Entreprise": "Vp plc"
    },
    {
      "Entreprise": "VPK Packaging Group"
    },
    {
      "Entreprise": "VVM De Lijn"
    },
    {
      "Entreprise": "Wacker Chemie AG"
    },
    {
      "Entreprise": "Wackler Holding SE"
    },
    {
      "Entreprise": "WAICA Reinsurance Corporation PLC"
    },
    {
      "Entreprise": "Wakaba Nouen CO.,Ltd"
    },
    {
      "Entreprise": "Wallenius Wilhelmsen"
    },
    {
      "Entreprise": "Wallenstam AB"
    },
    {
      "Entreprise": "Walmart Inc."
    },
    {
      "Entreprise": "Warehouses De Pauw"
    },
    {
      "Entreprise": "WAREMA Renkhoff SE"
    },
    {
      "Entreprise": "Warmworks Scotland LLP"
    },
    {
      "Entreprise": "Warner Music Group"
    },
    {
      "Entreprise": "Waste Management"
    },
    {
      "Entreprise": "WasteBox, Inc."
    },
    {
      "Entreprise": "Watches of Switzerland Group"
    },
    {
      "Entreprise": "WATERBOM BALI"
    },
    {
      "Entreprise": "Waterman Group Plc"
    },
    {
      "Entreprise": "Watertight Management Ltd"
    },
    {
      "Entreprise": "Wates Group Limited"
    },
    {
      "Entreprise": "Watkins Payne"
    },
    {
      "Entreprise": "Wavestone"
    },
    {
      "Entreprise": "Waystar Technologies, Inc."
    },
    {
      "Entreprise": "Wealmoor Ltd."
    },
    {
      "Entreprise": "Webhelp"
    },
    {
      "Entreprise": "Webuild S.p.A."
    },
    {
      "Entreprise": "Weckerle Machines"
    },
    {
      "Entreprise": "Weener Plastics Group BV"
    },
    {
      "Entreprise": "Weetabix Ltd"
    },
    {
      "Entreprise": "Weihai Luda Art & Craft Co., Ltd."
    },
    {
      "Entreprise": "Weir Group PLC (The)"
    },
    {
      "Entreprise": "Welbilt Halesowen Ltd"
    },
    {
      "Entreprise": "Wella International sarl"
    },
    {
      "Entreprise": "Wells & Co."
    },
    {
      "Entreprise": "Wellspect AB"
    },
    {
      "Entreprise": "Welltower Inc."
    },
    {
      "Entreprise": "Welspun India Limited"
    },
    {
      "Entreprise": "WENZHOU KAICHENG MACHINERY CO.,LTD"
    },
    {
      "Entreprise": "WEPA Group"
    },
    {
      "Entreprise": "Wereldhave"
    },
    {
      "Entreprise": "Wernsing Feinkost GmbH"
    },
    {
      "Entreprise": "West Fraser Timber Co. Ltd"
    },
    {
      "Entreprise": "Westcon International"
    },
    {
      "Entreprise": "Western Digital"
    },
    {
      "Entreprise": "Western Power Distribution plc"
    },
    {
      "Entreprise": "Westfalia Fruit International"
    },
    {
      "Entreprise": "Westpac Banking Corporation"
    },
    {
      "Entreprise": "WestRock Company"
    },
    {
      "Entreprise": "Westwing Group AG"
    },
    {
      "Entreprise": "Weyerhaeuser Company"
    },
    {
      "Entreprise": "WFW Global LLP"
    },
    {
      "Entreprise": "WH Smith PLC"
    },
    {
      "Entreprise": "Wheaton Precious Metals Corp."
    },
    {
      "Entreprise": "WHEB Asset Management LLP"
    },
    {
      "Entreprise": "Whirlpool Corporation"
    },
    {
      "Entreprise": "Whitbread PLC"
    },
    {
      "Entreprise": "White House"
    },
    {
      "Entreprise": "Wickes Group PLC"
    },
    {
      "Entreprise": "Wiegand-Glas Holding GmbH"
    },
    {
      "Entreprise": "Wieland Group"
    },
    {
      "Entreprise": "Wihlborgs Fastigheter"
    },
    {
      "Entreprise": "Willerby Landscapes Ltd."
    },
    {
      "Entreprise": "Willhem AB"
    },
    {
      "Entreprise": "William Fry LLP"
    },
    {
      "Entreprise": "William Hare Ltd"
    },
    {
      "Entreprise": "Williams-Sonoma, Inc."
    },
    {
      "Entreprise": "Willmott Dixon Holdings Limited"
    },
    {
      "Entreprise": "Wilmar International Limited"
    },
    {
      "Entreprise": "Wilmington plc"
    },
    {
      "Entreprise": "Wilo Group"
    },
    {
      "Entreprise": "Win Hanverky Holdings Limited"
    },
    {
      "Entreprise": "WindowMaster International A/S"
    },
    {
      "Entreprise": "wing Co., LTD"
    },
    {
      "Entreprise": "Winga Apparel Group Ltd."
    },
    {
      "Entreprise": "Winkler Partners"
    },
    {
      "Entreprise": "Winnebago Industries"
    },
    {
      "Entreprise": "Wipf AG"
    },
    {
      "Entreprise": "Wipro"
    },
    {
      "Entreprise": "Wise Travel India Private Limited"
    },
    {
      "Entreprise": "Wistron Corporation"
    },
    {
      "Entreprise": "With Intelligence"
    },
    {
      "Entreprise": "Withincompliance LLC dba Virtuosity Consulting"
    },
    {
      "Entreprise": "Witzenmann GmbH"
    },
    {
      "Entreprise": "Wiwynn Corporation"
    },
    {
      "Entreprise": "WIZERTECH INFORMATICS PRIVATE LIMITED"
    },
    {
      "Entreprise": "Wizz Air Holdings Plc."
    },
    {
      "Entreprise": "WJ Group Ltd"
    },
    {
      "Entreprise": "WNS (Holdings) Limited"
    },
    {
      "Entreprise": "Woco Group"
    },
    {
      "Entreprise": "Wolters Kluwer N.V."
    },
    {
      "Entreprise": "WONDER Group"
    },
    {
      "Entreprise": "Wood Life Company"
    },
    {
      "Entreprise": "WoolWorks New Zealand Ltd"
    },
    {
      "Entreprise": "Woolworths Group Limited"
    },
    {
      "Entreprise": "Woolworths Holdings Ltd"
    },
    {
      "Entreprise": "Woori Financial Group"
    },
    {
      "Entreprise": "WORD Co.,Ltd."
    },
    {
      "Entreprise": "Work & Co"
    },
    {
      "Entreprise": "Workday"
    },
    {
      "Entreprise": "Workspace Group PLC"
    },
    {
      "Entreprise": "WorkWave, LLC"
    },
    {
      "Entreprise": "World Wide Technology Holding Co., LLC"
    },
    {
      "Entreprise": "Worldline"
    },
    {
      "Entreprise": "Worldwide TechService LLC"
    },
    {
      "Entreprise": "Worthington Industries Sustainable Energy Solutions"
    },
    {
      "Entreprise": "WPP Plc"
    },
    {
      "Entreprise": "WS Audiology"
    },
    {
      "Entreprise": "WSH UK & Ireland Limited"
    },
    {
      "Entreprise": "WSP Global Inc."
    },
    {
      "Entreprise": "WTW"
    },
    {
      "Entreprise": "Wuhu Sanqi Interactive Entertainment Network Technology Group Co., Ltd."
    },
    {
      "Entreprise": "Wuxi Jinhui Precision Machining co., ltd."
    },
    {
      "Entreprise": "Wybo Transport NV"
    },
    {
      "Entreprise": "X5 Retail Group"
    },
    {
      "Entreprise": "XD Connects"
    },
    {
      "Entreprise": "Xella International GmbH"
    },
    {
      "Entreprise": "XELS Japan Co Ltd"
    },
    {
      "Entreprise": "Xero"
    },
    {
      "Entreprise": "Xerox Corporation"
    },
    {
      "Entreprise": "Xiamen Intretech Inc"
    },
    {
      "Entreprise": "XINGDA INTERNATIONAL HOLDINGS LIMITED"
    },
    {
      "Entreprise": "Xiongxian Liya Packaging Material Co., Ltd."
    },
    {
      "Entreprise": "XP Power"
    },
    {
      "Entreprise": "Xtrac Limited"
    },
    {
      "Entreprise": "Xylem Inc."
    },
    {
      "Entreprise": "Y.R.C.Textile Co.,Ltd."
    },
    {
      "Entreprise": "Yachiyo Engineering Co., Ltd."
    },
    {
      "Entreprise": "Yahoo Japan Corporation"
    },
    {
      "Entreprise": "YAMABISHI Corporation"
    },
    {
      "Entreprise": "YAMADAMEKKI KOUGYOUSYO Co.,Ltd."
    },
    {
      "Entreprise": "Yamaha Corporation"
    },
    {
      "Entreprise": "Yamaichi Metal Co.,Ltd."
    },
    {
      "Entreprise": "YAMAMOTO MACHINERY CO.,Ltd."
    },
    {
      "Entreprise": "Yamazen Co.,Ltd."
    },
    {
      "Entreprise": "Yancheng Yide Plastic Packaging Co., Ltd."
    },
    {
      "Entreprise": "Yanfeng Global Automotive Interior Systems Co. Ltd."
    },
    {
      "Entreprise": "Yapı ve Kredi Bankası A.Ş."
    },
    {
      "Entreprise": "Yara International ASA"
    },
    {
      "Entreprise": "Yarra Valley Water"
    },
    {
      "Entreprise": "Yashima Construction Co,ltd"
    },
    {
      "Entreprise": "Yaskawa Electric Corporation"
    },
    {
      "Entreprise": "YASUHIRA MACHINE TOOL INC."
    },
    {
      "Entreprise": "YES Bank"
    },
    {
      "Entreprise": "YETI Holdings, Inc."
    },
    {
      "Entreprise": "Yever Co., Ltd"
    },
    {
      "Entreprise": "Yingyang (China) Aroma Chemical Group"
    },
    {
      "Entreprise": "YIT Oyj"
    },
    {
      "Entreprise": "YKK AP Inc."
    },
    {
      "Entreprise": "YKK Corporation"
    },
    {
      "Entreprise": "Ylva"
    },
    {
      "Entreprise": "Yokogawa Electric Corporation"
    },
    {
      "Entreprise": "Yokogawa Rental ＆ Lease Corporation"
    },
    {
      "Entreprise": "Yorglass Cam Sanayi ve Ticaret"
    },
    {
      "Entreprise": "Yotrio Group Co., Ltd."
    },
    {
      "Entreprise": "Ypsomed AG"
    },
    {
      "Entreprise": "Yuanta Financial Holding Co Ltd"
    },
    {
      "Entreprise": "Yum China Holdings, Inc."
    },
    {
      "Entreprise": "Yum! Brands, Inc."
    },
    {
      "Entreprise": "YUTACOLOGY Co.,Ltd."
    },
    {
      "Entreprise": "Yutaka Finepack Co.,Ltd."
    },
    {
      "Entreprise": "Yutong Bus Co., Ltd."
    },
    {
      "Entreprise": "Żabka Polska Sp. z o. o. (Zabka Polska Sp. z o. o.)"
    },
    {
      "Entreprise": "Zadig&Voltaire"
    },
    {
      "Entreprise": "Zalando SE"
    },
    {
      "Entreprise": "Zamira Fashion Limited"
    },
    {
      "Entreprise": "ZAYO GROUP LLC"
    },
    {
      "Entreprise": "Zebra A/S (Flying Tiger Copenhagen)"
    },
    {
      "Entreprise": "Zebra MTD Limited"
    },
    {
      "Entreprise": "Zebra Technologies Corporation"
    },
    {
      "Entreprise": "ZEN Energy"
    },
    {
      "Entreprise": "Zen Internet Ltd"
    },
    {
      "Entreprise": "Zendesk"
    },
    {
      "Entreprise": "Zenergi Group Limited"
    },
    {
      "Entreprise": "Zenith Automotive Holdings Ltd"
    },
    {
      "Entreprise": "Zenobe Energy"
    },
    {
      "Entreprise": "Zentis GmbH & Co. KG"
    },
    {
      "Entreprise": "ZERMATT SA"
    },
    {
      "Entreprise": "ZEROPLUS Co.,ltd"
    },
    {
      "Entreprise": "ZF Friedrichshafen AG"
    },
    {
      "Entreprise": "Zhejiang Arcana Power Sports Tech. Co.. Ltd."
    },
    {
      "Entreprise": "Zhejiang Guangtao Healthy Kitchen Utensils Co., LTD"
    },
    {
      "Entreprise": "ZHEJIANG JWK FILTRATION TECHNOLOGY CO., LTD."
    },
    {
      "Entreprise": "ZHEJIANG MAYANG INDUSTRIES CO.,LTD"
    },
    {
      "Entreprise": "Zhejiang Narada Power Source Co., Ltd."
    },
    {
      "Entreprise": "Zhejiang Texwell Textile Co., Ltd."
    },
    {
      "Entreprise": "Zhejiang Tongli Heavy Machinery Manufacturing Co.,Ltd"
    },
    {
      "Entreprise": "Zhongshan Huali Industrial Group Co., Ltd"
    },
    {
      "Entreprise": "Zhongtian Technology Submarine Cable Co.,Ltd"
    },
    {
      "Entreprise": "Zhuhai CosMX Battery Co., Ltd"
    },
    {
      "Entreprise": "Zhuhai Pilot Technology Co., Ltd."
    },
    {
      "Entreprise": "Ziff Davis"
    },
    {
      "Entreprise": "Zimmer Biomet"
    },
    {
      "Entreprise": "Zimmermann"
    },
    {
      "Entreprise": "ZND UK LTD"
    },
    {
      "Entreprise": "ZORDAN SRL SB"
    },
    {
      "Entreprise": "Zorlu Enerji"
    },
    {
      "Entreprise": "Zott SE & Co. KG"
    },
    {
      "Entreprise": "Zound Industries International AB"
    },
    {
      "Entreprise": "ZOZO, Inc."
    },
    {
      "Entreprise": "ZS Associates"
    },
    {
      "Entreprise": "ZTO Express (Cayman) Inc."
    },
    {
      "Entreprise": "Zuellig Pharma"
    },
    {
      "Entreprise": "Zühlke Group"
    },
    {
      "Entreprise": "Zumtobel Group AG"
    },
    {
      "Entreprise": "Zurich Insurance Group Ltd"
    },
    {
      "Entreprise": "Zyxel Group Corporation"
    },
    {
      "Entreprise": "Ørsted"
    }
  ],
  [
    {"Entreprise":"2BM Limited"},{"Entreprise":"2CRSI SACA"},{"Entreprise":"3i Group"},{"Entreprise":"4imprint Group plc"},{"Entreprise":"888 Holdings"},{"Entreprise":"A Raymond Et Compagnie"},{"Entreprise":"A.G. Barr Plc"},{"Entreprise":"A2DOMINION HOUSING GROUP LTD"},{"Entreprise":"AB DYNAMICS PLC"},{"Entreprise":"AB SCIENCE SA"},{"Entreprise":"ABB"},{"Entreprise":"Abc Arbitrage"},{"Entreprise":"ABCAM"},{"Entreprise":"Abeo Sa"},{"Entreprise":"Aberdeen City Council"},{"Entreprise":"Aberdeenshire Council"},{"Entreprise":"Abionyx Pharma SA"},{"Entreprise":"Abivax SA"},{"Entreprise":"Abo Group Environment"},{"Entreprise":"abrdn"},{"Entreprise":"Abrdn China Investment Company"},{"Entreprise":"ABSOLUTE SOFTWARE"},{"Entreprise":"Accentis"},{"Entreprise":"ACCESSO TECHNOLOGY GROUP PLC"},{"Entreprise":"Accor"},{"Entreprise":"ACI WORLDWIDE  LTD"},{"Entreprise":"Ackermans & van Haaren"},{"Entreprise":"Acteos"},{"Entreprise":"Actia Group"},{"Entreprise":"ACTION LOGEMENT SERVICES SAS"},{"Entreprise":"Adecco Group AG"},{"Entreprise":"ADLPartner"},{"Entreprise":"Admiral Group"},{"Entreprise":"Adocia SAS"},{"Entreprise":"ADP (Aeroports de Paris)"},{"Entreprise":"Adur and Worthing Council"},{"Entreprise":"ADUX"},{"Entreprise":"ADVANCED MED SOLUTIONS"},{"Entreprise":"Advantage Oil & Gas Ltd."},{"Entreprise":"Aecon Group Inc."},{"Entreprise":"Aedifica SA"},{"Entreprise":"AEVIS VICTORIA SA"},{"Entreprise":"AEW UK REIT"},{"Entreprise":"AFFINITY WATER"},{"Entreprise":"AG GROWTH INTERNATIONAL"},{"Entreprise":"AG2R La Mondiale"},{"Entreprise":"Ageas SA/NV"},{"Entreprise":"Agfa-Gevaert N.V."},{"Entreprise":"Agglomeration Community of Albi"},{"Entreprise":"Agglomeration Community of Amiens"},{"Entreprise":"Agglomeration Community of Annecy"},{"Entreprise":"Agglomeration Community of Avignon"},{"Entreprise":"Agglomeration Community of Basque Country"},{"Entreprise":"Agglomeration Community of Béthune"},{"Entreprise":"Agglomeration Community of Bourges"},{"Entreprise":"Agglomeration Community of Caux Vallée de Seine"},{"Entreprise":"Agglomeration Community of Cœur d'Essonne"},{"Entreprise":"Agglomeration Community of Colmar"},{"Entreprise":"Agglomeration Community of Douai"},{"Entreprise":"Agglomeration Community of Durance-Luberon-Verdon"},{"Entreprise":"Agglomeration Community of Étampes"},{"Entreprise":"Agglomeration Community of Grand Paris Sud"},{"Entreprise":"Agglomeration Community of Grand Paris Sud Seine-Essonne-Sénart"},{"Entreprise":"Agglomeration Community of Guérande"},{"Entreprise":"Agglomeration Community of La Rochelle"},{"Entreprise":"Agglomeration Community of Lake Bourget"},{"Entreprise":"Agglomeration Community of Laval"},{"Entreprise":"Agglomeration Community of Lisieux"},{"Entreprise":"Agglomeration Community of Lorient"},{"Entreprise":"Agglomeration Community of Mâcon"},{"Entreprise":"Agglomeration Community of Mamoudzou"},{"Entreprise":"Agglomeration Community of North-Réunion"},{"Entreprise":"Agglomeration Community of Pau Béarn Pyrénées"},{"Entreprise":"Agglomeration Community of Pays de Gex"},{"Entreprise":"Agglomeration Community of Saint-Dizier"},{"Entreprise":"Agglomeration Community of Saint-Louis"},{"Entreprise":"Agglomeration Community of Saint-Nazaire"},{"Entreprise":"Agglomeration Community of Seine-Eure"},{"Entreprise":"Agglomeration Community of Thonon"},{"Entreprise":"Agglomeration Community of Troyes"},{"Entreprise":"Agglomeration Community of Val de Fensch"},{"Entreprise":"Agglomeration Community of Valenciennes"},{"Entreprise":"Aggreko"},{"Entreprise":"Agility Public Warehousing Co K.S.C."},{"Entreprise":"Agnico-Eagle Mines Limited"},{"Entreprise":"Air Canada"},{"Entreprise":"Air France - KLM"},{"Entreprise":"Air Liquide"},{"Entreprise":"AIRBOSS OF AMERICA CORP"},{"Entreprise":"Airtel Africa"},{"Entreprise":"AJ Bell"},{"Entreprise":"Akka Technologies"},{"Entreprise":"Akwel"},{"Entreprise":"Alamos Gold Inc."},{"Entreprise":"Albea"},{"Entreprise":"Alberta"},{"Entreprise":"ALBERTA POWERLINE LP"},{"Entreprise":"Albioma"},{"Entreprise":"Alcon"},{"Entreprise":"ALD SA"},{"Entreprise":"Aldo Group"},{"Entreprise":"ALECTRA INC"},{"Entreprise":"Alfa Financial Software Holdings"},{"Entreprise":"ALGOMA STEEL GROUP"},{"Entreprise":"Algonquin Power & Utilities Corporation"},{"Entreprise":"Aliaxis SA"},{"Entreprise":"Alimentation Couche-Tard Inc."},{"Entreprise":"ALLFUNDS GROUP PLC"},{"Entreprise":"ALLIANCE PHARMA INC"},{"Entreprise":"Allied Minds"},{"Entreprise":"Allied Properties REIT"},{"Entreprise":"Allreal Holding AG"},{"Entreprise":"Allseating Corporation"},{"Entreprise":"ALPHA FINANCIAL MARKETS CONS"},{"Entreprise":"ALPHA FX GROUP"},{"Entreprise":"ALPHA FX GROUP PLC"},{"Entreprise":"ALPHAWAVE IP GROUP"},{"Entreprise":"Alpiq Holding AG"},{"Entreprise":"ALSO Holding AG"},{"Entreprise":"Alstom"},{"Entreprise":"AltaGas Ltd."},{"Entreprise":"Altarea Cogedim"},{"Entreprise":"Alten"},{"Entreprise":"Alternative Income Reit PLC"},{"Entreprise":"Altice Financing S.A."},{"Entreprise":"ALTICE FRANCE S.A"},{"Entreprise":"ALTIUS MINERALS"},{"Entreprise":"Altus Group Ltd"},{"Entreprise":"Ameropa AG"},{"Entreprise":"Amigo Holdings"},{"Entreprise":"Amundi AM"},{"Entreprise":"ANAERGIA SV"},{"Entreprise":"ANDLAUER HEALTHCARE GROUP INC"},{"Entreprise":"ANDREWS SYKES GROUP PLC"},{"Entreprise":"Anglesey Mining plc"},{"Entreprise":"Anglian Water"},{"Entreprise":"Anglo American"},{"Entreprise":"Anglo Pacific Group"},{"Entreprise":"Anglo-Eastern Plantations Plc"},{"Entreprise":"Angus Council"},{"Entreprise":"Anheuser Busch InBev"},{"Entreprise":"Annington Funding PLC"},{"Entreprise":"ANTALIS"},{"Entreprise":"ANTIN INFRA PRTNRS"},{"Entreprise":"Antofagasta"},{"Entreprise":"Antrim and Newtownabbey Borough Council"},{"Entreprise":"AO World"},{"Entreprise":"Aon plc"},{"Entreprise":"APERAM"},{"Entreprise":"APG SGA SA"},{"Entreprise":"Aptitude Software Group PLC"},{"Entreprise":"Aptiv"},{"Entreprise":"ARAMIS GROUP"},{"Entreprise":"ARAMIS GROUP SAS"},{"Entreprise":"Arbonia AG"},{"Entreprise":"ARC Resources Ltd."},{"Entreprise":"ArcelorMittal"},{"Entreprise":"Ards and North Down Borough Council"},{"Entreprise":"ARGENTA SPAARBANK"},{"Entreprise":"Argenx S.E"},{"Entreprise":"ARGO BLOCKCHAIN"},{"Entreprise":"Argonaut Gold"},{"Entreprise":"Argyll and Bute Council"},{"Entreprise":"Aritzia Inc."},{"Entreprise":"Arkea"},{"Entreprise":"ARKEMA"},{"Entreprise":"Arm Ltd."},{"Entreprise":"Armagh City, Banbridge and Craigavon Borough Council"},{"Entreprise":"Armstrong Fluid Technology"},{"Entreprise":"Arrow Global UK Limited"},{"Entreprise":"Artis REIT"},{"Entreprise":"Artmarket.com"},{"Entreprise":"Aryzta AG"},{"Entreprise":"ASA International Group"},{"Entreprise":"Ascencio"},{"Entreprise":"Ascential"},{"Entreprise":"Ascom Holding AG"},{"Entreprise":"ASDA"},{"Entreprise":"Asf - Autoroutes Du Sud De La France"},{"Entreprise":"Ashmore Group Plc"},{"Entreprise":"Ashtead Group"},{"Entreprise":"ASOS"},{"Entreprise":"Associated British Foods"},{"Entreprise":"Assura Plc"},{"Entreprise":"Assystem"},{"Entreprise":"Aston Martin Lagonda Global Holdings"},{"Entreprise":"AstraZeneca"},{"Entreprise":"ATALAYA MINING"},{"Entreprise":"ATCO Ltd."},{"Entreprise":"ATEME S.A."},{"Entreprise":"Atenor"},{"Entreprise":"Athabasca Oil Corporation"},{"Entreprise":"Atlantica Sustainable Infrastructure PLC"},{"Entreprise":"Atlassian Corporation PLC"},{"Entreprise":"Atos SE"},{"Entreprise":"Atrato Onsite Energy"},{"Entreprise":"ATS Automation Tooling Systems"},{"Entreprise":"Aubay"},{"Entreprise":"Auchan Retail International"},{"Entreprise":"Auction Technology Group"},{"Entreprise":"Aurea"},{"Entreprise":"AURELIUS EQUITY OPPORTUNITIES SE & CO.KGAA"},{"Entreprise":"AURES Technologies SA"},{"Entreprise":"AURINIA PHARMACEUTICALS INC"},{"Entreprise":"Aurora Cannabis Inc"},{"Entreprise":"Auto Trader Group"},{"Entreprise":"AUTOCANADA INC"},{"Entreprise":"Autoneum Management AG"},{"Entreprise":"Autoroute 30 Express"},{"Entreprise":"Auvergne-Rhône-Alpes Region"},{"Entreprise":"AVACTA GROUP"},{"Entreprise":"Avanos Medical"},{"Entreprise":"Avast PLC"},{"Entreprise":"Avenir Telecom"},{"Entreprise":"Aveva Group"},{"Entreprise":"Aviva plc"},{"Entreprise":"Avon Rubber plc"},{"Entreprise":"Avril"},{"Entreprise":"AWG"},{"Entreprise":"AXA Group"},{"Entreprise":"AXWAY SOFTWARE SA"},{"Entreprise":"AYA GOLD & SILVER"},{"Entreprise":"AZELIS GROUP NV"},{"Entreprise":"B&M European Value Retail SA"},{"Entreprise":"B&S Group SA"},{"Entreprise":"B2GOLD CORP"},{"Entreprise":"Babcock International Group"},{"Entreprise":"Bachem Holding AG"},{"Entreprise":"Badger Infrastructure Solutions Ltd"},{"Entreprise":"BAE Systems"},{"Entreprise":"Bakkavör Group"},{"Entreprise":"Balfour Beatty"},{"Entreprise":"Ballard Power Systems"},{"Entreprise":"Baloise Group"},{"Entreprise":"Balta Group Nv"},{"Entreprise":"Baltic Classifieds Group"},{"Entreprise":"Balyo Sa"},{"Entreprise":"BAM REINSURANCE PART A"},{"Entreprise":"BANIMMO SA/NV - A"},{"Entreprise":"Bank of Georgia Group PLC"},{"Entreprise":"Bank of Montreal"},{"Entreprise":"Bank of Nova Scotia (Scotiabank)"},{"Entreprise":"Banque Cantonale de Geneve"},{"Entreprise":"Banque Cantonale Vaudoise"},{"Entreprise":"Banque Federative du Credit Mutuel SA"},{"Entreprise":"Banque Nationale Belgique S.A."},{"Entreprise":"Barclays"},{"Entreprise":"Barco NV"},{"Entreprise":"Barnet Council"},{"Entreprise":"Barratt Developments plc"},{"Entreprise":"Barrick Gold Corporation"},{"Entreprise":"Barry Callebaut AG"},{"Entreprise":"Basellandschaftliche Kantonalbank"},{"Entreprise":"Basilea Pharmaceutica Ltd"},{"Entreprise":"Basler Kantonalbank"},{"Entreprise":"Bastide Le Confort Medical"},{"Entreprise":"Bata Ltd."},{"Entreprise":"Bath and North East Somerset"},{"Entreprise":"Baytex Energy Corp."},{"Entreprise":"BB BIOTECH AG"},{"Entreprise":"BCE Inc."},{"Entreprise":"BCP Council"},{"Entreprise":"Beazley Group"},{"Entreprise":"Befimmo SA"},{"Entreprise":"Bekaert NV"},{"Entreprise":"BEL GROUP"},{"Entreprise":"Belfast City Council"},{"Entreprise":"Belfius Bank SA/NV"},{"Entreprise":"BELIEVE"},{"Entreprise":"BELIEVE SA"},{"Entreprise":"Belimo Holding AG"},{"Entreprise":"Bell Food Group AG"},{"Entreprise":"Bellevue Group AG"},{"Entreprise":"BELLUS HEALTH"},{"Entreprise":"Bellway Homes Limited"},{"Entreprise":"BENCHMARK HOLDINGS PLC"},{"Entreprise":"Beneteau"},{"Entreprise":"BENEVOLENTAI"},{"Entreprise":"Berkeley Group"},{"Entreprise":"Berner Kantonalbank AG BEKB"},{"Entreprise":"Bevco Lux S.à r.l"},{"Entreprise":"BHP"},{"Entreprise":"Bic"},{"Entreprise":"Biffa Plc"},{"Entreprise":"BIG TECHNOLOGIES PLC"},{"Entreprise":"Big Yellow Group"},{"Entreprise":"Bigben Interactive"},{"Entreprise":"Biocartis NV"},{"Entreprise":"bioMérieux"},{"Entreprise":"BIOTALYS NV"},{"Entreprise":"Birchcliff Energy Ltd"},{"Entreprise":"Birmingham City Council"},{"Entreprise":"BKW AG"},{"Entreprise":"Blaby District council"},{"Entreprise":"BlackBerry Limited"},{"Entreprise":"Blackburn with Darwen Borough Council"},{"Entreprise":"Blackpool Council"},{"Entreprise":"Blaenau Gwent County Borough Council"},{"Entreprise":"BLEND FUNDING PLC"},{"Entreprise":"Bloomsbury Publishing"},{"Entreprise":"BMO Commercial Property Trust Ltd"},{"Entreprise":"BMO Real Estate Investments Ltd"},{"Entreprise":"BNP Paribas"},{"Entreprise":"BNP Paribas Fortis SA"},{"Entreprise":"Boardwalk REIT"},{"Entreprise":"Bobst Group"},{"Entreprise":"Bodycote plc"},{"Entreprise":"Boiron Sa"},{"Entreprise":"Bolloré SA"},{"Entreprise":"Bolton Council"},{"Entreprise":"Bombardier Inc."},{"Entreprise":"Bonavista Energy Corporation"},{"Entreprise":"Bonduelle"},{"Entreprise":"BONE THERAPEUTICS SA"},{"Entreprise":"Bonterra Energy Corp"},{"Entreprise":"boohoo.com"},{"Entreprise":"Boparan Holdings Ltd"},{"Entreprise":"Boralex Inc"},{"Entreprise":"Bossard Holding AG-Reg A"},{"Entreprise":"Bourse Direct"},{"Entreprise":"Bouygues"},{"Entreprise":"Boyd Group Services Inc."},{"Entreprise":"BP"},{"Entreprise":"bpost"},{"Entreprise":"Braemar Shipping"},{"Entreprise":"Brecon Beacons National Park Authority"},{"Entreprise":"Brederode S.A."},{"Entreprise":"BREEDON GROUP"},{"Entreprise":"Breitling AG"},{"Entreprise":"Brent Council"},{"Entreprise":"Brewin Dolphin Holdings"},{"Entreprise":"BRICKABILITY GROUP PLC"},{"Entreprise":"Bridgend County Borough Council"},{"Entreprise":"Bridgepoint"},{"Entreprise":"Bristol City Council"},{"Entreprise":"British American Tobacco"},{"Entreprise":"British Broadcasting Corporation"},{"Entreprise":"British Columbia"},{"Entreprise":"British Columbia Credit Union System"},{"Entreprise":"British Land Company"},{"Entreprise":"Brittany Region"},{"Entreprise":"Britvic"},{"Entreprise":"Bromley Council"},{"Entreprise":"Brookfield Asset Management Inc."},{"Entreprise":"BROOKFIELD INFRA A (CA)"},{"Entreprise":"BROOKFIELD RENEWABLE"},{"Entreprise":"BROOKS MACDONALD GROUP PLC"},{"Entreprise":"Brown & Brown"},{"Entreprise":"Broxtowe Borough Council"},{"Entreprise":"BRP"},{"Entreprise":"Brussels-Capital Region"},{"Entreprise":"BSR REIT"},{"Entreprise":"BT Group"},{"Entreprise":"Bucher Industries AG"},{"Entreprise":"Buckinghamshire County Council"},{"Entreprise":"Bunzl plc"},{"Entreprise":"BUPA"},{"Entreprise":"Burberry Group"},{"Entreprise":"Burckhardt Compression AG"},{"Entreprise":"Bureau Veritas"},{"Entreprise":"BURFORD CAPITAL CDI"},{"Entreprise":"Burgundy-Franche-Comté Region"},{"Entreprise":"Burkhalter Holding AG"},{"Entreprise":"Bury Council"},{"Entreprise":"BUSINESS MOVES GROUP"},{"Entreprise":"Bystronic AG"},{"Entreprise":"Bytes Technology Group Plc"},{"Entreprise":"C & J Clark International Ltd"},{"Entreprise":"Cadent"},{"Entreprise":"CAE Inc."},{"Entreprise":"Caerphilly County Borough Council"},{"Entreprise":"Caffyns plc"},{"Entreprise":"Cafom"},{"Entreprise":"Caisse des Dépôts"},{"Entreprise":"Caisse Nationale de Reassurance Mutuelle Agricole Groupama"},{"Entreprise":"Calderdale Council"},{"Entreprise":"CALIAN GROUP"},{"Entreprise":"CALIBRE MINING"},{"Entreprise":"CALIDA HOLDING-REG"},{"Entreprise":"Calisen"},{"Entreprise":"Cambridge City Council"},{"Entreprise":"Cambridgeshire and Peterborough Combined Authority"},{"Entreprise":"Cambridgeshire County Council"},{"Entreprise":"Cameco Corporation"},{"Entreprise":"Campine S.A."},{"Entreprise":"Canaccord Genuity Group Inc."},{"Entreprise":"Canada Goose Holdings"},{"Entreprise":"Canada Pension Plan Investment Board (CPPIB)"},{"Entreprise":"Canadian Imperial Bank of Commerce (CIBC)"},{"Entreprise":"Canadian National Railway Company"},{"Entreprise":"Canadian Natural Resources Limited"},{"Entreprise":"Canadian Pacific Railway"},{"Entreprise":"Canadian Tire Corporation, Limited"},{"Entreprise":"Canadian Utilities"},{"Entreprise":"Canadian Western Bank"},{"Entreprise":"Canary Wharf Group Plc"},{"Entreprise":"Canfor Corporation"},{"Entreprise":"Canfor Pulp Products Inc"},{"Entreprise":"Canmore, AB"},{"Entreprise":"Canopy Growth Corp"},{"Entreprise":"Canterbury City Council"},{"Entreprise":"Canton de Lochaber-Partie-Ouest, QC"},{"Entreprise":"Canton of Aargau"},{"Entreprise":"Canton of Appenzell Ausserrhoden"},{"Entreprise":"Canton of Appenzell Innerrhoden"},{"Entreprise":"Canton of Basel-Landschaft"},{"Entreprise":"Canton of Basel-Stadt"},{"Entreprise":"Canton of Bern"},{"Entreprise":"Canton of Fribourg"},{"Entreprise":"Canton of Geneva"},{"Entreprise":"Canton of Glarus"},{"Entreprise":"Canton of Jura"},{"Entreprise":"Canton of Lucerne"},{"Entreprise":"Canton of Neuchâtel"},{"Entreprise":"Canton of Nidwalden"},{"Entreprise":"Canton of Obwalden"},{"Entreprise":"Canton of Schaffhausen"},{"Entreprise":"Canton of Schwyz"},{"Entreprise":"Canton of Solothurn"},{"Entreprise":"Canton of St. Gallen"},{"Entreprise":"Canton of the Grisons"},{"Entreprise":"Canton of Thurgau"},{"Entreprise":"Canton of Ticino"},{"Entreprise":"Canton of Uri"},{"Entreprise":"Canton of Valais"},{"Entreprise":"Canton of Vaud"},{"Entreprise":"Canton of Zug"},{"Entreprise":"Canton of Zürich"},{"Entreprise":"Cape Breton Regional Municipality, NS"},{"Entreprise":"Capgemini SE"},{"Entreprise":"Capita Plc"},{"Entreprise":"Capital & Counties Properties PLC"},{"Entreprise":"Capital & Regional"},{"Entreprise":"Capital Ltd"},{"Entreprise":"Capital Power Corporation"},{"Entreprise":"CAPREIT"},{"Entreprise":"Capricorn Energy Plc"},{"Entreprise":"CAPRICORN MEDIA PROTECTION LTD"},{"Entreprise":"CAPSTONE COPPER"},{"Entreprise":"Capstone Mining Corp"},{"Entreprise":"Carclo"},{"Entreprise":"Card Factory"},{"Entreprise":"Cardiff Capital Region"},{"Entreprise":"Cardiff Property plc"},{"Entreprise":"CARDINAL ENERGY LTD"},{"Entreprise":"Care Property Invest"},{"Entreprise":"CARETECH HOLDINGS PLC"},{"Entreprise":"CARGOJET INC"},{"Entreprise":"Carlisle City Council"},{"Entreprise":"Carmarthenshire County Council"},{"Entreprise":"Carmila SA"},{"Entreprise":"Carrefour"},{"Entreprise":"Carrs Group"},{"Entreprise":"Cascades Inc."},{"Entreprise":"Casino Guichard-Perrachon"},{"Entreprise":"Cast SA"},{"Entreprise":"Castle Point Borough Council"},{"Entreprise":"Catalyst Paper Corporation"},{"Entreprise":"Catana Group"},{"Entreprise":"Catering International & Services"},{"Entreprise":"Causeway Coast and Glens Borough Council"},{"Entreprise":"CBo Territoria"}
  ],
  [
    {
      "Entreprise": "Wieland Awarded Silver Medal by ESG Evaluator EcoVadis"
    },
    {
      "Entreprise": "Hexagon"
    },
    {
      "Entreprise": "Air Liquide"
    },
    {
      "Entreprise": "Basware"
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
      "Entreprise": "Deepak Nitrite Limited"
    },
    {
      "Entreprise": "Boralex"
    },
    {
      "Entreprise": "Tersano"
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
  ],
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
      "Entreprise": "Dreamore Ltd (trading as JustWears)"
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
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/clever-kombucha-ta-you-i",
      "Entreprise": "You + I (Clever Kombucha Ltd.)"
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
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/clever-kombucha-ta-you-i",
      "Entreprise": "You + I (Clever Kombucha Ltd.)"
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
      "Entreprise": "Ostrom (Aplus Energy GmbH)"
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
      "Entreprise": "Lopez Performance Solutions (LoPeS)"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/master-of-ceremonies-ltd",
      "Entreprise": "Pals"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/mr-marvis-bv",
      "Entreprise": "MR MARVIS Global Holding B.V."
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
      "Entreprise": "Don Baez - MONTELAN SA"
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
      "Entreprise": "BPM Development, L.L.C."
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
      "Entreprise": "Impacto - Experience Design"
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
      "Entreprise": "Magic Foundry Limited (trading as Ooni)"
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
      "Entreprise": "Dille & Kamille (International) B.V."
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
      "Entreprise": "IE Design Consultancy Ltd (TA IE Brand www.iebrand.co.uk and IE Digital www.iedigital.co.uk))"
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
      "Entreprise": "Wopilo (Better Path SAS)"
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
      "Entreprise": "ReVaso (REUY S.A.S)"
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
      "Entreprise": "Ambro-Sol S.r.l. SB"
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
      "Entreprise": "VANITY COSMETICA S.r.l."
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/life-is-tech",
      "Entreprise": "Life is Tech!"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/ciele-athletics",
      "Entreprise": "Ciele Athletics Inc"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/micro-scooters-ltd",
      "Entreprise": "Micro Scooters Ltd"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/grace-farms-foods-llc",
      "Entreprise": "Grace Farms Foods, LLC"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/in-blooom-co-ltd",
      "Entreprise": "inBlooom Co, Ltd."
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
      "Entreprise": "Wazoku, Ltd"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/cuatro-dos-srl",
      "Entreprise": "Cuatro Dos SRL"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/lick-home",
      "Entreprise": "Lick Home"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/culture-art-and-nature-can",
      "Entreprise": "Culture, Art and Nature (CAN)"
    },
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
      "Entreprise": "Bit (Prophets and Wizards B.V.)"
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
      "Entreprise": "QIDA (Caring Well, S.L.)"
    },
    {
      "FisrtURL": "https://www.bcorporation.net/en-us/find-a-b-corp/company/stories-services-ltd",
      "Entreprise": "Stories (Services) Ltd"
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
      "Entreprise": "Light Warrior Wellness (Wanderlust)"
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
    // TEST
    {
      "Entreprise": "2 Sisters Food Group"
    },
    {
      "Entreprise": "24 Ltd"
    },
    {
      "Entreprise": "2degrees"
    },
    {
      "Entreprise": "3B-Fibreglass"
    },
    {
      "Entreprise": "3i Group plc"
    },
  ],
]

let user_connected = false

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
  socket.on("signin", function ({email, password}) {
    // console.log('signin', email, password)
    let signin_result = 0
    if(!user_connected){
      if(email.toLowerCase().includes("@greenly.earth") && password === "S1fv@10nJ#H"){
        signin_result = 0
        user_connected = true
        console.log('client connecté', socket.id, user_connected);
      } else (
        signin_result = 1
      )
    } else {
      signin_result = 2
    }
    io.emit("signin_result", {"signin_result": signin_result, "id": socket.id});
  });
  socket.on("disconnect", (reason) => {
    user_connected = false
    console.log('client déconnecté', reason, user_connected)
  });
  socket.on("get_scrap", function ({selectedOption, selectedOptionICP, debVal}) {
    deb = debVal
    inc = deb + 1
    console.log('get_scrap', selectedOption, selectedOptionICP, deb, inc)
    timerInt = setInterval(()=>{
        // console.log('get_scrap_timer_int')
        if(selectedOption === options[0]){
          scrapAllURL(selectedOption, selectedOptionICP, dataURL[0], 0)
        } else if(selectedOption === options[1]){
          scrapAllURL(selectedOption, selectedOptionICP, dataURL[1], 1)
        } else if(selectedOption === options[2]){
          scrapAllURL(selectedOption, selectedOptionICP, dataURL[2], 2)
        } else if(selectedOption === options[3]){
          scrapAllURL(selectedOption, selectedOptionICP, dataURL[3], 3)
        } else {
          scrapAllURL(selectedOption, selectedOptionICP, dataURL[4], 4)
        }
    }, 10 * 1000) // 10sec
  });
  socket.on("get_comp_scrap", function ({selectedOption, selectedOptionICP, debVal}) {
    deb = debVal
    inc = deb + 1
    console.log('get_scrap_comp', selectedOption, selectedOptionICP, deb, inc)
    timerInt = setInterval(()=>{
        // console.log('get_scrap_timer_int')
        if(selectedOption === options[0]){
          scrapAllCompaniesURL(selectedOption, selectedOptionICP, dataURL[0], 0)
        } else if(selectedOption === options[1]){
          scrapAllCompaniesURL(selectedOption, selectedOptionICP, dataURL[1], 1)
        } else if(selectedOption === options[2]){
          scrapAllCompaniesURL(selectedOption, selectedOptionICP, dataURL[2], 2)
        } else if(selectedOption === options[3]){
          scrapAllCompaniesURL(selectedOption, selectedOptionICP, dataURL[3], 3)
        } else {
          scrapAllCompaniesURL(selectedOption, selectedOptionICP, dataURL[4], 4)
        }
    }, 10 * 1000) // 10sec
  });
  socket.on("stop_scrap", function () {
    console.log('stop_scrap')
    // io.emit("scrap_result", {"result": result, "deb": deb});
    io.emit("scrap_end");
    clearInterval(timerInt)
    deb = 0
    inc = deb + 1
    result = [];
  });
});

async function GetLinkedinDataFromCompany(selectedOptionICP, entreprise, val){
    // Login
    const client = new Client();
    try {
        await client.login.userPass({ username:"georges@greenly.earth", password:"25079819987" });
    } catch (error) {
        console.log(error)
    }
    let users = []
    let company = []
    try {
        // Fetch the job's company
        const companiesScroller = client.search.searchCompanies({
          keywords: entreprise,
          limit: 1,
        })
        // (type%3ATITLE%2Cvalues
        // List((text%3A%2528%25E2%2580%2599Directeur%25E2%2580%2599%2520OR%2520%25E2%2580%2598Directrice%25E2%2580%2599%2520OR%2520%25E2%2580%2598Director%25E2%2580%2599%2520OR%2520%25E2%2580%2598Head%2520of%25E2%2580%2599%2520OR%2520%25E2%2580%2598Project%2520Manager%25E2%2580%2599%2520OR%2520%25E2%2580%2598Charg%25C3%25A9%25E2%2580%2599%2520OR%2520%25E2%2580%2598Charg%25C3%25A9e%25E2%2580%2599%2520OR%2520%25E2%2580%2598Chef%2520de%2520Projet%25E2%2580%2599%2520OR%2520%25E2%2580%2598Cheffe%2520de%2520Projet%25E2%2580%2599%2520OR%2520%25E2%2580%2598Coordinateur%25E2%2580%2599%2520OR%2520%2527Responsable%2527%2520OR%2520%2527Coordinatrice%2527%2520OR%2520%25E2%2580%2598Coordinator%25E2%2580%2599%2520OR%2520%25E2%2580%2598Chief%25E2%2580%2599%2520OR%2520%25E2%2580%2598Manager%25E2%2580%2599%2520OR%2520%25E2%2580%2598Partner%25E2%2580%2599%2520OR%2520%25E2%2580%2598Analyste%25E2%2580%2599%2529%2520AND%2520%2528%2527RSE%2527%2520OR%2520%2520%25E2%2580%2598QSE%25E2%2580%2599%2520OR%2520%25E2%2580%2598HSE%25E2%2580%2599%2520OR%2520%25E2%2580%2598QHSE%25E2%2580%2599%2520OR%2520%25E2%2580%2598Environnement%25E2%2580%2599%2520OR%2520%25E2%2580%2598D%25C3%25A9veloppement%2520Durable%25E2%2580%2599%2520OR%2520%25E2%2580%2598Sustainability%25E2%2580%2599%2520OR%2520%25E2%2580%2598ESG%25E2%2580%2599%2520OR%2520%25E2%2580%2598ISR%25E2%2580%2599%2520OR%2520%25E2%2580%2598CSR%25E2%2580%2599%2520OR%2520%25E2%2580%2598Impact%25E2%2580%2599%2520OR%2520%25E2%2580%2598Impact%25E2%2580%2599%2520OR%2520%25E2%2580%2598Climat%25E2%2580%2599%2520OR%2520%25E2%2580%2598Climate%25E2%2580%2599%2520OR%2520%25E2%2580%2598Num%25C3%25A9rique%2520Responsable%25E2%2580%2599%2520OR%2520%25E2%2580%2598Bas-carbone%25E2%2580%2599%2529%2520OR%2520%2528%25E2%2580%2599Directeur%25E2%2580%2599%2520OR%2520%25E2%2580%2598Directrice%25E2%2580%2599%2520OR%2520%25E2%2580%2598Director%25E2%2580%2599%2520OR%2520%25E2%2580%2598Chief%25E2%2580%2599%2520OR%2520%25E2%2580%2598Head%2520of%25E2%2580%2599%2529%2520AND%2520%2528%25E2%2580%2599Op%25C3%25A9rations%25E2%2580%2599%2520OR%2520%25E2%2580%2598Operations%25E2%2580%2599%2520OR%2520%25E2%2580%2598Achats%25E2%2580%2599%2520OR%2520%25E2%2580%2598Procurement%25E2%2580%2599%2520OR%2520%25E2%2580%2598Achats%2520Responsables%25E2%2580%2599%2520OR%2520%25E2%2580%2598Qualit%25C3%25A9%25E2%2580%2599%2520OR%2520%25E2%2580%2598Strat%25C3%25A9gie%25E2%2580%2599%2520OR%2520%25E2%2580%2598Finance%25E2%2580%2599%2520OR%2520%25E2%2580%2598Qualit%25C3%25A9%25E2%2580%2599%2520OR%2520%25E2%2580%2598Conformit%25C3%25A9%25E2%2580%2599%2529%2520NOT%2520%2528%25E2%2580%2598Sales%25E2%2580%2599%2520OR%2520%25E2%2580%2598Commercial%25E2%2580%2599%2520OR%2520%25E2%2580%2598Adjoint%25E2%2580%2599%2520OR%2520%25E2%2580%2598Assistant%25E2%2580%2599%2520OR%2520%25E2%2580%2598Stagiaire%25E2%2580%2599%2520OR%2520%25E2%2580%2598Consultant%25E2%2580%2599%2520OR%2520%25E2%2580%2598Talent%25E2%2580%2599%2520OR%2520%25E2%2580%2598Lecturer%25E2%2580%2599%2520OR%2520%25E2%2580%2598Freelance%25E2%2580%2599%2520OR%2520%25E2%2580%2598R%2526D%25E2%2580%2599%2520OR%2520%25E2%2580%2598SI%25E2%2580%2599%2520OR%2520%25E2%2580%2598IT%25E2%2580%2599%2520OR%2520%25E2%2580%2598Administrateur%25E2%2580%2599%2520OR%2520%25E2%2580%2598Business%25E2%2580%2599%2520OR%2520%25E2%2580%2598Fresque%25E2%2580%2599%2520OR%2520%25E2%2580%2598Advisor%25E2%2580%2599%2520OR%2520%25E2%2580%2598S%25C3%25A9curit%25C3%25A9%25E2%2580%2599%2520Or%2520%25E2%2580%2598Investor%25E2%2580%2599%2529%2520OR%2520%2528%25E2%2580%2599CEO%25E2%2580%2599%2520OR%2520%25E2%2580%2598PDG%25E2%2580%2599%2520OR%2520%25E2%2580%2598Directeur%2520G%25C3%25A9n%25C3%25A9ral%25E2%2580%2599%2520OR%2520%25E2%2580%2598Co-founder%25E2%2580%2599%2520OR%2520%25E2%2580%2598Chief%2520of%2520Staff%25E2%2580%2599%2520OR%2520%25E2%2580%2598Partner%25E2%2580%2599%2520OR%2520%25E2%2580%2598COO%25E2%2580%2599%2520OR%2520%25E2%2580%2598CMO%25E2%2580%2599%2529%2520OR%2520%2528%25E2%2580%2599Directeur%25E2%2580%2599%2520OR%2520%25E2%2580%2598Directrice%25E2%2580%2599%2520OR%2520%25E2%2580%2598Director%25E2%2580%2599%2520OR%2520%25E2%2580%2598Chief%25E2%2580%2599%2520OR%2520%25E2%2580%2598Head%2520of%25E2%2580%2599%2529%2520AND%2520%2528%25E2%2580%2599Op%25C3%25A9rations%25E2%2580%2599%2520OR%2520%25E2%2580%2598Operations%25E2%2580%2599%2520OR%2520%25E2%2580%2598Achats%25E2%2580%2599%2520OR%2520%25E2%2580%2598Procurement%25E2%2580%2599%2520OR%2520%25E2%2580%2598Achats%2520Responsables%25E2%2580%2599%2520OR%2520%25E2%2580%2598Qualit%25C3%25A9%25E2%2580%2599%2520OR%2520%25E2%2580%2598Marketing%25E2%2580%2599%2520OR%2520%25E2%2580%2598Communication%25E2%2580%2599%2520OR%2520%25E2%2580%2598Strat%25C3%25A9gie%25E2%2580%2599%2520OR%2520%25E2%2580%2598Finance%25E2%2580%2599%2520OR%2520%25E2%2580%2598Qualit%25C3%25A9%25E2%2580%2599%2520OR%2520%25E2%2580%2598Conformit%25C3%25A9%25E2%2580%2599%2529%2520NOT%2520%2528%25E2%2580%2598Sales%25E2%2580%2599%2520OR%2520%25E2%2580%2598Commercial%25E2%2580%2599%2520OR%2520%25E2%2580%2598Adjoint%25E2%2580%2599%2520OR%2520%25E2%2580%2598Assistant%25E2%2580%2599%2520OR%2520%25E2%2580%2598Stagiaire%25E2%2580%2599%2520OR%2520%25E2%2580%2598Consultant%25E2%2580%2599%2520OR%2520%25E2%2580%2598Freelance%25E2%2580%2599%2520OR%2520%25E2%2580%2598R%2526D%25E2%2580%2599%2520OR%2520%25E2%2580%2598DSI%25E2%2580%2599%2520OR%2520%25E2%2580%2598SI%25E2%2580%2599%2520OR%2520%25E2%2580%2598IT%25E2%2580%2599%2520OR%2520%25E2%2580%2598Administrateur%25E2%2580%2599%2520OR%2520%25E2%2580%2598Business%2520Partner%25E2%2580%2599%2529%2CselectionType%3AINCLUDED))
        //'Directeur OR Directrice OR Director OR Head of OR Project Manager OR Chargé OR Chargée OR Chef de Projet OR Cheffe de Projet OR Coordinateur OR Responsable OR Coordinatrice OR Coordinator OR Chief OR Manager OR Partner OR Analyste'
        company = await companiesScroller.fetch()
        if(company.length <= 0 || company[0] === undefined || company[0].title || company[0].headline === undefined || company[0].subline === undefined || company[0].company === undefined || company[0].subline.text === undefined){
          // console.log(company[0].subline.text.split(" ")[0].split("-")[0].replace(",",""), parseInt(company[0].subline.text.split(" ")[0].split("-")[0].replace(",","")))
          if(
            company[0].subline.text.split(" ")[0].split("-")[0].length <= 1 || 
            parseInt(company[0].subline.text.split(" ")[0].split("-")[0].replace(",","")) === NaN  || 
            parseInt(company[0].subline.text.split(" ")[0].split("-")[0].replace(",","")) <= 50 
          ){
            company = []
          } else {
            // console.log("=======> ",company[0])
            if(val === true){
              if(selectedOptionICP === optionsICP[0]){
                const jobs1 = await client.search.searchPeople({filters: { company: entreprise, title: jobsICP[0]},keywords: entreprise,limit: 50}).fetch()
                const jobs2 = await client.search.searchPeople({filters: { company: entreprise, title: jobsICP[1]},keywords: entreprise,limit: 50}).fetch()
                const jobs3 = await client.search.searchPeople({filters: { company: entreprise, title: jobsICP[3]},keywords: entreprise,limit: 50}).fetch()
                users = users.concat(jobs1)
                users = users.concat(jobs2)
                users = users.concat(jobs3)
                users = [...new Map(users.map(v => [v["navigationUrl"], v])).values()]
              } else {
                let titleICP = (selectedOptionICP === optionsICP[0]) ? jobsICP[0] : ( (selectedOptionICP === optionsICP[1]) ? jobsICP[1] : ( (selectedOptionICP === optionsICP[2]) ? jobsICP[2] : jobsICP[3] ) )
                users = await client.search.searchPeople({filters: { company: entreprise, title: titleICP},keywords: entreprise,limit: 50}).fetch()
              }              
            } 
            // else {
            //   const peopleScroller = client.search.searchPeople({
            //     filters: { company: entreprise /*industry: company[0].headline.text , geoUrn: location */ },
            //     keywords: entreprise,
            //     limit: 1,
            //   })
            //   users = await peopleScroller.fetch()
            // }
          }
        }
    } catch (error) {
        console.log("==>> erreur")
        users = []
        company = []
    }
    // console.log("=>>>>", company)
    // let tmp = company[0].subline.text.split(" ")[0].split("-")[0].length
    // console.log("==>>>", tmp)
    return {
      // Nom: .title.text - Industry: .headline.text - size: .subline.text - https://www.linkedin.com/company/ + .company.companyId
      "Company": {
        "nom": (company.length <= 0 || company[0].title === undefined || company[0].title.text === undefined) ? "" : company[0].title.text,
        "industry" : (company.length <= 0 || company[0].headline === undefined || company[0].headline.text === undefined) ? "" :company[0].headline.text,
        "size" : (company.length <= 0 || company[0].subline === undefined || company[0].subline.text === undefined) ? "" :company[0].subline.text,
        // "loc" : (users.length <= 0 || users[0].subline === undefined || users[0].subline.text === undefined) ? "" : users[0].subline.text,
        "loc" : "",
        "url_linkedin" : (company.length <= 0 || company[0].company === undefined || company[0].company.companyId === undefined) ? "" : ("https://www.linkedin.com/company/" + company[0].company.companyId)
      },
      "Users": users
    }
}
async function getData(selectedOptionICP, dataURL, dataURLIndex, dataIndex, html, url){
  switch(dataURLIndex){
    case 0: {
      console.log("===>", deb, dataURL[deb]["Entreprise"])
      //Get Linkedin Datas
      let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, dataURL[dataIndex]["Entreprise"], true)
      let users = lnData["Users"]
      let company = lnData["Company"]
      // console.log("====>>>>>>>>>>", users.length)
      try {
          if (!(users === undefined || users === "" || users === null || users.length === 0)){
              users.forEach((user)=>{
                  if(
                    !(user.profile.firstName === undefined || user.profile.firstName === "" || user.profile.firstName === null  || company.size === "")
                    // &&
                    // !(jobs.icpno.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) 
                    // &&
                    // (
                    //   (jobs.icp1.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp2.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) ||
                    //   (jobs.icp3.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp4.some(x => user.profile.occupation.toLowerCase().includes(x)) === true)
                    // )
                  ){
                    // console.log(user)
                    result.push({
                        "URL": options[dataURLIndex],
                        "isNew": "yes",
                        "Entreprise": dataURL[dataIndex]["Entreprise"],
                        "Localisation": /*(locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? "France" :*/ user.subline.text,
                        "Geographie Greenly" : (locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[0] : ((locs.us.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[1] : ((locs.uk.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[2] : locs_greenly[3])),
                        "Industrie": company.industry,
                        "Taille": company.size,
                        "URL Linkedin": company.url_linkedin,
                        "Prenom": user.profile.firstName,
                        "Nom": user.profile.lastName,
                        "Poste": user.profile.occupation,
                        "Profil Linkedin": user.navigationUrl,
                        "Domaine Web": "",
                        "Email": "",
                        "Telephone": ""
                    })
                  }
              })
              //Show to the table
              io.emit("scrap_result", {"result": result, "deb": deb});
              // if(result.length % mod_leads === 0) io.emit("scrap_result", {"result": result, "deb": deb});
              // result = [];
          } else {
            result.push({
              "URL": options[dataURLIndex],
              "isNew": "notfound",
              "Entreprise": dataURL[dataIndex]["Entreprise"],
              "Localisation": "",
              "Geographie Greenly" : "",
              "Industrie": company.industry,
              "Taille": company.size,
              "URL Linkedin": company.url_linkedin,
              "Prenom": "",
              "Nom": "",
              "Poste": "",
              "Profil Linkedin": "",
              "Domaine Web": "",
              "Email": "",
              "Telephone": ""
            })
            //Show to the table
            io.emit("scrap_result", {"result": result, "deb": deb});
          }
      } catch (error) {
          console.error("pass")
      }
      break;
    }
    case 1: {
      console.log("===>", deb, dataURL[deb]["Entreprise"])
      //Get Linkedin Datas
      let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, dataURL[dataIndex]["Entreprise"], true)
      let users = lnData["Users"]
      let company = lnData["Company"]
      try {
          if (!(users === undefined || users === "" || users === null || users.length === 0)){
              users.forEach((user)=>{
                if(
                  !(user.profile.firstName === undefined || user.profile.firstName === "" || user.profile.firstName === null  || company.size === "")
                  // && 
                  // !(jobs.icpno.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) &&
                  // (
                  //   (jobs.icp1.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp2.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) ||
                  //   (jobs.icp3.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp4.some(x => user.profile.occupation.toLowerCase().includes(x)) === true)
                  // )
                ){
                    result.push({
                        "URL": options[dataURLIndex],
                        "isNew": "yes",
                        "Entreprise": dataURL[dataIndex]["Entreprise"],
                        "Localisation": /*(locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? "France" :*/ user.subline.text,
                        "Geographie Greenly" : (locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[0] : ((locs.us.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[1] : ((locs.uk.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[2] : locs_greenly[3])),
                        "Industrie": company.industry,
                        "Taille": company.size,
                        "URL Linkedin": company.url_linkedin,
                        "Prenom": user.profile.firstName,
                        "Nom": user.profile.lastName,
                        "Poste": user.profile.occupation,
                        "Profil Linkedin": user.navigationUrl,
                        "Domaine Web": "",
                        "Email": "",
                        "Telephone": ""
                    })
                  }
              })
              //Show to the table
              io.emit("scrap_result", {"result": result, "deb": deb});
              // result = [];
            } else {
              result.push({
                "URL": options[dataURLIndex],
                "isNew": "notfound",
                "Entreprise": dataURL[dataIndex]["Entreprise"],
                "Localisation": "",
                "Geographie Greenly" : "",
                "Industrie": company.industry,
                "Taille": company.size,
                "URL Linkedin": company.url_linkedin,
                "Prenom": "",
                "Nom": "",
                "Poste": "",
                "Profil Linkedin": "",
                "Domaine Web": "",
                "Email": "",
                "Telephone": ""
              })
              //Show to the table
              io.emit("scrap_result", {"result": result, "deb": deb});
            }
      } catch (error) {
          console.error("pass")
      }
      break;
    }
    case 2: {
      let entreprise = dataURL[dataIndex]["Entreprise"]
      const re = /\s*(?:once|\:|\-|\(|\,|obtain|name|recogn|award|streng|earn|receiv|achiev|acquir|honor|ranked|win|join|recogniz|place|has|tops|scoop|'|take|announc|rating|$)\s*/;
      if(entreprise.toLowerCase().split(re).length > 1){
        entreprise = entreprise.toLowerCase().split(re)[0]
        console.log("===>", deb, entreprise)
        //Get Linkedin Datas
        let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, entreprise, true)
        let users = lnData["Users"]
        let company = lnData["Company"]
        try {
            if (!(users === undefined || users === "" || users === null || users.length === 0)){
                users.forEach((user)=>{
                  if(
                    !(user.profile.firstName === undefined || user.profile.firstName === "" || user.profile.firstName === null  || company.size === "")
                    // && 
                    // !(jobs.icpno.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) &&
                    // (
                    //   (jobs.icp1.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp2.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) ||
                    //   (jobs.icp3.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp4.some(x => user.profile.occupation.toLowerCase().includes(x)) === true)
                    // )
                  ){
                        result.push({
                            "URL": options[dataURLIndex],
                            "isNew": "yes",
                            "Entreprise": entreprise,
                            "Localisation": /*(locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? "France" :*/ user.subline.text,
                            "Geographie Greenly" : (locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[0] : ((locs.us.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[1] : ((locs.uk.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[2] : locs_greenly[3])),
                            "Industrie": company.industry,
                            "Taille": company.size,
                            "URL Linkedin": company.url_linkedin,
                            "Prenom": user.profile.firstName,
                            "Nom": user.profile.lastName,
                            "Poste": user.profile.occupation,
                            "Profil Linkedin": user.navigationUrl,
                            "Domaine Web": "",
                            "Email": "",
                            "Telephone": ""
                        })
                    }
                })
                //Show to the table
                io.emit("scrap_result", {"result": result, "deb": deb});
                // result = [];
            } else {
                result.push({
                  "URL": options[dataURLIndex],
                  "isNew": "notfound",
                  "Entreprise": entreprise,
                  "Localisation": "",
                  "Geographie Greenly" : "",
                  "Industrie": company.industry,
                  "Taille": company.size,
                  "URL Linkedin": company.url_linkedin,
                  "Prenom": "",
                  "Nom": "",
                  "Poste": "",
                  "Profil Linkedin": "",
                  "Domaine Web": "",
                  "Email": "",
                  "Telephone": ""
                })
                //Show to the table
                io.emit("scrap_result", {"result": result, "deb": deb});
            }
        } catch (error) {
            console.error("pass")
        }
      }
      break;
    }
    case 3: {
      const $ = load(html)
      $('.break-words .opacity-60 a', html).each(async(index, el) => {
        console.log("===>", deb, dataURL[deb]["Entreprise"])
        //Get Linkedin Datas
        let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, dataURL[dataIndex]["Entreprise"], true)
        let users = lnData["Users"]
        let company = lnData["Company"]
        try {
            if (!(users === undefined || users === "" || users === null || users.length === 0)){
                users.forEach((user)=>{
                  if(
                    !(user.profile.firstName === undefined || user.profile.firstName === "" || user.profile.firstName === null  || company.size === "")
                    // && 
                    // !(jobs.icpno.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) &&
                    // (
                    //   (jobs.icp1.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp2.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) ||
                    //   (jobs.icp3.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp4.some(x => user.profile.occupation.toLowerCase().includes(x)) === true)
                    // )
                  ){
                    // console.log(dataURL[dataIndex]["Entreprise"])
                      result.push({
                          "URL": options[dataURLIndex],
                          "isNew": "yes",
                          "Entreprise": dataURL[dataIndex]["Entreprise"],
                          "Localisation": /*(locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? "France" :*/ user.subline.text,
                          "Geographie Greenly" : (locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[0] : ((locs.us.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[1] : ((locs.uk.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[2] : locs_greenly[3])),
                          "Industrie": company.industry,
                          "Taille": company.size,
                          "URL Linkedin": company.url_linkedin,
                          "Prenom": user.profile.firstName,
                          "Nom": user.profile.lastName,
                          "Poste": user.profile.occupation,
                          "Profil Linkedin": user.navigationUrl,
                          "Domaine Web": $(el).attr("href"),
                          "Email": "",
                          "Telephone": ""
                      })
                    }
                })
                //Show to the table
                io.emit("scrap_result", {"result": result, "deb": deb});
                // result = [];
              } else {
                result.push({
                  "URL": options[dataURLIndex],
                  "isNew": "notfound",
                  "Entreprise": dataURL[dataIndex]["Entreprise"],
                  "Localisation": "",
                  "Geographie Greenly" : "",
                  "Industrie": company.industry,
                  "Taille": company.size,
                  "URL Linkedin": company.url_linkedin,
                  "Prenom": "",
                  "Nom": "",
                  "Poste": "",
                  "Profil Linkedin": "",
                  "Domaine Web": "",
                  "Email": "",
                  "Telephone": ""
                })
                //Show to the table
                io.emit("scrap_result", {"result": result, "deb": deb});
              }
        } catch (error) {
            console.error("pass")
        }
      })
      break;
    }
    case 4: {
      console.log("===>", deb, dataURL[deb]["Entreprise"])
      //Get Linkedin Datas
      let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, dataURL[dataIndex]["Entreprise"], true)
      let users = lnData["Users"]
      let company = lnData["Company"]
      try {
          if (!(users === undefined || users === "" || users === null || users.length === 0)){
              users.forEach((user)=>{
                  if(
                    !(user.profile.firstName === undefined || user.profile.firstName === "" || user.profile.firstName === null  || company.size === "")
                    // &&
                    // !(jobs.icpno.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) 
                    // &&
                    // (
                    //   (jobs.icp1.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp2.some(x => user.profile.occupation.toLowerCase().includes(x)) === true) ||
                    //   (jobs.icp3.some(x => user.profile.occupation.toLowerCase().includes(x)) === true && jobs.icp4.some(x => user.profile.occupation.toLowerCase().includes(x)) === true)
                    // )
                  ){
                    // console.log(user)
                    result.push({
                        "URL": options[dataURLIndex],
                        "isNew": "yes",
                        "Entreprise": dataURL[dataIndex]["Entreprise"],
                        "Localisation": /*(locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? "France" :*/ user.subline.text,
                        "Geographie Greenly" : (locs.fr.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[0] : ((locs.us.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[1] : ((locs.uk.some(x => user.subline.text.toLowerCase().includes(x)) === true) ? locs_greenly[2] : locs_greenly[3])),
                        "Industrie": company.industry,
                        "Taille": company.size,
                        "URL Linkedin": company.url_linkedin,
                        "Prenom": user.profile.firstName,
                        "Nom": user.profile.lastName,
                        "Poste": user.profile.occupation,
                        "Profil Linkedin": user.navigationUrl,
                        "Domaine Web": "",
                        "Email": "",
                        "Telephone": ""
                    })
                  }
              })
              //Show to the table
              io.emit("scrap_result", {"result": result, "deb": deb});
              // result = [];
            } else {
              result.push({
                "URL": options[dataURLIndex],
                "isNew": "notfound",
                "Entreprise": dataURL[dataIndex]["Entreprise"],
                "Localisation": "",
                "Geographie Greenly" : "",
                "Industrie": company.industry,
                "Taille": company.size,
                "URL Linkedin": company.url_linkedin,
                "Prenom": "",
                "Nom": "",
                "Poste": "",
                "Profil Linkedin": "",
                "Domaine Web": "",
                "Email": "",
                "Telephone": ""
              })
              //Show to the table
              io.emit("scrap_result", {"result": result, "deb": deb});
            }
      } catch (error) {
          console.error("pass")
      }
      break;
    }
  }
}
async function firstScrapData(selectedOptionICP, dataURL,dataURLIndex, url, index){
    try {
        const response = (await fetch(url))
        const html = await response.text()
        // console.log("HTML : " + url + " - " + html)
        await getData(selectedOptionICP, dataURL,dataURLIndex, index, html, url)
    } catch (error) {
        console.error(error)
    }
}
function scrapAllURL(selectedOption, selectedOptionICP, dataURL, dataURLIndex){
    if(deb === dataURL.length) {
      console.log('stop_scrap')
      io.emit("scrap_result", {"result": result, "deb": deb});
      io.emit("scrap_end");
      clearInterval(timerInt)
      deb = 0
      inc = deb + 1
      result = [];
    } else {
      // console.log("===>", deb, dataURL[deb]["Entreprise"])
      if(selectedOption === options[0]){
        getData(selectedOptionICP, dataURL, dataURLIndex, deb, "", "")
      } else if(selectedOption === options[1]){
        getData(selectedOptionICP, dataURL, dataURLIndex, deb, "", "")
      } else if(selectedOption === options[2]){
        getData(selectedOptionICP, dataURL, dataURLIndex, deb, "", "")
      } else if(selectedOption === options[3]){
        firstScrapData(selectedOptionICP, dataURL, dataURLIndex, dataURL[deb]["FisrtURL"], deb)
      } else if(selectedOption === options[4]) {
        getData(selectedOptionICP, dataURL, dataURLIndex, deb, "", "")
      }

      deb = inc
      inc = ( (inc+1) >= dataURL.length) ? dataURL.length : (inc+1)
      result = [];
    }
}
async function scrapAllCompaniesURL(selectedOption, selectedOptionICP, dataURL, dataURLIndex){
  if(deb === dataURL.length) {
    console.log('stop_scrap')
    // io.emit("scrap_result", {"result": result, "deb": deb});
    io.emit("scrap_end");
    clearInterval(timerInt)
    deb = 0
    inc = deb + 1
    result = [];
  } else {
    if(selectedOption === options[2]){
      let entreprise = dataURL[deb]["Entreprise"]
      const re = /\s*(?:once|\:|\-|\(|\,|obtain|name|recogn|award|streng|earn|receiv|achiev|acquir|honor|ranked|win|join|recogniz|place|has|tops|scoop|'|take|announc|rating|$)\s*/;
      if(entreprise.toLowerCase().split(re).length > 1){
        entreprise = entreprise.toLowerCase().split(re)[0]
        console.log("===>", deb, entreprise)
        //Get Linkedin Datas
        let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, entreprise, false)
        let company = lnData["Company"]
        if(company.size !== ""){
          result.push({
            "URL": selectedOption,
            "isNew": "yes",
            "Entreprise": entreprise,
            "Localisation": company.loc,
            "Geographie Greenly" : "",
            "Industrie": company.industry,
            "Taille": company.size,
            "URL Linkedin": company.url_linkedin,
            "Prenom": "",
            "Nom": "",
            "Poste": "",
            "Profil Linkedin": "",
            "Domaine Web": "",
            "Email": "",
            "Telephone": ""
          })
        } else {
          result.push({
            "URL": selectedOption,
            "isNew": "notfound",
            "Entreprise": entreprise,
            "Localisation": company.loc,
            "Geographie Greenly" : "",
            "Industrie": company.industry,
            "Taille": company.size,
            "URL Linkedin": company.url_linkedin,
            "Prenom": "",
            "Nom": "",
            "Poste": "",
            "Profil Linkedin": "",
            "Domaine Web": "",
            "Email": "",
            "Telephone": ""
          })
        }
        //Show to the table
        //if(result.length % mod_comp === 0) 
        io.emit("scrap_result", {"result": result, "deb": deb});
      }
    } else {
      console.log("===>", deb, dataURL[deb]["Entreprise"])
      let lnData = await GetLinkedinDataFromCompany(selectedOptionICP, dataURL[deb]["Entreprise"], false)
      let company = lnData["Company"]
      if(company.size !== ""){
        result.push({
          "URL": selectedOption,
          "isNew": "yes",
          "Entreprise": dataURL[deb]["Entreprise"],
          "Localisation": company.loc,
          "Geographie Greenly" : "",
          "Industrie": company.industry,
          "Taille": company.size,
          "URL Linkedin": company.url_linkedin,
          "Prenom": "",
          "Nom": "",
          "Poste": "",
          "Profil Linkedin": "",
          "Domaine Web": "",
          "Email": "",
          "Telephone": ""
        })
      } else {
        result.push({
          "URL": selectedOption,
          "isNew": "notfound",
          "Entreprise": dataURL[deb]["Entreprise"],
          "Localisation": company.loc,
          "Geographie Greenly" : "",
          "Industrie": company.industry,
          "Taille": company.size,
          "URL Linkedin": company.url_linkedin,
          "Prenom": "",
          "Nom": "",
          "Poste": "",
          "Profil Linkedin": "",
          "Domaine Web": "",
          "Email": "",
          "Telephone": ""
        })
      }
      //Show to the table
      // if(result.length % mod_comp === 0) 
      io.emit("scrap_result", {"result": result, "deb": deb});
    }
  
    deb = inc
    inc = ( (inc+1) >= dataURL.length) ? dataURL.length : (inc+1)
    result = [];
  }
}

const port = 8080 //process.env.PORT;
server.listen(port, () => console.log(`Listening to port ${port}`));