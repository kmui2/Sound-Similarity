
$(document).ready(function(){
    $("form").submit(function(){
        // alert($("#firstName").val());
        $("form").remove();
        $("#loading").html('Loading trials... please wait. </br> <img src="img/preloader.gif">')
        $.ajax({
            url: '/sounds',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                number: 1
            }),
            success: function (trials) {
                
                console.log(trials);
                runExperiment(trials);
            }
        })
    });
});

//preloader