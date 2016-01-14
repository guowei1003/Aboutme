/**
 * Created by wei on 2015/9/15.
 */

function goencrypt(obj){
    var text_input = $("#"+obj+"-input").val();
    var text_output = $("#"+obj+"-output");
    if (!text_input){
        alert("请输入文本:)");
        return false;
    }
    if (obj == "md5"){
        text_output.text(CryptoJS.MD5(text_input));
    }if(obj == "sha1"){
        text_output.text(CryptoJS.SHA1(text_input));
    }if(obj == "sha224"){
        text_output.text(CryptoJS.SHA224(text_input));
    }if(obj == "sha256"){
        text_output.text(CryptoJS.SHA256(text_input));
    }if(obj == "sha384"){
        text_output.text(CryptoJS.SHA384(text_input));
    }if(obj == "sha512"){
        text_output.text(CryptoJS.SHA512(text_input));
    }if(obj == "ripemd-160"){
        text_output.text(CryptoJS.RIPEMD160(text_input));
    }if(obj == "sha3"){
        select_radio = $("#"+obj+"-input").siblings("label").children("input[type='radio']:checked").attr("name");
        text_output.text(CryptoJS.SHA3(text_input, { outputLength: select_radio }))
    }if(obj == "hmac"){
        var auth_code = $("#"+obj+"-h-input").val();
        select_radio = $("#"+obj+"-input").siblings("label").children("input[type='radio']:checked").attr("name");
        if (!auth_code){
            alert("请输入认证码:)");
            return false;
        }
        if(select_radio == "md5"){
            text_output.text(CryptoJS.HmacMD5(text_input,auth_code));
        }
        if(select_radio == "sha1"){
            text_output.text(CryptoJS.HmacSHA1(text_input,auth_code));
        }
        if(select_radio == "sha256"){
            text_output.text(CryptoJS.HmacSHA256(text_input,auth_code));
        }
        if(select_radio == "sha512"){
            text_output.text(CryptoJS.HmacSHA512(text_input,auth_code));
        }
        if(select_radio == "sha3"){
            text_output.text(CryptoJS.HmacSHA3(text_input,auth_code));
        }
        if(select_radio == "ripemd-160"){
            text_output.text(CryptoJS.HmacRIPEMD160(text_input,auth_code));
        }
    }if(obj == "pbkdf2"){
        salt = $("#pbkdf2-salt-input").val();
        iter = parseInt($("#pbkdf2-iter-input").val());
        keySize = parseInt($("#pbkdf2-size-select").val());
        if(!salt){
            alert("请输入盐:)");
            return false;
        }if(isNaN(iter)){
            alert("迭代次数写错啦，应该是个自然数:)");
            return false;
        }if(iter >= 1000){
            alert("您输入的迭代次数过大，计算时间可能会很长，这取决于您电脑性能:)")
        }
        text_output.text(CryptoJS.PBKDF2(text_input, salt, { keySize: keySize/32, iterations: iter }));
    }
}
function switch_radio(obj){
    $(obj).parent().siblings().children("input[type='radio']").uCheck('uncheck');
}
