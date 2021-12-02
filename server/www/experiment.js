var jsPsych = initJsPsych({
    on_finish: function(){
        jsPsych.data.displayData();
    }
});

function postData(data, uri) {

    let result = new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', uri);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                logMessage(`Error in postData (onload: ${uri}): ${xhr.statusText}`);
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            logMessage(`Error in postData (onerror: ${uri}): ${xhr.statusText}`);
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(data));
    });

    return result;
};

async function run_experiment(){
    let data = await postData({session_id: '1'}, 'fetchTrials.php');
    console.log(data);

    let pages = data.map(x => JSON.parse(x.json));

    let trial = {
        type: jsPsychSurvey,
        pages: [pages]
    };

    console.log(trial);

    let timeline = [trial];

    jsPsych.run(timeline);

}

run_experiment();
