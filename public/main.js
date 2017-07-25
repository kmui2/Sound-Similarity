
$(document).ready(function(){
    $("form").submit(function(){
        let name = $("#firstName").val().slice();
        $("form").remove();
        $("#loading").html('Loading trials... please wait. </br> <img src="img/preloader.gif">')
        $.ajax({
            url: '/sounds',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({name: name}),
            success: function (trials) {
                
                console.log(trials);
                runExperiment(trials);
            }
        })
    });
});

//preloader