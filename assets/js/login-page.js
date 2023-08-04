$(function(){
    //hide add-habits button
    $("#change").hide();
    $("#user").hide();
    $("#change").on("click", function(){
        
        $("#main-box").fadeToggle("slow");
        $("a").fadeIn("slow");
        
    });
    $("#user").html(`<i class="fa fa-user-plus"  aria-hidden="true"></i>`);
    
    
});