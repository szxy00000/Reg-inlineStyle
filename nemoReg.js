var through2 = require('through2');
var fs = require('fs');
function reg(dirname) {
    return through2.obj(function(file, enc, cb) {
        var fileName = file.path.substr(file.path.lastIndexOf('/') + 1).replace(/\.tag/, '');
        if (file.isNull()) {
          return cb(null, file);
        }

        var str = file.contents.toString();
        str = regStyle(str, fileName, dirname)
        file.contents = new Buffer(str);
        cb(null, file)
    })


    function regStyle (str, fileName) {
        var styleTagArr = [];
        var newTagArr = [];
        var styleObj = {};
        var tagArr = str.match(/\<\w.*\>/g);
        tagArr.forEach(function (one) {
            if (one.match(/style\=/)) {
                styleTagArr.push(one);
            }
        })
        for (var i = 0;i<styleTagArr.length;i++) {
            if (styleTagArr[i].match(/style.*\;(\'|\")/g)) {
                if (styleTagArr[i].match(/class/)) {
                    newTagArr[i] = styleTagArr[i].replace(/class\=\"/, 'class="' + fileName + i + ' ');
                    styleObj['.' + fileName + i] = '{' + styleTagArr[i].match(/style.*\;(\'|\")/g).join('').replace(/(\'|\")/g,'').replace(/style=/g,'').replace(/\s/g,'') + '}';
                    newTagArr[i] = newTagArr[i].replace(/style.*\;(\'|\")/g, '');
                    str = str.replace(styleTagArr[i],newTagArr[i]);
                } else {
                    styleObj['.' + fileName + i] = '{' + styleTagArr[i].match(/style.*\;(\'|\")/g).join('').replace(/(\'|\")/g,'').replace(/style=/g,'').replace(/\s/g,'') + '}';
                    newTagArr[i] = styleTagArr[i].replace(/style.*\;(\'|\")/g, 'class="' + fileName + i + '"');
                    str = str.replace(styleTagArr[i],newTagArr[i]);
                }
            }

        }
        var styleTag = '';
        if(str.match('<style>') && str.match('</style>')) {
            styleTag = str.substring(str.indexOf('<style>') + 7,str.indexOf('</style>'))
            str = str.replace(str.substring(str.indexOf('<style>'),str.indexOf('</style>') + 8), '')
        }
        getLess(styleObj, styleTag, fileName);
        return str;
    }
    function getLess (styleObj, styleTag, fileName) {
        var less = JSON.stringify(styleObj, null, 4).replace(/\"/g,'').replace(/\,/g, '').replace(/\:\s/g, '');
        less = fileName + less.substr(0, less.lastIndexOf('}')) + styleTag + '}';
        fs.writeFile(dirname + '/' + fileName + '.less', less, function () {
            console.log('less file has been created')
        })
    }

}

module.exports = reg;
