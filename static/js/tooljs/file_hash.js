/**
 * Created by wei on 2015/9/5.
 */

function file_size($bytesize){
    var $i=0;
    //当$bytesize 大于是1024字节时，开始循环，当循环到第4次时跳出；
    while(Math.abs($bytesize)>=1024){
        $bytesize=$bytesize/1024;
        $i++;
        if($i==4)break;
    }
    //将Bytes,KB,MB,GB,TB定义成一维数组；
    $units=new Array("Bytes","KB","MB","GB","TB");
    $newsize=$bytesize.toFixed(4);
    //$newsize=Math.round($bytesize,2);
    return($newsize+$units[$i])
}

handlefile = function(handle_param){
    blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;

    handle_param.base_progress.addClass(" am-active").fadeIn("slow");
    handle_param.filereader.onloadstart = function(){};
    handle_param.filereader.onprogress = function(e){
        handle_param.loaded+=e.loaded;
        handle_param.loaded_local.text(file_size(handle_param.loaded));
        handle_param.load_progress.css("width",(handle_param.loaded / handle_param.file.size)*100+"%");
    };
    handle_param.filereader.onloadend = function(e) {};
    handle_param.filereader.onabort = function(e){
        alert("上传异常中断！有问题请加QQ群;288171956");
    };
    handle_param.filereader.onerror = function(e){
        alert("error：上传失败:(有问题可以加QQ群:288171956");
    };
    handle_param.filereader.onload = function(e){
        $.each(handle_param.crypto_list,function(n,crypto_ob){
            crypto_ob.crypto_value.update(handle_param.crypto.enc.Latin1.parse(e.target.result));
        });
        handle_param.currentChunk++;
        if (handle_param.currentChunk < handle_param.chunks){
            loadNext();
        }else{
            $.each(handle_param.crypto_list,function(n,crypto_ob){
                handle_param.handle_table_tr+='<tr><td width="25%" style="color:#F27B1D"><strong>'+crypto_ob.crypto_name+'</strong></td>' +
                '<td width="70%" style="word-break:break-all; word-wrap:break-all;">' + crypto_ob.crypto_value.finalize() + '</td></tr>';
            });
            handle_param.base_progress.removeClass("am-active").fadeOut("show");
            handle_param.handle_table.append(handle_param.handle_table_tr);
        }
    };

    function loadNext(){
        var start = handle_param.currentChunk * handle_param.chunkSize, end = start + handle_param.chunkSize >= handle_param.file_size ? handle_param.file_size : start + handle_param.chunkSize;
        handle_param.filereader.readAsBinaryString(blobSlice.call(handle_param.file, start, end));
    }
    loadNext();
};

$(function() {

    $('#upload-files').on('change', function() {
        if ((!(window.File || window.FileReader || window.FileList || window.Blob)) ||(!!window.ActiveXObject || "ActiveXObject" in window)) {
            alert('您的浏览器为IE或实在太老了对HTML5兼容性差，请更新或更换最新火狐或Chrome:）');
        }else{
            var input_md5 = $("#hash_md5").get(0).checked;
            var input_sha1 = $("#hash_sha1").get(0).checked;
            var input_sha224 = $("#hash_sha224").get(0).checked;
            var input_sha256 = $("#hash_sha256").get(0).checked;
            var input_sha384 = $("#hash_sha384").get(0).checked;
            var input_sha512 = $("#hash_sha512").get(0).checked;
            var input_ripemd_160 = $("#hash_ripemd-160").get(0).checked;

            var table_result = $("#table_result");
            table_result.empty();
            for(var i = 0, f; f = this.files[i]; i++){
                crypto_list =[];
                if(input_md5){
                    var crypto_md5 = CryptoJS.algo.MD5.create();
                    crypto_list.push({"crypto_name":"HASH MD5","crypto_value":crypto_md5})
                }
                if(input_sha1){
                    var crypto_sha1 = CryptoJS.algo.SHA1.create();
                    crypto_list.push({"crypto_name":"HASH SHA1","crypto_value":crypto_sha1})
                }
                if(input_sha224){
                    var crypto_sha224 = CryptoJS.algo.SHA224.create();
                    crypto_list.push({"crypto_name":"HASH SHA224","crypto_value":crypto_sha224})
                }
                if(input_sha256){
                    var crypto_sha256 = CryptoJS.algo.SHA256.create();
                    crypto_list.push({"crypto_name":"HASH SHA256","crypto_value":crypto_sha256})
                }
                if(input_sha384){
                    var crypto_sha384 = CryptoJS.algo.SHA384.create();
                    crypto_list.push({"crypto_name":"HASH SHA384","crypto_value":crypto_sha384})
                }
                if(input_sha512){
                    var crypto_sha512 = CryptoJS.algo.SHA512.create();
                    crypto_list.push({"crypto_name":"HASH SHA512","crypto_value":crypto_sha512})
                }
                if(input_ripemd_160){
                    var crypto_ripemd_160 = CryptoJS.algo.RIPEMD160.create();
                    crypto_list.push({"crypto_name":"HASH RIPEMD-160","crypto_value":crypto_ripemd_160})
                }
                filereader = new FileReader();
                var handle_param={
                    "file":"",
                    "file_size":f.size,
                    "crypto":CryptoJS,
                    "base_progress":"",
                    "load_progress":"",
                    "handle_table":"",
                    "handle_table_tr":"",
                    "file_sign":"",
                    "currentChunk":0,
                    "chunkSize": 4096,
                    //"chunkSize": 1048576,
                    "chunks":Math.ceil(f.size / 4096),
                    "loaded_str":"",
                    "loaded":0,
                    "loaded_local":"",
                    "crypto_list":crypto_list,
                    "filereader":filereader
                };
                filetablist = "";
                $('#file-list').append('<span class="am-badge">' + f.name + '</span> ');
                filetablist +='<div id="base-progress-'+i+'" class="am-progress am-progress-striped" style="display: none;"><div id="up-progress-'+i+'" ' +
                'class="am-progress-bar am-progress-bar-warning" style="width: 0%"></div></div><table id="show_result_'+i+'" class="am-table am-table-striped am-table-hover am-monospace">' +
                '<tr><th width="25%">KEY</th><th width="70%">VALUE</th> </tr><tr> <td style="color: green;word-break:break-all" >'
                + f.name+'</td> <td style="color: green;" title="分片读取，大小会有细微误差，不会影响结果">大小:<span id="loaded_'+i+'">0</span>/'+ file_size(f.size)+'</td></tr></table>';
                table_result.append(filetablist);

                handle_param.file=f;
                handle_param.crypto=CryptoJS;
                handle_param.base_progress=$("#base-progress-"+i);
                handle_param.load_progress=$("#up-progress-"+i);
                handle_param.handle_table=$("#show_result_"+i);
                handle_param.loaded_local=$("#loaded_"+i);
                handle_param.handle_table_tr="";
                handle_param.file_sign=i;

                handlefile(handle_param);
            }

        }
    });
});