window.onload=function(){


//this listner handles the green thumbs up for when the correct song is found
//on click, we remove all page elements and replace it with song info
document.getElementById('yes-button').addEventListener('click', function (e) {
    e.preventDefault();
    searchAlbums(lyricObj.data[songIndex].title);
}, false);
//incase where lyrics are wrong, go to next song and load that data    
document.getElementById('no-button').addEventListener('click', function (e) {
    e.preventDefault();
    wrongSong();
}, false);
    

//this listener is the initial lyric search form    
document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    searchLyrics(document.getElementById('lyrics').value);
}, false);
}
//this global var tells us which song we are on in the query results
var songIndex = 0;


//search the api for matching lyrics
var searchLyrics = function(info){
    $.ajax({
        dataType: 'jsonp',
        url: 'http://api.lyricsnmusic.com/songs',
        data: {
            api_key: 'a99690bdcc79f4a1c541e25b92efa6',
            q: info,
            callback: 'returnList'
        }
    });
};

/**
 * @author Alexander Manzyuk <admsev@gmail.com>
 * Copyright (c) 2012 Alexander Manzyuk - released under MIT License
 * https://github.com/admsev/jquery-play-sound
 * Usage: $.playSound('http://example.org/sound.mp3');
**/

(function($){

  $.extend({
    playSound: function(){
      return $("<embed src='"+arguments[0]+".mp3' hidden='true' autostart='true' loop='false' class='playSound'>" + "<audio autoplay='autoplay' style='display:none;' controls='controls'><source src='"+arguments[0]+".mp3' /><source src='"+arguments[0]+".ogg' /></audio>").appendTo('body');
    }
  });

})(jQuery);

//this function changes page elements to display lyric information
var displayLyrics = function(lyricObj){
    //console.log(lyricObj.data[songIndex]);
    var songTitle= lyricObj.data[songIndex].title;
    var lyricUrl = lyricObj.data[songIndex].url;
    context = '"';
    context += lyricObj.data[songIndex].context + '"';
    var songArtist = lyricObj.data[songIndex].artist.name;
    //console.log(songTitle);
    $('#song-title').html(songTitle);
    $('#artist').html(songArtist);
    $('#lyric-content').html(context);
};

//this function resets the page data at end of query
function refreshPage(){
  location.reload();
};

//when track is found, replace page with track info
function displayTrack(data){

    var coverUrl = data.tracks.items[0].album.images[0].url;
    //console.log(cover);
    var preview = data.tracks.items[0].preview_url;
    
    //before hide, create elements of track display
    var cover = document.createElement('img');
    cover.src = coverUrl;
    cover.id = 'coverimg';
    $('.albumPage').append(cover);
    var refreshButton = document.createElement('button');
    refreshButton.className = 'reset';
    refreshButton.innerHTML = 'Restart';
    refreshButton.id = "refreshButton";
    $('.albumPage').append(refreshButton);
    $('.albumPage').append(document.createElement('br'));
    //add artist and track info
    var songTitle= lyricObj.data[songIndex].title;
    var songArtist = lyricObj.data[songIndex].artist.name;
    $('#song-title2').html(songTitle);
    $('#artist2').html(songArtist);
    var info = document.createElement("a");
    info.href = "#";
    info.id = "creatorsButton";
    info.innerHTML = "About the Creators"
    $('.albumPage').append(info);
    var p = document.createElement('p');
    p.id = "information";
    p.style.fontSize = '13px';
    p.style.color = '#eee';
    p.style.lineHeight = '16px';
    $('.albumPage').append(p);
    hideLyrics();
    //add listener to play sample on click
    document.getElementById('coverimg').addEventListener('click', function (e) {
    e.preventDefault();
    $.playSound(preview);
}, false);
    //event listener for refresh 
    document.getElementById('refreshButton').addEventListener('click', function (e) {
    e.preventDefault();
    refreshPage();
}, false);
    
    //listener for creators json
document.getElementById('creatorsButton').addEventListener('click', function (e) {
    e.preventDefault();
    doXMLHttpRequest();
}, false);
    
    
    
};
//when switch from lyric view to track view, remove lyric elements
function hideLyrics(){
   $('.lyricPage').fadeOut(300, function(){
     $('.albumPage').fadeIn(300);
   });
    
};
//if song is wrong, move onto next song in query result and display
function wrongSong(){
  songIndex++;
  console.log(songIndex + "is index");
  displayLyrics(lyricObj);
};
//global var that hold the query result from the lyric api
var lyricObj = [];

function returnList(arg){
    songIndex = 0;
    console.log(arg);
    lyricObj = arg;
    
    displayLyrics(lyricObj);
    //padding 5% for seperator
    //title opacity 0
    //results opacity 1
    //result display : inherit
    transition();
   
};
//all animation is stored here
function transition(){
  
  $('.separator').animate({ 'padding' : '1%' });
  $('.title').animate({ 'opacity' : '0' });
  $('.results').css('display' , 'block');   
  $('.results').animate({ 'opacity' : '1' });
}
//quoted from spotify api demo's
var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'track'
        },
        success: function (response) {
            console.log(response);
            displayTrack(response);
        }
    });
};


//local server json request


//listener

//process request
function doXMLHttpRequest() {
  var xhr = new XMLHttpRequest(); 

  xhr.onreadystatechange=function()  {
   if (xhr.readyState==4) {
     if(xhr.status == 200) {
        processResponse(xhr.responseText);
    } else {
      responseArea.innerHTML="Error code " + xhr.status;
    }
   }
  }
  xhr.open("GET", "creators.json", true); 
  xhr.send(null); 
  } 

function processResponse(responseJSON) {
    var responseObject = JSON.parse(responseJSON);
    
    var info = ""
    
    info += responseObject.info.donovan.name + " is a " + responseObject.info.donovan['hair-color'] + " hair-colored male with an interest in " + responseObject.info.donovan['interested-in'] + ". His relationship status is currently " + responseObject.info.donovan['relationship-status'] + " and his favorite musical genre is " + responseObject.info.donovan['favorite-musical-subgenre'] + ". <br>";
    
info += responseObject.info.max.name + " is a " + responseObject.info.max['hair-color'] + " hair-colored male with an interest in " + responseObject.info.max['interested-in'] + ". His relationship status is currently " + responseObject.info.max['relationship-status'] + " and his favorite musical genre is " + responseObject.info.max['favorite-musical-subgenre'] + ".";
    
    console.log(info);
    $("#information").html(info);
}