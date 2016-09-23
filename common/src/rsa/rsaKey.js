/**
 * Created by jess on 16/2/22.
 */


'use strict';

var ONLINE_KEY  = '-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMO0o8vYsqInbD/8uraIdWqP8Y\n' +
'cc7KQuLS7w0VbCWocyMRYu582LwzycBOPvbbEKt2feqpUKQ+F3peq+HQnI6gL9d6\n' +
'6l0ZG3KjflZTQJ8M847USfUNGVbAi3PJG/NiwQHddUUudmjIEAXwadelp/g+/p97\n' +
'YcBAz8caQDcEyI0AjQIDAQAB\n' +
'-----END PUBLIC KEY-----;';

var TEST_KEY  = '-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/GP6dENV96jD1oSvmbYhbhHhc\n' +
'/7Ngv+DY0iuhmzteyrWDswJDddEHViuhJTZguCGotujOcauzNm71sjW+sHXEJVIX\n' +
'HD4eiBNN9SpPpxeioKepaArqujo76GX2EW6JNCBFiB8fevhZHV/e7PQik+jZw/m1\n' +
'0eAjakbsbS4TBvwUtwIDAQAB\n' +
'-----END PUBLIC KEY-----';

window.___RSA_TRICK_KEYS___ = {
    onlineKey : ONLINE_KEY,
    testKey : TEST_KEY
};

window.___RSA_TRICK_KEYS___.finalKey = window.___RSA_TRICK_KEYS___.onlineKey;

if( location.href.indexOf('jdebug=jdebug') > 0 ){
    window.___RSA_TRICK_KEYS___.finalKey = window.___RSA_TRICK_KEYS___.testKey;
}

module.exports = window.___RSA_TRICK_KEYS___.finalKey;