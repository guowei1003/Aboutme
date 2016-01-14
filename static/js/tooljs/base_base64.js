/**
 * Created by wei on 2015/9/24.
 */

function encode_tool(){
    var en_words = $("#text-input").val();
    var de_words = $("#text-output");
    if (!en_words){
        alert("请输入文本:)");
        return false;
    }
    var a = new Base64();
    de_words.val(a.encode(en_words));
}
function decode_tool(){
    var de_words = $("#text-output").val();
    var en_words = $("#text-input");
    if (!de_words){
        alert("请输入加密后文本:)");
        return false;
    }
    var a = new Base64();
    en_words.val(a.decode(de_words));
}
$(function() {
    $('#image-input').on('change', function() {
        if ((!(window.File || window.FileReader || window.FileList || window.Blob)) ||(!!window.ActiveXObject || "ActiveXObject" in window)) {
            alert('您的浏览器为IE或实在太老了对HTML5兼容性差，请更新或更换最新火狐或Chrome:）');
            return false;
        }
        var img_output = $("#img-output");
        imgFile = this.files[0];
        if(!/image\/\w+/.test(imgFile.type)){
            alert("请确保文件为图像类型");
            return false;
        }
        if ( 204800 < imgFile.size && imgFile.size <= 1024000 ){
            alert("您的图片太大了，请耐心等待:)");
        }
        if ( 1024000 < imgFile.size && imgFile.size <= 2048000){
            alert("您的图片是在是太大了,可能会造成浏览器崩溃！:(");
        }
        if(imgFile.size > 2048000){
            alert("您上传的图片太大，请重新选择小一点的:)");
            return false;
        }
        var reader = new FileReader();
        var a =new Base64();
        reader.onload = function(e){
                $("#pre-img img").attr("src",this.result);
                img_output.val(this.result);
        };
        reader.readAsDataURL(imgFile);

    });
});