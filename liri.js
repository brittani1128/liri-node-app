//TO DO

//convert event date in getArtist
//dowhatitsays -- fix bug

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
        concertThis();
        break;
    case "spotify-this-song":
        getSong();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}


//OMDB ====================================================

var movie;
function getMovie() {

    //Grab user input
    movie = process.argv[3];
    for (var i = 4; i < process.argv.length; i++) {
        movie += (" " + process.argv[i]);
    }
    
    //If user doesn't enter movie, return error
    if (!movie){
        console.log(chalk.red("ERROR: You did not provide a movie. How about: Mr. Nobody"));
        movie = "mr+nobody"
    } else {
        movie = movie.trim().replace(" ", "+");
    }

    //Search OMDB for movie
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            console.log("------------------------------------");
            console.log(chalk.bold("Movie title: ")              + data.Title +
                        chalk.bold("\nReleased: " )              + data.Year +
                        chalk.bold("\nIMDB Rating: ")            + data.Ratings[0].Value +
                        chalk.bold("\nRotten Tomatoes Rating: ") + data.Ratings[1].Value +
                        chalk.bold("\nProduced in: ")            + data.Country +
                        chalk.bold("\nLanguage(s): ")            + data.Language +
                        chalk.bold("\nPlot: ")                   + data.Plot +
                        chalk.bold("\nActors: ")                 + data.Actors);
            console.log("------------------------------------");
        }
    })
}


//BandsInTown =============================================
var artist;
function concertThis() {

    //Grab user input
    artist = process.argv[3];
    for (var i = 4; i < process.argv.length; i++) {
        artist += (" " + process.argv[i]);
    }

    //If user doesn't enter artist, return error
    if (!artist){
        console.log(chalk.red("ERROR: You did not provide an artist!"));
        return;
    } else {
        artist = artist.trim();
    }

    //Search bandsintown for artist
    var queryUrl =
        "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown;
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            
            console.log("---------------------------------------" +
                        chalk.bold.blue("\nNEXT SHOW FOR " + artist.toUpperCase()) +
                        chalk.bold("\n\nVenue Name: ") + body[0].venue.name + 
                        chalk.bold("\nVenue Location: ") + body[0].venue.city + ", " + body[0].venue.country +
                        chalk.bold("\nDate: ") +
                        "\n---------------------------------------");

            //fix date format
            // console.log("Date: " + moment(JSON.parse(body)[0].datetime, ).format());
        }
    });
}

// //Spotify This Song ========================================

var song;
function getSong() {
    var spotify = new Spotify({
        id:keys.spotify.id,
        secret:keys.spotify.secret
    });

    //Grab user input
    song = process.argv[3];
    for (var i = 4; i < process.argv.length; i++) {
        song += (" " + process.argv[i]);
    }
    
    //If user doesnt enter song, return error
    if(!song){
        console.log(chalk.red("ERROR: You did not provide a song. How about: The Sign by Ace of Base"));
        song = "the sign ace of base"
    } else {
        song = song.trim();
    }

    //Search spotify for song
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

// //Do What It Says ===========================================
function doWhatItSays() {


    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        else {
            var array = data.split(',');
            console.log(array);
            console.log(array[1]);
            switch(array[0]){
                case "movie-this":
                    movie = array[1].trim();
                    getMovie();
                    break;
                case "concert-this":
                    artist = array[1].trim();
                    concertThis();
                    break;
                case "spotify-this-song":
                    song = array[1].trim();     //not actually entering something in argv[3] so just returning error?
                    console.log(song);
                    getSong();
                    break;
                
            }
        
        }
    });

}

doWhatItSays();
