const serverUpdate = (callback, snakeTail) => {
    console.log("serverUpdate");

    const snakeDataToPost = {
        "name": "Szabi",
        "coordinates": snakeTail
    };

    fetch("http://localhost:8080/snake", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(snakeDataToPost), // body data type must match "Content-Type" header
    })
        .then((resp) => {
            return resp.text()
        })
        .then((text) => {
            const jsonData = JSON.parse(text);
            callback(jsonData);
        })
        .catch((err) => {
            console.log(err);
        });
};

