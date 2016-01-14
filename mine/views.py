#coding:utf-8

import json, time, traceback

from django.shortcuts import render_to_response
from models import Article, Tags, Author
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.db.models import F, Q

from Aboutme.settings import LOADING_SIZE

def aboutme(request):
    """站长的简介"""
    ac_aboutme = "am-active"
    return render_to_response("aboutme.html", locals())

def blog(request):
    """博文列表"""
    ac_blog="am-active"
    title = "博文列表"
    ClassList = {}
    if request.method == "POST":
        data={"status": 0,"article":[]}
        article_id = request.POST.get("id", "")
        if not article_id:
            data["status"] = 1
            return HttpResponse(json.dumps(data), content_type="application/json")
        dataArticleList =  Article.objects.filter(is_avtive__exact=True,id__lt=article_id).order_by("-create_time")[0: LOADING_SIZE]
        if not dataArticleList:
            data["status"] = 2
            return HttpResponse(json.dumps(data), content_type="application/json")
        for i in dataArticleList:
            tag_list =  i.article_tags.values_list("tag", flat=True)
            new_tag_list =[]
            for j in tag_list:
                new_tag_list.append(j.encode("utf-8"))
            data['article'].append({
                "id": i.id,
                "title": i.title,
                "cornerite": i.cornerite,
                # "quote": i.quote,
                "article_class": i.article_class,
                "article_lead": i.article_lead,
                "tag_list": new_tag_list,
                "author": i.author.author_nickname,
                "public_time": i.publish_time.strftime('%Y-%m-%d %I:%M'),
            })
        return HttpResponse(json.dumps(data), content_type="application/json")
    else:
        DataBlogAritcles = Article.objects.filter(is_avtive__exact=True).order_by("-create_time")[0: LOADING_SIZE]
        AllTags = Tags.objects.all()[:50]
        AllClass = Article.objects.values("article_class")
        for c in AllClass:
            if c["article_class"] in ClassList:
                ClassList[c["article_class"]] +=1
            else:
                ClassList[c["article_class"]] = 1
        return render_to_response("blog/blog.html",locals())


def login(request):
    return
def space(request,author):

    print author
    return render_to_response("space.html",locals())
def blog_article(request,id):
    """博文详细页面"""
    ClassList = {}
    try:
        cur_blog = Article.objects.get(id=id)
        cur_blog.article_reads+=1
        if 10 <= cur_blog.article_reads:
            cur_blog.cornerite = "H"
        cur_blog.save()
    except:
        cur_blog = []
    blog_web_url = "http://"+str(request.get_host())+"/blog/article/"+str(id)
    AllTags = Tags.objects.all()[:50]
    AllClass = Article.objects.values("article_class")
    for c in AllClass:
        if c["article_class"] in ClassList:
            ClassList[c["article_class"]] +=1
        else:
            ClassList[c["article_class"]] = 1

    title = cur_blog.title
    return render_to_response("blog/blog_article.html",locals())
def add_article(request):
    """提交文章"""
    if request.META.has_key('HTTP_X_FORWARDED_FOR'):
        vsip =  request.META['HTTP_X_FORWARDED_FOR']
    else:
        vsip = request.META['REMOTE_ADDR']

    blog_title = request.POST.get("blog_title","")#根据标题判断是访问还是新增

    if blog_title:
        blog_content = request.POST.get("blog_content","")
        blog_quote = eval(request.POST.get("blog_quote",""))
        blog_class = request.POST.get("blog_class","")
        blog_tags = eval(request.POST.get("blog_tags",""))
        # print "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^66"
        # print blog_title
        # print blog_content
        # print blog_quote
        # print blog_class
        # print blog_tags,"|",type(blog_tags)
        # print "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
        if not blog_content or not blog_quote or not blog_class or not blog_title:
            return HttpResponse(json.dumps({"status":"1","messages":"parameter error"}), content_type="application/json")
        if blog_quote["sign"] == "C":
            cornerite = "C"
        else:
            cornerite = ""
        # print "***********************************"
        # print blog_title
        # print blog_content
        # print blog_quote
        # print blog_class
        # print blog_tags
        # print "***********************************"
        author = Author.objects.get(author_name="guowei1003")
        NewArticle = Article(
                             title=blog_title,
                             author=author,
                             location="北京",
                             quote=blog_quote["quote_url"],
                             article_class=blog_class,
                             article_lead=blog_content,
                             article_reads='0',
                             article_likes='0',
                             article_collects='0',
                             cornerite=cornerite
                             )
        NewArticle.save()
        for tag in blog_tags:
            try:
                mtag = Tags.objects.get(tag=tag)
            except:
                mtag = Tags(tag=tag)
                mtag.save()
            NewArticle.article_tags.add(mtag)
        return HttpResponse(json.dumps({"status":"0"}), content_type="application/json")
    else:
        ClassList = {}
        AllTags = Tags.objects.all()[:50]
        AllClass = Article.objects.values("article_class")
        for c in AllClass:
            if c["article_class"] in ClassList:
                ClassList[c["article_class"]] +=1
            else:
                ClassList[c["article_class"]] = 1
        title = "撰写博文"
        return render_to_response("blog/blog_addarticle.html",locals())

def blog_search(request):
    """返回所显示的固定列表"""
    blog_list = []
    ClassList ={}
    search_class=request.GET.get("class","")
    search_tag=request.GET.get("tag","")
    search_datetime=request.GET.get("datetime","")
    if search_tag:
        try:
            tag = Tags.objects.get(tag=search_tag)
            blog_list = tag.article_set.all()
        except:
            blog_list = []
        title = "显示检索数据:"+search_tag.encode("utf-8")
    elif search_datetime:
        datetime = search_datetime.split("-")
        blog_list = Article.objects.filter(create_time__year=datetime[0],create_time__month=datetime[1],create_time__day=datetime[2])
        title = "显示检索数据:"+search_datetime.encode("utf-8")
    elif search_class:
        blog_list = Article.objects.filter(article_class=search_class)
        title = "显示检索数据:"+search_class.encode("utf-8")
    DataBlogAritcles = blog_list
    AllTags = Tags.objects.all()[:50]
    AllClass = Article.objects.values("article_class")
    for c in AllClass:
        if c["article_class"] in ClassList:
            ClassList[c["article_class"]] +=1
        else:
            ClassList[c["article_class"]] = 1
    return render_to_response("blog/blog.html",locals())

def updatelikes(request):
    """更新喜欢人数"""
    id = request.POST.get("id", "")
    try:
        getarticle = Article.objects.get(id=id)
    except:
        getarticle=[]
    if getarticle:
        getarticle.article_likes +=1
        if 10 <= getarticle.article_likes and getarticle.article_reads < 500:
            getarticle.cornerite = "J"
        getarticle.save()
        return HttpResponse(json.dumps({"likes":str(getarticle.article_likes)}), content_type="application/json")
    return json.dumps({"likes":"error"})

#标签列表
def tags(request):
    """标签列表"""
    ac_tags="am-active"
    title="标签空间"
    tags_list={}
    allTags = Tags.objects.all()
    for tag in allTags:
        tags_list[tag.tag]=tag.article_set.count()
    tags_list = sorted(tags_list.items(), key=lambda d:d[1])
    return render_to_response("blog/tags.html",locals())

def tags_detail(request):
    """标签详细信息"""
    tag = request.POST.get("tag","")
    if not tag:
        return HttpResponse(json.dumps({"data":"无数据"}), content_type="application/json")
    describe= Tags.objects.get(tag=tag).describe
    return HttpResponse(json.dumps({"data":describe!=None and describe or "木有介绍哇:("}), content_type="application/json")

