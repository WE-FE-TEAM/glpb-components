/**
 * 从PC端WE理财拷贝的RSA加密JS,用于 注册/登录 过程中,加密 password
 * Created by jess on 16/2/22.
 */


/* eslint-disable */

var public_key_1024 = require('./rsaKey.js');

var pidCryptUtil = {};

function pidCrypt() {
    function a(a) {
        a || (a = 8);
        for (var b = new Array(a), c = [], d = 0; 256 > d; d++) c[d] = d;
        for (d = 0; d < b.length; d++) b[d] = c[Math.floor(Math.random() * c.length)];
        return b
    }
    this.setDefaults = function () {
        this.params.nBits = 256,
            this.params.salt = a(8),
            this.params.salt = pidCryptUtil.byteArray2String(this.params.salt),
            this.params.salt = pidCryptUtil.convertToHex(this.params.salt),
            this.params.blockSize = 16,
            this.params.UTF8 = !0,
            this.params.A0_PAD = !0
    },
        this.debug = !0,
        this.params = {},
        this.params.dataIn = "",
        this.params.dataOut = "",
        this.params.decryptIn = "",
        this.params.decryptOut = "",
        this.params.encryptIn = "",
        this.params.encryptOut = "",
        this.params.key = "",
        this.params.iv = "",
        this.params.clear = !0,
        this.setDefaults(),
        this.errors = "",
        this.warnings = "",
        this.infos = "",
        this.debugMsg = "",
        this.setParams = function (a) {
            a || (a = {});
            for (var b in a) this.params[b] = a[b]
        },
        this.getParams = function () {
            return this.params
        },
        this.getParam = function (a) {
            return this.params[a] || ""
        },
        this.clearParams = function () {
            this.params = {}
        },
        this.getNBits = function () {
            return this.params.nBits
        },
        this.getOutput = function () {
            return this.params.dataOut
        },
        this.setError = function (a) {
            this.error = a
        },
        this.appendError = function (a) {
            return this.errors += a,
                ""
        },
        this.getErrors = function () {
            return this.errors
        },
        this.isError = function () {
            return this.errors.length > 0 ? !0 : !1
        },
        this.appendInfo = function (a) {
            return this.infos += a,
                ""
        },
        this.getInfos = function () {
            return this.infos
        },
        this.setDebug = function (a) {
            this.debug = a
        },
        this.appendDebug = function (a) {
            return this.debugMsg += a,
                ""
        },
        this.isDebug = function () {
            return this.debug
        },
        this.getAllMessages = function (a) {
            var b = {
                lf: "\n",
                clr_mes: !1,
                verbose: 15
            };
            a || (a = b);
            for (var c in b)"undefined" == typeof a[c] && (a[c] = b[c]);
            var d = "",
                e = "";
            for (var f in this.params) {
                switch (f) {
                    case "encryptOut":
                        e = pidCryptUtil.toByteArray(this.params[f].toString()),
                            e = pidCryptUtil.fragment(e.join(), 64, a.lf);
                        break;
                    case "key":
                    case "iv":
                        e = pidCryptUtil.formatHex(this.params[f], 48);
                        break;
                    default:
                        e = pidCryptUtil.fragment(this.params[f].toString(), 64, a.lf)
                }
                d += "<p><b>" + f + "</b>:<pre>" + e + "</pre></p>"
            }
            return this.debug && (d += "debug: " + this.debug + a.lf),
            this.errors.length > 0 && 1 == (1 & a.verbose) && (d += "Errors:" + a.lf + this.errors + a.lf),
            this.warnings.length > 0 && 2 == (2 & a.verbose) && (d += "Warnings:" + a.lf + this.warnings + a.lf),
            this.infos.length > 0 && 4 == (4 & a.verbose) && (d += "Infos:" + a.lf + this.infos + a.lf),
            this.debug && 8 == (8 & a.verbose) && (d += "Debug messages:" + a.lf + this.debugMsg + a.lf),
            a.clr_mes && (this.errors = this.infos = this.warnings = this.debug = ""),
                d
        },
        this.getRandomBytes = function (b) {
            return a(b)
        }
}
pidCryptUtil = {},
    pidCryptUtil.encodeBase64 = function (a, b) {
        a || (a = "");
        var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        b = "undefined" == typeof b ? !1 : b;
        var d, e, f, g, h, i, j, k, n, o, p, l = [],
            m = "";
        if (o = b ? pidCryptUtil.encodeUTF8(a) : a, n = o.length % 3, n > 0) for (; n++ < 3;) m += "=",
            o += "\0";
        for (n = 0; n < o.length; n += 3) d = o.charCodeAt(n),
            e = o.charCodeAt(n + 1),
            f = o.charCodeAt(n + 2),
            g = d << 16 | e << 8 | f,
            h = 63 & g >> 18,
            i = 63 & g >> 12,
            j = 63 & g >> 6,
            k = 63 & g,
            l[n / 3] = c.charAt(h) + c.charAt(i) + c.charAt(j) + c.charAt(k);
        return p = l.join(""),
            p = p.slice(0, p.length - m.length) + m
    },
    pidCryptUtil.decodeBase64 = function (a, b) {
        a || (a = "");
        var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        b = "undefined" == typeof b ? !1 : b;
        var d, e, f, g, h, i, j, k, m, n, l = [];
        n = b ? pidCryptUtil.decodeUTF8(a) : a;
        for (var o = 0; o < n.length; o += 4) g = c.indexOf(n.charAt(o)),
            h = c.indexOf(n.charAt(o + 1)),
            i = c.indexOf(n.charAt(o + 2)),
            j = c.indexOf(n.charAt(o + 3)),
            k = g << 18 | h << 12 | i << 6 | j,
            d = 255 & k >>> 16,
            e = 255 & k >>> 8,
            f = 255 & k,
            l[o / 4] = String.fromCharCode(d, e, f),
        64 == j && (l[o / 4] = String.fromCharCode(d, e)),
        64 == i && (l[o / 4] = String.fromCharCode(d));
        return m = l.join(""),
            m = b ? pidCryptUtil.decodeUTF8(m) : m
    },
    pidCryptUtil.encodeUTF8 = function (a) {
        return a || (a = ""),
            a = a.replace(/[\u0080-\u07ff]/g, function (a) {
                var b = a.charCodeAt(0);
                return String.fromCharCode(192 | b >> 6, 128 | 63 & b)
            }),
            a = a.replace(/[\u0800-\uffff]/g, function (a) {
                var b = a.charCodeAt(0);
                return String.fromCharCode(224 | b >> 12, 128 | 63 & b >> 6, 128 | 63 & b)
            })
    },
    pidCryptUtil.decodeUTF8 = function (a) {
        return a || (a = ""),
            a = a.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (a) {
                var b = (31 & a.charCodeAt(0)) << 6 | 63 & a.charCodeAt(1);
                return String.fromCharCode(b)
            }),
            a = a.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (a) {
                var b = (15 & a.charCodeAt(0)) << 12 | (63 & a.charCodeAt(1)) << 6 | 63 & a.charCodeAt(2);
                return String.fromCharCode(b)
            })
    },
    pidCryptUtil.convertToHex = function (a) {
        a || (a = "");
        for (var b = "", c = "", d = 0; d < a.length; d++) c = a.charCodeAt(d).toString(16),
            b += 1 == c.length ? "0" + c : c;
        return b
    },
    pidCryptUtil.convertFromHex = function (a) {
        a || (a = "");
        for (var b = "", c = 0; c < a.length; c += 2) b += String.fromCharCode(parseInt(a.substring(c, c + 2), 16));
        return b
    },
    pidCryptUtil.stripLineFeeds = function (a) {
        a || (a = "");
        var b = "";
        return b = a.replace(/\n/g, ""),
            b = b.replace(/\r/g, "")
    },
    pidCryptUtil.toByteArray = function (a) {
        a || (a = "");
        for (var b = [], c = 0; c < a.length; c++) b[c] = a.charCodeAt(c);
        return b
    },
    pidCryptUtil.fragment = function (a, b, c) {
        if (a || (a = ""), !b || b >= a.length) return a;
        c || (c = "\n");
        for (var d = "", e = 0; e < a.length; e += b) d += a.substr(e, b) + c;
        return d
    },
    pidCryptUtil.formatHex = function (a, b) {
        a || (a = ""),
        b || (b = 45);
        for (var c = "", e = a.toLowerCase(), f = 0; f < e.length; f += 2) c += e.substr(f, 2) + ":";
        return e = this.fragment(c, b)
    },
    pidCryptUtil.byteArray2String = function (a) {
        for (var b = "", c = 0; c < a.length; c++) b += String.fromCharCode(a[c]);
        return b
    };

function Stream(a, b) {
    a instanceof Stream ? (this.enc = a.enc, this.pos = a.pos) : (this.enc = a, this.pos = b)
}
Stream.prototype.parseStringHex = function (a, b) {
    "undefined" == typeof b && (b = this.enc.length);
    for (var c = "", d = a; b > d; ++d) {
        var e = this.get(d);
        c += this.hexDigits.charAt(e >> 4) + this.hexDigits.charAt(15 & e)
    }
    return c
},
    Stream.prototype.get = function (a) {
        if (void 0 == a && (a = this.pos++), a >= this.enc.length) throw "Requesting byte offset " + a + " on a stream of length " + this.enc.length;
        return this.enc[a]
    },
    Stream.prototype.hexDigits = "0123456789ABCDEF",
    Stream.prototype.hexDump = function (a, b) {
        for (var c = "", d = a; b > d; ++d) {
            var e = this.get(d);
            c += this.hexDigits.charAt(e >> 4) + this.hexDigits.charAt(15 & e),
            7 == (15 & d) && (c += " "),
                c += 15 == (15 & d) ? "\n" : " "
        }
        return c
    },
    Stream.prototype.parseStringISO = function (a, b) {
        for (var c = "", d = a; b > d; ++d) c += String.fromCharCode(this.get(d));
        return c
    },
    Stream.prototype.parseStringUTF = function (a, b) {
        for (var c = "", d = 0, e = a; b > e;) {
            var d = this.get(e++);
            c += 128 > d ? String.fromCharCode(d) : d > 191 && 224 > d ? String.fromCharCode((31 & d) << 6 | 63 & this.get(e++)) : String.fromCharCode((15 & d) << 12 | (63 & this.get(e++)) << 6 | 63 & this.get(e++))
        }
        return c
    },
    Stream.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,
    Stream.prototype.parseTime = function (a, b) {
        var c = this.parseStringISO(a, b),
            d = this.reTime.exec(c);
        return d ? (c = d[1] + "-" + d[2] + "-" + d[3] + " " + d[4], d[5] && (c += ":" + d[5], d[6] && (c += ":" + d[6], d[7] && (c += "." + d[7]))), d[8] && (c += " UTC", "Z" != d[8] && (c += d[8], d[9] && (c += ":" + d[9]))), c) : "Unrecognized time: " + c
    },
    Stream.prototype.parseInteger = function (a, b) {
        if (b - a > 4) return void 0;
        for (var c = 0, d = a; b > d; ++d) c = c << 8 | this.get(d);
        return c
    },
    Stream.prototype.parseOID = function (a, b) {
        for (var c, d = 0, e = 0, f = a; b > f; ++f) {
            var g = this.get(f);
            d = d << 7 | 127 & g,
                e += 7,
            128 & g || (void 0 == c ? c = parseInt(d / 40) + "." + d % 40 : c += "." + (e >= 31 ? "big" : d), d = e = 0),
                c += String.fromCharCode()
        }
        return c
    },
"undefined" != typeof pidCrypt && (pidCrypt.ASN1 = function (a, b, c, d, e) {
    this.stream = a,
        this.header = b,
        this.length = c,
        this.tag = d,
        this.sub = e
}, pidCrypt.ASN1.prototype.toHexTree = function () {
    var a = {};
    if (a.type = this.typeName(), "SEQUENCE" != a.type && (a.value = this.stream.parseStringHex(this.posContent(), this.posEnd())), null != this.sub) {
        a.sub = [];
        for (var b = 0, c = this.sub.length; c > b; ++b) a.sub[b] = this.sub[b].toHexTree()
    }
    return a
}, pidCrypt.ASN1.prototype.typeName = function () {
    if (void 0 == this.tag) return "unknown";
    var a = this.tag >> 6;
    1 & this.tag >> 5;
    var c = 31 & this.tag;
    switch (a) {
        case 0:
            switch (c) {
                case 0:
                    return "EOC";
                case 1:
                    return "BOOLEAN";
                case 2:
                    return "INTEGER";
                case 3:
                    return "BIT_STRING";
                case 4:
                    return "OCTET_STRING";
                case 5:
                    return "NULL";
                case 6:
                    return "OBJECT_IDENTIFIER";
                case 7:
                    return "ObjectDescriptor";
                case 8:
                    return "EXTERNAL";
                case 9:
                    return "REAL";
                case 10:
                    return "ENUMERATED";
                case 11:
                    return "EMBEDDED_PDV";
                case 12:
                    return "UTF8String";
                case 16:
                    return "SEQUENCE";
                case 17:
                    return "SET";
                case 18:
                    return "NumericString";
                case 19:
                    return "PrintableString";
                case 20:
                    return "TeletexString";
                case 21:
                    return "VideotexString";
                case 22:
                    return "IA5String";
                case 23:
                    return "UTCTime";
                case 24:
                    return "GeneralizedTime";
                case 25:
                    return "GraphicString";
                case 26:
                    return "VisibleString";
                case 27:
                    return "GeneralString";
                case 28:
                    return "UniversalString";
                case 30:
                    return "BMPString";
                default:
                    return "Universal_" + c.toString(16)
            }
        case 1:
            return "Application_" + c.toString(16);
        case 2:
            return "[" + c + "]";
        case 3:
            return "Private_" + c.toString(16)
    }
}, pidCrypt.ASN1.prototype.content = function () {
    if (void 0 == this.tag) return null;
    var a = this.tag >> 6;
    if (0 != a) return null;
    var b = 31 & this.tag,
        c = this.posContent(),
        d = Math.abs(this.length);
    switch (b) {
        case 1:
            return 0 == this.stream.get(c) ? "false" : "true";
        case 2:
            return this.stream.parseInteger(c, c + d);
        case 6:
            return this.stream.parseOID(c, c + d);
        case 12:
            return this.stream.parseStringUTF(c, c + d);
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 26:
            return this.stream.parseStringISO(c, c + d);
        case 23:
        case 24:
            return this.stream.parseTime(c, c + d)
    }
    return null
}, pidCrypt.ASN1.prototype.toString = function () {
    return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null == this.sub ? "null" : this.sub.length) + "]"
}, pidCrypt.ASN1.prototype.print = function (a) {
    if (void 0 == a && (a = ""), document.writeln(a + this), null != this.sub) {
        a += "  ";
        for (var b = 0, c = this.sub.length; c > b; ++b) this.sub[b].print(a)
    }
}, pidCrypt.ASN1.prototype.toPrettyString = function (a) {
    void 0 == a && (a = "");
    var b = a + this.typeName() + " @" + this.stream.pos;
    if (this.length >= 0 && (b += "+"), b += this.length, 32 & this.tag ? b += " (constructed)" : 3 != this.tag && 4 != this.tag || null == this.sub || (b += " (encapsulates)"), b += "\n", null != this.sub) {
        a += "  ";
        for (var c = 0, d = this.sub.length; d > c; ++c) b += this.sub[c].toPrettyString(a)
    }
    return b
}, pidCrypt.ASN1.prototype.toDOM = function () {
    var a = document.createElement("div");
    a.className = "node",
        a.asn1 = this;
    var b = document.createElement("div");
    b.className = "head";
    var c = this.typeName();
    b.innerHTML = c,
        a.appendChild(b),
        this.head = b;
    var d = document.createElement("div");
    d.className = "value",
        c = "Offset: " + this.stream.pos + "<br/>",
        c += "Length: " + this.header + "+",
        c += this.length >= 0 ? this.length : -this.length + " (undefined)",
        32 & this.tag ? c += "<br/>(constructed)" : 3 != this.tag && 4 != this.tag || null == this.sub || (c += "<br/>(encapsulates)");
    var e = this.content();
    if (null != e && (c += "<br/>Value:<br/><b>" + e + "</b>", "object" == typeof oids && 6 == this.tag)) {
        var f = oids[e];
        f && (f.d && (c += "<br/>" + f.d), f.c && (c += "<br/>" + f.c), f.w && (c += "<br/>(warning!)"))
    }
    d.innerHTML = c,
        a.appendChild(d);
    var g = document.createElement("div");
    if (g.className = "sub", null != this.sub) for (var h = 0, i = this.sub.length; i > h; ++h) g.appendChild(this.sub[h].toDOM());
    return a.appendChild(g),
        b.switchNode = a,
        b.onclick = function () {
            var a = this.switchNode;
            a.className = "node collapsed" == a.className ? "node" : "node collapsed"
        },
        a
}, pidCrypt.ASN1.prototype.posStart = function () {
    return this.stream.pos
}, pidCrypt.ASN1.prototype.posContent = function () {
    return this.stream.pos + this.header
}, pidCrypt.ASN1.prototype.posEnd = function () {
    return this.stream.pos + this.header + Math.abs(this.length)
}, pidCrypt.ASN1.prototype.toHexDOM_sub = function (a, b, c, d, e) {
    if (!(d >= e)) {
        var f = document.createElement("span");
        f.className = b,
            f.appendChild(document.createTextNode(c.hexDump(d, e))),
            a.appendChild(f)
    }
}, pidCrypt.ASN1.prototype.toHexDOM = function () {
    var a = document.createElement("span");
    if (a.className = "hex", this.head.hexNode = a, this.head.onmouseover = function () {
            this.hexNode.className = "hexCurrent"
        }, this.head.onmouseout = function () {
            this.hexNode.className = "hex"
        }, this.toHexDOM_sub(a, "tag", this.stream, this.posStart(), this.posStart() + 1), this.toHexDOM_sub(a, this.length >= 0 ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent()), null == this.sub) a.appendChild(document.createTextNode(this.stream.hexDump(this.posContent(), this.posEnd())));
    else if (this.sub.length > 0) {
        var b = this.sub[0],
            c = this.sub[this.sub.length - 1];
        this.toHexDOM_sub(a, "intro", this.stream, this.posContent(), b.posStart());
        for (var d = 0, e = this.sub.length; e > d; ++d) a.appendChild(this.sub[d].toHexDOM());
        this.toHexDOM_sub(a, "outro", this.stream, c.posEnd(), this.posEnd())
    }
    return a
}, pidCrypt.ASN1.decodeLength = function (a) {
    var b = a.get(),
        c = 127 & b;
    if (c == b) return c;
    if (c > 3) throw "Length over 24 bits not supported at position " + (a.pos - 1);
    if (0 == c) return -1;
    b = 0;
    for (var d = 0; c > d; ++d) b = b << 8 | a.get();
    return b
}, pidCrypt.ASN1.hasContent = function (a, b, c) {
    if (32 & a) return !0;
    if (3 > a || a > 4) return !1;
    var d = new Stream(c);
    3 == a && d.get();
    var e = d.get();
    if (1 & e >> 6) return !1;
    try {
        var f = pidCrypt.ASN1.decodeLength(d);
        return d.pos - c.pos + f == b
    } catch (g) {
        return !1
    }
}, pidCrypt.ASN1.decode = function (a) {
    a instanceof Stream || (a = new Stream(a, 0));
    var b = new Stream(a),
        c = a.get(),
        d = pidCrypt.ASN1.decodeLength(a),
        e = a.pos - b.pos,
        f = null;
    if (pidCrypt.ASN1.hasContent(c, d, a)) {
        var g = a.pos;
        if (3 == c && a.get(), f = [], d >= 0) {
            for (var h = g + d; a.pos < h;) f[f.length] = pidCrypt.ASN1.decode(a);
            if (a.pos != h) throw "Content size is not correct for container starting at offset " + g
        } else try {
            for (;;) {
                var i = pidCrypt.ASN1.decode(a);
                if (0 == i.tag) break;
                f[f.length] = i
            }
            d = g - a.pos
        } catch (j) {
            throw "Exception while decoding undefined length content: " + j
        }
    } else a.pos += d;
    return new pidCrypt.ASN1(b, e, d, c, f)
}, pidCrypt.ASN1.test = function () {
    for (var a = [{
        value: [39],
        expected: 39
    },
        {
            value: [129, 201],
            expected: 201
        },
        {
            value: [131, 254, 220, 186],
            expected: 16702650
        }], b = 0, c = a.length; c > b; ++b) {
        var e = new Stream(a[b].value, 0),
            f = pidCrypt.ASN1.decodeLength(e);
        f != a[b].expected && document.write("In test[" + b + "] expected " + a[b].expected + " got " + f + "\n")
    }
});

function BigInteger(a, b, c) {
    null != a && ("number" == typeof a ? this.fromNumber(a, b, c) : null == b && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, b))
}
function nbi() {
    return new BigInteger(null)
}
function am1(a, b, c, d, e, f) {
    for (; --f >= 0;) {
        var g = b * this[a++] + c[d] + e;
        e = Math.floor(g / 67108864),
            c[d++] = 67108863 & g
    }
    return e
}
function am2(a, b, c, d, e, f) {
    for (var g = 32767 & b, h = b >> 15; --f >= 0;) {
        var i = 32767 & this[a],
            j = this[a++] >> 15,
            k = h * i + j * g;
        i = g * i + ((32767 & k) << 15) + c[d] + (1073741823 & e),
            e = (i >>> 30) + (k >>> 15) + h * j + (e >>> 30),
            c[d++] = 1073741823 & i
    }
    return e
}
function am3(a, b, c, d, e, f) {
    for (var g = 16383 & b, h = b >> 14; --f >= 0;) {
        var i = 16383 & this[a],
            j = this[a++] >> 14,
            k = h * i + j * g;
        i = g * i + ((16383 & k) << 14) + c[d] + e,
            e = (i >> 28) + (k >> 14) + h * j,
            c[d++] = 268435455 & i
    }
    return e
}
function int2char(a) {
    return BI_RM.charAt(a)
}
function intAt(a, b) {
    var c = BI_RC[a.charCodeAt(b)];
    return null == c ? -1 : c
}
function bnpCopyTo(a) {
    for (var b = this.t - 1; b >= 0; --b) a[b] = this[b];
    a.t = this.t,
        a.s = this.s
}
function bnpFromInt(a) {
    this.t = 1,
        this.s = 0 > a ? -1 : 0,
        a > 0 ? this[0] = a : -1 > a ? this[0] = a + DV : this.t = 0
}
function nbv(a) {
    var b = nbi();
    return b.fromInt(a),
        b
}
function bnpFromString(a, b) {
    var c;
    if (16 == b) c = 4;
    else if (8 == b) c = 3;
    else if (256 == b) c = 8;
    else if (2 == b) c = 1;
    else if (32 == b) c = 5;
    else {
        if (4 != b) return this.fromRadix(a, b),
            void 0;
        c = 2
    }
    this.t = 0,
        this.s = 0;
    for (var d = a.length, e = !1, f = 0; --d >= 0;) {
        var g = 8 == c ? 255 & a[d] : intAt(a, d);
        0 > g ? "-" == a.charAt(d) && (e = !0) : (e = !1, 0 == f ? this[this.t++] = g : f + c > this.DB ? (this[this.t - 1] |= (g & (1 << this.DB - f) - 1) << f, this[this.t++] = g >> this.DB - f) : this[this.t - 1] |= g << f, f += c, f >= this.DB && (f -= this.DB))
    }
    8 == c && 0 != (128 & a[0]) && (this.s = -1, f > 0 && (this[this.t - 1] |= (1 << this.DB - f) - 1 << f)),
        this.clamp(),
    e && BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
    for (var a = this.s & this.DM; this.t > 0 && this[this.t - 1] == a;)--this.t
}
function bnToString(a) {
    if (this.s < 0) return "-" + this.negate().toString(a);
    var b;
    if (16 == a) b = 4;
    else if (8 == a) b = 3;
    else if (2 == a) b = 1;
    else if (32 == a) b = 5;
    else {
        if (4 != a) return this.toRadix(a);
        b = 2
    }
    var d, c = (1 << b) - 1,
        e = !1,
        f = "",
        g = this.t,
        h = this.DB - g * this.DB % b;
    if (g-- > 0) for (h < this.DB && (d = this[g] >> h) > 0 && (e = !0, f = int2char(d)); g >= 0;) b > h ? (d = (this[g] & (1 << h) - 1) << b - h, d |= this[--g] >> (h += this.DB - b)) : (d = this[g] >> (h -= b) & c, 0 >= h && (h += this.DB, --g)),
    d > 0 && (e = !0),
    e && (f += int2char(d));
    return e ? f : "0"
}
function bnNegate() {
    var a = nbi();
    return BigInteger.ZERO.subTo(this, a),
        a
}
function bnAbs() {
    return this.s < 0 ? this.negate() : this
}
function bnCompareTo(a) {
    var b = this.s - a.s;
    if (0 != b) return b;
    var c = this.t;
    if (b = c - a.t, 0 != b) return b;
    for (; --c >= 0;) if (0 != (b = this[c] - a[c])) return b;
    return 0
}
function nbits(a) {
    var c, b = 1;
    return 0 != (c = a >>> 16) && (a = c, b += 16),
    0 != (c = a >> 8) && (a = c, b += 8),
    0 != (c = a >> 4) && (a = c, b += 4),
    0 != (c = a >> 2) && (a = c, b += 2),
    0 != (c = a >> 1) && (a = c, b += 1),
        b
}
function bnBitLength() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}
function bnpDLShiftTo(a, b) {
    var c;
    for (c = this.t - 1; c >= 0; --c) b[c + a] = this[c];
    for (c = a - 1; c >= 0; --c) b[c] = 0;
    b.t = this.t + a,
        b.s = this.s
}
function bnpDRShiftTo(a, b) {
    for (var c = a; c < this.t; ++c) b[c - a] = this[c];
    b.t = Math.max(this.t - a, 0),
        b.s = this.s
}
function bnpLShiftTo(a, b) {
    var h, c = a % this.DB,
        d = this.DB - c,
        e = (1 << d) - 1,
        f = Math.floor(a / this.DB),
        g = this.s << c & this.DM;
    for (h = this.t - 1; h >= 0; --h) b[h + f + 1] = this[h] >> d | g,
        g = (this[h] & e) << c;
    for (h = f - 1; h >= 0; --h) b[h] = 0;
    b[f] = g,
        b.t = this.t + f + 1,
        b.s = this.s,
        b.clamp()
}
function bnpRShiftTo(a, b) {
    b.s = this.s;
    var c = Math.floor(a / this.DB);
    if (c >= this.t) return b.t = 0,
        void 0;
    var d = a % this.DB,
        e = this.DB - d,
        f = (1 << d) - 1;
    b[0] = this[c] >> d;
    for (var g = c + 1; g < this.t; ++g) b[g - c - 1] |= (this[g] & f) << e,
        b[g - c] = this[g] >> d;
    d > 0 && (b[this.t - c - 1] |= (this.s & f) << e),
        b.t = this.t - c,
        b.clamp()
}
function bnpSubTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); e > c;) d += this[c] - a[c],
        b[c++] = d & this.DM,
        d >>= this.DB;
    if (a.t < this.t) {
        for (d -= a.s; c < this.t;) d += this[c],
            b[c++] = d & this.DM,
            d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d -= a[c],
            b[c++] = d & this.DM,
            d >>= this.DB;
        d -= a.s
    }
    b.s = 0 > d ? -1 : 0,
        -1 > d ? b[c++] = this.DV + d : d > 0 && (b[c++] = d),
        b.t = c,
        b.clamp()
}
function bnpMultiplyTo(a, b) {
    var c = this.abs(),
        d = a.abs(),
        e = c.t;
    for (b.t = e + d.t; --e >= 0;) b[e] = 0;
    for (e = 0; e < d.t; ++e) b[e + c.t] = c.am(0, d[e], b, e, 0, c.t);
    b.s = 0,
        b.clamp(),
    this.s != a.s && BigInteger.ZERO.subTo(b, b)
}
function bnpSquareTo(a) {
    for (var b = this.abs(), c = a.t = 2 * b.t; --c >= 0;) a[c] = 0;
    for (c = 0; c < b.t - 1; ++c) {
        var d = b.am(c, b[c], a, 2 * c, 0, 1);
        (a[c + b.t] += b.am(c + 1, 2 * b[c], a, 2 * c + 1, d, b.t - c - 1)) >= b.DV && (a[c + b.t] -= b.DV, a[c + b.t + 1] = 1)
    }
    a.t > 0 && (a[a.t - 1] += b.am(c, b[c], a, 2 * c, 0, 1)),
        a.s = 0,
        a.clamp()
}
function bnpDivRemTo(a, b, c) {
    var d = a.abs();
    if (!(d.t <= 0)) {
        var e = this.abs();
        if (e.t < d.t) return null != b && b.fromInt(0),
        null != c && this.copyTo(c),
            void 0;
        null == c && (c = nbi());
        var f = nbi(),
            g = this.s,
            h = a.s,
            i = this.DB - nbits(d[d.t - 1]);
        i > 0 ? (d.lShiftTo(i, f), e.lShiftTo(i, c)) : (d.copyTo(f), e.copyTo(c));
        var j = f.t,
            k = f[j - 1];
        if (0 != k) {
            var l = k * (1 << this.F1) + (j > 1 ? f[j - 2] >> this.F2 : 0),
                m = this.FV / l,
                n = (1 << this.F1) / l,
                o = 1 << this.F2,
                p = c.t,
                q = p - j,
                r = null == b ? nbi() : b;
            for (f.dlShiftTo(q, r), c.compareTo(r) >= 0 && (c[c.t++] = 1, c.subTo(r, c)), BigInteger.ONE.dlShiftTo(j, r), r.subTo(f, f); f.t < j;) f[f.t++] = 0;
            for (; --q >= 0;) {
                var s = c[--p] == k ? this.DM : Math.floor(c[p] * m + (c[p - 1] + o) * n);
                if ((c[p] += f.am(0, s, c, q, 0, j)) < s) for (f.dlShiftTo(q, r), c.subTo(r, c); c[p] < --s;) c.subTo(r, c)
            }
            null != b && (c.drShiftTo(j, b), g != h && BigInteger.ZERO.subTo(b, b)),
                c.t = j,
                c.clamp(),
            i > 0 && c.rShiftTo(i, c),
            0 > g && BigInteger.ZERO.subTo(c, c)
        }
    }
}
function bnMod(a) {
    var b = nbi();
    return this.abs().divRemTo(a, null, b),
    this.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && a.subTo(b, b),
        b
}
function Classic(a) {
    this.m = a
}
function cConvert(a) {
    return a.s < 0 || a.compareTo(this.m) >= 0 ? a.mod(this.m) : a
}
function cRevert(a) {
    return a
}
function cReduce(a) {
    a.divRemTo(this.m, null, a)
}
function cMulTo(a, b, c) {
    a.multiplyTo(b, c),
        this.reduce(c)
}
function cSqrTo(a, b) {
    a.squareTo(b),
        this.reduce(b)
}
function bnpInvDigit() {
    if (this.t < 1) return 0;
    var a = this[0];
    if (0 == (1 & a)) return 0;
    var b = 3 & a;
    return b = 15 & b * (2 - (15 & a) * b),
        b = 255 & b * (2 - (255 & a) * b),
        b = 65535 & b * (2 - (65535 & (65535 & a) * b)),
        b = b * (2 - a * b % this.DV) % this.DV,
        b > 0 ? this.DV - b : -b
}
function Montgomery(a) {
    this.m = a,
        this.mp = a.invDigit(),
        this.mpl = 32767 & this.mp,
        this.mph = this.mp >> 15,
        this.um = (1 << a.DB - 15) - 1,
        this.mt2 = 2 * a.t
}
function montConvert(a) {
    var b = nbi();
    return a.abs().dlShiftTo(this.m.t, b),
        b.divRemTo(this.m, null, b),
    a.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(b, b),
        b
}
function montRevert(a) {
    var b = nbi();
    return a.copyTo(b),
        this.reduce(b),
        b
}
function montReduce(a) {
    for (; a.t <= this.mt2;) a[a.t++] = 0;
    for (var b = 0; b < this.m.t; ++b) {
        var c = 32767 & a[b],
            d = c * this.mpl + ((c * this.mph + (a[b] >> 15) * this.mpl & this.um) << 15) & a.DM;
        for (c = b + this.m.t, a[c] += this.m.am(0, d, a, b, 0, this.m.t); a[c] >= a.DV;) a[c] -= a.DV,
            a[++c]++
    }
    a.clamp(),
        a.drShiftTo(this.m.t, a),
    a.compareTo(this.m) >= 0 && a.subTo(this.m, a)
}
function montSqrTo(a, b) {
    a.squareTo(b),
        this.reduce(b)
}
function montMulTo(a, b, c) {
    a.multiplyTo(b, c),
        this.reduce(c)
}
function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}
function bnpExp(a, b) {
    if (a > 4294967295 || 1 > a) return BigInteger.ONE;
    var c = nbi(),
        d = nbi(),
        e = b.convert(this),
        f = nbits(a) - 1;
    for (e.copyTo(c); --f >= 0;) if (b.sqrTo(c, d), (a & 1 << f) > 0) b.mulTo(d, e, c);
    else {
        var g = c;
        c = d,
            d = g
    }
    return b.revert(c)
}
function bnModPowInt(a, b) {
    var c;
    return c = 256 > a || b.isEven() ? new Classic(b) : new Montgomery(b),
        this.exp(a, c)
}
function bnClone() {
    var a = nbi();
    return this.copyTo(a),
        a
}
function bnIntValue() {
    if (this.s < 0) {
        if (1 == this.t) return this[0] - this.DV;
        if (0 == this.t) return -1
    } else {
        if (1 == this.t) return this[0];
        if (0 == this.t) return 0
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}
function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24
}
function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16
}
function bnpChunkSize(a) {
    return Math.floor(Math.LN2 * this.DB / Math.log(a))
}
function bnSigNum() {
    return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
}
function bnpToRadix(a) {
    if (null == a && (a = 10), 0 == this.signum() || 2 > a || a > 36) return "0";
    var b = this.chunkSize(a),
        c = Math.pow(a, b),
        d = nbv(c),
        e = nbi(),
        f = nbi(),
        g = "";
    for (this.divRemTo(d, e, f); e.signum() > 0;) g = (c + f.intValue()).toString(a).substr(1) + g,
        e.divRemTo(d, e, f);
    return f.intValue().toString(a) + g
}
function bnpFromRadix(a, b) {
    this.fromInt(0),
    null == b && (b = 10);
    for (var c = this.chunkSize(b), d = Math.pow(b, c), e = !1, f = 0, g = 0, h = 0; h < a.length; ++h) {
        var i = intAt(a, h);
        0 > i ? "-" == a.charAt(h) && 0 == this.signum() && (e = !0) : (g = b * g + i, ++f >= c && (this.dMultiply(d), this.dAddOffset(g, 0), f = 0, g = 0))
    }
    f > 0 && (this.dMultiply(Math.pow(b, f)), this.dAddOffset(g, 0)),
    e && BigInteger.ZERO.subTo(this, this)
}
function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) if (2 > a) this.fromInt(1);
    else for (this.fromNumber(a, c), this.testBit(a - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(b);) this.dAddOffset(2, 0),
        this.bitLength() > a && this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
    else {
        var d = new Array,
            e = 7 & a;
        d.length = (a >> 3) + 1,
            b.nextBytes(d),
            e > 0 ? d[0] &= (1 << e) - 1 : d[0] = 0,
            this.fromString(d, 256)
    }
}
function bnToByteArray() {
    var a = this.t,
        b = new Array;
    b[0] = this.s;
    var d, c = this.DB - a * this.DB % 8,
        e = 0;
    if (a-- > 0) for (c < this.DB && (d = this[a] >> c) != (this.s & this.DM) >> c && (b[e++] = d | this.s << this.DB - c); a >= 0;) 8 > c ? (d = (this[a] & (1 << c) - 1) << 8 - c, d |= this[--a] >> (c += this.DB - 8)) : (d = 255 & this[a] >> (c -= 8), 0 >= c && (c += this.DB, --a)),
    0 != (128 & d) && (d |= -256),
    0 == e && (128 & this.s) != (128 & d) && ++e,
    (e > 0 || d != this.s) && (b[e++] = d);
    return b
}
function bnEquals(a) {
    return 0 == this.compareTo(a)
}
function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a
}
function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a
}
function bnpBitwiseTo(a, b, c) {
    var d, e, f = Math.min(a.t, this.t);
    for (d = 0; f > d; ++d) c[d] = b(this[d], a[d]);
    if (a.t < this.t) {
        for (e = a.s & this.DM, d = f; d < this.t; ++d) c[d] = b(this[d], e);
        c.t = this.t
    } else {
        for (e = this.s & this.DM, d = f; d < a.t; ++d) c[d] = b(e, a[d]);
        c.t = a.t
    }
    c.s = b(this.s, a.s),
        c.clamp()
}
function op_and(a, b) {
    return a & b
}
function bnAnd(a) {
    var b = nbi();
    return this.bitwiseTo(a, op_and, b),
        b
}
function op_or(a, b) {
    return a | b
}
function bnOr(a) {
    var b = nbi();
    return this.bitwiseTo(a, op_or, b),
        b
}
function op_xor(a, b) {
    return a ^ b
}
function bnXor(a) {
    var b = nbi();
    return this.bitwiseTo(a, op_xor, b),
        b
}
function op_andnot(a, b) {
    return a & ~b
}
function bnAndNot(a) {
    var b = nbi();
    return this.bitwiseTo(a, op_andnot, b),
        b
}
function bnNot() {
    for (var a = nbi(), b = 0; b < this.t; ++b) a[b] = this.DM & ~this[b];
    return a.t = this.t,
        a.s = ~this.s,
        a
}
function bnShiftLeft(a) {
    var b = nbi();
    return 0 > a ? this.rShiftTo(-a, b) : this.lShiftTo(a, b),
        b
}
function bnShiftRight(a) {
    var b = nbi();
    return 0 > a ? this.lShiftTo(-a, b) : this.rShiftTo(a, b),
        b
}
function lbit(a) {
    if (0 == a) return -1;
    var b = 0;
    return 0 == (65535 & a) && (a >>= 16, b += 16),
    0 == (255 & a) && (a >>= 8, b += 8),
    0 == (15 & a) && (a >>= 4, b += 4),
    0 == (3 & a) && (a >>= 2, b += 2),
    0 == (1 & a) && ++b,
        b
}
function bnGetLowestSetBit() {
    for (var a = 0; a < this.t; ++a) if (0 != this[a]) return a * this.DB + lbit(this[a]);
    return this.s < 0 ? this.t * this.DB : -1
}
function cbit(a) {
    for (var b = 0; 0 != a;) a &= a - 1,
        ++b;
    return b
}
function bnBitCount() {
    for (var a = 0, b = this.s & this.DM, c = 0; c < this.t; ++c) a += cbit(this[c] ^ b);
    return a
}
function bnTestBit(a) {
    var b = Math.floor(a / this.DB);
    return b >= this.t ? 0 != this.s : 0 != (this[b] & 1 << a % this.DB)
}
function bnpChangeBit(a, b) {
    var c = BigInteger.ONE.shiftLeft(a);
    return this.bitwiseTo(c, b, c),
        c
}
function bnSetBit(a) {
    return this.changeBit(a, op_or)
}
function bnClearBit(a) {
    return this.changeBit(a, op_andnot)
}
function bnFlipBit(a) {
    return this.changeBit(a, op_xor)
}
function bnpAddTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); e > c;) d += this[c] + a[c],
        b[c++] = d & this.DM,
        d >>= this.DB;
    if (a.t < this.t) {
        for (d += a.s; c < this.t;) d += this[c],
            b[c++] = d & this.DM,
            d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d += a[c],
            b[c++] = d & this.DM,
            d >>= this.DB;
        d += a.s
    }
    b.s = 0 > d ? -1 : 0,
        d > 0 ? b[c++] = d : -1 > d && (b[c++] = this.DV + d),
        b.t = c,
        b.clamp()
}
function bnAdd(a) {
    var b = nbi();
    return this.addTo(a, b),
        b
}
function bnSubtract(a) {
    var b = nbi();
    return this.subTo(a, b),
        b
}
function bnMultiply(a) {
    var b = nbi();
    return this.multiplyTo(a, b),
        b
}
function bnDivide(a) {
    var b = nbi();
    return this.divRemTo(a, b, null),
        b
}
function bnRemainder(a) {
    var b = nbi();
    return this.divRemTo(a, null, b),
        b
}
function bnDivideAndRemainder(a) {
    var b = nbi(),
        c = nbi();
    return this.divRemTo(a, b, c),
        new Array(b, c)
}
function bnpDMultiply(a) {
    this[this.t] = this.am(0, a - 1, this, 0, 0, this.t),
        ++this.t,
        this.clamp()
}
function bnpDAddOffset(a, b) {
    for (; this.t <= b;) this[this.t++] = 0;
    for (this[b] += a; this[b] >= this.DV;) this[b] -= this.DV,
    ++b >= this.t && (this[this.t++] = 0),
        ++this[b]
}
function NullExp() {}
function nNop(a) {
    return a
}
function nMulTo(a, b, c) {
    a.multiplyTo(b, c)
}
function nSqrTo(a, b) {
    a.squareTo(b)
}
function bnPow(a) {
    return this.exp(a, new NullExp)
}
function bnpMultiplyLowerTo(a, b, c) {
    var d = Math.min(this.t + a.t, b);
    for (c.s = 0, c.t = d; d > 0;) c[--d] = 0;
    var e;
    for (e = c.t - this.t; e > d; ++d) c[d + this.t] = this.am(0, a[d], c, d, 0, this.t);
    for (e = Math.min(a.t, b); e > d; ++d) this.am(0, a[d], c, d, 0, b - d);
    c.clamp()
}
function bnpMultiplyUpperTo(a, b, c) {
    --b;
    var d = c.t = this.t + a.t - b;
    for (c.s = 0; --d >= 0;) c[d] = 0;
    for (d = Math.max(b - this.t, 0); d < a.t; ++d) c[this.t + d - b] = this.am(b - d, a[d], c, 0, 0, this.t + d - b);
    c.clamp(),
        c.drShiftTo(1, c)
}
function Barrett(a) {
    this.r2 = nbi(),
        this.q3 = nbi(),
        BigInteger.ONE.dlShiftTo(2 * a.t, this.r2),
        this.mu = this.r2.divide(a),
        this.m = a
}
function barrettConvert(a) {
    if (a.s < 0 || a.t > 2 * this.m.t) return a.mod(this.m);
    if (a.compareTo(this.m) < 0) return a;
    var b = nbi();
    return a.copyTo(b),
        this.reduce(b),
        b
}
function barrettRevert(a) {
    return a
}
function barrettReduce(a) {
    for (a.drShiftTo(this.m.t - 1, this.r2), a.t > this.m.t + 1 && (a.t = this.m.t + 1, a.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); a.compareTo(this.r2) < 0;) a.dAddOffset(1, this.m.t + 1);
    for (a.subTo(this.r2, a); a.compareTo(this.m) >= 0;) a.subTo(this.m, a)
}
function barrettSqrTo(a, b) {
    a.squareTo(b),
        this.reduce(b)
}
function barrettMulTo(a, b, c) {
    a.multiplyTo(b, c),
        this.reduce(c)
}
function bnModPow(a, b) {
    var d, f, c = a.bitLength(),
        e = nbv(1);
    if (0 >= c) return e;
    d = 18 > c ? 1 : 48 > c ? 3 : 144 > c ? 4 : 768 > c ? 5 : 6,
        f = 8 > c ? new Classic(b) : b.isEven() ? new Barrett(b) : new Montgomery(b);
    var g = new Array,
        h = 3,
        i = d - 1,
        j = (1 << d) - 1;
    if (g[1] = f.convert(this), d > 1) {
        var k = nbi();
        for (f.sqrTo(g[1], k); j >= h;) g[h] = nbi(),
            f.mulTo(k, g[h - 2], g[h]),
            h += 2
    }
    var m, p, l = a.t - 1,
        n = !0,
        o = nbi();
    for (c = nbits(a[l]) - 1; l >= 0;) {
        for (c >= i ? m = a[l] >> c - i & j : (m = (a[l] & (1 << c + 1) - 1) << i - c, l > 0 && (m |= a[l - 1] >> this.DB + c - i)), h = d; 0 == (1 & m);) m >>= 1,
            --h;
        if ((c -= h) < 0 && (c += this.DB, --l), n) g[m].copyTo(e),
            n = !1;
        else {
            for (; h > 1;) f.sqrTo(e, o),
                f.sqrTo(o, e),
                h -= 2;
            h > 0 ? f.sqrTo(e, o) : (p = e, e = o, o = p),
                f.mulTo(o, g[m], e)
        }
        for (; l >= 0 && 0 == (a[l] & 1 << c);) f.sqrTo(e, o),
            p = e,
            e = o,
            o = p,
        --c < 0 && (c = this.DB - 1, --l)
    }
    return f.revert(e)
}
function bnGCD(a) {
    var b = this.s < 0 ? this.negate() : this.clone(),
        c = a.s < 0 ? a.negate() : a.clone();
    if (b.compareTo(c) < 0) {
        var d = b;
        b = c,
            c = d
    }
    var e = b.getLowestSetBit(),
        f = c.getLowestSetBit();
    if (0 > f) return b;
    for (f > e && (f = e), f > 0 && (b.rShiftTo(f, b), c.rShiftTo(f, c)); b.signum() > 0;)(e = b.getLowestSetBit()) > 0 && b.rShiftTo(e, b),
    (e = c.getLowestSetBit()) > 0 && c.rShiftTo(e, c),
        b.compareTo(c) >= 0 ? (b.subTo(c, b), b.rShiftTo(1, b)) : (c.subTo(b, c), c.rShiftTo(1, c));
    return f > 0 && c.lShiftTo(f, c),
        c
}
function bnpModInt(a) {
    if (0 >= a) return 0;
    var b = this.DV % a,
        c = this.s < 0 ? a - 1 : 0;
    if (this.t > 0) if (0 == b) c = this[0] % a;
    else for (var d = this.t - 1; d >= 0; --d) c = (b * c + this[d]) % a;
    return c
}
function bnModInverse(a) {
    var b = a.isEven();
    if (this.isEven() && b || 0 == a.signum()) return BigInteger.ZERO;
    for (var c = a.clone(), d = this.clone(), e = nbv(1), f = nbv(0), g = nbv(0), h = nbv(1); 0 != c.signum();) {
        for (; c.isEven();) c.rShiftTo(1, c),
            b ? (e.isEven() && f.isEven() || (e.addTo(this, e), f.subTo(a, f)), e.rShiftTo(1, e)) : f.isEven() || f.subTo(a, f),
            f.rShiftTo(1, f);
        for (; d.isEven();) d.rShiftTo(1, d),
            b ? (g.isEven() && h.isEven() || (g.addTo(this, g), h.subTo(a, h)), g.rShiftTo(1, g)) : h.isEven() || h.subTo(a, h),
            h.rShiftTo(1, h);
        c.compareTo(d) >= 0 ? (c.subTo(d, c), b && e.subTo(g, e), f.subTo(h, f)) : (d.subTo(c, d), b && g.subTo(e, g), h.subTo(f, h))
    }
    return 0 != d.compareTo(BigInteger.ONE) ? BigInteger.ZERO : h.compareTo(a) >= 0 ? h.subtract(a) : h.signum() < 0 ? (h.addTo(a, h), h.signum() < 0 ? h.add(a) : h) : h
}
function bnIsProbablePrime(a) {
    var b, c = this.abs();
    if (1 == c.t && c[0] <= lowprimes[lowprimes.length - 1]) {
        for (b = 0; b < lowprimes.length; ++b) if (c[0] == lowprimes[b]) return !0;
        return !1
    }
    if (c.isEven()) return !1;
    for (b = 1; b < lowprimes.length;) {
        for (var d = lowprimes[b], e = b + 1; e < lowprimes.length && lplim > d;) d *= lowprimes[e++];
        for (d = c.modInt(d); e > b;) if (0 == d % lowprimes[b++]) return !1
    }
    return c.millerRabin(a)
}
function bnpMillerRabin(a) {
    var b = this.subtract(BigInteger.ONE),
        c = b.getLowestSetBit();
    if (0 >= c) return !1;
    var d = b.shiftRight(c);
    a = a + 1 >> 1,
    a > lowprimes.length && (a = lowprimes.length);
    for (var e = nbi(), f = 0; a > f; ++f) {
        e.fromInt(lowprimes[f]);
        var g = e.modPow(d, this);
        if (0 != g.compareTo(BigInteger.ONE) && 0 != g.compareTo(b)) {
            for (var h = 1; h++ < c && 0 != g.compareTo(b);) if (g = g.modPowInt(2, this), 0 == g.compareTo(BigInteger.ONE)) return !1;
            if (0 != g.compareTo(b)) return !1
        }
    }
    return !0
}
var dbits, canary = 0xdeadbeefcafe,
    j_lm = 15715070 == (16777215 & canary);
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2, dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1, dbits = 26) : (BigInteger.prototype.am = am3, dbits = 28),
    BigInteger.prototype.DB = dbits,
    BigInteger.prototype.DM = (1 << dbits) - 1,
    BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP),
    BigInteger.prototype.F1 = BI_FP - dbits,
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz",
    BI_RC = new Array,
    rr, vv;
for (rr = "0".charCodeAt(0), vv = 0; 9 >= vv; ++vv) BI_RC[rr++] = vv;
for (rr = "a".charCodeAt(0), vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;
for (rr = "A".charCodeAt(0), vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;
Classic.prototype.convert = cConvert,
    Classic.prototype.revert = cRevert,
    Classic.prototype.reduce = cReduce,
    Classic.prototype.mulTo = cMulTo,
    Classic.prototype.sqrTo = cSqrTo,
    Montgomery.prototype.convert = montConvert,
    Montgomery.prototype.revert = montRevert,
    Montgomery.prototype.reduce = montReduce,
    Montgomery.prototype.mulTo = montMulTo,
    Montgomery.prototype.sqrTo = montSqrTo,
    BigInteger.prototype.copyTo = bnpCopyTo,
    BigInteger.prototype.fromInt = bnpFromInt,
    BigInteger.prototype.fromString = bnpFromString,
    BigInteger.prototype.clamp = bnpClamp,
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo,
    BigInteger.prototype.drShiftTo = bnpDRShiftTo,
    BigInteger.prototype.lShiftTo = bnpLShiftTo,
    BigInteger.prototype.rShiftTo = bnpRShiftTo,
    BigInteger.prototype.subTo = bnpSubTo,
    BigInteger.prototype.multiplyTo = bnpMultiplyTo,
    BigInteger.prototype.squareTo = bnpSquareTo,
    BigInteger.prototype.divRemTo = bnpDivRemTo,
    BigInteger.prototype.invDigit = bnpInvDigit,
    BigInteger.prototype.isEven = bnpIsEven,
    BigInteger.prototype.exp = bnpExp,
    BigInteger.prototype.toString = bnToString,
    BigInteger.prototype.negate = bnNegate,
    BigInteger.prototype.abs = bnAbs,
    BigInteger.prototype.compareTo = bnCompareTo,
    BigInteger.prototype.bitLength = bnBitLength,
    BigInteger.prototype.mod = bnMod,
    BigInteger.prototype.modPowInt = bnModPowInt,
    BigInteger.ZERO = nbv(0),
    BigInteger.ONE = nbv(1),
    NullExp.prototype.convert = nNop,
    NullExp.prototype.revert = nNop,
    NullExp.prototype.mulTo = nMulTo,
    NullExp.prototype.sqrTo = nSqrTo,
    Barrett.prototype.convert = barrettConvert,
    Barrett.prototype.revert = barrettRevert,
    Barrett.prototype.reduce = barrettReduce,
    Barrett.prototype.mulTo = barrettMulTo,
    Barrett.prototype.sqrTo = barrettSqrTo;
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509],
    lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
BigInteger.prototype.chunkSize = bnpChunkSize,
    BigInteger.prototype.toRadix = bnpToRadix,
    BigInteger.prototype.fromRadix = bnpFromRadix,
    BigInteger.prototype.fromNumber = bnpFromNumber,
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo,
    BigInteger.prototype.changeBit = bnpChangeBit,
    BigInteger.prototype.addTo = bnpAddTo,
    BigInteger.prototype.dMultiply = bnpDMultiply,
    BigInteger.prototype.dAddOffset = bnpDAddOffset,
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo,
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo,
    BigInteger.prototype.modInt = bnpModInt,
    BigInteger.prototype.millerRabin = bnpMillerRabin,
    BigInteger.prototype.clone = bnClone,
    BigInteger.prototype.intValue = bnIntValue,
    BigInteger.prototype.byteValue = bnByteValue,
    BigInteger.prototype.shortValue = bnShortValue,
    BigInteger.prototype.signum = bnSigNum,
    BigInteger.prototype.toByteArray = bnToByteArray,
    BigInteger.prototype.equals = bnEquals,
    BigInteger.prototype.min = bnMin,
    BigInteger.prototype.max = bnMax,
    BigInteger.prototype.and = bnAnd,
    BigInteger.prototype.or = bnOr,
    BigInteger.prototype.xor = bnXor,
    BigInteger.prototype.andNot = bnAndNot,
    BigInteger.prototype.not = bnNot,
    BigInteger.prototype.shiftLeft = bnShiftLeft,
    BigInteger.prototype.shiftRight = bnShiftRight,
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit,
    BigInteger.prototype.bitCount = bnBitCount,
    BigInteger.prototype.testBit = bnTestBit,
    BigInteger.prototype.setBit = bnSetBit,
    BigInteger.prototype.clearBit = bnClearBit,
    BigInteger.prototype.flipBit = bnFlipBit,
    BigInteger.prototype.add = bnAdd,
    BigInteger.prototype.subtract = bnSubtract,
    BigInteger.prototype.multiply = bnMultiply,
    BigInteger.prototype.divide = bnDivide,
    BigInteger.prototype.remainder = bnRemainder,
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder,
    BigInteger.prototype.modPow = bnModPow,
    BigInteger.prototype.modInverse = bnModInverse,
    BigInteger.prototype.pow = bnPow,
    BigInteger.prototype.gcd = bnGCD,
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

function SecureRandom() {
    if (this.rng_state, this.rng_pool, this.rng_pptr, this.rng_seed_int = function (a) {
            this.rng_pool[this.rng_pptr++] ^= 255 & a,
                this.rng_pool[this.rng_pptr++] ^= 255 & a >> 8,
                this.rng_pool[this.rng_pptr++] ^= 255 & a >> 16,
                this.rng_pool[this.rng_pptr++] ^= 255 & a >> 24,
            this.rng_pptr >= rng_psize && (this.rng_pptr -= rng_psize)
        }, this.rng_seed_time = function () {
            this.rng_seed_int((new Date).getTime())
        }, null == this.rng_pool) {
        this.rng_pool = new Array,
            this.rng_pptr = 0;
        var a;
        if ("Netscape" == navigator.appName && navigator.appVersion < "5" && window.crypto) {
            var b = window.crypto.random(32);
            for (a = 0; a < b.length; ++a) this.rng_pool[this.rng_pptr++] = 255 & b.charCodeAt(a)
        }
        for (; this.rng_pptr < rng_psize;) a = Math.floor(65536 * Math.random()),
            this.rng_pool[this.rng_pptr++] = a >>> 8,
            this.rng_pool[this.rng_pptr++] = 255 & a;
        this.rng_pptr = 0,
            this.rng_seed_time()
    }
    this.rng_get_byte = function () {
        if (null == this.rng_state) {
            for (this.rng_seed_time(), this.rng_state = prng_newstate(), this.rng_state.init(this.rng_pool), this.rng_pptr = 0; this.rng_pptr < this.rng_pool.length; ++this.rng_pptr) this.rng_pool[this.rng_pptr] = 0;
            this.rng_pptr = 0
        }
        return this.rng_state.next()
    },
        this.nextBytes = function (a) {
            var b;
            for (b = 0; b < a.length; ++b) a[b] = this.rng_get_byte()
        }
}
function Arcfour() {
    this.i = 0,
        this.j = 0,
        this.S = new Array
}
function ARC4init(a) {
    var b, c, d;
    for (b = 0; 256 > b; ++b) this.S[b] = b;
    for (c = 0, b = 0; 256 > b; ++b) c = 255 & c + this.S[b] + a[b % a.length],
        d = this.S[b],
        this.S[b] = this.S[c],
        this.S[c] = d;
    this.i = 0,
        this.j = 0
}
function ARC4next() {
    var a;
    return this.i = 255 & this.i + 1,
        this.j = 255 & this.j + this.S[this.i],
        a = this.S[this.i],
        this.S[this.i] = this.S[this.j],
        this.S[this.j] = a,
        this.S[255 & a + this.S[this.i]]
}
function prng_newstate() {
    return new Arcfour
}
Arcfour.prototype.init = ARC4init,
    Arcfour.prototype.next = ARC4next;
var rng_psize = 256;

function parseBigInt(a, b) {
    return new BigInteger(a, b)
}
function linebrk(a, b) {
    for (var c = "", d = 0; d + b < a.length;) c += a.substring(d, d + b) + "\n",
        d += b;
    return c + a.substring(d, a.length)
}
function byte2Hex(a) {
    return 16 > a ? "0" + a.toString(16) : a.toString(16)
}
function pkcs1unpad2(a, b) {
    for (var c = a.toByteArray(), d = 0; d < c.length && 0 == c[d];)++d;
    if (c.length - d != b - 1 || 2 != c[d]) return null;
    for (++d; 0 != c[d];) if (++d >= c.length) return null;
    for (var e = ""; ++d < c.length;) e += String.fromCharCode(c[d]);
    return e
}
function pkcs1pad2(a, b) {
    if (b < a.length + 11) return alert("Message too long for RSA"),
        null;
    for (var c = new Array, d = a.length - 1; d >= 0 && b > 0;) c[--b] = a.charCodeAt(d--);
    c[--b] = 0;
    for (var e = new SecureRandom, f = new Array; b > 2;) {
        for (f[0] = 0; 0 == f[0];) e.nextBytes(f);
        c[--b] = f[0]
    }
    return c[--b] = 2,
        c[--b] = 0,
        new BigInteger(c)
}
"undefined" != typeof pidCrypt && "undefined" != typeof BigInteger && "undefined" != typeof SecureRandom && "undefined" != typeof Arcfour && (pidCrypt.RSA = function () {
    this.n = null,
        this.e = 0,
        this.d = null,
        this.p = null,
        this.q = null,
        this.dmp1 = null,
        this.dmq1 = null,
        this.coeff = null
}, pidCrypt.RSA.prototype.doPrivate = function (a) {
    if (null == this.p || null == this.q) return a.modPow(this.d, this.n);
    for (var b = a.mod(this.p).modPow(this.dmp1, this.p), c = a.mod(this.q).modPow(this.dmq1, this.q); b.compareTo(c) < 0;) b = b.add(this.p);
    return b.subtract(c).multiply(this.coeff).mod(this.p).multiply(this.q).add(c)
}, pidCrypt.RSA.prototype.setPublic = function (a, b, c) {
    "undefined" == typeof c && (c = 16),
        null != a && null != b && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, c), this.e = parseInt(b, c)) : alert("Invalid RSA public key")
}, pidCrypt.RSA.prototype.doPublic = function (a) {
    return a.modPowInt(this.e, this.n)
}, pidCrypt.RSA.prototype.encryptRaw = function (a) {
    var b = pkcs1pad2(a, this.n.bitLength() + 7 >> 3);
    if (null == b) return null;
    var c = this.doPublic(b);
    if (null == c) return null;
    var d = c.toString(16);
    return 0 == (1 & d.length) ? d : "0" + d
}, pidCrypt.RSA.prototype.encrypt = function (a) {
    return a = pidCryptUtil.encodeBase64(a),
        this.encryptRaw(a)
}, pidCrypt.RSA.prototype.decryptRaw = function (a) {
    var b = parseBigInt(a, 16),
        c = this.doPrivate(b);
    return null == c ? null : pkcs1unpad2(c, this.n.bitLength() + 7 >> 3)
}, pidCrypt.RSA.prototype.decrypt = function (a) {
    var b = this.decryptRaw(a);
    return b = b ? pidCryptUtil.decodeBase64(b) : ""
}, pidCrypt.RSA.prototype.setPrivate = function (a, b, c, d) {
    "undefined" == typeof d && (d = 16),
        null != a && null != b && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, d), this.e = parseInt(b, d), this.d = parseBigInt(c, d)) : alert("Invalid RSA private key")
}, pidCrypt.RSA.prototype.setPrivateEx = function (a, b, c, d, e, f, g, h, i) {
    "undefined" == typeof i && (i = 16),
        null != a && null != b && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, i), this.e = parseInt(b, i), this.d = parseBigInt(c, i), this.p = parseBigInt(d, i), this.q = parseBigInt(e, i), this.dmp1 = parseBigInt(f, i), this.dmq1 = parseBigInt(g, i), this.coeff = parseBigInt(h, i)) : alert("Invalid RSA private key")
}, pidCrypt.RSA.prototype.generate = function (a, b) {
    var c = new SecureRandom,
        d = a >> 1;
    this.e = parseInt(b, 16);
    for (var e = new BigInteger(b, 16);;) {
        for (; this.p = new BigInteger(a - d, 1, c), 0 != this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) || !this.p.isProbablePrime(10););
        for (; this.q = new BigInteger(d, 1, c), 0 != this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) || !this.q.isProbablePrime(10););
        if (this.p.compareTo(this.q) <= 0) {
            var f = this.p;
            this.p = this.q,
                this.q = f
        }
        var g = this.p.subtract(BigInteger.ONE),
            h = this.q.subtract(BigInteger.ONE),
            i = g.multiply(h);
        if (0 == i.gcd(e).compareTo(BigInteger.ONE)) {
            this.n = this.p.multiply(this.q),
                this.d = e.modInverse(i),
                this.dmp1 = this.d.mod(g),
                this.dmq1 = this.d.mod(h),
                this.coeff = this.q.modInverse(this.p);
            break
        }
    }
}, pidCrypt.RSA.prototype.getASNData = function (a) {
    var c = [],
        d = 0;
    if (a.value && "INTEGER" == a.type && (c[d++] = a.value), a.sub) for (var e = 0; e < a.sub.length; e++) c = c.concat(this.getASNData(a.sub[e]));
    return c
}, pidCrypt.RSA.prototype.setKeyFromASN = function (a, b) {
    var c = ["N", "E", "D", "P", "Q", "DP", "DQ", "C"],
        d = {},
        e = this.getASNData(b);
    switch (a) {
        case "Public":
        case "public":
            for (var f = 0; f < e.length; f++) d[c[f]] = e[f].toLowerCase();
            this.setPublic(d.N, d.E, 16);
            break;
        case "Private":
        case "private":
            for (var f = 1; f < e.length; f++) d[c[f - 1]] = e[f].toLowerCase();
            this.setPrivateEx(d.N, d.E, d.D, d.P, d.Q, d.DP, d.DQ, d.C, 16)
    }
}, pidCrypt.RSA.prototype.setPublicKeyFromASN = function (a) {
    this.setKeyFromASN("public", a)
}, pidCrypt.RSA.prototype.setPrivateKeyFromASN = function (a) {
    this.setKeyFromASN("private", a)
}, pidCrypt.RSA.prototype.getParameters = function () {
    var a = {};
    return null != this.n && (a.n = this.n),
        a.e = this.e,
    null != this.d && (a.d = this.d),
    null != this.p && (a.p = this.p),
    null != this.q && (a.q = this.q),
    null != this.dmp1 && (a.dmp1 = this.dmp1),
    null != this.dmq1 && (a.dmq1 = this.dmq1),
    null != this.coeff && (a.c = this.coeff),
        a
});

function certParser(cert) {
    var lines = cert.split('\n');
    var read = false;
    var b64 = false;
    var end = false;
    var flag = '';
    var retObj = {};
    retObj.info = '';
    retObj.salt = '';
    retObj.iv;
    retObj.b64 = '';
    retObj.aes = false;
    retObj.mode = '';
    retObj.bits = 0;
    for (var i = 0; i < lines.length; i++) {
        flag = lines[i].substr(0, 9);
        if (i == 1 && flag != 'Proc-Type' && flag.indexOf('M') == 0) b64 = true;
        switch (flag) {
            case '-----BEGI':
                read = true;
                break;
            case 'Proc-Type':
                if (read) retObj.info = lines[i];
                break;
            case 'DEK-Info:':
                if (read) {
                    var tmp = lines[i].split(',');
                    var dek = tmp[0].split(': ');
                    var aes = dek[1].split('-');
                    retObj.aes = (aes[0] == 'AES') ? true : false;
                    retObj.mode = aes[2];
                    retObj.bits = parseInt(aes[1]);
                    retObj.salt = tmp[1].substr(0, 16);
                    retObj.iv = tmp[1]
                };
                break;
            case '':
                if (read) b64 = true;
                break;
            case '-----END ':
                if (read) {
                    b64 = false;
                    read = false
                };
                break;
            default:
                if (read && b64) retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i])
        }
    };
    return retObj
};

function RSAencript(str) {
    var crypted;
    var public_key = public_key_1024;
    var params = {};
    params = certParser(public_key);
    if (params.b64) {
        var key = pidCryptUtil.decodeBase64(params.b64);
        var rsa = new pidCrypt.RSA();
        var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
        var tree = asn.toHexTree();
        rsa.setPublicKeyFromASN(tree);
        crypted = rsa.encrypt(str);
        return pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted))
    } else return "error"
}

/**
 * RSAinit length > 60 been encripted
 */
var RSAinit = function(str){
    if( !str ){
        return;
    }
    str = str + '';
    return str.length >60 ? str: RSAencript(str);
}
module.exports = RSAinit;

