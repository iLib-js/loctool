package com.healthtap;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class ScriptInfo {
	private static Map<String, String> locales = null;
	private static final String DEFAULT_SCRIPT = "Latn";
	private static final String DASH = "-";
	private static final String[][] likelyLocales = {
		{"aa", "aa-Latn-ET"},
		{"ab", "ab-Cyrl-GE"},
		{"abr", "abr-Latn-GH"},
		{"ace", "ace-Latn-ID"},
		{"ach", "ach-Latn-UG"},
		{"ady", "ady-Cyrl-RU"},
		{"ae", "ae-Avst-IR"},
		{"aeb", "aeb-Arab-TN"},
		{"af", "af-Latn-ZA"},
		{"agq", "agq-Latn-CM"},
		{"ak", "ak-Latn-GH"},
		{"akk", "akk-Xsux-IQ"},
		{"aln", "aln-Latn-XK"},
		{"alt", "alt-Cyrl-RU"},
		{"am", "am-Ethi-ET"},
		{"amo", "amo-Latn-NG"},
		{"aoz", "aoz-Latn-ID"},
		{"ar", "ar-Arab-EG"},
		{"arc", "arc-Armi-IR"},
		{"arc-Nbat", "arc-Nbat-JO"},
		{"arc-Palm", "arc-Palm-SY"},
		{"arn", "arn-Latn-CL"},
		{"aro", "aro-Latn-BO"},
		{"arq", "arq-Arab-DZ"},
		{"ary", "ary-Arab-MA"},
		{"arz", "arz-Arab-EG"},
		{"as", "as-Beng-IN"},
		{"asa", "asa-Latn-TZ"},
		{"ast", "ast-Latn-ES"},
		{"atj", "atj-Latn-CA"},
		{"av", "av-Cyrl-RU"},
		{"awa", "awa-Deva-IN"},
		{"ay", "ay-Latn-BO"},
		{"az", "az-Latn-AZ"},
		{"az-Arab", "az-Arab-IR"},
		{"az-IR", "az-Arab-IR"},
		{"az-RU", "az-Cyrl-RU"},
		{"azb", "azb-Arab-IR"},
		{"ba", "ba-Cyrl-RU"},
		{"bal", "bal-Arab-PK"},
		{"ban", "ban-Latn-ID"},
		{"bap", "bap-Deva-NP"},
		{"bar", "bar-Latn-AT"},
		{"bas", "bas-Latn-CM"},
		{"bax", "bax-Bamu-CM"},
		{"bbc", "bbc-Latn-ID"},
		{"bbj", "bbj-Latn-CM"},
		{"bci", "bci-Latn-CI"},
		{"be", "be-Cyrl-BY"},
		{"bem", "bem-Latn-ZM"},
		{"bew", "bew-Latn-ID"},
		{"bez", "bez-Latn-TZ"},
		{"bfd", "bfd-Latn-CM"},
		{"bfq", "bfq-Taml-IN"},
		{"bft", "bft-Arab-PK"},
		{"bfy", "bfy-Deva-IN"},
		{"bg", "bg-Cyrl-BG"},
		{"bgc", "bgc-Deva-IN"},
		{"bgx", "bgx-Grek-TR"},
		{"bh", "bh-Kthi-IN"},
		{"bhb", "bhb-Deva-IN"},
		{"bhi", "bhi-Deva-IN"},
		{"bhk", "bhk-Latn-PH"},
		{"bho", "bho-Deva-IN"},
		{"bi", "bi-Latn-VU"},
		{"bik", "bik-Latn-PH"},
		{"bin", "bin-Latn-NG"},
		{"bjj", "bjj-Deva-IN"},
		{"bjn", "bjn-Latn-ID"},
		{"bkm", "bkm-Latn-CM"},
		{"bku", "bku-Latn-PH"},
		{"blt", "blt-Tavt-VN"},
		{"bm", "bm-Latn-ML"},
		{"bmq", "bmq-Latn-ML"},
		{"bn", "bn-Beng-BD"},
		{"bo", "bo-Tibt-CN"},
		{"bpy", "bpy-Beng-IN"},
		{"bqi", "bqi-Arab-IR"},
		{"bqv", "bqv-Latn-CI"},
		{"br", "br-Latn-FR"},
		{"bra", "bra-Deva-IN"},
		{"brh", "brh-Arab-PK"},
		{"brx", "brx-Deva-IN"},
		{"bs", "bs-Latn-BA"},
		{"bsq", "bsq-Bass-LR"},
		{"bss", "bss-Latn-CM"},
		{"bto", "bto-Latn-PH"},
		{"btv", "btv-Deva-PK"},
		{"bua", "bua-Cyrl-RU"},
		{"buc", "buc-Latn-YT"},
		{"bug", "bug-Latn-ID"},
		{"bum", "bum-Latn-CM"},
		{"bvb", "bvb-Latn-GQ"},
		{"byn", "byn-Ethi-ER"},
		{"byv", "byv-Latn-CM"},
		{"bze", "bze-Latn-ML"},
		{"ca", "ca-Latn-ES"},
		{"cch", "cch-Latn-NG"},
		{"ccp", "ccp-Beng-IN"},
		{"ccp-Cakm", "ccp-Cakm-BD"},
		{"ce", "ce-Cyrl-RU"},
		{"ceb", "ceb-Latn-PH"},
		{"cgg", "cgg-Latn-UG"},
		{"ch", "ch-Latn-GU"},
		{"chk", "chk-Latn-FM"},
		{"chm", "chm-Cyrl-RU"},
		{"chp", "chp-Latn-CA"},
		{"chr", "chr-Cher-US"},
		{"cja", "cja-Arab-KH"},
		{"cjm", "cjm-Cham-VN"},
		{"ckb", "ckb-Arab-IQ"},
		{"co", "co-Latn-FR"},
		{"cop", "cop-Copt-EG"},
		{"cps", "cps-Latn-PH"},
		{"cr", "cr-Cans-CA"},
		{"crj", "crj-Cans-CA"},
		{"crk", "crk-Cans-CA"},
		{"crl", "crl-Cans-CA"},
		{"crm", "crm-Cans-CA"},
		{"crs", "crs-Latn-SC"},
		{"cs", "cs-Latn-CZ"},
		{"csb", "csb-Latn-PL"},
		{"csw", "csw-Cans-CA"},
		{"ctd", "ctd-Pauc-MM"},
		{"cu", "cu-Cyrl-RU"},
		{"cu-Glag", "cu-Glag-BG"},
		{"cv", "cv-Cyrl-RU"},
		{"cy", "cy-Latn-GB"},
		{"da", "da-Latn-DK"},
		{"dar", "dar-Cyrl-RU"},
		{"dav", "dav-Latn-KE"},
		{"dcc", "dcc-Arab-IN"},
		{"de", "de-Latn-DE"},
		{"den", "den-Latn-CA"},
		{"dgr", "dgr-Latn-CA"},
		{"dje", "dje-Latn-NE"},
		{"dnj", "dnj-Latn-CI"},
		{"doi", "doi-Arab-IN"},
		{"dsb", "dsb-Latn-DE"},
		{"dtm", "dtm-Latn-ML"},
		{"dtp", "dtp-Latn-MY"},
		{"dua", "dua-Latn-CM"},
		{"dv", "dv-Thaa-MV"},
		{"dyo", "dyo-Latn-SN"},
		{"dyu", "dyu-Latn-BF"},
		{"dz", "dz-Tibt-BT"},
		{"ebu", "ebu-Latn-KE"},
		{"ee", "ee-Latn-GH"},
		{"efi", "efi-Latn-NG"},
		{"egl", "egl-Latn-IT"},
		{"egy", "egy-Egyp-EG"},
		{"eky", "eky-Kali-MM"},
		{"el", "el-Grek-GR"},
		{"en", "en-Latn-US"},
		{"en-Shaw", "en-Shaw-GB"},
		{"eo", "eo-Latn-001"},
		{"es", "es-Latn-ES"},
		{"esu", "esu-Latn-US"},
		{"et", "et-Latn-EE"},
		{"ett", "ett-Ital-IT"},
		{"eu", "eu-Latn-ES"},
		{"ewo", "ewo-Latn-CM"},
		{"ext", "ext-Latn-ES"},
		{"fa", "fa-Arab-IR"},
		{"fan", "fan-Latn-GQ"},
		{"ff", "ff-Latn-SN"},
		{"ffm", "ffm-Latn-ML"},
		{"fi", "fi-Latn-FI"},
		{"fil", "fil-Latn-PH"},
		{"fit", "fit-Latn-SE"},
		{"fj", "fj-Latn-FJ"},
		{"fo", "fo-Latn-FO"},
		{"fon", "fon-Latn-BJ"},
		{"fr", "fr-Latn-FR"},
		{"frc", "frc-Latn-US"},
		{"frp", "frp-Latn-FR"},
		{"frr", "frr-Latn-DE"},
		{"frs", "frs-Latn-DE"},
		{"fud", "fud-Latn-WF"},
		{"fuq", "fuq-Latn-NE"},
		{"fur", "fur-Latn-IT"},
		{"fuv", "fuv-Latn-NG"},
		{"fy", "fy-Latn-NL"},
		{"ga", "ga-Latn-IE"},
		{"gaa", "gaa-Latn-GH"},
		{"gag", "gag-Latn-MD"},
		{"gan", "gan-Hans-CN"},
		{"gbm", "gbm-Deva-IN"},
		{"gbz", "gbz-Arab-IR"},
		{"gcr", "gcr-Latn-GF"},
		{"gd", "gd-Latn-GB"},
		{"gez", "gez-Ethi-ET"},
		{"ggn", "ggn-Deva-NP"},
		{"gil", "gil-Latn-KI"},
		{"gjk", "gjk-Arab-PK"},
		{"gju", "gju-Arab-PK"},
		{"gl", "gl-Latn-ES"},
		{"glk", "glk-Arab-IR"},
		{"gn", "gn-Latn-PY"},
		{"gom", "gom-Deva-IN"},
		{"gon", "gon-Telu-IN"},
		{"gor", "gor-Latn-ID"},
		{"gos", "gos-Latn-NL"},
		{"got", "got-Goth-UA"},
		{"grc", "grc-Cprt-CY"},
		{"grc-Linb", "grc-Linb-GR"},
		{"grt", "grt-Beng-IN"},
		{"gsw", "gsw-Latn-CH"},
		{"gu", "gu-Gujr-IN"},
		{"gub", "gub-Latn-BR"},
		{"guc", "guc-Latn-CO"},
		{"gur", "gur-Latn-GH"},
		{"guz", "guz-Latn-KE"},
		{"gv", "gv-Latn-IM"},
		{"gvr", "gvr-Deva-NP"},
		{"gwi", "gwi-Latn-CA"},
		{"ha", "ha-Latn-NG"},
		{"ha-CM", "ha-Arab-CM"},
		{"ha-SD", "ha-Arab-SD"},
		{"hak", "hak-Hans-CN"},
		{"haw", "haw-Latn-US"},
		{"haz", "haz-Arab-AF"},
		{"he", "he-Hebr-IL"},
		{"hi", "hi-Deva-IN"},
		{"hif", "hif-Deva-FJ"},
		{"hil", "hil-Latn-PH"},
		{"hmd", "hmd-Plrd-CN"},
		{"hnd", "hnd-Arab-PK"},
		{"hne", "hne-Deva-IN"},
		{"hnj", "hnj-Hmng-LA"},
		{"hnn", "hnn-Latn-PH"},
		{"hno", "hno-Arab-PK"},
		{"ho", "ho-Latn-PG"},
		{"hoc", "hoc-Deva-IN"},
		{"hoj", "hoj-Deva-IN"},
		{"hr", "hr-Latn-HR"},
		{"hsb", "hsb-Latn-DE"},
		{"hsn", "hsn-Hans-CN"},
		{"ht", "ht-Latn-HT"},
		{"hu", "hu-Latn-HU"},
		{"hy", "hy-Armn-AM"},
		{"ia", "ia-Latn-FR"},
		{"ibb", "ibb-Latn-NG"},
		{"id", "id-Latn-ID"},
		{"ig", "ig-Latn-NG"},
		{"ii", "ii-Yiii-CN"},
		{"ik", "ik-Latn-US"},
		{"ikt", "ikt-Latn-CA"},
		{"ilo", "ilo-Latn-PH"},
		{"in", "in-Latn-ID"},
		{"inh", "inh-Cyrl-RU"},
		{"is", "is-Latn-IS"},
		{"it", "it-Latn-IT"},
		{"iu", "iu-Cans-CA"},
		{"iw", "iw-Hebr-IL"},
		{"izh", "izh-Latn-RU"},
		{"ja", "ja-Jpan-JP"},
		{"jam", "jam-Latn-JM"},
		{"jgo", "jgo-Latn-CM"},
		{"ji", "ji-Hebr-UA"},
		{"jmc", "jmc-Latn-TZ"},
		{"jml", "jml-Deva-NP"},
		{"jut", "jut-Latn-DK"},
		{"jv", "jv-Latn-ID"},
		{"jw", "jw-Latn-ID"},
		{"ka", "ka-Geor-GE"},
		{"kaa", "kaa-Cyrl-UZ"},
		{"kab", "kab-Latn-DZ"},
		{"kaj", "kaj-Latn-NG"},
		{"kam", "kam-Latn-KE"},
		{"kao", "kao-Latn-ML"},
		{"kbd", "kbd-Cyrl-RU"},
		{"kcg", "kcg-Latn-NG"},
		{"kck", "kck-Latn-ZW"},
		{"kde", "kde-Latn-TZ"},
		{"kdt", "kdt-Thai-TH"},
		{"kea", "kea-Latn-CV"},
		{"ken", "ken-Latn-CM"},
		{"kfo", "kfo-Latn-CI"},
		{"kfr", "kfr-Deva-IN"},
		{"kfy", "kfy-Deva-IN"},
		{"kg", "kg-Latn-CD"},
		{"kge", "kge-Latn-ID"},
		{"kgp", "kgp-Latn-BR"},
		{"kha", "kha-Latn-IN"},
		{"khb", "khb-Talu-CN"},
		{"khn", "khn-Deva-IN"},
		{"khq", "khq-Latn-ML"},
		{"kht", "kht-Mymr-IN"},
		{"khw", "khw-Arab-PK"},
		{"ki", "ki-Latn-KE"},
		{"kiu", "kiu-Latn-TR"},
		{"kj", "kj-Latn-NA"},
		{"kjg", "kjg-Laoo-LA"},
		{"kk", "kk-Cyrl-KZ"},
		{"kk-AF", "kk-Arab-AF"},
		{"kk-Arab", "kk-Arab-CN"},
		{"kk-CN", "kk-Arab-CN"},
		{"kk-IR", "kk-Arab-IR"},
		{"kk-MN", "kk-Arab-MN"},
		{"kkj", "kkj-Latn-CM"},
		{"kl", "kl-Latn-GL"},
		{"kln", "kln-Latn-KE"},
		{"km", "km-Khmr-KH"},
		{"kmb", "kmb-Latn-AO"},
		{"kn", "kn-Knda-IN"},
		{"ko", "ko-Kore-KR"},
		{"koi", "koi-Cyrl-RU"},
		{"kok", "kok-Deva-IN"},
		{"kos", "kos-Latn-FM"},
		{"kpe", "kpe-Latn-LR"},
		{"krc", "krc-Cyrl-RU"},
		{"kri", "kri-Latn-SL"},
		{"krj", "krj-Latn-PH"},
		{"krl", "krl-Latn-RU"},
		{"kru", "kru-Deva-IN"},
		{"ks", "ks-Arab-IN"},
		{"ksb", "ksb-Latn-TZ"},
		{"ksf", "ksf-Latn-CM"},
		{"ksh", "ksh-Latn-DE"},
		{"ku", "ku-Latn-TR"},
		{"ku-Arab", "ku-Arab-IQ"},
		{"ku-LB", "ku-Arab-LB"},
		{"kum", "kum-Cyrl-RU"},
		{"kv", "kv-Cyrl-RU"},
		{"kvr", "kvr-Latn-ID"},
		{"kvx", "kvx-Arab-PK"},
		{"kw", "kw-Latn-GB"},
		{"kxm", "kxm-Thai-TH"},
		{"kxp", "kxp-Arab-PK"},
		{"ky", "ky-Cyrl-KG"},
		{"ky-Arab", "ky-Arab-CN"},
		{"ky-CN", "ky-Arab-CN"},
		{"ky-Latn", "ky-Latn-TR"},
		{"ky-TR", "ky-Latn-TR"},
		{"la", "la-Latn-VA"},
		{"lab", "lab-Lina-GR"},
		{"lad", "lad-Hebr-IL"},
		{"lag", "lag-Latn-TZ"},
		{"lah", "lah-Arab-PK"},
		{"laj", "laj-Latn-UG"},
		{"lb", "lb-Latn-LU"},
		{"lbe", "lbe-Cyrl-RU"},
		{"lbw", "lbw-Latn-ID"},
		{"lcp", "lcp-Thai-CN"},
		{"lep", "lep-Lepc-IN"},
		{"lez", "lez-Cyrl-RU"},
		{"lg", "lg-Latn-UG"},
		{"li", "li-Latn-NL"},
		{"lif", "lif-Deva-NP"},
		{"lif-Limb", "lif-Limb-IN"},
		{"lij", "lij-Latn-IT"},
		{"lis", "lis-Lisu-CN"},
		{"ljp", "ljp-Latn-ID"},
		{"lki", "lki-Arab-IR"},
		{"lkt", "lkt-Latn-US"},
		{"lmn", "lmn-Telu-IN"},
		{"lmo", "lmo-Latn-IT"},
		{"ln", "ln-Latn-CD"},
		{"lo", "lo-Laoo-LA"},
		{"lol", "lol-Latn-CD"},
		{"loz", "loz-Latn-ZM"},
		{"lrc", "lrc-Arab-IR"},
		{"lt", "lt-Latn-LT"},
		{"ltg", "ltg-Latn-LV"},
		{"lu", "lu-Latn-CD"},
		{"lua", "lua-Latn-CD"},
		{"luo", "luo-Latn-KE"},
		{"luy", "luy-Latn-KE"},
		{"luz", "luz-Arab-IR"},
		{"lv", "lv-Latn-LV"},
		{"lwl", "lwl-Thai-TH"},
		{"lzh", "lzh-Hans-CN"},
		{"lzz", "lzz-Latn-TR"},
		{"mad", "mad-Latn-ID"},
		{"maf", "maf-Latn-CM"},
		{"mag", "mag-Deva-IN"},
		{"mai", "mai-Deva-IN"},
		{"mak", "mak-Latn-ID"},
		{"man", "man-Latn-GM"},
		{"man-GN", "man-Nkoo-GN"},
		{"man-Nkoo", "man-Nkoo-GN"},
		{"mas", "mas-Latn-KE"},
		{"maz", "maz-Latn-MX"},
		{"mdf", "mdf-Cyrl-RU"},
		{"mdh", "mdh-Latn-PH"},
		{"mdr", "mdr-Latn-ID"},
		{"men", "men-Latn-SL"},
		{"mer", "mer-Latn-KE"},
		{"mfa", "mfa-Arab-TH"},
		{"mfe", "mfe-Latn-MU"},
		{"mg", "mg-Latn-MG"},
		{"mgh", "mgh-Latn-MZ"},
		{"mgo", "mgo-Latn-CM"},
		{"mgp", "mgp-Deva-NP"},
		{"mgy", "mgy-Latn-TZ"},
		{"mh", "mh-Latn-MH"},
		{"mi", "mi-Latn-NZ"},
		{"min", "min-Latn-ID"},
		{"mk", "mk-Cyrl-MK"},
		{"ml", "ml-Mlym-IN"},
		{"mn", "mn-Cyrl-MN"},
		{"mn-CN", "mn-Mong-CN"},
		{"mn-Mong", "mn-Mong-CN"},
		{"mni", "mni-Beng-IN"},
		{"mnw", "mnw-Mymr-MM"},
		{"moe", "moe-Latn-CA"},
		{"moh", "moh-Latn-CA"},
		{"mos", "mos-Latn-BF"},
		{"mr", "mr-Deva-IN"},
		{"mrd", "mrd-Deva-NP"},
		{"mrj", "mrj-Cyrl-RU"},
		{"mru", "mru-Mroo-BD"},
		{"ms", "ms-Latn-MY"},
		{"ms-CC", "ms-Arab-CC"},
		{"ms-ID", "ms-Arab-ID"},
		{"mt", "mt-Latn-MT"},
		{"mtr", "mtr-Deva-IN"},
		{"mua", "mua-Latn-CM"},
		{"mvy", "mvy-Arab-PK"},
		{"mwk", "mwk-Latn-ML"},
		{"mwr", "mwr-Deva-IN"},
		{"mwv", "mwv-Latn-ID"},
		{"mxc", "mxc-Latn-ZW"},
		{"my", "my-Mymr-MM"},
		{"myv", "myv-Cyrl-RU"},
		{"myx", "myx-Latn-UG"},
		{"myz", "myz-Mand-IR"},
		{"mzn", "mzn-Arab-IR"},
		{"na", "na-Latn-NR"},
		{"nan", "nan-Hans-CN"},
		{"nap", "nap-Latn-IT"},
		{"naq", "naq-Latn-NA"},
		{"nb", "nb-Latn-NO"},
		{"nch", "nch-Latn-MX"},
		{"nd", "nd-Latn-ZW"},
		{"ndc", "ndc-Latn-MZ"},
		{"nds", "nds-Latn-DE"},
		{"ne", "ne-Deva-NP"},
		{"new", "new-Deva-NP"},
		{"ng", "ng-Latn-NA"},
		{"ngl", "ngl-Latn-MZ"},
		{"nhe", "nhe-Latn-MX"},
		{"nhw", "nhw-Latn-MX"},
		{"nij", "nij-Latn-ID"},
		{"niu", "niu-Latn-NU"},
		{"njo", "njo-Latn-IN"},
		{"nl", "nl-Latn-NL"},
		{"nmg", "nmg-Latn-CM"},
		{"nn", "nn-Latn-NO"},
		{"nnh", "nnh-Latn-CM"},
		{"no", "no-Latn-NO"},
		{"nod", "nod-Lana-TH"},
		{"noe", "noe-Deva-IN"},
		{"non", "non-Runr-SE"},
		{"nqo", "nqo-Nkoo-GN"},
		{"nr", "nr-Latn-ZA"},
		{"nsk", "nsk-Cans-CA"},
		{"nso", "nso-Latn-ZA"},
		{"nus", "nus-Latn-SD"},
		{"nv", "nv-Latn-US"},
		{"nxq", "nxq-Latn-CN"},
		{"ny", "ny-Latn-MW"},
		{"nym", "nym-Latn-TZ"},
		{"nyn", "nyn-Latn-UG"},
		{"oc", "oc-Latn-FR"},
		{"om", "om-Latn-ET"},
		{"or", "or-Orya-IN"},
		{"or-Orya", "or-Orya-IN"},
		{"os", "os-Cyrl-GE"},
		{"otk", "otk-Orkh-MN"},
		{"pa", "pa-Guru-IN"},
		{"pa-Arab", "pa-Arab-PK"},
		{"pa-PK", "pa-Arab-PK"},
		{"pag", "pag-Latn-PH"},
		{"pal", "pal-Phli-IR"},
		{"pal-Phlp", "pal-Phlp-CN"},
		{"pam", "pam-Latn-PH"},
		{"pap", "pap-Latn-AW"},
		{"pau", "pau-Latn-PW"},
		{"pcd", "pcd-Latn-FR"},
		{"pcm", "pcm-Latn-NG"},
		{"pdc", "pdc-Latn-US"},
		{"pdt", "pdt-Latn-CA"},
		{"peo", "peo-Xpeo-IR"},
		{"pfl", "pfl-Latn-DE"},
		{"phn", "phn-Phnx-LB"},
		{"pka", "pka-Brah-IN"},
		{"pko", "pko-Latn-KE"},
		{"pl", "pl-Latn-PL"},
		{"pms", "pms-Latn-IT"},
		{"pnt", "pnt-Grek-GR"},
		{"pon", "pon-Latn-FM"},
		{"pra", "pra-Khar-PK"},
		{"prd", "prd-Arab-IR"},
		{"prg", "prg-Latn-001"},
		{"ps", "ps-Arab-AF"},
		{"pt", "pt-Latn-BR"},
		{"puu", "puu-Latn-GA"},
		{"qu", "qu-Latn-PE"},
		{"quc", "quc-Latn-GT"},
		{"qug", "qug-Latn-EC"},
		{"raj", "raj-Latn-IN"},
		{"rcf", "rcf-Latn-RE"},
		{"rej", "rej-Latn-ID"},
		{"rgn", "rgn-Latn-IT"},
		{"ria", "ria-Latn-IN"},
		{"rif", "rif-Tfng-MA"},
		{"rif-NL", "rif-Latn-NL"},
		{"rjs", "rjs-Deva-NP"},
		{"rkt", "rkt-Beng-BD"},
		{"rm", "rm-Latn-CH"},
		{"rmf", "rmf-Latn-FI"},
		{"rmo", "rmo-Latn-CH"},
		{"rmt", "rmt-Arab-IR"},
		{"rmu", "rmu-Latn-SE"},
		{"rn", "rn-Latn-BI"},
		{"rng", "rng-Latn-MZ"},
		{"ro", "ro-Latn-RO"},
		{"rob", "rob-Latn-ID"},
		{"rof", "rof-Latn-TZ"},
		{"rtm", "rtm-Latn-FJ"},
		{"ru", "ru-Cyrl-RU"},
		{"rue", "rue-Cyrl-UA"},
		{"rug", "rug-Latn-SB"},
		{"rw", "rw-Latn-RW"},
		{"rwk", "rwk-Latn-TZ"},
		{"ryu", "ryu-Kana-JP"},
		{"sa", "sa-Deva-IN"},
		{"saf", "saf-Latn-GH"},
		{"sah", "sah-Cyrl-RU"},
		{"saq", "saq-Latn-KE"},
		{"sas", "sas-Latn-ID"},
		{"sat", "sat-Latn-IN"},
		{"saz", "saz-Saur-IN"},
		{"sbp", "sbp-Latn-TZ"},
		{"sc", "sc-Latn-IT"},
		{"sck", "sck-Deva-IN"},
		{"scn", "scn-Latn-IT"},
		{"sco", "sco-Latn-GB"},
		{"scs", "scs-Latn-CA"},
		{"sd", "sd-Arab-PK"},
		{"sd-Deva", "sd-Deva-IN"},
		{"sd-Khoj", "sd-Khoj-IN"},
		{"sd-Sind", "sd-Sind-IN"},
		{"sdc", "sdc-Latn-IT"},
		{"se", "se-Latn-NO"},
		{"sef", "sef-Latn-CI"},
		{"seh", "seh-Latn-MZ"},
		{"sei", "sei-Latn-MX"},
		{"ses", "ses-Latn-ML"},
		{"sg", "sg-Latn-CF"},
		{"sga", "sga-Ogam-IE"},
		{"sgs", "sgs-Latn-LT"},
		{"shi", "shi-Tfng-MA"},
		{"shn", "shn-Mymr-MM"},
		{"si", "si-Sinh-LK"},
		{"sid", "sid-Latn-ET"},
		{"sk", "sk-Latn-SK"},
		{"skr", "skr-Arab-PK"},
		{"sl", "sl-Latn-SI"},
		{"sli", "sli-Latn-PL"},
		{"sly", "sly-Latn-ID"},
		{"sm", "sm-Latn-WS"},
		{"sma", "sma-Latn-SE"},
		{"smj", "smj-Latn-SE"},
		{"smn", "smn-Latn-FI"},
		{"smp", "smp-Samr-IL"},
		{"sms", "sms-Latn-FI"},
		{"sn", "sn-Latn-ZW"},
		{"snk", "snk-Latn-ML"},
		{"so", "so-Latn-SO"},
		{"sou", "sou-Thai-TH"},
		{"sq", "sq-Latn-AL"},
		{"sr", "sr-Cyrl-RS"},
		{"sr-ME", "sr-Latn-ME"},
		{"sr-RO", "sr-Latn-RO"},
		{"sr-RU", "sr-Latn-RU"},
		{"sr-TR", "sr-Latn-TR"},
		{"srb", "srb-Sora-IN"},
		{"srn", "srn-Latn-SR"},
		{"srr", "srr-Latn-SN"},
		{"srx", "srx-Deva-IN"},
		{"ss", "ss-Latn-ZA"},
		{"ssy", "ssy-Latn-ER"},
		{"st", "st-Latn-ZA"},
		{"stq", "stq-Latn-DE"},
		{"su", "su-Latn-ID"},
		{"suk", "suk-Latn-TZ"},
		{"sus", "sus-Latn-GN"},
		{"sv", "sv-Latn-SE"},
		{"sw", "sw-Latn-TZ"},
		{"swb", "swb-Arab-YT"},
		{"swc", "swc-Latn-CD"},
		{"swv", "swv-Deva-IN"},
		{"sxn", "sxn-Latn-ID"},
		{"syl", "syl-Beng-BD"},
		{"syr", "syr-Syrc-IQ"},
		{"szl", "szl-Latn-PL"},
		{"ta", "ta-Taml-IN"},
		{"taj", "taj-Deva-NP"},
		{"tbw", "tbw-Latn-PH"},
		{"tcy", "tcy-Knda-IN"},
		{"tdd", "tdd-Tale-CN"},
		{"tdg", "tdg-Deva-NP"},
		{"tdh", "tdh-Deva-NP"},
		{"te", "te-Telu-IN"},
		{"tem", "tem-Latn-SL"},
		{"teo", "teo-Latn-UG"},
		{"tet", "tet-Latn-TL"},
		{"tg", "tg-Cyrl-TJ"},
		{"tg-Arab", "tg-Arab-PK"},
		{"tg-PK", "tg-Arab-PK"},
		{"th", "th-Thai-TH"},
		{"thl", "thl-Deva-NP"},
		{"thq", "thq-Deva-NP"},
		{"thr", "thr-Deva-NP"},
		{"ti", "ti-Ethi-ET"},
		{"tig", "tig-Ethi-ER"},
		{"tiv", "tiv-Latn-NG"},
		{"tk", "tk-Latn-TM"},
		{"tkl", "tkl-Latn-TK"},
		{"tkr", "tkr-Latn-AZ"},
		{"tkt", "tkt-Deva-NP"},
		{"tl", "tl-Latn-PH"},
		{"tly", "tly-Latn-AZ"},
		{"tmh", "tmh-Latn-NE"},
		{"tn", "tn-Latn-ZA"},
		{"to", "to-Latn-TO"},
		{"tpi", "tpi-Latn-PG"},
		{"tr", "tr-Latn-TR"},
		{"tru", "tru-Latn-TR"},
		{"trv", "trv-Latn-TW"},
		{"ts", "ts-Latn-ZA"},
		{"tsd", "tsd-Grek-GR"},
		{"tsf", "tsf-Deva-NP"},
		{"tsg", "tsg-Latn-PH"},
		{"tsj", "tsj-Tibt-BT"},
		{"tt", "tt-Cyrl-RU"},
		{"ttj", "ttj-Latn-UG"},
		{"tts", "tts-Thai-TH"},
		{"ttt", "ttt-Latn-AZ"},
		{"tum", "tum-Latn-MW"},
		{"tvl", "tvl-Latn-TV"},
		{"twq", "twq-Latn-NE"},
		{"ty", "ty-Latn-PF"},
		{"tyv", "tyv-Cyrl-RU"},
		{"tzm", "tzm-Latn-MA"},
		{"udm", "udm-Cyrl-RU"},
		{"ug", "ug-Arab-CN"},
		{"ug-Cyrl", "ug-Cyrl-KZ"},
		{"ug-KZ", "ug-Cyrl-KZ"},
		{"ug-MN", "ug-Cyrl-MN"},
		{"uga", "uga-Ugar-SY"},
		{"uk", "uk-Cyrl-UA"},
		{"uli", "uli-Latn-FM"},
		{"umb", "umb-Latn-AO"},
		{"und", "en-Latn-US"},
		{"AD", "ca-Latn-AD"},
		{"AE", "ar-Arab-AE"},
		{"AF", "fa-Arab-AF"},
		{"AL", "sq-Latn-AL"},
		{"AM", "hy-Armn-AM"},
		{"AO", "pt-Latn-AO"},
		{"AQ", "und-Latn-AQ"},
		{"AR", "es-Latn-AR"},
		{"AS", "sm-Latn-AS"},
		{"AT", "de-Latn-AT"},
		{"AW", "nl-Latn-AW"},
		{"AX", "sv-Latn-AX"},
		{"AZ", "az-Latn-AZ"},
		{"Aghb", "lez-Aghb-RU"},
		{"Arab", "ar-Arab-EG"},
		{"Arab-CC", "ms-Arab-CC"},
		{"Arab-CN", "ug-Arab-CN"},
		{"Arab-GB", "ks-Arab-GB"},
		{"Arab-ID", "ms-Arab-ID"},
		{"Arab-IN", "ur-Arab-IN"},
		{"Arab-KH", "cja-Arab-KH"},
		{"Arab-MN", "kk-Arab-MN"},
		{"Arab-MU", "ur-Arab-MU"},
		{"Arab-NG", "ha-Arab-NG"},
		{"Arab-PK", "ur-Arab-PK"},
		{"Arab-TH", "mfa-Arab-TH"},
		{"Arab-TJ", "fa-Arab-TJ"},
		{"Arab-YT", "swb-Arab-YT"},
		{"Armi", "arc-Armi-IR"},
		{"Armn", "hy-Armn-AM"},
		{"Avst", "ae-Avst-IR"},
		{"BA", "bs-Latn-BA"},
		{"BD", "bn-Beng-BD"},
		{"BE", "nl-Latn-BE"},
		{"BF", "fr-Latn-BF"},
		{"BG", "bg-Cyrl-BG"},
		{"BH", "ar-Arab-BH"},
		{"BI", "rn-Latn-BI"},
		{"BJ", "fr-Latn-BJ"},
		{"BL", "fr-Latn-BL"},
		{"BN", "ms-Latn-BN"},
		{"BO", "es-Latn-BO"},
		{"BQ", "pap-Latn-BQ"},
		{"BR", "pt-Latn-BR"},
		{"BT", "dz-Tibt-BT"},
		{"BV", "und-Latn-BV"},
		{"BY", "be-Cyrl-BY"},
		{"Bali", "ban-Bali-ID"},
		{"Bamu", "bax-Bamu-CM"},
		{"Bass", "bsq-Bass-LR"},
		{"Batk", "bbc-Batk-ID"},
		{"Beng", "bn-Beng-BD"},
		{"Bopo", "zh-Bopo-TW"},
		{"Brah", "pka-Brah-IN"},
		{"Brai", "fr-Brai-FR"},
		{"Bugi", "bug-Bugi-ID"},
		{"Buhd", "bku-Buhd-PH"},
		{"CD", "sw-Latn-CD"},
		{"CF", "fr-Latn-CF"},
		{"CG", "fr-Latn-CG"},
		{"CH", "de-Latn-CH"},
		{"CI", "fr-Latn-CI"},
		{"CL", "es-Latn-CL"},
		{"CM", "fr-Latn-CM"},
		{"CN", "zh-Hans-CN"},
		{"CO", "es-Latn-CO"},
		{"CP", "und-Latn-CP"},
		{"CR", "es-Latn-CR"},
		{"CU", "es-Latn-CU"},
		{"CV", "pt-Latn-CV"},
		{"CW", "pap-Latn-CW"},
		{"CY", "el-Grek-CY"},
		{"CZ", "cs-Latn-CZ"},
		{"Cakm", "ccp-Cakm-BD"},
		{"Cans", "cr-Cans-CA"},
		{"Cari", "xcr-Cari-TR"},
		{"Cham", "cjm-Cham-VN"},
		{"Cher", "chr-Cher-US"},
		{"Copt", "cop-Copt-EG"},
		{"Cprt", "grc-Cprt-CY"},
		{"Cyrl", "ru-Cyrl-RU"},
		{"Cyrl-AL", "mk-Cyrl-AL"},
		{"Cyrl-BA", "sr-Cyrl-BA"},
		{"Cyrl-GE", "ab-Cyrl-GE"},
		{"Cyrl-GR", "mk-Cyrl-GR"},
		{"Cyrl-MD", "uk-Cyrl-MD"},
		{"Cyrl-PL", "be-Cyrl-PL"},
		{"Cyrl-RO", "bg-Cyrl-RO"},
		{"Cyrl-SK", "uk-Cyrl-SK"},
		{"Cyrl-TR", "kbd-Cyrl-TR"},
		{"Cyrl-XK", "sr-Cyrl-XK"},
		{"DE", "de-Latn-DE"},
		{"DJ", "aa-Latn-DJ"},
		{"DK", "da-Latn-DK"},
		{"DO", "es-Latn-DO"},
		{"DZ", "ar-Arab-DZ"},
		{"Deva", "hi-Deva-IN"},
		{"Deva-BT", "ne-Deva-BT"},
		{"Deva-FJ", "hif-Deva-FJ"},
		{"Deva-MU", "bho-Deva-MU"},
		{"Deva-PK", "btv-Deva-PK"},
		{"Dupl", "fr-Dupl-FR"},
		{"EA", "es-Latn-EA"},
		{"EC", "es-Latn-EC"},
		{"EE", "et-Latn-EE"},
		{"EG", "ar-Arab-EG"},
		{"EH", "ar-Arab-EH"},
		{"ER", "ti-Ethi-ER"},
		{"ES", "es-Latn-ES"},
		{"ET", "am-Ethi-ET"},
		{"EU", "en-Latn-GB"},
		{"Egyp", "egy-Egyp-EG"},
		{"Elba", "sq-Elba-AL"},
		{"Ethi", "am-Ethi-ET"},
		{"FI", "fi-Latn-FI"},
		{"FM", "chk-Latn-FM"},
		{"FO", "fo-Latn-FO"},
		{"FR", "fr-Latn-FR"},
		{"GA", "fr-Latn-GA"},
		{"GE", "ka-Geor-GE"},
		{"GF", "fr-Latn-GF"},
		{"GH", "ak-Latn-GH"},
		{"GL", "kl-Latn-GL"},
		{"GN", "fr-Latn-GN"},
		{"GP", "fr-Latn-GP"},
		{"GQ", "es-Latn-GQ"},
		{"GR", "el-Grek-GR"},
		{"GS", "und-Latn-GS"},
		{"GT", "es-Latn-GT"},
		{"GW", "pt-Latn-GW"},
		{"Geor", "ka-Geor-GE"},
		{"Glag", "cu-Glag-BG"},
		{"Goth", "got-Goth-UA"},
		{"Gran", "sa-Gran-IN"},
		{"Grek", "el-Grek-GR"},
		{"Grek-TR", "bgx-Grek-TR"},
		{"Gujr", "gu-Gujr-IN"},
		{"Guru", "pa-Guru-IN"},
		{"HK", "zh-Hant-HK"},
		{"HM", "und-Latn-HM"},
		{"HN", "es-Latn-HN"},
		{"HR", "hr-Latn-HR"},
		{"HT", "ht-Latn-HT"},
		{"HU", "hu-Latn-HU"},
		{"Hang", "ko-Hang-KR"},
		{"Hani", "zh-Hani-CN"},
		{"Hano", "hnn-Hano-PH"},
		{"Hans", "zh-Hans-CN"},
		{"Hant", "zh-Hant-TW"},
		{"Hebr", "he-Hebr-IL"},
		{"Hebr-CA", "yi-Hebr-CA"},
		{"Hebr-GB", "yi-Hebr-GB"},
		{"Hebr-SE", "yi-Hebr-SE"},
		{"Hebr-UA", "yi-Hebr-UA"},
		{"Hebr-US", "yi-Hebr-US"},
		{"Hira", "ja-Hira-JP"},
		{"Hmng", "hnj-Hmng-LA"},
		{"IC", "es-Latn-IC"},
		{"ID", "id-Latn-ID"},
		{"IL", "he-Hebr-IL"},
		{"IN", "hi-Deva-IN"},
		{"IQ", "ar-Arab-IQ"},
		{"IR", "fa-Arab-IR"},
		{"IS", "is-Latn-IS"},
		{"IT", "it-Latn-IT"},
		{"Ital", "ett-Ital-IT"},
		{"JO", "ar-Arab-JO"},
		{"JP", "ja-Jpan-JP"},
		{"Java", "jv-Java-ID"},
		{"Jpan", "ja-Jpan-JP"},
		{"KG", "ky-Cyrl-KG"},
		{"KH", "km-Khmr-KH"},
		{"KM", "ar-Arab-KM"},
		{"KP", "ko-Kore-KP"},
		{"KR", "ko-Kore-KR"},
		{"KW", "ar-Arab-KW"},
		{"KZ", "ru-Cyrl-KZ"},
		{"Kali", "eky-Kali-MM"},
		{"Kana", "ja-Kana-JP"},
		{"Khar", "pra-Khar-PK"},
		{"Khmr", "km-Khmr-KH"},
		{"Khoj", "sd-Khoj-IN"},
		{"Knda", "kn-Knda-IN"},
		{"Kore", "ko-Kore-KR"},
		{"Kthi", "bh-Kthi-IN"},
		{"LA", "lo-Laoo-LA"},
		{"LB", "ar-Arab-LB"},
		{"LI", "de-Latn-LI"},
		{"LK", "si-Sinh-LK"},
		{"LS", "st-Latn-LS"},
		{"LT", "lt-Latn-LT"},
		{"LU", "fr-Latn-LU"},
		{"LV", "lv-Latn-LV"},
		{"LY", "ar-Arab-LY"},
		{"Lana", "nod-Lana-TH"},
		{"Laoo", "lo-Laoo-LA"},
		{"Latn-AF", "tk-Latn-AF"},
		{"Latn-AM", "ku-Latn-AM"},
		{"Latn-BG", "tr-Latn-BG"},
		{"Latn-CN", "za-Latn-CN"},
		{"Latn-CY", "tr-Latn-CY"},
		{"Latn-DZ", "fr-Latn-DZ"},
		{"Latn-ET", "en-Latn-ET"},
		{"Latn-GE", "ku-Latn-GE"},
		{"Latn-GR", "tr-Latn-GR"},
		{"Latn-IL", "ro-Latn-IL"},
		{"Latn-IR", "tk-Latn-IR"},
		{"Latn-KM", "fr-Latn-KM"},
		{"Latn-KZ", "de-Latn-KZ"},
		{"Latn-LB", "fr-Latn-LB"},
		{"Latn-MA", "fr-Latn-MA"},
		{"Latn-MK", "sq-Latn-MK"},
		{"Latn-MO", "pt-Latn-MO"},
		{"Latn-MR", "fr-Latn-MR"},
		{"Latn-RU", "krl-Latn-RU"},
		{"Latn-SY", "fr-Latn-SY"},
		{"Latn-TN", "fr-Latn-TN"},
		{"Latn-TW", "trv-Latn-TW"},
		{"Latn-UA", "pl-Latn-UA"},
		{"Lepc", "lep-Lepc-IN"},
		{"Limb", "lif-Limb-IN"},
		{"Lina", "lab-Lina-GR"},
		{"Linb", "grc-Linb-GR"},
		{"Lisu", "lis-Lisu-CN"},
		{"Lyci", "xlc-Lyci-TR"},
		{"Lydi", "xld-Lydi-TR"},
		{"MA", "ar-Arab-MA"},
		{"MC", "fr-Latn-MC"},
		{"MD", "ro-Latn-MD"},
		{"ME", "sr-Latn-ME"},
		{"MF", "fr-Latn-MF"},
		{"MG", "mg-Latn-MG"},
		{"MK", "mk-Cyrl-MK"},
		{"ML", "bm-Latn-ML"},
		{"MM", "my-Mymr-MM"},
		{"MN", "mn-Cyrl-MN"},
		{"MO", "zh-Hant-MO"},
		{"MQ", "fr-Latn-MQ"},
		{"MR", "ar-Arab-MR"},
		{"MT", "mt-Latn-MT"},
		{"MU", "mfe-Latn-MU"},
		{"MV", "dv-Thaa-MV"},
		{"MX", "es-Latn-MX"},
		{"MY", "ms-Latn-MY"},
		{"MZ", "pt-Latn-MZ"},
		{"Mahj", "hi-Mahj-IN"},
		{"Mand", "myz-Mand-IR"},
		{"Mani", "xmn-Mani-CN"},
		{"Mend", "men-Mend-SL"},
		{"Merc", "xmr-Merc-SD"},
		{"Mero", "xmr-Mero-SD"},
		{"Mlym", "ml-Mlym-IN"},
		{"Modi", "mr-Modi-IN"},
		{"Mong", "mn-Mong-CN"},
		{"Mroo", "mru-Mroo-BD"},
		{"Mtei", "mni-Mtei-IN"},
		{"Mymr", "my-Mymr-MM"},
		{"Mymr-IN", "kht-Mymr-IN"},
		{"Mymr-TH", "mnw-Mymr-TH"},
		{"NA", "af-Latn-NA"},
		{"NC", "fr-Latn-NC"},
		{"NE", "ha-Latn-NE"},
		{"NI", "es-Latn-NI"},
		{"NL", "nl-Latn-NL"},
		{"NO", "nb-Latn-NO"},
		{"NP", "ne-Deva-NP"},
		{"Narb", "xna-Narb-SA"},
		{"Nbat", "arc-Nbat-JO"},
		{"Nkoo", "man-Nkoo-GN"},
		{"OM", "ar-Arab-OM"},
		{"Ogam", "sga-Ogam-IE"},
		{"Olck", "sat-Olck-IN"},
		{"Orkh", "otk-Orkh-MN"},
		{"Orya", "or-Orya-IN"},
		{"Osma", "so-Osma-SO"},
		{"PA", "es-Latn-PA"},
		{"PE", "es-Latn-PE"},
		{"PF", "fr-Latn-PF"},
		{"PG", "tpi-Latn-PG"},
		{"PH", "fil-Latn-PH"},
		{"PK", "ur-Arab-PK"},
		{"PL", "pl-Latn-PL"},
		{"PM", "fr-Latn-PM"},
		{"PR", "es-Latn-PR"},
		{"PS", "ar-Arab-PS"},
		{"PT", "pt-Latn-PT"},
		{"PW", "pau-Latn-PW"},
		{"PY", "gn-Latn-PY"},
		{"Palm", "arc-Palm-SY"},
		{"Pauc", "ctd-Pauc-MM"},
		{"Perm", "kv-Perm-RU"},
		{"Phag", "lzh-Phag-CN"},
		{"Phli", "pal-Phli-IR"},
		{"Phlp", "pal-Phlp-CN"},
		{"Phnx", "phn-Phnx-LB"},
		{"Plrd", "hmd-Plrd-CN"},
		{"Prti", "xpr-Prti-IR"},
		{"QA", "ar-Arab-QA"},
		{"QO", "en-Latn-IO"},
		{"RE", "fr-Latn-RE"},
		{"RO", "ro-Latn-RO"},
		{"RS", "sr-Cyrl-RS"},
		{"RU", "ru-Cyrl-RU"},
		{"RW", "rw-Latn-RW"},
		{"Rjng", "rej-Rjng-ID"},
		{"Runr", "non-Runr-SE"},
		{"SA", "ar-Arab-SA"},
		{"SC", "fr-Latn-SC"},
		{"SD", "ar-Arab-SD"},
		{"SE", "sv-Latn-SE"},
		{"SI", "sl-Latn-SI"},
		{"SJ", "nb-Latn-SJ"},
		{"SK", "sk-Latn-SK"},
		{"SM", "it-Latn-SM"},
		{"SN", "fr-Latn-SN"},
		{"SO", "so-Latn-SO"},
		{"SR", "nl-Latn-SR"},
		{"ST", "pt-Latn-ST"},
		{"SV", "es-Latn-SV"},
		{"SY", "ar-Arab-SY"},
		{"Samr", "smp-Samr-IL"},
		{"Sarb", "xsa-Sarb-YE"},
		{"Saur", "saz-Saur-IN"},
		{"Shaw", "en-Shaw-GB"},
		{"Shrd", "sa-Shrd-IN"},
		{"Sidd", "sa-Sidd-IN"},
		{"Sind", "sd-Sind-IN"},
		{"Sinh", "si-Sinh-LK"},
		{"Sora", "srb-Sora-IN"},
		{"Sund", "su-Sund-ID"},
		{"Sylo", "syl-Sylo-BD"},
		{"Syrc", "syr-Syrc-IQ"},
		{"TD", "fr-Latn-TD"},
		{"TF", "fr-Latn-TF"},
		{"TG", "fr-Latn-TG"},
		{"TH", "th-Thai-TH"},
		{"TJ", "tg-Cyrl-TJ"},
		{"TK", "tkl-Latn-TK"},
		{"TL", "pt-Latn-TL"},
		{"TM", "tk-Latn-TM"},
		{"TN", "ar-Arab-TN"},
		{"TO", "to-Latn-TO"},
		{"TR", "tr-Latn-TR"},
		{"TV", "tvl-Latn-TV"},
		{"TW", "zh-Hant-TW"},
		{"TZ", "sw-Latn-TZ"},
		{"Tagb", "tbw-Tagb-PH"},
		{"Takr", "doi-Takr-IN"},
		{"Tale", "tdd-Tale-CN"},
		{"Talu", "khb-Talu-CN"},
		{"Taml", "ta-Taml-IN"},
		{"Tavt", "blt-Tavt-VN"},
		{"Telu", "te-Telu-IN"},
		{"Tfng", "zgh-Tfng-MA"},
		{"Tglg", "fil-Tglg-PH"},
		{"Thaa", "dv-Thaa-MV"},
		{"Thai", "th-Thai-TH"},
		{"Thai-CN", "lcp-Thai-CN"},
		{"Thai-KH", "kdt-Thai-KH"},
		{"Thai-LA", "kdt-Thai-LA"},
		{"Tibt", "bo-Tibt-CN"},
		{"Tirh", "mai-Tirh-IN"},
		{"UA", "uk-Cyrl-UA"},
		{"UG", "sw-Latn-UG"},
		{"UY", "es-Latn-UY"},
		{"UZ", "uz-Latn-UZ"},
		{"Ugar", "uga-Ugar-SY"},
		{"VA", "it-Latn-VA"},
		{"VE", "es-Latn-VE"},
		{"VN", "vi-Latn-VN"},
		{"VU", "bi-Latn-VU"},
		{"Vaii", "vai-Vaii-LR"},
		{"WF", "fr-Latn-WF"},
		{"WS", "sm-Latn-WS"},
		{"Wara", "hoc-Wara-IN"},
		{"XK", "sq-Latn-XK"},
		{"Xpeo", "peo-Xpeo-IR"},
		{"Xsux", "akk-Xsux-IQ"},
		{"YE", "ar-Arab-YE"},
		{"YT", "fr-Latn-YT"},
		{"Yiii", "ii-Yiii-CN"},
		{"unr", "unr-Beng-IN"},
		{"unr-Deva", "unr-Deva-NP"},
		{"unr-NP", "unr-Deva-NP"},
		{"unx", "unx-Beng-IN"},
		{"ur", "ur-Arab-PK"},
		{"uz", "uz-Latn-UZ"},
		{"uz-AF", "uz-Arab-AF"},
		{"uz-Arab", "uz-Arab-AF"},
		{"uz-CN", "uz-Cyrl-CN"},
		{"vai", "vai-Vaii-LR"},
		{"ve", "ve-Latn-ZA"},
		{"vec", "vec-Latn-IT"},
		{"vep", "vep-Latn-RU"},
		{"vi", "vi-Latn-VN"},
		{"vic", "vic-Latn-SX"},
		{"vls", "vls-Latn-BE"},
		{"vmf", "vmf-Latn-DE"},
		{"vmw", "vmw-Latn-MZ"},
		{"vo", "vo-Latn-001"},
		{"vro", "vro-Latn-EE"},
		{"vun", "vun-Latn-TZ"},
		{"wa", "wa-Latn-BE"},
		{"wae", "wae-Latn-CH"},
		{"wal", "wal-Ethi-ET"},
		{"war", "war-Latn-PH"},
		{"wbq", "wbq-Telu-IN"},
		{"wbr", "wbr-Deva-IN"},
		{"wls", "wls-Latn-WF"},
		{"wo", "wo-Latn-SN"},
		{"wtm", "wtm-Deva-IN"},
		{"wuu", "wuu-Hans-CN"},
		{"xav", "xav-Latn-BR"},
		{"xcr", "xcr-Cari-TR"},
		{"xh", "xh-Latn-ZA"},
		{"xlc", "xlc-Lyci-TR"},
		{"xld", "xld-Lydi-TR"},
		{"xmf", "xmf-Geor-GE"},
		{"xmn", "xmn-Mani-CN"},
		{"xmr", "xmr-Merc-SD"},
		{"xna", "xna-Narb-SA"},
		{"xnr", "xnr-Deva-IN"},
		{"xog", "xog-Latn-UG"},
		{"xpr", "xpr-Prti-IR"},
		{"xsa", "xsa-Sarb-YE"},
		{"xsr", "xsr-Deva-NP"},
		{"yao", "yao-Latn-MZ"},
		{"yap", "yap-Latn-FM"},
		{"yav", "yav-Latn-CM"},
		{"ybb", "ybb-Latn-CM"},
		{"yi", "yi-Hebr-001"},
		{"yo", "yo-Latn-NG"},
		{"yrl", "yrl-Latn-BR"},
		{"yua", "yua-Latn-MX"},
		{"za", "za-Latn-CN"},
		{"zdj", "zdj-Arab-KM"},
		{"zea", "zea-Latn-NL"},
		{"zgh", "zgh-Tfng-MA"},
		{"zh", "zh-Hans-CN"},
		{"zh-AU", "zh-Hant-AU"},
		{"zh-BN", "zh-Hant-BN"},
		{"zh-Bopo", "zh-Bopo-TW"},
		{"zh-GB", "zh-Hant-GB"},
		{"zh-GF", "zh-Hant-GF"},
		{"zh-HK", "zh-Hant-HK"},
		{"zh-Hant", "zh-Hant-TW"},
		{"zh-ID", "zh-Hant-ID"},
		{"zh-MO", "zh-Hant-MO"},
		{"zh-MY", "zh-Hant-MY"},
		{"zh-PA", "zh-Hant-PA"},
		{"zh-PF", "zh-Hant-PF"},
		{"zh-PH", "zh-Hant-PH"},
		{"zh-SR", "zh-Hant-SR"},
		{"zh-TH", "zh-Hant-TH"},
		{"zh-TW", "zh-Hant-TW"},
		{"zh-US", "zh-Hant-US"},
		{"zh-VN", "zh-Hant-VN"},
		{"zmi", "zmi-Latn-MY"},
		{"zu", "zu-Latn-ZA"},
		{"zza", "zza-Latn-TR"}
	};

	static {
		initLocales();
	}

	protected static void initLocales() {
		if (locales != null) return;

		locales = new HashMap<String,String>();

		for (int i = 0; i < likelyLocales.length; i++) {
			locales.put(likelyLocales[i][0], likelyLocales[i][1]);
		}
	}

	/**
	 * Seeks for full locale name in locales map and returns script of target locale,
	 * otherwise - default script Latn
	 * @param target locale in BCP 47 format
	 * @return native script for given locale and default script Latn if locale is not detected
	 */
	public static String getScriptByLocale(Locale target) {
		if (target != null && locales != null && !locales.isEmpty()) {
			final String language = target.getLanguage();
			final String region = target.getCountry();
			final String langRegion = target.getLanguage() + DASH + target.getCountry();
			String likely;
			
			if ( locales.containsKey(language) ) {
				// extractedLocale = Locale.forLanguageTag(locales.get(language));
				likely = locales.get(language);
			} else if ( locales.containsKey(region) ) {
				likely = locales.get(region);
			} else if ( locales.containsKey(langRegion) ) {
				likely = locales.get(langRegion);
			} else {
				return DEFAULT_SCRIPT;
			}
			String[] parts = likely.split("-");
			return parts[1];
		}

		return DEFAULT_SCRIPT;
	}
}
