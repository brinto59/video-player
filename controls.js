var video,btn,juice,controls,vol,currentTimeElement,durationTimeElement,muteUnmute;
var volValue;
var position=0;
var playlist;
window.onload=function(){
    playlist=["video/demovideo1.mp4","video/demovideo2.mp4"];
    video=document.getElementById("video");
    juice=document.getElementById("orange-juice");
    btn=document.getElementById("playPause");
    controls=document.getElementById("controls");
    vol=document.getElementById("volume");
    currentTimeElement=document.getElementById("current");
    durationTimeElement=document.getElementById("duration");
    muteUnmute=document.getElementById("mute");
    var progressBar=document.getElementById("orange-bar");
    var fullscreen=document.getElementById("fullscreen");
    var stepBackward=document.getElementById("step-backward");
    var stepForward=document.getElementById("step-forward");
    
    //play and pause
    btn.onclick=function(){
        togglePlayPause();
    };
    video.onplay=function(){
        btn.className="pause";//when video is played from fullscreen
    };
    video.onpause=function(){
        btn.className="play";//when video is played from fullscreen
    };
    video.addEventListener("ended",function(){
        btn.className="play";
        controls.style.transform="translateY(0)";
    })
    //prograss bar
    video.addEventListener('timeupdate',function(){
        var juicePos=video.currentTime/video.duration;
        juice.style.width=juicePos*100+"%";
        controls.style.transform="";
    })
    
    progressBar.addEventListener("click",(e)=>{
        video.currentTime=(e.offsetX/progressBar.offsetWidth) * video.duration;
    })
    
    //volume
    vol.addEventListener("mousemove",()=>{
        video.volume=vol.value/100;
        if(vol.value>0){
            muteUnmute.className="";
            video.muted=false;
        }else{
            muteUnmute.className="muted";
            video.muted=true;
            volValue=1; 
        }
    })
    
    //mute unmute
    muteUnmute.onclick=()=>{  
        video.muted=!video.muted;
        volumeUpDown();
    }
    video.onvolumechange=()=>{
        vol.value=video.volume*100;//when volume is changed from the fullscreen view the volume range is also changed.
        if(video.muted){
            vol.value=0;
            muteUnmute.className="muted";
        }else{
            volValue=vol.value;
            muteUnmute.className="";
        }
    }
    //time
    video.onloadeddata=()=>{
    var durationMin=Math.floor(video.duration/60);
    var durationSec=Math.floor(video.duration-durationMin*60);
    durationTimeElement.innerHTML=`/${durationMin}:${durationSec}`;
    vol.value=video.volume*100;//before the video start playing the volume range is set to the video's initial volume.
    }

    video.addEventListener("timeupdate",()=>{
        currentTime();
    })
    //fullscreen
    fullscreen.addEventListener("click",()=>{
        video.requestFullscreen();
    })

    //playlist
    video.addEventListener("ended",nextVideo,false);
    stepBackward.addEventListener("click",previousVideo,false);
    stepForward.addEventListener("click",nextVideo,false);
    video.src=playlist[position];
    video.load();
};

function togglePlayPause(){
    if(video.paused){
        btn.className='pause';
        video.play();
    }
    else{
        btn.className="play";
        video.pause();
    }
}
function currentTime(){
    var currentMin=Math.floor(video.currentTime/60);
    var currentSec=Math.floor(video.currentTime-currentMin*60);
    currentTimeElement.innerHTML=`${currentMin}:${currentSec<10 ? '0'+currentSec:currentSec}`;
}
function volumeUpDown(){ //when video is muted it is necessary to reduce the volume to zero.
        if(video.muted){
            volValue=vol.value;//copying volume of the range to the var volValue using it when video is unmuted  
            muteUnmute.className="muted";
            vol.value=0;
            video.volume=0;
        }
        else{
            muteUnmute.className="";
            vol.value=volValue;
            video.volume=volValue/100;
        }
}
function previousVideo(){
    position--;
    if(position<0){
        position=2;
    }
    video.src=playlist[position];
    video.load();
    video.play();
}
function nextVideo(){
    position++;
    if(position>2){
        position=0;
    }
    video.src=playlist[position];
    video.load();
    video.play();
}


