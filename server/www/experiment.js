const postData = async(data, uri) => {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try{
        const fetchResponse = await fetch(uri, settings);
        const data = await fetchResponse.json();
        console.log(data);
        return data;
    } catch(e){
        console.log(e);
        return false;
    }
};

var jsPsych = initJsPsych({
    on_finish: function(){
        let responses = jsPsych.data.get().trials[0].response;
        let questions = Object.keys(responses);
        questions.map(x => responses[x] = JSON.stringify(responses[x]))

        postData(responses, 'saveResponses.php')
    }
});

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
