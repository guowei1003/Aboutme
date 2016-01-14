/**
 * Created by wei on 2015/9/1.
 */

$(function() {
    var $radios = $('[name="options"]');
    var $uplike = $(".update_like");
    $radios.on('change',function() {
        alert('单选框当前选中的是：'+ $radios.filter(':checked').val());
    });
    $uplike.hover(function (event) {
        $(this).removeClass("am-icon-heart-o").addClass("am-icon-heart");
    },function(event){
        $(this).removeClass("am-icon-heart").addClass("am-icon-heart-o");
    });
    $uplike.click(function(event){
        var toolid = $(this);
        if (toolid.attr("name") == 0){
            return false;
        }else{
            $.post(
                '/tools/updatelikes/',
                {id:toolid.attr("name")},
                function(data){
                    if (data["data"]){
                        toolid.attr("name",'0');
                        toolid.html(" "+data["data"]);
                    }
                },
                'json'
            );
        }

    });
    //扫描ip
    $("#scan_id").dblclick(function(){
        $.get('/tools/scan_ipadd');
    });

});