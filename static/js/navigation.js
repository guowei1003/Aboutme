/**
 * Created by wei on 2015/10/13.
 */
function AddFavorite(sURL, sTitle,tagsa) {
    $(tagsa).removeClass("am-icon-star-o").addClass("am-icon-star");
    try {
        window.external.addFavorite(sURL, sTitle);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");

        }
        catch (e) {
            alert("加入收藏失败，请手动进行添加");
        }
    }
}
//设为首页 <a onclick="SetHome(this,window.location)">设为首页</a>
function SetHome(obj, vrl) {
    try {
        obj.style.behavior = 'url(#default#homepage)';
        obj.setHomePage(vrl);
    }
    catch (e) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
                alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', vrl);
        }
    }
}
//更新喜欢计数
function updateLike(id,tagsa){
    $.post(
        "/nav/navsite_update/url_likes/",
        {'id':id}
    );
    $(tagsa).removeClass("am-icon-heart-o").addClass("am-icon-heart").attr("onclick","");
}
//更新点击数
function updateReads(id){
    $.post(
        "/nav/navsite_update/url_reads/",
        {'id':id}
    )
}
//更新收藏数量
function updateCollect(id,tagsa){
    $.post(
        "/nav/navsite_update/url_collects/",
        {'id':id}
    );
    $(tagsa).removeClass("am-icon-star-o").addClass("am-icon-star").attr("onclick","");
}

$(function(){
    $(".content-enter-list").hover(function(){
        $(this).find("span").show();
    },function(){
        $(this).find("span").hide();
    });
     $("#author_id").dblclick(function(){
         location.href = "/nav/navsite_addsiteinfos"
     });
    //更新分组

});