let rq = indexedDB.open('gallery', 1);


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
          <button mid-value=${cursor.value.mId} class="media-delete">Delete</button>
      </div>`;

            let download = mediaCard.querySelector('.media-download');
            let delbtn = mediaCard.querySelector('.media-delete');
            delbtn.addEventListener('click', function (e) {

                let mid = Number(e.currentTarget.getAttribute('mid-value'));
                deletekaro(mid);
                e.currentTarget.parentElement.parentElement.remove();

            })

            let data = cursor.value.mediadata;

            let type = typeof data;
            if (type == "string") {
                let img = document.createElement('img');
                img.src = data;
                let actual = mediaCard.querySelector('.actual-media');
                actual.append(img);

                download.addEventListener('click', function () {
                    downloadkaro(data, "image");
                })
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

                download.addEventListener('click', function () {
                    downloadkaro(url, "object");
                })
            }

            gallerycontainer.append(mediaCard);
            cursor.continue();
        }

    })

}

function downloadkaro(url, type) {

    if (type == 'image') {

        let a = document.createElement('a');
        a.href = url;
        a.download = "img.png";
        a.click();

    }
    else {

        let a = document.createElement('a');
        a.href = url;
        a.download = "video.mp4";
        a.click();
    }
}

function deletekaro(mid) {

    if (!database) return;

    let tx = database.transaction('media', 'readwrite');
    let mediaObject = tx.objectStore('media');
    mediaObject.delete(mid);

}
