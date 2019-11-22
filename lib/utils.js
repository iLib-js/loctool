/*
 * utils.js - various utilities
 *
 * Copyright © 2016-2019, HealthTap, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale");
var isAlnum = require("ilib/lib/isAlnum.js");
var isIdeo = require("ilib/lib/isIdeo.js");

//load the data for these
isAlnum._init();
isIdeo._init();

// var log4js = require("log4js");
// var logger = log4js.getLogger("loctool.lib.utils");

module.exports = {
    iso3166: {
        "AF": 1,
        "AX": 1,
        "AL": 1,
        "DZ": 1,
        "AS": 1,
        "AD": 1,
        "AO": 1,
        "AI": 1,
        "AQ": 1,
        "AG": 1,
        "AR": 1,
        "AM": 1,
        "AW": 1,
        "AU": 1,
        "AT": 1,
        "AZ": 1,
        "BS": 1,
        "BH": 1,
        "BD": 1,
        "BB": 1,
        "BY": 1,
        "BE": 1,
        "BZ": 1,
        "BJ": 1,
        "BM": 1,
        "BT": 1,
        "BO": 1,
        "BQ": 1,
        "BA": 1,
        "BW": 1,
        "BV": 1,
        "BR": 1,
        "IO": 1,
        "BN": 1,
        "BG": 1,
        "BF": 1,
        "BI": 1,
        "KH": 1,
        "CM": 1,
        "CA": 1,
        "CV": 1,
        "KY": 1,
        "CF": 1,
        "TD": 1,
        "CL": 1,
        "CN": 1,
        "CX": 1,
        "CC": 1,
        "CO": 1,
        "KM": 1,
        "CG": 1,
        "CD": 1,
        "CK": 1,
        "CR": 1,
        "CI": 1,
        "HR": 1,
        "CU": 1,
        "CW": 1,
        "CY": 1,
        "CZ": 1,
        "DK": 1,
        "DJ": 1,
        "DM": 1,
        "DO": 1,
        "EC": 1,
        "EG": 1,
        "SV": 1,
        "GQ": 1,
        "ER": 1,
        "EE": 1,
        "ET": 1,
        "FK": 1,
        "FO": 1,
        "FJ": 1,
        "FI": 1,
        "FR": 1,
        "GF": 1,
        "PF": 1,
        "TF": 1,
        "GA": 1,
        "GM": 1,
        "GE": 1,
        "DE": 1,
        "GH": 1,
        "GI": 1,
        "GR": 1,
        "GL": 1,
        "GD": 1,
        "GP": 1,
        "GU": 1,
        "GT": 1,
        "GG": 1,
        "GN": 1,
        "GW": 1,
        "GY": 1,
        "HT": 1,
        "HM": 1,
        "VA": 1,
        "HN": 1,
        "HK": 1,
        "HU": 1,
        "IS": 1,
        "IN": 1,
        "ID": 1,
        "IR": 1,
        "IQ": 1,
        "IE": 1,
        "IM": 1,
        "IL": 1,
        "IT": 1,
        "JM": 1,
        "JP": 1,
        "JE": 1,
        "JO": 1,
        "KZ": 1,
        "KE": 1,
        "KI": 1,
        "KP": 1,
        "KR": 1,
        "KW": 1,
        "KG": 1,
        "LA": 1,
        "LV": 1,
        "LB": 1,
        "LS": 1,
        "LR": 1,
        "LY": 1,
        "LI": 1,
        "LT": 1,
        "LU": 1,
        "MO": 1,
        "MK": 1,
        "MG": 1,
        "MW": 1,
        "MY": 1,
        "MV": 1,
        "ML": 1,
        "MT": 1,
        "MH": 1,
        "MQ": 1,
        "MR": 1,
        "MU": 1,
        "YT": 1,
        "MX": 1,
        "FM": 1,
        "MD": 1,
        "MC": 1,
        "MN": 1,
        "ME": 1,
        "MS": 1,
        "MA": 1,
        "MZ": 1,
        "MM": 1,
        "NA": 1,
        "NR": 1,
        "NP": 1,
        "NL": 1,
        "NC": 1,
        "NZ": 1,
        "NI": 1,
        "NE": 1,
        "NG": 1,
        "NU": 1,
        "NF": 1,
        "MP": 1,
        "NO": 1,
        "OM": 1,
        "PK": 1,
        "PW": 1,
        "PS": 1,
        "PA": 1,
        "PG": 1,
        "PY": 1,
        "PE": 1,
        "PH": 1,
        "PN": 1,
        "PL": 1,
        "PT": 1,
        "PR": 1,
        "QA": 1,
        "RE": 1,
        "RO": 1,
        "RU": 1,
        "RW": 1,
        "BL": 1,
        "SH": 1,
        "KN": 1,
        "LC": 1,
        "MF": 1,
        "PM": 1,
        "VC": 1,
        "WS": 1,
        "SM": 1,
        "ST": 1,
        "SA": 1,
        "SN": 1,
        "RS": 1,
        "SC": 1,
        "SL": 1,
        "SG": 1,
        "SX": 1,
        "SK": 1,
        "SI": 1,
        "SB": 1,
        "SO": 1,
        "ZA": 1,
        "GS": 1,
        "SS": 1,
        "ES": 1,
        "LK": 1,
        "SD": 1,
        "SR": 1,
        "SJ": 1,
        "SZ": 1,
        "SE": 1,
        "CH": 1,
        "SY": 1,
        "TW": 1,
        "TJ": 1,
        "TZ": 1,
        "TH": 1,
        "TL": 1,
        "TG": 1,
        "TK": 1,
        "TO": 1,
        "TT": 1,
        "TN": 1,
        "TR": 1,
        "TM": 1,
        "TC": 1,
        "TV": 1,
        "UG": 1,
        "UA": 1,
        "AE": 1,
        "GB": 1,
        "US": 1,
        "UM": 1,
        "UY": 1,
        "UZ": 1,
        "VU": 1,
        "VE": 1,
        "VN": 1,
        "VG": 1,
        "VI": 1,
        "WF": 1,
        "EH": 1,
        "YE": 1,
        "ZM": 1,
        "ZW": 1
    },

    iso639: {
        "ab": 1,
        "aa": 1,
        "af": 1,
        "ak": 1,
        "sq": 1,
        "am": 1,
        "ar": 1,
        "an": 1,
        "hy": 1,
        "as": 1,
        "av": 1,
        "ae": 1,
        "ay": 1,
        "az": 1,
        "bm": 1,
        "ba": 1,
        "eu": 1,
        "be": 1,
        "bn": 1,
        "bh": 1,
        "bi": 1,
        "bs": 1,
        "br": 1,
        "bg": 1,
        "my": 1,
        "ca": 1,
        "ch": 1,
        "ce": 1,
        "ny": 1,
        "zh": 1,
        "cv": 1,
        "kw": 1,
        "co": 1,
        "cr": 1,
        "hr": 1,
        "cs": 1,
        "da": 1,
        "dv": 1,
        "nl": 1,
        "dz": 1,
        "en": 1,
        "eo": 1,
        "et": 1,
        "ee": 1,
        "fo": 1,
        "fj": 1,
        "fi": 1,
        "fr": 1,
        "ff": 1,
        "gl": 1,
        "ka": 1,
        "de": 1,
        "el": 1,
        "gn": 1,
        "gu": 1,
        "ht": 1,
        "ha": 1,
        "he": 1,
        "hz": 1,
        "hi": 1,
        "ho": 1,
        "hu": 1,
        "ia": 1,
        "id": 1,
        "ie": 1,
        "ga": 1,
        "ig": 1,
        "ik": 1,
        "io": 1,
        "is": 1,
        "it": 1,
        "iu": 1,
        "ja": 1,
        "jv": 1,
        "kl": 1,
        "kn": 1,
        "kr": 1,
        "ks": 1,
        "kk": 1,
        "km": 1,
        "ki": 1,
        "rw": 1,
        "ky": 1,
        "kv": 1,
        "kg": 1,
        "ko": 1,
        "ku": 1,
        "kj": 1,
        "la": 1,
        "lb": 1,
        "lg": 1,
        "li": 1,
        "ln": 1,
        "lo": 1,
        "lt": 1,
        "lu": 1,
        "lv": 1,
        "gv": 1,
        "mk": 1,
        "mg": 1,
        "ms": 1,
        "ml": 1,
        "mt": 1,
        "mi": 1,
        "mr": 1,
        "mh": 1,
        "mn": 1,
        "na": 1,
        "nv": 1,
        "nb": 1,
        "nd": 1,
        "ne": 1,
        "ng": 1,
        "nn": 1,
        "no": 1,
        "ii": 1,
        "nr": 1,
        "oc": 1,
        "oj": 1,
        "cu": 1,
        "om": 1,
        "or": 1,
        "os": 1,
        "pa": 1,
        "pi": 1,
        "fa": 1,
        "pl": 1,
        "ps": 1,
        "pt": 1,
        "qu": 1,
        "rm": 1,
        "rn": 1,
        "ro": 1,
        "ru": 1,
        "sa": 1,
        "sc": 1,
        "sd": 1,
        "se": 1,
        "sm": 1,
        "sg": 1,
        "sr": 1,
        "gd": 1,
        "sn": 1,
        "si": 1,
        "sk": 1,
        "sl": 1,
        "so": 1,
        "st": 1,
        "es": 1,
        "su": 1,
        "sw": 1,
        "ss": 1,
        "sv": 1,
        "ta": 1,
        "te": 1,
        "tg": 1,
        "th": 1,
        "ti": 1,
        "bo": 1,
        "tk": 1,
        "tl": 1,
        "tn": 1,
        "to": 1,
        "tr": 1,
        "ts": 1,
        "tt": 1,
        "tw": 1,
        "ty": 1,
        "ug": 1,
        "uk": 1,
        "ur": 1,
        "uz": 1,
        "ve": 1,
        "vi": 1,
        "vo": 1,
        "wa": 1,
        "cy": 1,
        "wo": 1,
        "fy": 1,
        "xh": 1,
        "yi": 1,
        "yo": 1,
        "za": 1,
        "zu": 1,
        "aar": 1,
        "abk": 1,
        "ace": 1,
        "ach": 1,
        "ada": 1,
        "ady": 1,
        "afa": 1,
        "afh": 1,
        "afr": 1,
        "ain": 1,
        "aka": 1,
        "akk": 1,
        "alb": 1,
        "alb": 1,
        "ale": 1,
        "alg": 1,
        "alt": 1,
        "amh": 1,
        "ang": 1,
        "anp": 1,
        "apa": 1,
        "ara": 1,
        "arc": 1,
        "arg": 1,
        "arm": 1,
        "arm": 1,
        "arn": 1,
        "arp": 1,
        "art": 1,
        "arw": 1,
        "asm": 1,
        "ast": 1,
        "ath": 1,
        "aus": 1,
        "ava": 1,
        "ave": 1,
        "awa": 1,
        "aym": 1,
        "aze": 1,
        "bad": 1,
        "bai": 1,
        "bak": 1,
        "bal": 1,
        "bam": 1,
        "ban": 1,
        "baq": 1,
        "baq": 1,
        "bas": 1,
        "bat": 1,
        "bej": 1,
        "bel": 1,
        "bem": 1,
        "ben": 1,
        "ber": 1,
        "bho": 1,
        "bih": 1,
        "bik": 1,
        "bin": 1,
        "bis": 1,
        "bla": 1,
        "bnt": 1,
        "bod": 1,
        "bod": 1,
        "bos": 1,
        "bra": 1,
        "bre": 1,
        "btk": 1,
        "bua": 1,
        "bug": 1,
        "bul": 1,
        "bur": 1,
        "bur": 1,
        "byn": 1,
        "cad": 1,
        "cai": 1,
        "car": 1,
        "cat": 1,
        "cau": 1,
        "ceb": 1,
        "cel": 1,
        "ces": 1,
        "ces": 1,
        "cha": 1,
        "chb": 1,
        "che": 1,
        "chg": 1,
        "chi": 1,
        "chi": 1,
        "chk": 1,
        "chm": 1,
        "chn": 1,
        "cho": 1,
        "chp": 1,
        "chr": 1,
        "chu": 1,
        "chv": 1,
        "chy": 1,
        "cmc": 1,
        "cnr": 1,
        "cop": 1,
        "cor": 1,
        "cos": 1,
        "cpe": 1,
        "cpf": 1,
        "cpp": 1,
        "cre": 1,
        "crh": 1,
        "crp": 1,
        "csb": 1,
        "cus": 1,
        "cym": 1,
        "cym": 1,
        "cze": 1,
        "cze": 1,
        "dak": 1,
        "dan": 1,
        "dar": 1,
        "day": 1,
        "del": 1,
        "den": 1,
        "deu": 1,
        "deu": 1,
        "dgr": 1,
        "din": 1,
        "div": 1,
        "doi": 1,
        "dra": 1,
        "dsb": 1,
        "dua": 1,
        "dum": 1,
        "dut": 1,
        "dut": 1,
        "dyu": 1,
        "dzo": 1,
        "efi": 1,
        "egy": 1,
        "eka": 1,
        "ell": 1,
        "ell": 1,
        "elx": 1,
        "eng": 1,
        "enm": 1,
        "epo": 1,
        "est": 1,
        "eus": 1,
        "eus": 1,
        "ewe": 1,
        "ewo": 1,
        "fan": 1,
        "fao": 1,
        "fas": 1,
        "fas": 1,
        "fat": 1,
        "fij": 1,
        "fil": 1,
        "fin": 1,
        "fiu": 1,
        "fon": 1,
        "fra": 1,
        "fra": 1,
        "fre": 1,
        "fre": 1,
        "frm": 1,
        "fro": 1,
        "frr": 1,
        "frs": 1,
        "fry": 1,
        "ful": 1,
        "fur": 1,
        "gaa": 1,
        "gay": 1,
        "gba": 1,
        "gem": 1,
        "geo": 1,
        "geo": 1,
        "ger": 1,
        "ger": 1,
        "gez": 1,
        "gil": 1,
        "gla": 1,
        "gle": 1,
        "glg": 1,
        "glv": 1,
        "gmh": 1,
        "goh": 1,
        "gon": 1,
        "gor": 1,
        "got": 1,
        "grb": 1,
        "grc": 1,
        "gre": 1,
        "gre": 1,
        "grn": 1,
        "gsw": 1,
        "guj": 1,
        "gwi": 1,
        "hai": 1,
        "hat": 1,
        "hau": 1,
        "haw": 1,
        "heb": 1,
        "her": 1,
        "hil": 1,
        "him": 1,
        "hin": 1,
        "hit": 1,
        "hmn": 1,
        "hmo": 1,
        "hrv": 1,
        "hsb": 1,
        "hun": 1,
        "hup": 1,
        "hye": 1,
        "hye": 1,
        "iba": 1,
        "ibo": 1,
        "ice": 1,
        "ice": 1,
        "ido": 1,
        "iii": 1,
        "ijo": 1,
        "iku": 1,
        "ile": 1,
        "ilo": 1,
        "ina": 1,
        "inc": 1,
        "ind": 1,
        "ine": 1,
        "inh": 1,
        "ipk": 1,
        "ira": 1,
        "iro": 1,
        "isl": 1,
        "isl": 1,
        "ita": 1,
        "jav": 1,
        "jbo": 1,
        "jpn": 1,
        "jpr": 1,
        "jrb": 1,
        "kaa": 1,
        "kab": 1,
        "kac": 1,
        "kal": 1,
        "kam": 1,
        "kan": 1,
        "kar": 1,
        "kas": 1,
        "kat": 1,
        "kat": 1,
        "kau": 1,
        "kaw": 1,
        "kaz": 1,
        "kbd": 1,
        "kha": 1,
        "khi": 1,
        "khm": 1,
        "kho": 1,
        "kik": 1,
        "kin": 1,
        "kir": 1,
        "kmb": 1,
        "kok": 1,
        "kom": 1,
        "kon": 1,
        "kor": 1,
        "kos": 1,
        "kpe": 1,
        "krc": 1,
        "krl": 1,
        "kro": 1,
        "kru": 1,
        "kua": 1,
        "kum": 1,
        "kur": 1,
        "kut": 1,
        "lad": 1,
        "lah": 1,
        "lam": 1,
        "lao": 1,
        "lat": 1,
        "lav": 1,
        "lez": 1,
        "lim": 1,
        "lin": 1,
        "lit": 1,
        "lol": 1,
        "loz": 1,
        "ltz": 1,
        "lua": 1,
        "lub": 1,
        "lug": 1,
        "lui": 1,
        "lun": 1,
        "luo": 1,
        "lus": 1,
        "mac": 1,
        "mac": 1,
        "mad": 1,
        "mag": 1,
        "mah": 1,
        "mai": 1,
        "mak": 1,
        "mal": 1,
        "man": 1,
        "mao": 1,
        "mao": 1,
        "map": 1,
        "mar": 1,
        "mas": 1,
        "may": 1,
        "may": 1,
        "mdf": 1,
        "mdr": 1,
        "men": 1,
        "mga": 1,
        "mic": 1,
        "min": 1,
        "mis": 1,
        "mkd": 1,
        "mkd": 1,
        "mkh": 1,
        "mlg": 1,
        "mlt": 1,
        "mnc": 1,
        "mni": 1,
        "mno": 1,
        "moh": 1,
        "mon": 1,
        "mos": 1,
        "mri": 1,
        "mri": 1,
        "msa": 1,
        "msa": 1,
        "mul": 1,
        "mun": 1,
        "mus": 1,
        "mwl": 1,
        "mwr": 1,
        "mya": 1,
        "mya": 1,
        "myn": 1,
        "myv": 1,
        "nah": 1,
        "nai": 1,
        "nap": 1,
        "nau": 1,
        "nav": 1,
        "nbl": 1,
        "nde": 1,
        "ndo": 1,
        "nds": 1,
        "nep": 1,
        "new": 1,
        "nia": 1,
        "nic": 1,
        "niu": 1,
        "nld": 1,
        "nld": 1,
        "nno": 1,
        "nob": 1,
        "nog": 1,
        "non": 1,
        "nor": 1,
        "nqo": 1,
        "nso": 1,
        "nub": 1,
        "nwc": 1,
        "nya": 1,
        "nym": 1,
        "nyn": 1,
        "nyo": 1,
        "nzi": 1,
        "oci": 1,
        "oji": 1,
        "ori": 1,
        "orm": 1,
        "osa": 1,
        "oss": 1,
        "ota": 1,
        "oto": 1,
        "paa": 1,
        "pag": 1,
        "pal": 1,
        "pam": 1,
        "pan": 1,
        "pap": 1,
        "pau": 1,
        "peo": 1,
        "per": 1,
        "per": 1,
        "phi": 1,
        "phn": 1,
        "pli": 1,
        "pol": 1,
        "pon": 1,
        "por": 1,
        "pra": 1,
        "pro": 1,
        "pus": 1,
        "qaa": 1,
        "qtz": 1,
        "que": 1,
        "raj": 1,
        "rap": 1,
        "rar": 1,
        "roa": 1,
        "roh": 1,
        "rom": 1,
        "ron": 1,
        "ron": 1,
        "rum": 1,
        "rum": 1,
        "run": 1,
        "rup": 1,
        "rus": 1,
        "sad": 1,
        "sag": 1,
        "sah": 1,
        "sai": 1,
        "sal": 1,
        "sam": 1,
        "san": 1,
        "sas": 1,
        "sat": 1,
        "scn": 1,
        "sco": 1,
        "sel": 1,
        "sem": 1,
        "sga": 1,
        "sgn": 1,
        "shn": 1,
        "sid": 1,
        "sin": 1,
        "sio": 1,
        "sit": 1,
        "sla": 1,
        "slk": 1,
        "slk": 1,
        "slo": 1,
        "slo": 1,
        "slv": 1,
        "sma": 1,
        "sme": 1,
        "smi": 1,
        "smj": 1,
        "smn": 1,
        "smo": 1,
        "sms": 1,
        "sna": 1,
        "snd": 1,
        "snk": 1,
        "sog": 1,
        "som": 1,
        "son": 1,
        "sot": 1,
        "spa": 1,
        "sqi": 1,
        "sqi": 1,
        "srd": 1,
        "srn": 1,
        "srp": 1,
        "srr": 1,
        "ssa": 1,
        "ssw": 1,
        "suk": 1,
        "sun": 1,
        "sus": 1,
        "sux": 1,
        "swa": 1,
        "swe": 1,
        "syc": 1,
        "syr": 1,
        "tah": 1,
        "tai": 1,
        "tam": 1,
        "tat": 1,
        "tel": 1,
        "tem": 1,
        "ter": 1,
        "tet": 1,
        "tgk": 1,
        "tgl": 1,
        "tha": 1,
        "tib": 1,
        "tib": 1,
        "tig": 1,
        "tir": 1,
        "tiv": 1,
        "tkl": 1,
        "tlh": 1,
        "tli": 1,
        "tmh": 1,
        "tog": 1,
        "ton": 1,
        "tpi": 1,
        "tsi": 1,
        "tsn": 1,
        "tso": 1,
        "tuk": 1,
        "tum": 1,
        "tup": 1,
        "tur": 1,
        "tut": 1,
        "tvl": 1,
        "twi": 1,
        "tyv": 1,
        "udm": 1,
        "uga": 1,
        "uig": 1,
        "ukr": 1,
        "umb": 1,
        "und": 1,
        "urd": 1,
        "uzb": 1,
        "vai": 1,
        "ven": 1,
        "vie": 1,
        "vol": 1,
        "vot": 1,
        "wak": 1,
        "wal": 1,
        "war": 1,
        "was": 1,
        "wel": 1,
        "wel": 1,
        "wen": 1,
        "wln": 1,
        "wol": 1,
        "xal": 1,
        "xho": 1,
        "yao": 1,
        "yap": 1,
        "yid": 1,
        "yor": 1,
        "ypk": 1,
        "zap": 1,
        "zbl": 1,
        "zen": 1,
        "zgh": 1,
        "zha": 1,
        "zho": 1,
        "zho": 1,
        "znd": 1,
        "zul": 1,
        "zun": 1,
        "zxx": 1,
        "zza": 1
    },

    iso15924: {
        "Adlm": 1,
        "Afak": 1,
        "Aghb": 1,
        "Ahom": 1,
        "Arab": 1,
        "Aran": 1,
        "Armi": 1,
        "Armn": 1,
        "Avst": 1,
        "Bali": 1,
        "Bamu": 1,
        "Bass": 1,
        "Batk": 1,
        "Beng": 1,
        "Bhks": 1,
        "Blis": 1,
        "Bopo": 1,
        "Brah": 1,
        "Brai": 1,
        "Bugi": 1,
        "Buhd": 1,
        "Cakm": 1,
        "Cans": 1,
        "Cari": 1,
        "Cham": 1,
        "Cher": 1,
        "Cirt": 1,
        "Copt": 1,
        "Cprt": 1,
        "Cyrl": 1,
        "Cyrs": 1,
        "Deva": 1,
        "Dogr": 1,
        "Dsrt": 1,
        "Dupl": 1,
        "Egyd": 1,
        "Egyh": 1,
        "Egyp": 1,
        "Elba": 1,
        "Ethi": 1,
        "Geok": 1,
        "Geor": 1,
        "Glag": 1,
        "Gong": 1,
        "Gonm": 1,
        "Goth": 1,
        "Gran": 1,
        "Grek": 1,
        "Gujr": 1,
        "Guru": 1,
        "Hanb": 1,
        "Hang": 1,
        "Hani": 1,
        "Hano": 1,
        "Hans": 1,
        "Hant": 1,
        "Hatr": 1,
        "Hebr": 1,
        "Hira": 1,
        "Hluw": 1,
        "Hmng": 1,
        "Hrkt": 1,
        "Hung": 1,
        "Inds": 1,
        "Ital": 1,
        "Jamo": 1,
        "Java": 1,
        "Jpan": 1,
        "Jurc": 1,
        "Kali": 1,
        "Kana": 1,
        "Khar": 1,
        "Khmr": 1,
        "Khoj": 1,
        "Kitl": 1,
        "Kits": 1,
        "Knda": 1,
        "Kore": 1,
        "Kpel": 1,
        "Kthi": 1,
        "Lana": 1,
        "Laoo": 1,
        "Latf": 1,
        "Latg": 1,
        "Latn": 1,
        "Leke": 1,
        "Lepc": 1,
        "Limb": 1,
        "Lina": 1,
        "Linb": 1,
        "Lisu": 1,
        "Loma": 1,
        "Lyci": 1,
        "Lydi": 1,
        "Mahj": 1,
        "Maka": 1,
        "Mand": 1,
        "Mani": 1,
        "Marc": 1,
        "Maya": 1,
        "Medf": 1,
        "Mend": 1,
        "Merc": 1,
        "Mero": 1,
        "Mlym": 1,
        "Modi": 1,
        "Mong": 1,
        "Moon": 1,
        "Mroo": 1,
        "Mtei": 1,
        "Mult": 1,
        "Mymr": 1,
        "Narb": 1,
        "Nbat": 1,
        "Newa": 1,
        "Nkgb": 1,
        "Nkoo": 1,
        "Nshu": 1,
        "Ogam": 1,
        "Olck": 1,
        "Orkh": 1,
        "Orya": 1,
        "Osge": 1,
        "Osma": 1,
        "Palm": 1,
        "Pauc": 1,
        "Perm": 1,
        "Phag": 1,
        "Phli": 1,
        "Phlp": 1,
        "Phlv": 1,
        "Phnx": 1,
        "Plrd": 1,
        "Piqd": 1,
        "Prti": 1,
        "Qaaa": 1,
        "Qabx": 1,
        "Rjng": 1,
        "Roro": 1,
        "Runr": 1,
        "Samr": 1,
        "Sara": 1,
        "Sarb": 1,
        "Saur": 1,
        "Sgnw": 1,
        "Shaw": 1,
        "Shrd": 1,
        "Sidd": 1,
        "Sind": 1,
        "Sinh": 1,
        "Sora": 1,
        "Soyo": 1,
        "Sund": 1,
        "Sylo": 1,
        "Syrc": 1,
        "Syre": 1,
        "Syrj": 1,
        "Syrn": 1,
        "Tagb": 1,
        "Takr": 1,
        "Tale": 1,
        "Talu": 1,
        "Taml": 1,
        "Tang": 1,
        "Tavt": 1,
        "Telu": 1,
        "Teng": 1,
        "Tfng": 1,
        "Tglg": 1,
        "Thaa": 1,
        "Thai": 1,
        "Tibt": 1,
        "Tirh": 1,
        "Ugar": 1,
        "Vaii": 1,
        "Visp": 1,
        "Wara": 1,
        "Wole": 1,
        "Xpeo": 1,
        "Xsux": 1,
        "Yiii": 1,
        "Zanb": 1,
        "Zinh": 1,
        "Zmth": 1,
        "Zsye": 1,
        "Zsym": 1,
        "Zxxx": 1,
        "Zyyy": 1,
        "Zzzz": 1
    }
};

module.exports.makeDirs = function makeDirs(path) {
    var parts = path.split(/[\\\/]/);

    for (var i = 1; i <= parts.length; i++) {
        var p = parts.slice(0, i).join("/");
        if (p && p.length > 0 && !fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

module.exports.isEmpty = function (obj) {
    var prop = undefined;

    if (!obj) {
        return true;
    }

    for (prop in obj) {
        if (prop && obj[prop]) {
            return false;
        }
    }
    return true;
};

module.exports.escapeXml = function (str) {
    if (str) {
        str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return str;
};


/**
 * Strip the quotes off of a string and return the resulting string.
 * The quotes may be either single or double. If there are no quotes
 * on the string, the entire string is returned.
 *
 * @param {String} str the string to strip the quotes from
 * @returns {String} the stripped string
 */
module.exports.stripQuotes = function(str) {
    var ret = str;
    if (ret[0] === '"' || ret[0] === "'") {
        ret = ret.substring(1);
    }

    if (ret[ret.length-1] === '"' || ret[ret.length-1] === "'") {
        ret = ret.substring(0, ret.length-1);
    }

    return ret;
}

/**
 * Compare two objects for equivalence. If they contain a
 * different number of properties, or if the value of any
 * of the properties differs between the two, then this
 * will return false.
 *
 * @param {Object} left the first object to compare
 * @param {Object} right the second object to compare
 * @return {boolean} true if both objects contain the same
 * properties and those properties have the same values
 */
module.exports.objectEquals = function(left, right) {
    var lkeys = Object.keys(left);
    var rkeys = Object.keys(right);
    if (lkeys.length !== rkeys.length) {
        return false;
    }

    var ret = lkeys.every(function(key) {
        return right.hasOwnProperty(key) && left[key] === right[key];
    });
    if (!ret) return false;
    return rkeys.every(function(key) {
        return left.hasOwnProperty(key) && left[key] === right[key];
    });
}

/**
 * @private
 * These locales represent the generic world-wide version of the
 * language/script. That is, "es" means "Spanish for the US". If you
 * want something other than that, you have to use the full locale.
 * eg. "es-ES" for Spanish for Spain
 */
var localeDefaults = {
    "ar": {
        def: "ar-EG",
        spec: "ar"
    },
    "de": {
        def: "de-DE",
        spec: "de"
    },
    "en": {
        def: "en-GB",
        spec: "en"
    },
    "es": {
        def: "es-US",
        spec: "es"
    },
    "fr": {
        def: "fr-FR",
        spec: "fr"
    },
    "it": {
        def: "it-IT",
        spec: "it"
    },
    "ko": {
        def: "ko-KR",
        spec: "ko"
    },
    "nl": {
        def: "nl-NL",
        spec: "nl"
    },
    "no": {
        def: "no-NO",
        spec: "no"
    },
    "pt": {
        def: "pt-BR",
        spec: "pt"
    },
    "ru": {
        def: "ru-RU",
        spec: "ru"
    },
    "sv": {
        def: "sv-SE",
        spec: "sv"
    },
    "zh": {
        def: "zh-Hans-CN",
        spec: "zh"
    },
    "zh-Hans": {
        def: "zh-Hans-CN",
        spec: "zh"
    },
    "zh-Hant": {
        def: "zh-Hant-HK",
        spec: "zh-Hant"
    }
};

/**
 * @private
 */
module.exports.getLocaleDefault = function(locale, flavor, defaults) {
    var l = new Locale(locale);
    flavor = flavor || l.variant;

    var langscript = l.language + (l.script ? "-" + l.script : ""),
        def = defaults ? defaults[langscript] : localeDefaults[langscript],
        spec = l.language;

    if (flavor) {
        l = new Locale(l.language, l.region, flavor, l.script);
        spec = l.getSpec();
    } else if (def) {
        // overwrite the locale dir for the default of this language
        spec = (def.def === l.getSpec()) ? def.spec : l.getSpec();
    }

    return spec;
};


var alreadyResRE = /^@\+?([\w:][\w:]*)\//;
var alreadyResourcified = {
    "anim": true,
    "array": true,
    "color": true,
    "dimen": true,
    "drawable": true,
    "id": true,
    "integer": true,
    "layout": true,
    "string": true,
    "style": true,
    "android:id": true,
    "android:anim": true,
    "android:color": true,
    "android:style": true,
};
var alreadyRes2RE = /^@=?\{.*\}$/;

/**
 * Return true if the given value already represents an android resource
 * value.
 *
 * @returns {boolean} true if the value represents an android resource
 * value, or false otherwise
 */
module.exports.isAndroidResource = function(value) {
    var match = alreadyResRE.exec(value);
    var match2 = alreadyRes2RE.exec(value);
    return (match && match.length > 1 && alreadyResourcified[match[1]]) || (match2 !== null && match2.length);
};

/**
 * Return true if the first character in c is a white space character.
 * This checks for all Unicode white space characters.
 *
 * @param {String} c the character to check
 * @returns {boolean} true if the character contains whitespace, false
 * otherwise
 */
module.exports.isWhite = function (c) {
    if (c === " " || c === "\n" || c === "\t" || c === '\r' || c === '\f') return true;
    var code = c.charCodeAt(0);
    return code === 0x00A0 ||
        (code >= 0x2000 && code <= 0x200F) ||
        (code >= 0x2028 && code <= 0x202F) ||
        (code >= 0x205F && code <= 0x206F);
};

/**
 * Return true if the given locale spec is for an Asian locale that does
 * not have spaces between words, or false for any other type of language.
 *
 * @param {String} spec the locale specification of the locale to test
 * @returns {boolean} true if the given spec is for an Asian locale, or
 * false otherwise
 */
module.exports.isAsianLocale = function(spec) {
    var locale = new Locale(spec);
    switch (locale.getLanguage()) {
    case 'zh':
    case 'ja':
    case 'th':
        return true;
    default:
        return false;
    }
};

/**
 * Return true if the string represents a 'do not translate'
 * string.
 *
 * @returns {boolean} true if the string represents a do not translate
 * string, of false if the string does not or if it is undefined
 */
module.exports.isDNT = function(str) {
    if (!str) return false;
    str = str.trim().toLowerCase();
    return str === "dnt" || str === "do not translate";
};

/**
 * Return a standard hash of the given source string. This should
 * correspond exactly to the hash in the haml localizer, the ruby
 * RB.t function, and the Java hash function.
 *
 * @param {String} source the source string as extracted from the
 * source code, unmodified
 * @returns {String} the hash key
 */
module.exports.hashKey = function(source) {
    if (!source) return undefined;
    var hash = 0;
    // these two numbers together = 46 bits so it won't blow out the precision of an integer in javascript
    var modulus = 1073741789;  // largest prime number that fits in 30 bits
    var multiple = 65521;      // largest prime that fits in 16 bits, co-prime with the modulus

    // logger.trace("hash starts off at " + hash);

    for (var i = 0; i < source.length; i++) {
        // logger.trace("hash " + hash + " char " + source.charCodeAt(i) + "=" + source.charAt(i));
        hash += source.charCodeAt(i);
        hash *= multiple;
        hash %= modulus;
    }
    var value = "r" + hash;

    // System.out.println("String '" + source + "' hashes to " + value);

    return value;
};

/**
 * Trim actual whitespace AND escaped white space characters
 * from the beginning and end of the string.
 *
 * @param {string} str string to trim
 * @returns {string} trimmed string
 */
module.exports.trimEscaped = function (str) {
    return str && str.replace(/^(\s|\\t|\\r|\\n)*/, "").replace(/(\s|\\t|\\r|\\n)*$/, "");
};

/**
 * A hash containing a list of HTML tags that do not
 * cause a break in a resource string. These tags should
 * be included in the middle of the string.
 */
module.exports.nonBreakingTags = {
    "a": true,
    "abbr": true,
    "b": true,
    "bdi": true,
    "bdo": true,
    "br": true,
    "dfn": true,
    "del": true,
    "em": true,
    "i": true,
    "ins": true,
    "mark": true,
    "ruby": true,
    "rt": true,
    "span": true,
    "strong": true,
    "sub": true,
    "sup": true,
    "time": true,
    "u": true,
    "var": true,
    "wbr": true
};

/**
 * A hash containing a list of HTML tags that are
 * typically self-closing. That is, in HTML4 and earlier,
 * the close tag was not needed for these.
 */
module.exports.selfClosingTags = {
    "area": true,
    "base": true,
    "bdi": true,
    "bdo": true,
    "br": true,
    "embed": true,
    "hr": true,
    "img": true,
    "input": true,
    "link": true,
    "option": true,
    "param": true,
    "source": true,
    "track": true
};

/**
 * A hash containing a list of HTML tags where
 * the text content inside of those tags should be
 * ignored for localization purposes. Instead,
 * those contents should just be copied to the
 * localized file unmodified.
 */
module.exports.ignoreTags = {
    "code": true,
    "output": true,
    "samp": true,
    "script": true,
    "style": true
};

/**
 * Return an HTML-escaped version of the given string.
 * This escaped version is appropriate for use in
 * HTML attribute values.
 *
 * @param {String} str the string to escape
 * @returns {String} the escaped string
 */
module.exports.escapeQuotes = function (str) {
    var ret = "";
    if (str.length < 1) {
        return '';
    }
    var suffix = "";

    if (str[0] === '"' || str[0] === "'") {
        ret += str[0];
        str = str.substring(1);
        if (str[str.length-1] === '"' || str[str.length-1] === "'") {
            suffix = str[str.length-1];
            str = str.substring(0, str.length-1);
        }
    }

    for (var i = 0; i < str.length; i++) {
        switch (str[i]) {
        case '"':
            ret += '&quot;';
            break;
        case "'":
            ret += '&apos;';
            break;
        case '<':
            if (i+1 < str.length && str[i+1] === '%') {
                i += 2;
                ret += '<%';
                while (i+1 < str.length && (str[i] !== '%' || str[i+1] !== '>')) {
                    ret += str[i++];
                }
                if (i < str.length) {
                    ret += str[i];
                }
            } else {
                ret += "&lt;";
            }
            break;
        case '>':
            ret += (i > 0 && str[i-1] === '%') ? '>' : "&gt;";
            break;
        case '\\':
            ret += '\\';
            if (i+1 < str.length-1) {
                ret += str[++i];
            }
            break;
        default:
            ret += str[i];
            break;
        }
    }

    // trailing quote if necessary
    ret += suffix;

    return ret;
};

/**
 * Find the line number of the given character index into the data. The lastIndex
 * is the index of the last search, and indicates where to start searching this
 * time. The lastLine is the line number for the last search, and indicates where
 * to start when counting lines from the lastIndex to the given index.
 *
 * @param {String} data the data to search
 * @param {number} index the point in the data for which the line number is being sought
 * @param {number} lastIndex the point in the data where the last search left off
 * @param {number} lastLine the line number found in the last search
 * @return {number} the line number for the given index
 */
module.exports.findLineNumber = function findLineNumber(data, index, lastIndex, lastLine) {
    var num = lastLine;

    for (var i = lastIndex; i < data.length && i < index; i++) {
        if (data[i] === "\n") num++;
    }

    return num;
};

/**
 * Truncate the start of the line, leaving the given length of string
 * at the end. For example,<p>
 *
 * "abcdefghijklmnopqrstuvwxyz"<p>
 *
 * would be truncated at 10 to:<p>
 *
 * "…rstuvwxyz" <p>
 *
 * Note that the ellipsis character takes up one spot, so there are only
 * 9 characters left from the original string.
 *
 * @param {String} line the line to truncate
 * @param {number} length the length of the string to leave intact
 * @returns {String} the truncated line
 */
module.exports.truncateStart = function(line, length) {
    return (!line || line.length <= length - 1) ? line : "…" + line.substr(-length+1);
};

/**
 * Search the given data for errors using the given regular expression and
 * print the results to the log.
 * @param {String} data the contents of the file to search
 * @param {RegExp} re the regular expression to use to search that data
 * @param {String} message message to print when a problem is found
 * @param {Logger} logger the log4js logger to use for output
 * @param {String} pathName the path naeme of the file that is being read
 */
module.exports.generateWarnings = function(data, re, message, logger, pathName) {
    var line = 0, lastIndex = 0;
    var truncated = module.exports.truncateStart(pathName, 40);
    re.lastIndex = 0; // for safety
    result = re.exec(data);
    while (result) {
        line = module.exports.findLineNumber(data, result.index, lastIndex, line);
        lastIndex = result.index;
        logger.warn(message);
        logger.warn(truncated + ":" + line + ":" + result[0]);
        result = re.exec(data);
    }
};

/**
 * Clean a string for matching against other strings by removing
 * differences that are inconsequential for translation.
 *
 * @param {String} str string to clean
 * @returns {String} the cleaned string
 */
module.exports.cleanString = function(str) {
    return str.toLowerCase().
        replace(/\\n/g, " ").
        replace(/\\t/g, " ").
        replace(/\\/g, "").
        replace(/\s+/g, " ").
        trim().
        replace(/&apos;/g, "'").
        replace(/&quot;/g, '"').
        replace(/&lt;/g, "<").
        replace(/&gt;/g, ">").
        replace(/&amp;/g, "&").
        replace(/’/g, "'");
};

//list of html5 tags and their attributes that contain localizable strings
module.exports.localizableAttributes = {
    "area": {"alt":true},
    "img": {"alt":true},
    "input": {
        "alt": true,
        "placeholder": true
    },
    "optgroup": {"label":true},
    "option": {"label":true},
    "textarea": {"placeholder":true},
    "track": {"label":true}
};

var entityRE = new RegExp(/^&(\w*);/);

// HTML5 entities from https://dev.w3.org/html5/html-author/charref
var spaceEntities = {
    "MediumSpace": "\u205F",
    "NegativeMediumSpace": "\u200B",
    "NegativeThickSpace;": "\u200B",
    "NegativeThinSpace": "\u200B",
    "NegativeVeryThinSpace": "\u200B",
    "NoBreak": "\u2060",
    "ThinSpace": "\u2009",
    "VeryThinSpace": "\u200A",
    "ZeroWidthSpace": "\u200B",
    "ensp": "\u2002",
    "emsp": "\u2003",
    "emsp13": "\u2004",
    "emsp14": "\u2005",
    "hairsp": "\u200A",
    "mmsp": "\u205F",
    "nbsp": "\u00A0",
    "nnbsp": "\u202F",
    "numsp": "\u2007",
    "puncsp": "\u2008",
    "thinsp": "\u2009",
    "wj": "\u2060",
    "zwj": "\u200D",
    "zwnj": "\u200C"
};

module.exports.isNotSpaceEntity = function (s, i) {
    entityRE.lastIndex = i;
    var match = entityRE.exec(s);
    if (!match) return true;
    return !spaceEntities[match[1]];
};

/**
 * Return true if the string contains all white space characters,
 * including white space entities.
 * @param {string} str the string to check
 * @returns {boolean} true if all the characters represent white space
 */
module.exports.isAllWhite = function (str) {
    for (i = 0; i < str.length; i++) {
        if (!module.exports.isWhite(str.charAt(i)) && module.exports.isNotSpaceEntity(str, i)) return false;
    }
    return true;
};

/**
 * Convert any space entities in the string to their actual Unicode characters.
 * Other entities are left alone.
 * @param {String} str the string to unescape
 * @returns {string} the unescaped string
 */
module.exports.unescapeSpaceEntities = function(str) {
    return str.split(/(&\w+;)/g).map(function(part) {
        var name = part.substring(1, part.length-1);
        return spaceEntities[name] || part;
    }).join('');
};

/**
 * Return true if the string still contains some text after removing all HTML tags and entities.
 * @param {string} str the string to check
 * @returns {boolean} true if there is text left over, and false otherwise
 */
module.exports.containsActualText = function (str) {
    // remove the html and entities first
    var cleaned = str.replace(/<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g, "").replace(/&[a-zA-Z]+;/g, "");

    for (i = 0; i < cleaned.length; i++) {
        var c = cleaned.charAt(i);
        if (isAlnum(c) || isIdeo(c)) return true;
    }
    return false;
};

/**
 * Replace characters that are invalid in HTML documents (ie. control characters)
 * with entities to escape them.
 * @param {string} str the string to escape
 * @returns {string} the escaped string
 */
module.exports.escapeInvalidChars = function (str) {
    var ret = "";
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 0x09 || (c > 0x0D && c < 0x20)) {
            ret += "&#" + c + ";";
        } else {
            ret += str.charAt(i);
        }
    }
    return ret;
};

