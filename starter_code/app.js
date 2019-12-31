require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    app.get('/artists', (req, res, next) => {    
      spotifyApi.searchArtists(req.query.artist/*'HERE GOES THE QUERY ARTIST'*/)
        .then(data => {          
          //console.log(req.query.artist)
          console.log('The received data from the API: ', data.body);
          //console.log(data.body.artists.items[0].name)
         //console.log(data.body.artists.items[0].images[0].url)
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
          res.render('artists', data.body);
          //res.send(data.body);
        })
        .catch(err => {
          console.log('The error while searching artists occurred: ', err);
        });
    });
    app.get('/albums/:artistId', (req, res, next) => {
      spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {          
          console.log('The received data from the API: ', data.body);
          res.render('albums', data.body);
          //res.send(data.body);
        })
        .catch(err => {
          console.log('The error while searching albums occurred: ', err);
        });
    });
    app.get('/tracks/:trackId', (req, res, next) => {
      spotifyApi.getAlbumTracks(req.params.trackId)
        .then(data => {          
          console.log('The received data from the API: ', data.body);
          res.render('tracks', data.body);
          //res.send(data.body);
        })
        .catch(err => {
          console.log('The error while searching tracks occurred: ', err);
        });
    });
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })
  


// the routes go here:

//Render Homepage with search form
app.get('/', (req, res, next) => {
  res.render('index');
})

// app.get('/search', (req, res, next) => {
//   res.send(req.query)       
// })

// app.get('/artists', (req, res, next) => {    
//   spotifyApi.searchArtists(req.query/*'HERE GOES THE QUERY ARTIST'*/)
//   .then(data => {
//     console.log('The received data from the API: ', data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     //res.render('artists', {data});
//     res.send({data});
//   })
//   .catch(err => {
//     console.log('The error while searching artists occurred: ', err);
//   });
// });


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
