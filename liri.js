//TO DO

//convert event date in getArtist
//dowhatitsays

//log.txt
//readme
//add to portfolio

require("dotenv").config();

var request = require("request");
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var moment = require("moment");
var chalk = require("chalk");

var command = process.argv[2];
switch (command) {
    case "movie-this":
        getMovie();
        break;
    case "concert-this":
        getArtist();
        break;
    case "spotify-this-song":
        getSong();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

//OMDB ====================================================

var movieTitle;
function getMovie() {
    movieTitle = process.argv[3];
    if (!movieTitle){
        console.log(chalk.red("ERROR: You did not provide a movie. How about: Mr. Nobody"));
        movieTitle = "mr+nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=" + keys.omdb;
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            console.log("------------------------------------");
            console.log(chalk.bold("Movie title: ")              + body.Title +
                        chalk.bold("\nReleased: " )              + body.Year +
                        chalk.bold("\nIMDB Rating: ")            + body.Ratings[0].Value +
                        chalk.bold("\nRotten Tomatoes Rating: ") + body.Ratings[1].Value +
                        chalk.bold("\nProduced in: ")            + body.Country +
                        chalk.bold("\nLanguage(s): ")            + body.Language +
                        chalk.bold("\nPlot: ")                   + body.Plot +
                        chalk.bold("\nActors: ")                 + body.Actors);
            console.log("------------------------------------");
        }
    })
}


//BandsInTown =============================================

var artist;
function getArtist() {
    artist = process.argv[3];
    if (!artist){
        console.log(chalk.red("ERROR: You did not provide an artist!"));
        return;
    }

    var queryUrl =
        "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown;
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            console.log("---------------------------------------" +
                        chalk.bold("\nVenue Name: ") + body[0].venue.name + 
                        chalk.bold("\nVenue Location: ") + body[0].venue.city + ", " + body[0].venue.country +
                        chalk.bold("\nDate: ") +
                        "\n---------------------------------------");

            //fix date format
            // console.log("Date: " + moment(JSON.parse(body)[0].datetime, ).format());
        }
    });
}

//Spotify This Song ========================================

var song;


function getSong() {
    var spotify = new Spotify({
        id:keys.spotify.id,
        secret:keys.spotify.secret
    });
    song = process.argv[3];
    if(!song){
        console.log(chalk.red("ERROR: You did not provide a song. How about: The Sign by Ace of Base"));
        song = "the sign ace of base"
    }
    spotify.search({ type: 'track', query: song, limit: 2 }, function (error, data) {
        if (error) {
            return console.log(chalk.red("ERROR: " + error));
        }
        var name = data.tracks.items[0].name;
        var artist = data.tracks.items[0].artists[0].name;
        var album = data.tracks.items[0].album.name;
        var preview = data.tracks.items[0].preview_url;
        console.log("--------------------------------------" +
                    chalk.bold("\nArtist: ") + artist +           
                    chalk.bold("\nName: ") + name +
                    chalk.bold("\nAlbum: ") + album +
                    chalk.bold("\nPreview link: ") + preview +
                    "\n--------------------------------------");

    });

}

//Do What It Says ===========================================
function doWhatItSays() {


    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        else {
            var array = data.split(",");
            switch(array[0]){
                case "movie-this":
                    movieTitle = array[1].trim();
                    getMovie();
                    break;
                case "concert-this":
                    artist = array[1].trim();
                    getArtist();
                    break;
                case "spotify-this-song":
                    console.log("random.txt")
                    song = array[1].trim();
                    getSong();
                    break;
                
            }
        
        }
    });

}

doWhatItSays();
