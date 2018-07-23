function convertToUTF8 (str) {
  var patt = /&#x\w{2};/g
  var fields = str.match(patt)
  if (fields) {
    fields.forEach(function (item) {
      str = str.replace(item, hashMap.get(item.toLowerCase()))
    })
    return str
  } else {
    return str
  }
}

var hashMap = {
  set: function (key, value) { this[key] = value },
  get: function (key) { return this[key] }
}

hashMap.set('&#xe0;', 'à')
hashMap.set('&#xe1;', 'á')
hashMap.set('&#xe2;', 'â')
hashMap.set('&#xe3;', 'ã')
hashMap.set('&#xe4;', 'ä')
hashMap.set('&#xe5;', 'å')
hashMap.set('&#xe6;', 'æ')
hashMap.set('&#xe7;', 'ç')
hashMap.set('&#xe8;', 'è')
hashMap.set('&#xe9;', 'é')
hashMap.set('&#xea;', 'ê')
hashMap.set('&#xeb;', 'ë')
hashMap.set('&#xec;', 'ì')
hashMap.set('&#xed;', 'í')
hashMap.set('&#xee;', 'î')
hashMap.set('&#xef;', 'ï')

hashMap.set('&#xf0;', 'ð')
hashMap.set('&#xf1;', 'ñ')
hashMap.set('&#xf2;', 'ò')
hashMap.set('&#xf3;', 'ó')
hashMap.set('&#xf4;', 'ô')
hashMap.set('&#xf5;', 'õ')
hashMap.set('&#xf6;', 'ö')
hashMap.set('&#xf7;', '÷')
hashMap.set('&#xf8;', 'ø')
hashMap.set('&#xf9;', 'ù')
hashMap.set('&#xfa;', 'ú')
hashMap.set('&#xfb;', 'û')
hashMap.set('&#xfc;', 'ü')
hashMap.set('&#xfd;', 'ý')
hashMap.set('&#xfe;', 'þ')
hashMap.set('&#xff;', 'ÿ')

exports.convertToUTF8 = convertToUTF8
