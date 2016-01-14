#coding:utf-8
__author__ = 'wei'


################################
#此模块为对加密函数的封装
#作者：曹国伟
#日期：2015年4月28日9:57:52
################################

import hashlib, os, re, json

def AccEncrypted(method,keytype, strword):
    """
    函数作用：md5加密
    函数使用模块：hashlib
    method:加密类型：md5，sha1，sha224，sha256，sha384，sha512
    keytype:查询类型（onestr:单字符串加密，type：str
                    ,manystr：多字符串加密，type:list
                    filestr）：文件数据加密：type：str
    strword:提供的值
    reutrn:json  {
                status:状态值：0表示成功，其余皆为错误
                data:加密结果
                digest_size:结果hash的大小
                block_size:hash内部块的大小
                    }
    """
    return_data = {"status":0}
    strword = str(strword)
    method_con = eval('hashlib.'+method+'()')
    if keytype == "onestr":
        method_con.update(strword)
    elif keytype == 'manystr':
        if re.findall(r'\[.*\]',strword):
            for s in eval(strword):
                method_con.update(str(s))
            # return_data["data"] = md5_con.hexdigest()
        else:
            return_data["status"] = 1
            md5_con = "Format Error"
    elif keytype == 'filestr':
        if not os.path.isfile(strword):
            return_data["status"] = 2
            method_con ="File does not exist "
        else:
            f = open(strword,'rb')
            while True:
                b = f.read(8096)
                if not b :
                    break
                method_con.update(b)
            f.close()
            # return_data["data"] = md5_con.hexdigest()
    if return_data["status"] == 0 :
        return_data["data"] = method_con.hexdigest()
        return_data["digest_size"] = method_con.digest_size
        return_data["block_size"] = method_con.block_size
    else:
        return_data["ErrorMsg"] = method_con
    return json.dumps(return_data)


