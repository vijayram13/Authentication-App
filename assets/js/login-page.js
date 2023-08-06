$(function(){
    //hide add-habits button
    $("#change").hide();
    // $("#user").hide();
    $("#change").on("click", function(){
        
        $("#main-box").fadeToggle("slow");
        $("a").fadeIn("slow");
        
    });
    // set icon
    $("#user").html(`<i class="fa fa-user-plus"  aria-hidden="true"></i>`);

    // to show or hide password
    $("#showPassword").click(function() {
        const passwordInput = $("#user_password");
  
        if ($(this).is(":checked")) {
          passwordInput.attr("type", "text");
        } else {
          passwordInput.attr("type", "password");
        }
      });
    
});