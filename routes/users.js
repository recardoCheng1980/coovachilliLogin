var express = require('express');
var router = express.Router();
var debug = require('debug')('users');
var md5 = require('./md5');
var util = require('util');

String.prototype.pad = function( length ,padding ) {
	        var padding = typeof padding === 'string' && padding.length > 0 ? padding[0] : '\x00',length = isNaN( length ) ? 0 : ~~length;
	        return this.length < length ? this + Array( length - this.length + 1 ).join( padding ) : this;
}

String.prototype.packHex = function() {
	        var source = this.length % 2 ? this + '0' : this, result = '';
	        for( var i = 0; i < source.length; i = i + 2 ) {
			                result += String.fromCharCode( parseInt( source.substr( i , 2 ) ,16 ) );
			        }
	        return result;
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  debug(req.query);
  debug(req.query.challenge);

  if (req.query.res=='already') { //already login in
    res.send('login success!!');
  }
  else if (req.query.res=='success') {
    res.send('login success!!');
  }
  else if (req.query.res=='notyet') {
    var challenge=req.query.challenge;
    var uamsecret="testing123";
    var password="hello";
    var server_ip="192.168.123.254";
    var server_port=3990;
    var username="bob";

    var hexchal = challenge.packHex();
    var newchal = md5( hexchal + uamsecret ).packHex();

    var response = md5( '\0' + password + newchal );
    var newpwd = password.pad( 32 );
    var pappassword = '';
    for( var i = 0; i < newchal.length; i++ ) {
      pappassword += ( newpwd.charCodeAt( i ) ^ newchal.charCodeAt( i ) ).toString( 16 );
    }
    var userurl="http%3a%2f%2fcaptive.apple.com%2fhotspot-detect.html";

    console.log("challenge:", challenge);
    console.log("uamsecret:", uamsecret);
    console.log("password:", password);
    console.log("pappassword:", pappassword);
    console.log("response:", response);
    var resp=util.format("http://%s:%d/logon?username=%s&password=%s&userurl=%s", server_ip, server_port, username, pappassword, userurl);
    res.send(resp);
  }
  else if (req.query.res=='failed') {
    res.send('login failed');
  }
});

module.exports = router;


//var challenge = 'ba4215c6484be79ae56123a5b4e3f0d9';
//var challenge = 'd85119efdcc52f8bc016b992c4626435';
//var uamsecret = 'testing123';
//var password = 'hello';
//
//var hexchal = challenge.packHex();
////console.log("hexchal:"+ hexchal);
//var newchal = md5( hexchal + uamsecret ).packHex();
//console.log("newchal:"+ newchal);
//var response = md5( '\0' + password + newchal );
//var newpwd = password.pad( 32 );
//var pappassword = '';
//for( var i = 0; i < newchal.length; i++ ) {
//  pappassword += ( newpwd.charCodeAt( i ) ^ newchal.charCodeAt( i ) ).toString( 16 );
//}
//console.log("pappassword: --> ", pappassword);
//console.log("Response: --> ", response);
//console.log("http://192.168.123.254:3990/login?username=bob&response="+response+"&userurl=http%3a%2f%2fcaptive.apple.com%2fhotspot-detect.html");
////echo "http://$uamip:$uamport/login?username=$username&response=$response&userurl=$userurl\n";
