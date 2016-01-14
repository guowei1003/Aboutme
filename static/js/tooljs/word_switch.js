/**
 * Created by wei on 2015/9/10.
 */
function trans(zhdata) {
    var cc = zhdata;
    var str = '', str2;
    var s;
    for (var i = 0; i < cc.length; i++) {
        //alert(cc.charAt(i)+" = "+cc.charCodeAt(i));
        if (pydic.indexOf(cc.charAt(i)) != -1 && cc.charCodeAt(i) > 200) {
            s = 1;
            while (pydic.charAt(pydic.indexOf(cc.charAt(i)) + s) != ",") {
                str += pydic.charAt(pydic.indexOf(cc.charAt(i)) + s);
                s++;
            }
            str += " ";
        }
        else {
            str += cc.charAt(i);
        }
    }
    return str;
}
$(function(){
     $("#text-output").empty();
    $("button[name='text-reset']").click(function(){
        $("#text-input").val("");
    });
    $("button[name='zh-unicode']").click(function(){
        $("#text-output").html(escape($("#text-input").val()).toLocaleLowerCase().replace(/%u/gi, '\\u'));
    });
    $("button[name='unicode-zh']").click(function(){
        input_text = $("#text-input").val();
        $("#text-output").html(eval("'" + input_text.toLocaleLowerCase() + "'"));
    });
    $("button[name='zh-pinyin']").click(function(){
        $("#text-output").html($("#text-input").toPinyin());
    });

    $("button[name='zh-pinyin-beta']").click(function(){
        $("#text-output").html(trans($("#text-input").val()));
    });

});

