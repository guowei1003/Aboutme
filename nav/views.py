#coding:utf-8

import os, json, time, traceback

from django.shortcuts import render_to_response
from models import site,site_class,site_group
from django.http import HttpResponse,HttpResponseRedirect, HttpResponseNotFound
from django.db.models import F,Q


MNUE_LIST=[
            "news",
            "videos",
            "shopping",
            "cars",
            "finance",
            "develop",
            "live",
            "cool",
            "relax"
]

def navsite(request):
    ac_navsite = "am-active"
    title = "网站导航"
    site_mysql = site.objects
    site_list = site_mysql.filter(is_onhome=True)
    site_mysql = site.objects.filter(is_onhome=False)
    champion_reads = site_mysql.order_by("-url_reads")[:100]
    champion_likes = site_mysql.order_by("-url_likes")[:100]
    champion_collects = site_mysql.order_by("-url_collects")[:100]
    return render_to_response("nav/navigate_url.html",locals())

def navsite_class(request,keywords):
    ac_navsite = "am-active"

    if keywords not in MNUE_LIST:
        return HttpResponseNotFound
    class_site = site_class.objects.get(class_name=keywords)

    site_list = site.objects.filter(url_class_id=class_site)
    champion_reads = site_list.order_by("-url_reads")[:10]
    champion_likes = site_list.order_by("-url_likes")[:10]
    champion_collects = site_list.order_by("-url_collects")[:10]
    title = class_site.class_name_cn
    title_en = class_site.class_name
    return render_to_response("nav/navigate_"+keywords+".html",locals())

def navsite_add(request):
    ac_navsite = "am-active"
    title = "填写新网站"
    site_class_mysql = site_class.objects.order_by("class_code")
    site_group_mysql = site_group.objects.order_by("group_code")
    site_name = request.POST.get("site_name","")
    site_url =  request.POST.get("site_url","")
    site_class_req =  request.POST.get("site_class","")
    site_group_req =  request.POST.get("site_group","")
    site_onhome = request.POST.get("site_onhome","")
    site_onhome = site_onhome and True or False
    site_describe =  request.POST.get("site_describe","")
    if not site_name:
        return render_to_response("nav/navigate_addsiteinfos.html",locals())
    else:
        # print site_name
        # print site_url
        # print site_class_req
        print site_group_req
        print site_onhome
        # print site_describe
        try:
            site_class_id = site_class.objects.get(id=site_class_req)
            site_group_id = site_group.objects.get(id=site_group_req)
            Site = site(
                name=site_name,
                url=site_url,
                url_class_id=site_class_id,
                url_group_id=site_group_id,
                is_onhome=site_onhome,
                describe=site_describe
            )
            Site.save()
            msg = '0'
        except Exception,e:
            traceback.print_exc()
            print e
            msg = e
        return render_to_response("nav/navigate_addsiteinfos.html",locals())

def navsite_update(request,keywords):

    site_id = request.POST.get("id" ,"")
    if not site_id:
        return HttpResponse(json.dumps({"data":"1"}))
    if keywords == "url_reads":
        site.objects.filter(id=site_id).update(url_reads=F("url_reads")+1)
    elif keywords == "url_likes":
        site.objects.filter(id=site_id).update(url_likes=F("url_likes")+1)
    elif keywords == "url_collects":
        site.objects.filter(id=site_id).update(url_collects=F("url_collects")+1)
    else:
        HttpResponse(json.dumps({"data":"2"}))

    return HttpResponse(json.dumps({"data":"0"}))


