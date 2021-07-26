
let videoplayer = document.querySelector("video");
let mediaRecorder;  //// mediaRecorder function for recroding video , uska refernece 
let chunks = [];  /// jitni bhi video record hoti hai vo kuch parts me hoti hai toh un sabko 
///// hum ek array me push karwate jayenge  
let recbtn = document.querySelector("#record");
let body = document.querySelector('body');
let isRec = false;
let capbtn = document.querySelector("#capture");
let currsrc;
recbtn.addEventListener("click", function () {
    if (isRec) {
        recbtn.innerText = "RECORD"
        mediaRecorder.stop();
        isRec = false;
    }
    else {
        mediaRecorder.start();
        recbtn.innerText = "STOP"
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
    console.log("clicked");
    let can = document.createElement('canvas');
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    let tool = can.getContext('2d');

    tool.drawImage(videoplayer, 0, 0);
    downloadkaro(can.toDataURL());

})

function downloadkaro(val) {
    let a = document.createElement('a');
    a.href = val;
    a.download = "img.png";
    a.click();
    a.remove();
}





