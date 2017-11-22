function Webcrawler() {
  this.request = require('request');
  this.cheerio = require('cheerio');
  this.fs = require('fs');

}

Webcrawler.prototype.getContent = function(site, callback) {
  var myThis = this;
  var content = [];

  this.request(site, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    console.log("Status code: " + response.statusCode);

    var $ = myThis.cheerio.load(body);

    if (site.includes("reddit")) {
      myThis._scrapeReddit($, content, callback);
    }

    if (site.includes("youtube")) {
      myThis._scrapeYouTube($, content, callback);
    }

    if (site.includes("memecenter")) {
      myThis._scrapeMemeCenter($, content, callback);
    }
  });

}

Webcrawler.prototype._scrapeReddit = function($, content, callback) {
  $('div#siteTable > div.link').each(function(index) {
    var title = $(this).find('p.title > a.title').text().trim();
    var score = $(this).find('div.score.unvoted').text().trim();
    var user = $(this).find('a.author').text().trim();
    var link = $(this).find('p.title > a.title').attr('href');
    
    if (link.includes("/r/")) {
      link = "https://www.reddit.com" + link;
    }

    content.push({
      src: "reddit",
      title: title,
      score: score,
      user: user,
      link: link
    });
      //fs.appendFileSync('reddit.txt', title + '\n' + score + '\n' + user + '\n');
    });
  callback(content);
}

Webcrawler.prototype._scrapeYouTube = function($, content, callback) {
  $("a.yt-uix-tile-link").each(function(index) {
    var title = $(this).text().trim();
    var link = $(this).attr('href');
    content.push({
      src: "youtube",
      title: title,
      link: link
    });

    if (index == 6) {
      return false;
    }
  });
  callback(content);
}

Webcrawler.prototype._scrapeMemeCenter = function($, content, callback) {
  $(".content-image.act_float_guide").each(function(index) {
    var meme = $(this).find("a").first().html();
    var link = $(this).find("a").attr('href');
    content.push({
      src: "memecenter",
      meme: meme,
      link: link
    });

    if (index == 20) {
      return false;
    }
  });
  callback(content);
}

exports.Webcrawler = Webcrawler;

