

$(function () {
    $("#change").on("click", function(){
        $("#main-box").fadeToggle("slow");
        $("a").fadeIn("slow");
        $("#change").attr("href", "/login");
        
        
    });
    $("#user").html(`<i class="fa fa-user"  aria-hidden="true"></i>`);
    

    
    
    
    
});