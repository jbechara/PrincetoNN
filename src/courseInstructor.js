//import libraries
var https = require('https');
var cheerio = require('cheerio');

//symbol table for mapping subject full name to three letter abbreviation

var subjects = {
    "african american studies":'AAS',
    "african studies":'AFS',
    "american studies":'AMS',
    "anthropology":'ANT',
    "atmospheric and oceanic sciences":'AOS',
    "applied and computational math":'APC',
    "arabic":'ARA',
    "architecture":'ARC',
    "art and archaeology":'ART',
    "astrophysical sciences":'AST',
    "atelier":'ATL',
    "bosnian croatian serbian":'BCS',
    "chemical and biological engineering":'CBE',
    "civil and environmental engineering":'CEE',
    "cognitive science":'CGS',
    "chinese":'CHI',
    "chemistry":'CHM',
    "center for human values":'CHV',
    "classics":'CLA',
    "classical greek":'CLG',
    "comparative literature":'COM',
    "computer science":'COS',
    "center for teaching and learning":'CTL',
    "creative writing":'CWR',
    "czech":'CZE',
    "dance":'DAN',
    "east asian studies":'EAS',
    "economics":'ECO',
    "european cultural studies":'ECS',
    "ecology and evolutionary biology":'EEB',
    "engineering":'EGR',
    "electrical engineering":'ELE',
    "energy studies":'ENE',
    "english":'ENG',
    "entrepreneurship":'ENT',
    "environmental studies":'ENV',
    "contemporary european politics":'EPS',
    "finance":'FIN',
    "french":'FRE',
    "freshman seminar":'FRS',
    "geosciences":'GEO',
    "german":'GER',
    "global health and health policy":'GHP',
    "global seminar":'GLS',
    "gender and sexuality studies":'GSS',
    "hebrew":'HEB',
    "hindi":'HIN',
    "history":'HIS',
    "hellenic studies":'HLS',
    "history of science":'HOS',
    "history and practice of diplomacy":'HPD',
    "humanistic studies":'HUM',
    "integrated science curriculum":'ISC',
    "italian":'ITA',
    "judaic studies":'JDS',
    "japanese":'JPN',
    "journalism":'JRN',
    "korean":'KOR',
    "latino studies":'LAO',
    "latin american studies":'LAS',
    "latin":'LAT',
    "lewis center for the arts":'LCA',
    "linguistics":'LIN',
    "mechanical and aerospace engineering":'MAE',
    "mathematics":'MAT',
    "medieval studies":'MED',
    "media and modernity":'MOD',
    "modern greek":'MOG',
    "molecular biology":'MOL',
    "materials science and engineering":'MSE',
    "music theater":'MTD',
    "music":'MUS',
    "near eastern studies":'NES',
    "neuroscience":'NEU',
    "operations research and financial engineering":'ORF',
    "ancient world":'PAW',
    "persian":'PER',
    "philosophy":'PHI',
    "physics":'PHY',
    "polish":'PLS',
    "politics":'POL',
    "population studies":'POP',
    "portuguese":'POR',
    "psychology":'PSY',
    "quantitative computational biology":'QCB',
    "religion":'REL',
    "russian east european and eurasian":'RES',
    "russian":'RUS',
    "sanskrit":'SAN',
    "south asian studies":'SAS',
    "slavic languages and literature":'SLA',
    "statistics and machine learning":'SML',
    "sociology":'SOC',
    "spanish":'SPA',
    "science and technology council":'STC',
    "swahili":'SWA',
    "theater":'THR',
    "teacher preparation":'TPP',
    "translation and intercultural communication":'TRA',
    "turkish":'TUR',
    "twi":'TWI',
    "urban studies":'URB',
    "urdu":'URD',
    "visual arts":'VIS',
    "writing seminar":'WRI',
    "woodrow wilson school":'WWS'
};

var courseInstructor = {};
//************** COURSES INTENTS START *****************************

/**
 * Method to retrieve all public events on Princeton's feed
 * URL Link: https://etcweb.princeton.edu/webfeeds/events/
 */
    courseInstructor.courseInstructor_whatCourseInstructor = (courseName, courseNum, callback) => {

        // instantiates vars for API call
        var options = {
            host: 'etcweb.princeton.edu',
            port: 443,
            path: '/webfeeds/courseofferings/?subject=' + subjects[courseName] + '&catnum=' + courseNum,
            method: 'GET'
        };

        // HTTPS request call
        var req = https.request(options, res => {
            res.setEncoding('utf8');
            var returnData = "";
            // concat the xml stream
            res.on('data', chunk => {
                returnData += chunk;
            });

            res.on('end',  () => {
                // load data into cheerio
                var result = cheerio.load(returnData);
                // get professor(s) full name(s)
                var profArray = result('instructors').children('instructor');
                var answer;

                // grammar logic
                if (profArray.length == 1) {
                    answer = 'the professor for ' + courseName + ' ' + courseNum + ' is ';
                }
                else {
                    answer = 'the professors for ' + courseName + ' ' + courseNum + ' are '
                }

                // loop thru all professors to add them to ouput
                for (i = 0; i < profArray.length; i++) {
                    if (i == profArray.length - 1) {
                        answer += 'and ';
                        answer += result(profArray[i]).children('full_name').text();
                        break;
                    }
                    answer += result(profArray[i]).children('full_name').text() + ', ';

                }

                callback(answer);
            });
        });

        req.end();
}
//************** COURSES INTENTS END ********************************
module.exports = courseInstructor;