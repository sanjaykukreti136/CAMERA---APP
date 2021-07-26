
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

let color = "";
let allfilters = document.querySelectorAll('.filter');
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
        let link = URL.createObjectURL(blob); /// blob ka link 
        let a = document.createElement("a"); /// video download ke liye 
        a.href = link;
        a.download = "video.mp4";
        a.click();
        a.remove();
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


    tool.drawImage(videoplayer, 0, 0);
    if (color != "") {
        tool.fillStyle = color;
        tool.fillRect(0, 0, can.width, can.height)
    }
    downloadkaro(can.toDataURL());

})

function downloadkaro(val) {
    let a = document.createElement('a');
    a.href = val;
    a.download = "img.png";
    a.click();
    a.remove();
}





