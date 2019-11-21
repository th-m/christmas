export const to = promise => {
    return promise.then(data => [null, data]).catch(err => [err]);
};

export const too = promiseArr => {
    return Promise.all(promiseArr).then(sources => [null, sources]).catch(err => [err]);
};

export const makeid = (length = 4) => {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const mobilecheck = () => {
    let check = false;
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        check = true;
    }
    return check;
};