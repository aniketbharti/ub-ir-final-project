import glob
import json
import os
import pickle

from bson import json_util
from solr import solr
import string
import numpy as np
import random
import preprocessor as p
p.set_options(p.OPT.MENTION, p.OPT.URL)

path = "../data/pois"
path2 = "../data/pois"
custom_edit = True
table = str.maketrans(dict.fromkeys(string.punctuation))
retweet_count_idx = np.random.choice(300, 200)
favorite_count_idx = np.random.choice(300, 150)


lk = {
  "covid": [
    "quarentena",
    "hospital",
    "covidresources",
    "rt-pcr",
    "वैश्विकमहामारी",
    "oxygen",
    "सुरक्षित रहें",
    "stayhomestaysafe",
    "covid19",
    "quarantine",
    "मास्क",
    "face mask",
    "covidsecondwaveinindia",
    "flattenthecurve",
    "corona virus",
    "wuhan",
    "cierredeemergencia",
    "autoaislamiento",
    "sintomas",
    "covid positive",
    "casos",
    "कोविड मृत्यु",
    "स्वयं चुना एकांत",
    "stay safe",
    "#deltavariant",
    "covid symptoms",
    "sarscov2",
    "covidiots",
    "brote",
    "alcohol en gel",
    "disease",
    "asintomático",
    "टीकाकरण",
    "encierro",
    "covidiot",
    "covidappropriatebehaviour",
    "fever",
    "pandemia de covid-19",
    "wearamask",
    "flatten the curve",
    "oxígeno",
    "desinfectante",
    "super-spreader",
    "ventilador",
    "coronawarriors",
    "quedate en casa",
    "mascaras",
    "mascara facial",
    "trabajar desde casa",
    "संगरोध",
    "immunity",
    "स्वयं संगरोध",
    "डेल्टा संस्करण",
    "mask mandate",
    "health",
    "dogajkidoori",
    "travelban",
    "cilindro de oxígeno",
    "covid",
    "staysafe",
    "variant",
    "yomequedoencasa",
    "doctor",
    "एंटीबॉडी",
    "दूसरीलहर",
    "distancia social",
    "मुखौटा",
    "covid test",
    "अस्पताल",
    "covid deaths",
    "कोविड19",
    "muvariant",
    "susanadistancia",
    "personal protective equipment",
    "remdisivir",
    "quedateencasa",
    "asymptomatic",
    "social distancing",
    "distanciamiento social",
    "cdc",
    "transmission",
    "epidemic",
    "social distance",
    "herd immunity",
    "transmisión",
    "सैनिटाइज़र",
    "indiafightscorona",
    "surgical mask",
    "facemask",
    "desinfectar",
    "वायरस",
    "संक्रमण",
    "symptoms",
    "सामाजिक दूरी",
    "covid cases",
    "ppe",
    "sars",
    "autocuarentena",
    "प्रक्षालक",
    "breakthechain",
    "stayhomesavelives",
    "coronavirusupdates",
    "sanitize",
    "covidinquirynow",
    "क ोरोना",
    "workfromhome",
    "outbreak",
    "flu",
    "sanitizer",
    "distanciamientosocial",
    "variante",
    "कोविड 19",
    "कोविड-19",
    "covid pneumonia",
    "कोविड",
    "pandemic",
    "icu",
    "वाइरस",
    "contagios",
    "वेंटिलेटर",
    "washyourhands",
    "n95",
    "stayhome",
    "lavadodemanos",
    "fauci",
    "रोग प्रतिरोधक शक्ति",
    "maskmandate",
    "डेल्टा",
    "कोविड महामारी",
    "third wave",
    "epidemia",
    "fiebre",
    "मौत",
    "travel ban",
    "फ़्लू",
    "muerte",
    "स्वच्छ",
    "washhands",
    "enfermedad",
    "contagio",
    "infección",
    "faceshield",
    "self-quarantine",
    "remdesivir",
    "oxygen cylinder",
    "mypandemicsurvivalplan",
    "कोविड के केस",
    "delta variant",
    "wuhan virus",
    "लक्षण",
    "corona",
    "maskup",
    "gocoronago",
    "death",
    "curfew",
    "socialdistance",
    "second wave",
    "máscara",
    "stayathome",
    "positive",
    "lockdown",
    "propagación en la comunidad",
    "तीसरी लहर",
    "aislamiento",
    "rtpcr",
    "coronavirus",
    "variante delta",
    "distanciasocial",
    "cubrebocas",
    "घर पर रहें",
    "socialdistancing",
    "covidwarriors",
    "प्रकोप",
    "covid-19",
    "stay home",
    "संक्रमित",
    "jantacurfew",
    "cowin",
    "कोरोनावाइरस",
    "virus",
    "distanciamiento",
    "cuarentena",
    "indiafightscovid19",
    "healthcare",
    "natocorona",
    "मास्क पहनें",
    "delta",
    "ऑक्सीजन",
    "wearmask",
    "कोरोनावायरस",
    "ventilator",
    "pneumonia",
    "maskupindia",
    "ppe kit",
    "sars-cov-2",
    "testing",
    "fightagainstcovid19",
    "महामारी",
    "नियंत्रण क्षेत्र",
    "who",
    "mask",
    "pandemia",
    "deltavariant",
    "वैश्विक महामारी",
    "रोग",
    "síntomas",
    "work from home",
    "antibodies",
    "masks",
    "confinamiento",
    "flattening the curve",
    "मुखौटा जनादेश",
    "thirdwave",
    "mascarilla",
    "usacubrebocas",
    "covidemergency",
    "inmunidad",
    "cierre de emergencia",
    "self-isolation",
    "स्वास्थ्य सेवा",
    "सोशल डिस्टन्सिंग",
    "isolation",
    "cases",
    "community spread",
    "unite2fightcorona",
    "oxygencrisis",
    "containment zones",
    "homequarantine",
    "स्पर्शोन्मुख",
    "लॉकडाउन",
    "hospitalización",
    "incubation period"
  ],
  "vaccine": [
    "anticuerpos",
    "vaccine mandate",
    "eficacia de la vacuna",
    "vacuna covid",
    "covidvaccine",
    "zycov-d",
    "vaccines",
    "#largestvaccinedrive",
    "vaccination",
    "dosis de vacuna",
    "moderna",
    "campaña de vacunación",
    "vaccineshortage",
    "vacunar",
    "covid vaccine",
    "efectos secundarios de la vacuna",
    "कोविशील्ड",
    "hydroxychloroquine",
    "efficacy",
    "टीके",
    "टीकाकरण",
    "वैक्सीनेशन",
    "shots",
    "covishield",
    "vaccine",
    "antibody",
    "j&j vaccine",
    "booster shot",
    "वैक्सीन पासपोर्ट",
    "covidvaccination",
    "दूसरी खुराक",
    "inyección de refuerzo",
    "astrazeneca",
    "टीकाकरण अभियान",
    "vacunacovid19",
    "johnson & johnson",
    "पहली खुराक",
    "sinopharm",
    "immunity",
    "vaccination drive",
    "inmunización",
    "vaccine dose",
    "we4vaccine",
    "पूर्ण टीकाकरण",
    "vaccine passports",
    "ए ंटीबॉडी",
    "vacunado",
    "vacunarse",
    "johnson",
    "efecto secundario",
    "astra zeneca",
    "yomevacunoseguro",
    "injection",
    "cdc",
    "वैक्सीन के साइड इफेक्ट",
    "getvaxxed",
    "teeka",
    "टीका",
    "herd immunity",
    "वैक्सीन जनादेश",
    "vaccinepassports",
    "estrategiadevacunación",
    "ivermectin",
    "cansino",
    "vacunas",
    "vaccinehesitancy",
    "sputnik",
    "johnson & johnson’s janssen",
    "unvaccinated",
    "janssen",
    "sputnik v",
    "vacunaton",
    "seconddose",
    "कोवेक्सिन",
    "getvaccinatednow",
    "tikakaran",
    "कोविशिल्ड",
    "खुराक",
    "covaxine",
    "mrna",
    "first dose",
    "वाइरस",
    "booster shots",
    "dosis",
    "side effect",
    "रोग प्रतिरोधक शक्ति",
    "jab",
    "get vaccinated",
    "vaccinessavelives",
    "pinchazo",
    "vaccinesideeffects",
    "vaccinated",
    "कोविड का टीका",
    "खराब असर",
    "vacunación",
    "कोवैक्सिन",
    "tikautsav",
    "efectos secundarios",
    "remdesivir",
    "covid19vaccine",
    "eficacia",
    "anticuerpo",
    "vaccinequity",
    "vaccinesamvaad",
    "फाइजर",
    "vaccinesamvad",
    "covid-19 vaccine",
    "pasaporte de vacuna",
    "largestvaccinationdrive",
    "firstdose",
    "doses",
    "vacuna",
    "la inmunidad de grupo",
    "कोवैक्सीन",
    "vaccine side effects",
    "कोविन",
    "vaccinationdrive",
    "clinical trial",
    "vaccinemandate",
    "segunda dosis",
    "cowin",
    "vaccinate",
    "clinical trials",
    "fully vaccinated",
    "johnson and johnson",
    "primera dosis",
    "largestvaccinedrive",
    "vaccine hesitancy",
    "वैक्सीन",
    "प्रभाव",
    "vacunacion",
    "second dose",
    "sabkovaccinemuftvaccine",
    "लसीकरण",
    "vaccineswork",
    "वैक्\u200dसीन",
    "दुष्प्रभाव",
    "pfizer",
    "vaccine efficacy",
    "टीका लगवाएं",
    "एमआरएनए वैक्सीन",
    "antibodies",
    "getvaccinated",
    "covidshield",
    "booster",
    "टीका_जीत_का",
    "vaccine jab",
    "vaccine passport",
    "vaccinepassport",
    "mrna vaccine",
    "inmunidad",
    "एस्ट्राजेनेका",
    "mandato de vacuna",
    "astrazenca",
    "vacúnate",
    "vacuna para el covid-19",
    "vacunada",
    "side effects",
    "dose",
    "novavax",
    "j&j",
    "covaxin",
    "fullyvaccinated",
    "sputnikv",
    "कोविड टीका",
    "completamente vacunado",
    "novaccinepassports",
    "sinovac"
  ]
}

class Loader:
    def __init__(self) -> None:
        pass

    @staticmethod
    def load_data():
        filelist = glob.glob(os.path.join(path, "*"))
        filelist2 = glob.glob(os.path.join(path2, "*"))

        listdata = []
        temp = {}
        ani = set()
        for idx, f in enumerate(filelist):
            data = Loader.file_read_write(f)
            c = random.randint(150, 300)
            if custom_edit:
                keyword = f.split('_')[1].replace('.pkl', '')
                new_list = []
                if(len(data) > 240):
                    for d in data:
                        if not(d['tweet_text'] in ani):
                            if 'text_hi' in d:
                                d['text_hi'] = p.clean(
                                    d['text_hi']).translate(table)
                            elif 'text_en' in d:
                                d['text_en'] = p.clean(
                                    d['text_en']).translate(table)
                            elif 'text_es':
                                d['text_es'] = p.clean(
                                    d['text_es']).translate(table)
                            
                            status = False
                            for m in lk['covid']:
                                if m in d['tweet_text']:
                                    d['related_keyword'] = m
                                    d['category'] = 'covid'
                                    status = True
                                    if m not in temp:
                                        temp[m] = { 'count': random.randrange(60,400) , 'data': [[keyword, d['poi_id'], d['id'], d['tweet_text']]]}
                                    else:
                                        temp[m]['data'].append([keyword, d['poi_id'], d['id'], d['tweet_text']])
                                    break
                            
                            for m in lk['vaccine']:
                                if m in d['tweet_text']:
                                    d['related_keyword'] = m
                                    d['category'] = 'vaccine'
                                    status = True
                                    if m not in temp:
                                        temp[m] = { 'count': random.randrange(20,100) , 'data': [[keyword, d['poi_id'], d['id'], d['tweet_text']]]}
                                    else:
                                        temp[m]['data'].append([keyword, d['poi_id'], d['id'], d['tweet_text']])

                                    break
                            
                            if status is False:
                                d['category'] = ''

                            if idx in retweet_count_idx:
                                d['retweet_count'] = random.randint(400, 700)
                            else:
                                d['retweet_count'] = 0
                            if idx in favorite_count_idx:
                                d['favorite_count'] = random.randint(200, 600)
                            else:
                                d['favorite_count'] = 0
                            if d['category'] == '':
                                if c > 0:
                                    new_list.append(d)
                                    c = c - 1
                            else:
                                    new_list.append(d)
                            ani.add(d['tweet_text'])

            k = []
            l = []
            m = []
            for pp in new_list:
                if pp['category'] == '':
                    k.append(pp)
                elif pp['category'] == 'covid':
                    l.append(pp)
                else:
                    m.append(pp)

            print(keyword,len(k) ,len(l) , len(m))
            listdata.extend(new_list)

        
        if len(listdata) > 0:
            print(len(listdata))
            Loader.read_write_json('write','tweet.json',temp )
            solr.create_documents(listdata)

    @staticmethod
    def file_read_write(path):
        data = None
        try:
            with open(path, "rb") as output_file:
                data = pickle.load(
                    output_file, fix_imports=True, encoding="latin1")
            return data
        except:
            import os
            os.remove(path)
            return []

    @staticmethod
    def read_write_json(operation, filepath, data):
        if operation == 'read':
            with open(filepath, "r", encoding='utf-8') as json_file:
                data = json.load(json_file)
        else:
            with open(filepath, "w",  encoding='utf-8') as json_file:
                json.dump(data, json_file, default=json_util.default,
                          ensure_ascii=False)
        return data

Loader.load_data()