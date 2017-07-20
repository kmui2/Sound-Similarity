
let timeline = [];
let timeline2 = [];


let condition_string = 'explicit';//condition();
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
    <p>Welcome to the experiment. Please maximize this window, then press SPACE to begin.</p>
    <p>The experiment will not procede if this window is less than 740 pixels high or if this window is less than 90% 
    your available screen height.</p>
    <p>If the experiment doesn't begin when you hit SPACE but you have maximized this window, then your screen may be 
    too small, or you may have too large a tool- or menu-bar taking up space.
    If you're having trouble at this point, please just return the HIT.</p>`
};

let loop_node = {
    timeline: [welcome_block],
    loop_function: function () {
        let wdth = document.documentElement.clientWidth;
        let hght = document.documentElement.clientHeight;
        let availWdth = window.screen.availWidth;
        let availHght = window.screen.availHeight;
        console.log("heightratio:", hght / availHght);
        if (hght / availHght > 0.9 & hght > 740) {
            return false;
        } else {
            return true;
        }
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
        to rate how similar the two sounds are on a 7-point scale.</p>`,
        
        `<p>A 7 means the sounds are nearly identical. That is, if you were to hear these two sounds played again, you would 
        likely be unable to tell whether they were in the same or different order as the first time you heard them. A 1 
        on the scale means the sounds are entirely different and you would never confuse them. Each sound in the pair 
        will come from a different speaker, so try to ignore differences due to just people having different voices. For 
        example, a man and a woman saying the same word should get a high rating.
        </p>`,

        `<p>Please try to use as much of the scale as you can while maximizing the likelihood that if you did this again, you 
        would reach the same judgments. If you need to hear the sounds again, you can press 'r' to repeat the trial. If 
        one of the sounds is a non-verbal sound (like someone tapping on the mic), or if you only hear a single sound, 
        or if you are otherwise unable to judge the similarity between the sounds, press the 'e' key to report the error. 
        Pressing 'q' will quit the experiment. Your progress will be saved and you can continue later. Press the SPACEBAR 
        to begin the experiment.
        </p>`
    ]
};

  /* define instructions block */
  var instructions_block = {
    type: "text",
    text: "<p>In this experiment, a circle will appear in the center " +
        "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
        "press the letter F on the keyboard as fast as you can.</p>" +
        "<p>If the circle is <strong>orange</strong>, do not press " +
        "any key.</p>" +
        "<div class='left center-content'><img src='img/blue.png'></img>" +
        "<p class='small'><strong>Press the F key</strong></p></div>" +
        "<div class='right center-content'><img src='img/orange.png'></img>" +
        "<p class='small'><strong>Do not press a key</strong></p></div>" +
        "<p>Press any key to begin.</p>",
    timing_post_trial: 2000
  };



/* define test block */

  let test_stimuli = [
    {
      stimulus: "img/blue.png",
      data: { response: 'go' }
    },
    {
      stimulus: "img/orange.png",
      data: { response: 'no-go' }
    }
  ];

  let all_trials = jsPsych.randomization.repeat(test_stimuli, 10);

  let post_trial_gap = function() {
    return Math.floor( Math.random() * 1500 ) + 750;
  }

  let test_block = {
    type: "single-stim",
    choices: ['F'],
    timing_response: 1500,
    timing_post_trial: post_trial_gap,
    on_finish: function(data){
      let correct = false;
      if(data.response == 'go' && data.rt > -1){
        correct = true;
      } else if(data.response == 'no-go' && data.rt == -1){
        correct = true;
      }
      jsPsych.data.addDataToLastTrial({correct: correct});
    },
    timeline: all_trials
  };

  /* define debrief block */

  function getSubjectData() {

    let trials = jsPsych.data.getTrialsOfType('single-stim');

    let sum_rt = 0;
    let correct_trial_count = 0;
    let correct_rt_count = 0;
    for (let i = 0; i < trials.length; i++) {
      if (trials[i].correct == true) {
        correct_trial_count++;
        if(trials[i].rt > -1){
          sum_rt += trials[i].rt;
          correct_rt_count++;
        }
      }
    }
    return {
      rt: Math.floor(sum_rt / correct_rt_count),
      accuracy: Math.floor(correct_trial_count / trials.length * 100)
    }
  }

  let debrief_block = {
    type: "text",
    text: function() {
      let subject_data = getSubjectData();
      return "<p>You responded correctly on "+subject_data.accuracy+"% of "+
      "the trials.</p><p>Your average response time was <strong>" +
      subject_data.rt + "ms</strong>. Press any key to complete the "+
      "experiment. Thank you!</p>";
    }
  };


// timeline.push(instructions);
timeline.push(instructions_block);
timeline.push(test_block);
timeline.push(debrief_block);

let endmessage = "Thank you for participating! Your completion code is " +
    participantID +
    ". Copy and paste this in MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu."



jsPsych.init({
    default_iti: 0,
    timeline: timeline,
    on_finish: function (data) {
        jsPsych.endExperiment(endmessage);
        saveData(participantID + ".csv", jsPsych.data.dataAsCSV())
    }
});