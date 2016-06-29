/*!
 * superagent-absoluteurl
 * Copyright(c) 2016 André Ferreira.
 * MIT Licensed
 */

var url = require("url"),
    cheerio = require("cheerio");

module.exports = function(res, debug){
    var debug = (debug != undefined) ? debug : false;
    var parseUrl = url.parse(res.request.url);
    var absolteUrl = parseUrl.protocol+"//"+parseUrl.host;
    var pathName = parseUrl.pathname;
    if(res.status == 200){
        var $ = cheerio.load(res.text);
        
        $("a").each(function(){//Change links
            var href = $(this).attr("href");
            $(this).attr("href", replacelink(href, absolteUrl, pathName, debug));
        });
        
        $("img").each(function(){//Change images
            var src = $(this).attr("src");
            $(this).attr("src", replacelink(src, absolteUrl, pathName, debug));
        });
        
        $("link").each(function(){//Change css
            var href = $(this).attr("href");
            $(this).attr("href", replacelink(href, absolteUrl, pathName, debug));
        });
        
        $("script").each(function(){//Change scripts
            var src = $(this).attr("src");
            $(this).attr("src", replacelink(src, absolteUrl, pathName, debug));
        });
        
        res.text = $.html();
        delete $;//Fix memory usage
    }

    return res;
};

function replacelink(path, absolteUrl, pathName, debug){
    if(typeof path == "string"){
        if(path.substr(0, 1) == "/" && path.substr(0, 2) != "//"){
            var absolutePath = absolteUrl + path;
            return absolutePath;
        } else if(path.substr(0, 2) == "./"){
            var absolutePath = path.replace("./", absolteUrl+"/");
            return absolutePath;
        } else if(path.substr(0, 3) == "../"){
            var parseUrl = url.parse(absolteUrl);
            var parsePath = pathName.split("/");
            var absolutePath = absolteUrl;
            for(var i = 0; i < parsePath.length-2; i++)
              absolutePath += parsePath[i]+"/";

            absolutePath += path.replace("../", "");
            return absolutePath;
        } else if(path.substr(0, 4) != "http" && path.substr(0, 2) != "//"){
            var absolutePath = absolteUrl + "/" + path;
            return absolutePath;
        }
        else{
            return path;
        }
    }
    else{
        return path;
    }
}
