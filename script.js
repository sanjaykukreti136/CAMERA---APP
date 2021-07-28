
let videoplayer = document.querySelector("video");
console.log(videoplayer.videoHeight);
console.log(videoplayer.videoWidth);
let mediaRecorder;  //// mediaRecorder function for recroding video , uska refernece 
let chunks = [];  /// jitni bhi video record hoti hai vo kuch parts me hoti hai toh un sabko 
///// hum ek array me push karwate jayenge  
let recbtn = document.querySelector("#record");
let body = document.querySelector('body');
let isRec = false;
let capbtn = document.querySelector("#capture");
let currsrc;
let zoomin = document.querySelector("#zoomin");
let zoomout = document.querySelector("#zoomout");
let currzoomlevel = 1;
let color = "";
let allfilters = document.querySelectorAll('.filter');
let gallerybtn = document.querySelector('#gallery');

gallerybtn.addEventListener('click', function () {
    location.assign('gallery.html')
})


//// zooom in button function
zoomin.addEventListener('click', function () {
    /// increase zoom level 
    currzoomlevel = currzoomlevel + 0.1;
    if (currzoomlevel > 3) currzoomlevel = 3;
    console.log(currzoomlevel);
    /// set current zoom style to videoplayer 
    videoplayer.style.transform = `scale(${currzoomlevel})`;
})

zoomout.addEventListener('click', function () {
    currzoomlevel = currzoomlevel - 0.1;
    if (currzoomlevel < 1) currzoomlevel = 1;
    videoplayer.style.transform = `scale(${currzoomlevel})`;
})



for (let i = 0; i < allfilters.length; i++) {
    allfilters[i].addEventListener('click', function (e) {

        let previousfilter = document.querySelector('.filter-div');
        if (previousfilter) previousfilter.remove();

        let currcolor = e.currentTarget.style.backgroundColor;
        color = currcolor
        let div = document.createElement('div');
        div.classList.add('filter-div');
        div.style.backgroundColor = currcolor;

        body.append(div);
    })
}


recbtn.addEventListener("click", function () {
    let previousfilter = document.querySelector('.filter-div');
    if (previousfilter) previousfilter.remove();
    videoplayer.style.transform = `scale(${1})`;
    let span = recbtn.querySelector('span');
    if (isRec) {
        span.classList.remove('animations')
        mediaRecorder.stop();
        isRec = false;
    }
    else {
        mediaRecorder.start();
        span.classList.add('animations');
        isRec = true;
    }
})

let audiovideopromise = navigator.mediaDevices.getUserMedia({   /// BOM CODE TO GET USER PERMISSIONS
    audio: true,
    video: true
});

audiovideopromise.then(function (mediastream) {  //// ON PROMISE RESOLVE IT GIVE AN OBJECT WHICH
    videoplayer.srcObject = mediastream;    /// HAVE VIDEO AND AUDIO SRC 

    mediaRecorder = new MediaRecorder(mediastream); /// function for recording 

    mediaRecorder.addEventListener("dataavailable", function (e) { /// agar recording hui hai matlab
        // rec start hui hai toh sab parts ko array me daalte jao
        chunks.push(e.data);
        currsrc = e.data;
    })

    mediaRecorder.addEventListener("stop", function () { /// jab user stop ke bole toh phir 
        // jitni bhi videos chunks me the usko ek blob me daal de 
        let blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        addmedia(blob);

    })


}).catch(function () {

})

capbtn.addEventListener('click', function () {   //// capture button par click hua 
    let span = capbtn.querySelector('span');
    span.classList.add('animations');
    setTimeout(function () {
        span.classList.remove('animations');
    }, 1000)
    console.log("clicked");
    let can = document.createElement('canvas');
    can.width = videoplayer.videoWidth
    can.height = videoplayer.videoHeight
    let tool = can.getContext('2d');


    ////  canvass ko stretch karne ke liye center position me fixed
    tool.translate(can.width / 2, can.height / 2);
    /// canvas ko stretch
    tool.scale(currzoomlevel, currzoomlevel);
    //// canvas back to normal position 
    tool.translate(-can.width / 2, -can.height / 2);
    tool.drawImage(videoplayer, 0, 0);
    if (color != "") {
        tool.fillStyle = color;
        tool.fillRect(0, 0, can.width, can.height)
    }


    addmedia(can.toDataURL());



})




