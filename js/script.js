
const wonderApp = {};

let headers = {};

let audio = $("<audio>");

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
            wonderApp.events();
        });

        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 1600) {
                $(".arrowBounce").addClass("hidden");
            }
        });
    };

    wonderApp.events = function() {
        //get users information to figure out the WonderYears date range.
        $('form').on('submit', function (e) {
            //When user clicks submit, we grab their birth year and gender
            e.preventDefault();
            $('#playlist').html('');
            // console.log('submitted')
            const birthYear = Number($('select[name=birth-year]').val());
            // console.log(birthYear);
            const gender = $('select[id=gender]').val();
            // console.log(gender);
            if (gender === "woman") {
              const startYear = birthYear + 11 + "-1-1";
              const endYear = birthYear + 14 + "-12-31";
              // console.log(startYear, endYear);
              wonderApp.getRanked(startYear, endYear);
            } else if (gender === "male") {
              const startYear = birthYear + 13 + "-1-1";
              const endYear = birthYear + 16 + "-12-31";
              // console.log(startYear, endYear);
              wonderApp.getRanked(startYear, endYear);
            } else {
                const startYear = birthYear + 11 + "-1-1";
                const endYear = birthYear + 16 + "-12-31";
                // console.log(startYear, endYear);
                wonderApp.getRanked(startYear, endYear);
            }
            $("#record").removeClass("open");
            $("#record").addClass("closed");
            $(".arrowBounce").removeClass("hidden");
        });    

    }
    
//* Get Ranked
        
    wonderApp.getRanked = function (startYear, endYear) {
        $.ajax({
            url: 'http://proxy.hackeryou.com',
            dataType: 'json',
            method: 'GET',
            data: {
                reqUrl: `http://billboard.modulo.site/rank/song/1/?from=${startYear}&to=${endYear}`,
               
            }
        }).then(function (res) {
            console.log(res);
            wonderApp.spotifyTrackID(res);
        });
    };
    
//*Track ID

    wonderApp.spotifyTrackID = function (res) {
        // we created a track id variable that we could pass in a map function that returns an array with the spotify_id values. Its important to note the 
        const unfilteredTracks = res.map(function (song) {
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
        const results = trackIDs.map(billboard => {
            return wonderApp.getTrack(billboard);
        });
        $.when(...results).then(function(...args){
            args = args.map(item =>{
                return args
            });
        });
    };

//*Get Song information from spotify using billboard id
        
    wonderApp.getTrack = function (id) {
        return $.ajax({
            url: `https://api.spotify.com/v1/tracks/${id}`,
            method: "GET",
            headers: headers,
            dataType: 'json'
        })
        
        .then(function (info){
            wonderApp.displayAlbumContent(info);
            console.log(info);
        });
    };

wonderApp.displayAlbumContent = function (info) {
    if (info.preview_url !== (null)) {
        const container =
            `<div id="conatiner">` +
            `<div id="player">` +
            `<div id="cover">` +
            `<img src="${info.album.images[1].url}" width="200" height="200" alt="" id="artwork" />` +
            `<div id="trackInfos">` +
            `<a href="#" id="${info.id}" onclick="play('audio_${info.id}')" class="play far fa-play-circle"></a>` +
            `<audio  id="audio_${info.id}" src="${info.preview_url}" type="audio/mpeg"></audio>` +
            `</div>` +
            `</div>` +
            `</div>` +
            `<div class="song-info"><p>${info.name}</p><p>${info.artists[0].name}</p></div>` +
            `</div>`;
        $('#playlist').append(container);
        console.log(container);
    }
};

//plays the song preview and toggles between the play and pause buttons
//using .bind here to get the unique id od the element that was clicked.
function play(element) {
    let audio = document.getElementById(element);
    $(".play").bind("click", function () {
        return ($(this).attr("id"));
    });
    if (audio.paused) {
        audio.play();
        $(".play")
            .removeClass("far fa-play-circle")
            .addClass("far fa-pause-circle")
        $("#player")


    } else {
        audio.pause();
        $(".play")
            .removeClass("far fa-pause-circle")
            .addClass("far fa-play-circle");

    }
};


            
//*Doc ready

        $(function () {
        wonderApp.init();
    });

