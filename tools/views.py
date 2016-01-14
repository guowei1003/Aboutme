#coding:utf-8

import json, threading,urllib2
from django.shortcuts import render_to_response
from django.http import HttpResponseNotFound,HttpResponse
from tools.models import Tools, Access_record, Tools_class
from django.db.models import Count, F, Q

def SiteNav():
    """返回站点导航数据"""
    siteMap ={}
    MysqlClass = Tools_class.objects.values("tool_class","tool_class_ename")
    MysqlTools = Tools.objects
    for i in MysqlClass:
        tools_list = MysqlTools.filter(tool_class=i["tool_class_ename"])
        if tools_list:
            siteMap[i["tool_class"]]=tools_list
    return siteMap

def toolsHome(request):
    """工具首页
    返回几个序列，最新，使用最多，最受喜欢列表
    """
    MysqlHandler = Tools.objects
    new_tool_list = MysqlHandler.order_by("-create_time")[0:10]
    like_most_list = MysqlHandler.order_by("-like_count")[0:10]
    use_most_list = MysqlHandler.order_by("-usage_count")[0:10]
    ds_web_url = "http://"+str(request.get_host())+"/tools/"
    siteMap = SiteNav()
    ds_web_id = 'tool_index'
    title = "谁？谁！"
    ac_tools = "am-active"
    return render_to_response("tools/toolshome.html",locals())

def toolDetail(request,t_ename):
    """工具页面"""
    try:
        tool = Tools.objects.get(tool_ename=t_ename)
    except:
        return HttpResponseNotFound
    Tools.objects.filter(tool_ename=t_ename).update(usage_count=F("usage_count")+1)
    access_user = request.session.get("username",u"匿名用户")
    sec_key = ""
    if request.META.has_key('HTTP_X_FORWARDED_FOR'):
        access_ip =  request.META['HTTP_X_FORWARDED_FOR']
    else:
        access_ip = request.META['REMOTE_ADDR']
    access_url = t_ename
    location = ""
    try:
        Access_record(access_user=access_user,sec_key=sec_key,ip=access_ip.strip(","),url=access_url,location=location).save()
        #新浪SAE不支持异步socket，暂不开启
        # id = Access_record.objects.filter(access_user=access_user,sec_key=sec_key,ip=access_ip.strip(','),url=access_url,location=location).order_by("-create_time")[0].id
        # AsyncLocation(id, access_ip.strip(",")).start()
    except:
        pass
    ds_web_id = t_ename
    ds_web_url = "http://"+str(request.get_host())+"/tools/tooldetail/"+t_ename
    siteMap = SiteNav()
    title = tool.tool_name
    header_title = tool.tool_name
    header_subtitle = tool.tool_class + " - " +tool.tool_name
    ac_tools = "am-active"
    return render_to_response("tools/"+t_ename+".html",locals())

def toolClass(request):
    """分类展示"""
    get_class = request.GET.get("menu","tool_site")
    try:
        tool_class = Tools_class.objects.get(tool_class_ename=get_class)
    except:
        return HttpResponseNotFound
    toolsbyclass = Tools.objects.filter(tool_class=tool_class.tool_class_ename).order_by("tool_ename")

    ds_web_id = get_class
    ds_web_url = "http://"+str(request.get_host())+"/tools/toolclass/?menu="+get_class
    siteMap = SiteNav()
    header_title = tool_class.tool_class
    header_subtitle = header_title
    title = header_title
    ac_tools = "am-active"
    return render_to_response("tools/toolclass.html",locals())

def updatelikes(request):
    """更新喜欢人数"""
    id = request.POST.get("id", "")
    try:
        gettools = Tools.objects.get(id=id)
        gettools.like_count+=1
        gettools.save()
    except:
        return HttpResponse(json.dumps({"data":0}), content_type="application/json")
    return HttpResponse(json.dumps({"data":gettools.like_count}), content_type="application/json")

def get_location(ip):
    ipapi = "http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=%s" % ip
    req = urllib2.Request(ipapi)
    req.add_header("apikey", "03bf6d51a5c9b8457dbd5381ad160ad2")
    resp = urllib2.urlopen(req)
    content = json.loads(resp.read())
    if content["errNum"] == 0:
        country = content["retData"]["country"] != "None" and content["retData"]["country"] or ""
        province = content["retData"]["province"] != "None" and content["retData"]["province"] or ""
        city = content["retData"]["city"] != "None" and content["retData"]["city"] or ""
        district = content["retData"]["district"] != "None" and content["retData"]["district"] or ""
        carrier = content["retData"]["carrier"] != "None" and content["retData"]["carrier"] or ""
        location = "%s%s%s%s %s" % (country,province,city,district,carrier)
        response = location
    else:
        response = "未知"
    return response
def scan_ipadd(request):
    #扫描ip地址，获取本地地址

    ip_list = Access_record.objects.filter(Q(ip__isnull=False)&Q(location__exact=""))
    for i in ip_list:
        if "," in i.ip:
            ip = i.ip.split(",")[0]
            if len(i.ip.split(".")) == 4:
                location = get_location(ip)
                Access_record.objects.filter(id=i.id).update(ip=ip, location=location)
            else:
                location = get_location(ip)
                Access_record.objects.filter(id=i.id).update(ip=ip, location=location)
        else:
            if len(i.ip.split(".")) == 4:
                location = get_location(i.ip)
                Access_record.objects.filter(id=i.id).update(location=location)
            else:
                location = "IP异常"
                Access_record.objects.filter(id=i.id).update(location=location)

    return HttpResponse(json.dumps({"status": "0","count": ip_list.count()}), content_type="application/json")

class AsyncLocation(threading.Thread):
    def __init__(self, id, ip):
        threading.Thread.__init__(self)
        self.id = id
        self.ip = ip
    def run(self):
        # from utils.ip2location import IParser
        # IParser = IParser(self.ip)
        # location = IParser.getresult()
        # IParser.close()
        ipapi = "http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=%s" %self.ip
        req = urllib2.Request(ipapi)
        req.add_header("apikey", "03bf6d51a5c9b8457dbd5381ad160ad2")
        resp = urllib2.urlopen(req)
        content = json.loads(resp.read())
        if content["errNum"] == 0:
            country = content["retData"]["country"] != "None" and content["retData"]["country"] or ""
            province = content["retData"]["province"] != "None" and content["retData"]["province"] or ""
            city = content["retData"]["city"] != "None" and content["retData"]["city"] or ""
            district = content["retData"]["district"] != "None" and content["retData"]["district"] or ""
            carrier = content["retData"]["carrier"] != "None" and content["retData"]["carrier"] or ""
            location = "%s%s%s%s%s" % (country,province,city,district,carrier)
            Access_record.objects.filter(id=self.id).update(location=location)
        else:
            Access_record.objects.filter(id=self.id).update(location="未知")