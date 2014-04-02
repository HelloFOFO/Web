var UPYun = require('./../tools/upyun').UPYun;
var upyun = new UPYun("dd885", "rtaimage", "rtaimage");

var md5 = function(string) {
    var crypto = require('crypto');
    var md5sum = crypto.createHash('md5');
    md5sum.update(string, 'utf8');
    return md5sum.digest('hex');
};

var randomObjectId = function () {
    var crypto = require('crypto');
    return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, 24);
}

exports.fileUpload = function(req, res) {
    res.contentType('json');
    var fs =  require('fs');
    var fileContent = fs.readFileSync(req.files.file.path);
    console.log('----->          '+req.files.file.path);
    console.log('----->          '+req.files.file.name);
    var md5Str = md5(fileContent);
    var newFileName = randomObjectId()+'.jpg';
    upyun.setContentMD5(md5Str);

    upyun.writeFile('/'+newFileName, fileContent, false, function(err, data){
        if (err) {
            console.log(err);
            throw err
        }
        fs.unlink(req.files.file.path, function(err) {
            if (err) throw err;
            res.send({"srcFileName":req.files.file.name  ,"upyunFileName":newFileName});
        });
    });
}