const dotenv = require('dotenv');
const express = require('express');
const app = new express();
dotenv.config();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());


function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    if (req.query.url != "") {
        const analyzeParams = {
            'url': req.query.url,
            'features': {
                'entities': {
                    'emotion': true,
                    'limit': 1
                }
            }
        }

        getNLUInstance().analyze(analyzeParams)
            .then(analysisResults => {

                //console.log(JSON.stringify(analysisResults.result.entities[0].emotion, null, 2));
                return res.send(analysisResults.result.entities[0].emotion, null, 2);
            }).catch(err => {
                console.log('error', err);
                return res.send("Error occured");
            });
    } else {
        return res.send("Can't Analyze An Empty URL");
    }
});


app.get("/url/sentiment", (req, res) => {
    if (req.query.url != "") {
        const analyzeParams = {
            'url': req.query.url,
            'features': {
                'entities': {
                    'sentiment': true,
                    'limit': 1
                }
            }
        }

        getNLUInstance().analyze(analyzeParams)
            .then(analysisResults => {
                // console.log(JSON.stringify(analysisResults.result.entities[0].sentiment.label));
                return res.send(analysisResults.result.entities[0].sentiment.label, null, 2);
            }).catch(err => {
                console.log('error:', err);
                return res.send("Error occured");
            })
    } else {
        return res.send("Can't Analyze An Empty URL");
    }

});

app.get("/text/emotion", (req, res) => {
    if (req.query.text != "") {

        const analyzeParams = {
            'text': req.query.text,
            'features': {
                'emotion': {}
            }
        }
        getNLUInstance().analyze(analyzeParams)
            .then(analysisResults => {
                // console.log(analysisResults)
                // e = analysisResults.result.emotion.document.emotion;
                // return res.send(e);
                //console.log(JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2));
                return res.send(analysisResults.result.emotion.document.emotion);
            }).catch(err => {
                console.log('error', err);
                return res.send("Error occured");
            });
    } else {
        return res.send("Can't Analyze Empty Input");
    }
});

app.get("/text/sentiment", (req, res) => {

    if (req.query.text != "") {

        const analyzeParams = {
            'text': req.query.text,
            'features': {
                'sentiment': {}
            }
        };

        getNLUInstance().analyze(analyzeParams)
            .then(analysisResults => {
                s = analysisResults.result.sentiment.document.label;
                //console.log(s);
                return res.send(s);
            }).catch(err => {
                console.log('error', err);
                return res.send("Error occured");
            });
    } else {
        return res.send("Can't Analyze Empty Input");
    }
});

app.get("/", (req, res) => {
    res.render('index.html');
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

