/**
 * Created by wei on 2015/7/3.
 */
//博客的JS文件
//{#        文章截断#}
$.fn.limit=function(){
    //这里的div去掉的话，就可以运用li和其他元素上了，否则就只能div使用。
    var self = $("[limit]");
        self.each(function(){
            var objString = $(this).text();
            var objLength = $(this).text().length;
            var num = $(this).attr("limit");
            if(objLength > num){
            //这里可以设置鼠标移动上去后显示标题全文的title属性，可去掉。
            $(this).attr("title",objString);
            $(this).text(objString.substring(0,num) + "...");
            }
        })
};

function setQouteStatus(select) {
    if ($(select).val() == "C"){
        $("#span_quote").html("");
    }else{
        $("#span_quote").html('<input class="am-field am-radius" id="quote_url" type="text" placeholder="请输入引用地址"/>');
    }
}

function setClassStatus(select) {
    if ($(select).val() == "0"){
        $("#span_class").html("<input class='am-field' id='new_class' type='text' placeholder='请输入分类名称^_^' />");
    }else{
        $("#span_class").html("");
    }
}
//定义提交
function blog_submit(){
    //获取
    //标题：blog_title
    //引用：blog_quote
    //分类：blog_class
    //标签：blog_tags
    //文章内容：blog_content
    var blog_title = $.trim($("#blog_title").val());
    var blog_quote = $("#blog_quote").val();
    var blog_class = $("#blog_class").val();
    var quote_url = $("#quote_url").val();
    var new_class = $.trim($("#new_class").val());
    var blog_tags = eval(JSON.stringify($("#blog_tags").val()));
    var new_tags = $.trim($("#new_tags").val());

    var RegUrl = new RegExp();
    RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
    UrlRight = RegUrl.test(quote_url);

    //判断
    if (blog_title == ""){
        $("#blog_submit").html("出差错啦![标题没填哇T_T],填完在点我(～ o ～)~zZ");
    }else if(!ue.hasContents()){
        $("#blog_submit").html("出差错啦![没填内容哇( ⊙o⊙ )],填完在点我╮(╯_╰)╭");
    }else if(blog_quote == "Y" && !UrlRight) {
        $("#blog_submit").html("出差错啦![引用地址格式不对哦(╯﹏╰)b],填完在点我╭(╯3╰)╮")
    }else if(blog_class == "0" && new_class == "") {
        $("#blog_submit").html("出差错啦![新建分类名称错啦o(>﹏<)o],填完在点我X﹏X")
    }else if(blog_tags == null && new_tags == ""){
        $("#blog_submit").html("出差错啦![至少要有个标签吧-_-#],填完在点我( ˇˍˇ )")
    }else{
        if (blog_quote == "Y"){
            blog_quote = '{"sign":"'+blog_quote+'","quote_url":"'+quote_url+'"}'
        }else{
            blog_quote = '{"sign":"'+blog_quote+'","quote_url":"原创"}'
        }
        if(blog_class == "0"){
            blog_class = new_class;
        }
        if (blog_tags == null){
            blog_tags = new_tags.split(" ");
        }else if (blog_tags != null && new_tags == "") {

        }else{
            blog_tags = $.unique($.merge(blog_tags,new_tags.split(" ")))
        }
        $.post(
            "/blog/addarticle",
            {
                blog_title: blog_title,
                blog_content: ue.getContent(),
                blog_quote: blog_quote,
                blog_class: blog_class,
                blog_tags: JSON.stringify(blog_tags)
            },
            function(data){
                if (data["status"] == "0"){
                    $(".content-center-write").html('<div class="content-center-write-success"><div>提交成功，3秒跳转<br/>如没跳转，请点击<a href="/blog">走着</a></div></div>');
                    setTimeout('window.location.href = "/blog"',3000);
                }else{
                    $(".content-center-write").html('<div class="content-center-write-fail"><div>提交失败，将在3秒后跳转<br/>如没跳转，请点击<a href="/blog">走着</a></div></div>');
                    setTimeout('window.location.href = "/blog"',3000);
                }
            },
            'json'
        );
    }
}

$(function(){
    //标签字数截断
    $(document.body).limit();
    //喜欢人数增加
    $('.up-likes').click(function(){//修改支持反对数
        var mytag = $(this);
        $.post(
            "/blog/updatelikes/",
            {id:this.id},
            function(result){
                //判断是否为内容，内容的话返回一个网页，否则显示该做的事情，加一
                mytag.html(result["likes"]);
            }
        );
    });
    //标签球
    $('.content-center-right-tags').tagCloud();
    //撰写博文
    $("#blog_quote").change(function(){
        setQouteStatus(this);
    });
    $("#blog_class").change(function(){
        setClassStatus(this);
    });

    $("#button_tags").click(function(){
        $("#span_tags").html("<input class='am-field' id='new_tags' type='text' placeholder='请输入标签，最多输入三个，以空格分隔^_^' />");
    });

    $('.btn-loading-more').click(function () {
        var last_item_id = $(".content-cneter-left-cell").last().find("#article-id").text();
        var $btn = $(this);
        var cur_id = $();
        $btn.button('loading');
        $.post(
            "/blog/",
            {id:last_item_id},
            function(data){
                if (data["status"] == 1){
                    $(".load-more .am-alert .alert-text").html("系统出错，请刷新重试！⊙﹏⊙b汗");
                    $(".load-more .am-alert").addClass("am-alert-danger").removeClass("am-hide");
                    setTimeout(function(){
                        $(".load-more .am-alert").removeClass("am-alert-danger").addClass("am-hide");
                    }, 3000);
                } else if(data["status"] == 2){
                    $(".load-more .am-alert .alert-text").html("所有数据都已加载完毕，下面请您尽情欣赏！~\(≧▽≦)/~啦啦啦");
                    $(".load-more .am-alert").addClass("am-alert-danger").removeClass("am-hide");
                    setTimeout(function(){
                        $(".load-more").hide("slow");
                    }, 3000);
                }else if(data["status"] == 0){
                    $.each(data["article"], function(i,value){
                        //判断角标
                        if (value["cornerite"] == "J"){
                            cornerite_html = '<span class="cornerite-j"></span>';
                        }else if (value["cornerite"] == "H"){
                            cornerite_html = '<span class="cornerite-h"></span>';
                        }else if (value["cornerite"] == "C"){
                            cornerite_html = '<span class="cornerite-c"></span>';
                        }else{
                            cornerite_html = '<span class="cornerite"></span>';
                        }
                        //处理标签
                        if (value["tag_list"]){
                            tag_html = "";
                            for (j in value["tag_list"]){
                                tag_html += '<span><a href="/blog/search/?tag='+value["tag_list"][j]+'" target="_blank">'+value["tag_list"][j]+'</a> </span> '
                            }
                        } else {
                            tag_html = "";
                        }
                        cell_html = '<div class="content-cneter-left-cell" >'
                            +cornerite_html
                            +'<article class="am-article"><span id="article-id" class="am-hide">'
                            +value["id"]
                            +'</span><div class="am-article-hd"><h1 class="am-article-title" ><a limit="22" href="/blog/article/'
                            + value["id"] + '">' + value["title"]
                            + '</a></h1></div><hr class="am-article-divider"/><div class="am-article-yw am-g"><span class="am-u-sm-3 am-u-md-3 am-u-lg-3"  title="作者是'
                            + value["author"]
                            + '"><span class="content-cneter-left-cell-author">By <a limit="4" href="/space/'
                            +value["author"] +'">' + value["author"]
                            +'</a></span></span><span class="am-u-sm-2 am-u-md-2 am-u-lg-2" title="所属分类"><span><a limit="10" href="/blog/search/?class='
                            +value["article_class"] +'">'+value["article_class"]
                            +'</a></span></span><span class="am-u-sm-3 am-u-md-3 am-u-lg-3" title="发表时间"><span ><a href="/blog/search/?datetime='
                            +value["public_time"] +'">'+value["public_time"]
                            +'</a></span>　</span><span class="am-u-sm-4 am-u-md-4 am-u-lg-4" title="标签"><img src="/static/images/tags.png" alt="标签" width="15px" height="15px"/>'
                            +tag_html
                            +'</span></div></article></div>';
                        $(".content-cneter-left-cell").last().after(cell_html);
                    });
                    $(document.body).limit();
                    setTimeout(function(){
                        $btn.button('reset');
                    }, 1000);
                }
            },
            "json"
        );

    });
});


