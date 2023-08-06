

$(function () {
    $("#change").on("click", function(){
        $("#main-box").fadeToggle("slow");
        $("a").fadeIn("slow");
        $("#change").attr("href", "/login");

        
    });
    // to add profile icon
    $("#user").html(`<i class="fa fa-user"  aria-hidden="true"></i>`);
    

    
    
    
    
});