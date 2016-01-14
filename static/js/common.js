/**
 * Created by wei on 2015/6/26.
 */

//<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
var duoshuoQuery = {short_name:"ilxx"};
(function() {
    var ds = document.createElement('script');
    ds.type = 'text/javascript';ds.async = true;
    ds.src = '/static/js/duoshuo_embed.js';
    ds.charset = 'UTF-8';
    (document.getElementsByTagName('head')[0]
     || document.getElementsByTagName('body')[0]).appendChild(ds);

})();
//<!-- 多说公共JS代码 end -->

$(function() {
    $(window).scroll(function(){
        var wintop = $(window).scrollTop();
        //alert(wintop);
        if (wintop != 0){
            $("header").addClass("am-sticky");
        }else{
             $("header").removeClass("am-sticky");
        }
      });
    //$(".am-nav li").click(function(){
    //    $(this).addClass("am-active").siblings().removeClass("am-active");
    //});

    $("#mail").animate({opacity:'0.3'},"slow").hover(
        function(){
            $("#mail").attr('src','/static/images/mail.png').animate({opacity:'0.8'},"slow");
        },
        function(){
            $("#mail").attr('src','/static/images/mail.png').animate({opacity:'0.3'},"slow");
        }
    );
    var errHeight = $(window).height()-$("footer").height();
    $(".sorry-error").css("height",errHeight);
    $(".go-top").hover(function(){
        $(this).animate({width:"50px",height:"50px"});
    },function(){
        $(this).animate({width:"30px",height:"30px"});
    });
});