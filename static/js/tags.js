/**
 * Created by wei on 2015/8/19.
 */

function detail_tags(tag){
    $.post(
        '/tags/tags_detail/',
        {"tag":$(tag).text()},
        function(data){
            $(".am-popup-bd").text(data['data']);
        },
        'json'
    );
}