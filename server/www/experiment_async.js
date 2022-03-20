// jsPsych demo using trials to load and save data asynchronously

// Functions //

// General purpose function for posting data
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
        // console.log(data);
        return data;
    } catch(e){
        console.log(e);
        return false;
    }
};

// function to simulate an asynchronous delay for testing
const simulateDelay = () => {
    let test = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('message');
        }, 5000);
    });

    return test;
};

// This is a placeholder that would be called when the experiment is closed unexpectedly
// Ethical implications of this should be considered. Is closing the window withdrawing from the experiment?
const dataDump = async() => {
    return true;
};

// function to prepare data for jsPsychSurvey trial
const getPages = () => {
    let data = jsPsych.data.getLastTrialData().trials[0].value;
    let pages = data.map(x => JSON.parse(x.json));
    return [pages];
};

// function to save data
const saveResponses = () => {
    let responses = jsPsych.data.getLastTrialData().trials[0].response;
    let questions = Object.keys(responses);
    questions.map(x => responses[x] = JSON.stringify(responses[x]));

    let save_resp = postData(responses, 'saveResponses.php');
    return save_resp;
};

// jsPsych setup //

var jsPsych = initJsPsych({
    on_finish: () => console.log('finished'),
    on_close: dataDump
});

// Trials //

// Preloading trials

let hello = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Welcome to the experiment<br>You might not notice but I\'m fetching the trials now.<br>Press any key to continue',
    data: {
        trialData: () => postData({session_id: '1'}, 'fetchTrials.php'), // get the data as a promise
        test: simulateDelay
    }
};

let loading = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Still loading...<br>(not really, just waiting on a timer)',
    on_load: async () => {
        await jsPsych.data.get().trials[0].test;
        await jsPsych.data.get().trials[0].trialData; // display trial until promise is fulfilled
        jsPsych.finishTrial();
    },
    choices: 'NO_KEYS'
};

let awaitData = {
    type: jsPsychCallFunction,
    async: true,
    func: async (done) => {
        let data = await jsPsych.data.get().trials[0].trialData; // resolve promise
        done(data);
    }
};

// Experiment trials

let trial = {
    type: jsPsychSurvey,
    pages: getPages
};

// Data saving trials

let bye = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Thank you for taking part...',
    data: {
        saved: saveResponses, // post responses and get response as promise
        test: simulateDelay
    },
    trial_duration: 1000
};     

let saving = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Please don\'t close the window...<br>we\'re still saving your data.',
    on_load: async () => {
        await jsPsych.data.getLastTrialData().trials[0].test;
        let save_status = await jsPsych.data.getLastTrialData().trials[0].saved; // display trial unil promise is fulfilled
        console.log(save_status); // you might want to check this and display an error trial if necessary
        jsPsych.finishTrial();
    },
    choices: 'NO_KEYS'
};

let saved = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 'Data saved', // no need to resolve promise 
    trial_duration: 5000
};

// Run experiment //

let timeline = [hello, loading, awaitData, trial, bye, saving, saved];

jsPsych.run(timeline);
