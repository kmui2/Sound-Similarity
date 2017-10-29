const PORT = 7073;
const FULLSCREEN = false;
$(document).ready(function(){

    // This listens to the form on-submit action
    $("form").submit(function(){    // Remove


        //////////////////////////////////////////
        // DEFINE workerId, hitId, assignmentId HERE
        //////////////////////////////////////////
        let subjCode = $("#subjCode").val().slice();
        let workerId = 'workerId';
        let assignmentId = 'assignmentId';
        let hitId = 'hitId';

        $("form").remove();
        $("#loading").html('<h2 style="text-align:center;">Loading trials... please wait.</h2> </br> <div  class="col-md-2 col-md-offset-5"><img src="img/preloader.gif"></div>')
        
        // This calls server to run python generate trials (judements.py) script
        // Then passes the generated trials to the experiment
        $.ajax({
            url: 'http://'+document.domain+':'+PORT+'/trials',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({subjCode: subjCode}),
            success: function (data) {
                console.log(data);
                let sounds = [];
                for (let trial of data.trials) {
                    sounds.push('http://'+document.domain+':'+PORT+trial[1].slice(2));
                    sounds.push('http://'+document.domain+':'+PORT+trial[2].slice(2))
                }
                jsPsych.pluginAPI.preloadImages(sounds, function(){
                    // $('#loading').remove();
                    runExperiment(data.trials, subjCode, workerId, assignmentId, hitId);

                }); 
            }
        })
    }); // Remove
    

});