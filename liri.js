
require("dotenv").config();

var request = require("request");
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var moment = require("moment");
var chalk = require("chalk");


var command = process.argv[2];
function switchStatement() {
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
}

var input = process.argv.slice(3).join(" ");

//OMDB ====================================================

function getMovie() {

    //Grab user input
    var movie = input;


    //If user doesn't enter movie, return error
    if (!movie) {
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
            var movieData = [
                "Movie title: " + data.Title,
                "Released: " + data.Year,
                "IMDB Rating: " + data.Ratings[0].Value,
                "Rotten Tomatoes Rating: " + data.Ratings[1].Value,
                "Produced in: " + data.Country,
                "Language(s): " + data.Language,
                "Plot: " + data.Plot,
                "Actors: " + data.Actors
            ].join("\n\n");

            fs.appendFile("log.txt", movieData + "\n---------------------------\n", function (err) {
                if (err) throw err;
                console.log("---------------------------\n" +
                    movieData +
                    "\n---------------------------");
            });
        }
    })
}


//BandsInTown =============================================
// var artist;
function concertThis() {

    //Grab user input
    var artist = input;

    //If user doesn't enter artist, return error
    if (!artist) {
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
            var data = JSON.parse(body);
            var formatTime = moment(data[0].datetime.slice(0, 10), "YYYY-MM-DD").format("dddd MMMM Do, YYYY");
            var artistData = [
                "Venue Name: " + data[0].venue.name,
                "Venue Location: " + data[0].venue.city + ", " + data[0].venue.country,
                "Date: " + formatTime
            ].join("\n\n");

            fs.appendFile("log.txt", artistData + "\n---------------------------\n", function (err) {
                if (err) throw err;
                console.log(chalk.bold.blue("NEXT SHOW FOR: " + artist.toUpperCase()) +
                    "\n\n" + artistData +
                    "\n---------------------------");
            });
        }
    });
}

//Spotify This Song ========================================

// var song;
function getSong() {
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    //Grab user input
    var song = input;


    //If user doesnt enter song, return error
    if (!song) {
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
        var songData = [
            "Artist: " + artist,
            "Name: " + name,
            "Album: " + album,
            "Preview link: " + preview
        ].join("\n\n");

        fs.appendFile("log.txt", songData + "\n---------------------------\n", function (err) {
            if (err) throw err;
            console.log("---------------------------\n" +
                songData +
                "\n---------------------------");
        });
    });
}

// //Do What It Says ===========================================
function doWhatItSays() {


    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(chalk.red("ERROR: " + error));
        }
        else {
            var array = data.split(',');
            console.log(array);
            command = array[0];
            input = array[1];
            switchStatement();

        }
    });

}

switchStatement();
