export const to = promise => {
    return promise.then(data => [null, data]).catch(err => [err]);
};

export const too = promiseArr => {
    return Promise.all(promiseArr).then(sources => [null, sources]).catch(err => [err]);
};

export const mobilecheck = () => {
    let check = false;
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        check = true;
    }
    return check;
};