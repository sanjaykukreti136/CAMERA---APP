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