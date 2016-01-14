#coding:utf-8
from HTMLParser import HTMLParser
import urllib

class IParser(HTMLParser):
    '''
    ip解析器从ip138解析数据
    '''
    def __init__(self, ip):
        HTMLParser.__init__(self)
        self.location = None
        self.url = "http://ip138.com/ips138.asp?ip="
        self.feed(unicode(urllib.urlopen(self.url + ip).read(), 'gb2312'))
        
    def handle_starttag(self,tag,attrs):
        ''' attrs is a tuple like ((name,value),(name,value),) '''
        pass
                    
    def handle_data(self,data):
        if data.startswith(u"本站主数据"):
            self.location = data.split(u'：')[1]
        
    def handle_endtag(self,tag):
        pass
            
    def getresult(self):
        return self.location
            
if __name__=="__main__":
    IParser = IParser("117.85.103.246")
    IParser.getresult()
    IParser.close()