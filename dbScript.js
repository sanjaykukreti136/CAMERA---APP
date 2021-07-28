let rq = indexedDB.open('gallery', 1);

let download = document.querySelector('.media-download');
let deletebtn = document.querySelector('.media-delete');

let database;

rq.addEventListener('success', function () {
    database = rq.result;
})

rq.addEventListener('upgradeneeded', function () {

    let db = rq.result;
    db.createObjectStore('media', { keyPath: "mId" });

})

rq.addEventListener('error', function () {

})

function addmedia(media) {
    if (!database) return;

    let tx = database.transaction('media', 'readwrite');
    let mediaobject = tx.objectStore('media');

    let data = {
        mId: Date.now(),
        mediadata: media
    }

    mediaobject.add(data);

}

function viewMedia() {

    if (!database) return;

    let tx = database.transaction('media', 'readonly');
    let mediaobject = tx.objectStore('media');

    let req = mediaobject.openCursor();

    let gallerycontainer = document.querySelector('.gallery-container')

    req.addEventListener('success', function () {

        cursor = req.result;
        if (cursor) {

            let mediaCard = document.createElement("div");

            mediaCard.classList.add("media-card");

            mediaCard.innerHTML = `<div class="actual-media"></div>
      <div class="media-buttons">
          <button class="media-download">Download</button>
          <button class="media-delete">Delete</button>
      </div>`;

            let data = cursor.value.mediadata;

            let type = typeof data;
            if (type == "string") {
                let img = document.createElement('img');
                img.src = data;
                let actual = mediaCard.querySelector('.actual-media');
                actual.append(img);
            }
            else if (type == "object") {
                console.log(1);
                let video = document.createElement('video');
                let url = URL.createObjectURL(data);
                video.src = url;

                video.autoplay = false
                video.loop = true
                video.controls = true
                video.muted = true
                let actual = mediaCard.querySelector('.actual-media');
                actual.append(video);
            }

            gallerycontainer.append(mediaCard);
            cursor.continue();
        }

    })

}

download.addEventListener('click', function (e) {
    
    

})

deletebtn.addEventListener('click', function () {
    
})