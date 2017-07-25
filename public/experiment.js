
function runExperiment(trials) {
    let timeline = [];
    let timeline2 = [];
    let audioTimeline = [];


    let condition_string = 'explicit'; //condition();
    let group = 'shuffled';
    let turkInfo = jsPsych.turk.turkInfo();
    let participantID = makeid() + 'iTi' + makeid()

    jsPsych.data.addProperties({
        subject: participantID,
        condition: condition_string,
        group: group,
        workerId: turkInfo.workerId,
        assginementId: turkInfo.assignmentId,
        hitId: turkInfo.assignmentId
    });

    let continue_space = "<div class='right small'>(press SPACE to continue, or BACKSPACE to head back)</div>";

    let welcome_block = {
        type: "text",
        cont_key: ' ',
        text: `<h1>Judge the similarity between two sounds</h1>
        <p>Welcome to the experiment. Press SPACE to begin.</p>`
    };

    let loop_node = {
        timeline: [welcome_block],
        on_trial_start: function() {
            $("#loading").remove();
        },
        loop_function: function () {
            return false;
        }
    };

    timeline.push(loop_node)



    let instructions = {
        type: "instructions",
        key_forward: ' ',
        key_backward: 8,
        pages: [
            `<p>On each trial, you will hear two sounds played in succession. To help you distinguish them, during the first
            you will see the number 1, and during the second a number 2. After hearing the second sound, you will be asked 
            to rate how similar the two sounds are on a 7-point scale.</p> ${continue_space}`,

            `<p>A 7 means the sounds are nearly identical. That is, if you were to hear these two sounds played again, you would 
            likely be unable to tell whether they were in the same or different order as the first time you heard them. A 1 
            on the scale means the sounds are entirely different and you would never confuse them. Each sound in the pair 
            will come from a different speaker, so try to ignore differences due to just people having different voices. For 
            example, a man and a woman saying the same word should get a high rating.
            </p> ${continue_space}`,

            `<p>Please try to use as much of the scale as you can while maximizing the likelihood that if you did this again, you 
            would reach the same judgments. If you need to hear the sounds again, you can press 'r' to repeat the trial. If 
            one of the sounds is a non-verbal sound (like someone tapping on the mic), or if you only hear a single sound, 
            or if you are otherwise unable to judge the similarity between the sounds, press the 'e' key to report the error. 
            Pressing 'q' will quit the experiment. Your progress will be saved and you can continue later. Press the SPACEBAR 
            to begin the experiment.
            </p> ${continue_space}`
        ]
    };

    timeline.push(instructions);

    _.forEach(trials, (trial) => {
        let nested_timeline = [];
        let response = {
            Name: 'maggie',
            Datetime: moment().format('MMMM Do YYYY, h:mm:ss a'),
            Block_ix: trial[5],
            Trial_ix: trial[0],
            Sound_x: trial[1].match(/\d+/)[0],
            Sound_y: trial[2].match(/\d+/)[0],
            Reversed: trial[3],
            Category: trial[4],
            Similarity: -1,
            Notes: 'None',
            Repeat: -1
        };
        let audio1Num = ((response.Reversed)%2)+1;
        let audio2Num = ((response.Reversed+1)%2)+1;
        console.log('Response.Reversed = '+ response.Reversed);
        console.log('First audio: ' + audio1Num);
        console.log('Seconds audio: ' + audio2Num);
        
        let audio1Trial = {
            type: 'single-audio',
            prompt: '<div class="center"><h1>'+audio1Num+'</h1><img src="img/speaker_icon.png" /></div>',
            stimulus: trial[1].slice(2),
            // stimulus: '/data/sounds/34.wav'
            on_finish: function() {
                console.log("that was audio1trial")
            }
        }

        let audio2Trial = {
            type: 'single-audio',
            prompt: '<div class="center"><h1>'+audio2Num+'</h1><img src="img/speaker_icon.png" /></div>',
            stimulus: trial[2].slice(2),
            // stimulus: '/data/sounds/35.wav'
            on_finish: function() {
                console.log("that was audio2trial")
            }
        }

        let block = {
            type: 'multi-stim-multi-response',
            stimuli: ['img/speaker_icon.png'],
            choices: [
                [49, 50, 51, 52, 53, 54, 55, 82]
            ], // Y or N , 1 - 5
            timing_stim: [-1],
            prompt: 'Rate the similarity of the two sounds on a scale of 1-7, or press "r" to repeat the trial',
            on_finish: function (data) {
                response.Repeat++;
                response.Similarity = String.fromCharCode(data.key_press.slice(1, 3));
                response.Datetime = moment().format('MMMM Do YYYY, h:mm:ss a');
                console.log(response);
            }
        }

        if (trial[3] == 1) {
            nested_timeline.push(audio2Trial);
            nested_timeline.push(audio1Trial);
        }
        else {
            nested_timeline.push(audio1Trial);
            nested_timeline.push(audio2Trial);
        }
        nested_timeline.push(block);

        var repeat_trial = {
            timeline: nested_timeline,
            loop_function: function(data){
                if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('r') == jsPsych.data.getLastTrialData().key_press.slice(1,3)){
                    console.log("repeated!");
                    return true;
                } else {
                    // TODO HTTP request here
                    $.ajax({
                        url: '/record',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(response),
                        success: function (trials) {
                            
                            console.log(trials);
                            runExperiment(trials);
                        }
                    })
                    return false;
                }
            }
        }
        timeline.push(repeat_trial);    
    })





    let endmessage = "Thank you for participating! Your completion code is " +
        participantID +
        ". Copy and paste this in MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu."

    jsPsych.init({
        default_iti: 0,
        timeline: timeline,
        on_finish: function (data) {
            jsPsych.endExperiment(endmessage);
            // saveData(participantID + ".csv", jsPsych.data.dataAsCSV())
            console.log("finished initTimeline");
            
        }
    });
}