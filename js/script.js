
const wonderApp = {};

let headers = {};

//*init
    wonderApp.init = function () {
        $.ajax({
            url: "http://proxy.hackeryou.com",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: JSON.stringify({
                reqUrl: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'client_credentials'
                },
                proxyHeaders: {
                    "Authorization": "Basic Njk5ZDkyYjdiY2VmNDljMDkxNGM0ODc0NDEzZWIwOTg6OTExOTU1N2RkOTcxNGFjYWFkNWE2M2NiZTJiMTU5MTk="
                }
            })
        }).then(function (res) {
            headers = {
                "Authorization": res.token_type + " " + res.access_token
            };
            // console.log(res);
            // wonderApp.getRanked();
            // wonderApp.getTrack();
            wonderApp.events();
        });
    };

    wonderApp.events = function() {
        //get users information to figure out the WonderYears date range.
        $('form').on('submit', function (e) {
            //When user clicks submit, we grab their birth year and gender
            e.preventDefault();
        
            // console.log('submitted')
            const birthYear = Number($('select[name=birth-year]').val());
            // console.log(birthYear);
            const gender = $('input[name=gender]:checked').val();
            // console.log(gender);
            if (gender === "female") {
                const startYear = (birthYear + 11) + "-1-1";
                const endYear = (birthYear + 14) + "-12-31";
                // console.log(startYear, endYear);
                wonderApp.getRanked(startYear, endYear);
            } else {
                const startYear = (birthYear + 13) + "-1-1";
                const endYear = (birthYear + 16) + "-12-31";
                // console.log(startYear, endYear);
                wonderApp.getRanked(startYear, endYear);
            } 
        });    

    }

    
//* Get Ranked
        
    wonderApp.getRanked = function (startYear, endYear) {
        $.ajax({
            url: 'http://proxy.hackeryou.com',
            dataType: 'json',
            method: 'GET',
            data: {
                reqUrl: `http://billboard.modulo.site/rank/song/1/?from=${startYear}&to=${endYear}`
            }
        }).then(function (res) {
            console.log(res);
            wonderApp.spotifyTrackID(res);
        });
    };
    
//*Track ID

    wonderApp.spotifyTrackID = function (billboardList) {
        // we created a track id variable that we could pass in a map function that returns an array with the spotify_id values. Its important to note the 
        const unfilteredTracks = billboardList.map(function (song) {
            return song.spotify_id;
        });
        
        // this is filtering out the duplicates
        const uniqueTracks = unfilteredTracks.filter(function (elem, pos) {
            return unfilteredTracks.indexOf(elem) == pos;
        });
        
        // this is the tracks without any nulls
        const trackIDs = uniqueTracks.filter(function (item) {
            return (item !== (null));
        });
        
        // for (let i = 0; i < billboardList.length; i = i + 1) {
        // }
        // console.log(unfilteredTracks);
        // console.log(uniqueTracks);
        console.log(trackIDs);
    };

//*Get Song information from spotify using billboard id
        
    wonderApp.getTrack = function () {
        $.ajax({
            url: "https://api.spotify.com/v1/tracks/4kflIGfjdZJW4ot2ioixTB",
            method: "GET",
            headers: headers,
            dataType: 'json'
        }).then(function (res) {
            // console.log(res);
            wonderApp.displayAlbumContent(res);
        });
    };

    wonderApp.displayAlbumContent = function (trackInfo) {
        // this is grabbing the art
        const displayArt = trackInfo.album.images[1].url;
        // console.log(displayArt);
        // this is the album title
        const albumTitle = trackInfo.album.name;
        // console.log(albumTitle);
        // this is the song title
        const songTitle = trackInfo.name;
        // console.log(songTitle);
        // this is the artist
        const songArtist = trackInfo.artists[0].name;
        // console.log(songArtist);
        //This is the 30sec song preview URL
        const songPreview = trackInfo.preview_url;
        // console.log(songPreview);
    };

//*Doc ready
        $(function () {
        wonderApp.init();
    });
