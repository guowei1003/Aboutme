/**
 * Created by wei on 2015/9/18.
 */

function switch_radio(obj){
    $(obj).parent().siblings().children("input[type='radio']").uCheck('uncheck');
}

function encrypt_tool(){
    var en_words = $("#text-input").val();
    var de_words = $("#text-output");
    var en_mothod = $("#type-method input[type='radio']:checked").attr("name");
    var key_words = $('#key-word-input').val();
    if (!en_words){
        alert("请输入文本:)");
        return false;
    }
    if (en_mothod == "aes"){
        de_words.val(CryptoJS.AES.encrypt(en_words,key_words));
        return
    }if(en_mothod == "des"){
        de_words.val(CryptoJS.DES.encrypt(en_words,key_words));
    }if(en_mothod == "triple-des"){
        de_words.val(CryptoJS.TripleDES.encrypt(en_words,key_words));
    }if(en_mothod == "rabbit"){
        de_words.val(CryptoJS.Rabbit.encrypt(en_words,key_words));
    }if(en_mothod == "rabbitlegacy"){
        de_words.val(CryptoJS.RabbitLegacy.encrypt(en_words,key_words));
    }if(en_mothod == "rc4"){
        de_words.val(CryptoJS.RC4.encrypt(en_words,key_words));
    }if(en_mothod == "rc4drop"){
        de_words.val(CryptoJS.RC4Drop.encrypt(en_words,key_words));
    }
}

function decrypt_tool(){
    var en_words = $("#text-input");
    var de_words = $("#text-output").val();
    var en_mothod = $("#type-method input[type='radio']:checked").attr("name");
    var key_words = $('#key-word-input').val();
    if (!de_words){
        alert("请输入文本:)");
        return false;
    }
    if (en_mothod == "aes"){
        en_words.val(CryptoJS.AES.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }if(en_mothod == "des"){
        en_words.val(CryptoJS.DES.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }if(en_mothod == "triple-des"){
        en_words.val(CryptoJS.TripleDES.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }if(en_mothod == "rabbit"){
        en_words.val(CryptoJS.Rabbit.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }if(en_mothod == "rabbitlegacy"){
        en_words.val(CryptoJS.RabbitLegacy.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }if(en_mothod == "rc4"){
        en_words.val(CryptoJS.RC4.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }if(en_mothod == "rc4drop"){
        en_words.val(CryptoJS.RC4Drop.decrypt(de_words,key_words).toString(CryptoJS.enc.Utf8));
    }
}