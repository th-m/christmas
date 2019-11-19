import { db } from ".";

export const listenToJournal = cb => {
    let data: Object[] = [];

    return db.collection('user').orderBy("datetime", "desc").onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
        data = [];
        querySnapshot.forEach(doc => {
            var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
            data.push({ ...doc.data(), datetime: doc.data().datetime.toDate(), id: doc.id });
        });
        cb(data);
    });
};

export interface Event {
    type: string;
    note: string;
    datetime: Date;
    id?: string;
}

export const upsertWishlistItem = (data: Event, cb) => {
    const ref = db.collection('user');
    if (data.id) {
        ref.doc(data.id).update({ ...data })
            .then(() => {
                cb(data.id);
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            });;
    } else {
        ref.add(data)
            .then(docRef => {
                cb(docRef.id);
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            });
    }
}
