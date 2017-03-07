/*
 * PseudoFactory.js - class that creates the right type of pseudo localization
 * resource bundle for the given locale
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

var log4js = require("log4js");

var WordBasedPseudo = require("./WordBasedPseudo.js");
// var HantPseudo = require("./HantPseudo.js");

var logger = log4js.getLogger("loctool.lib.PseudoFactory");

// everything that inherits from British English
var britishLike = [
	"en-AG",
	"en-AI",
	"en-AS",
	"en-AU",
	"en-BB",
	"en-BE",
	"en-BM",
	"en-BS",
	"en-BW",
	"en-BZ",
	"en-CC",
	"en-CK",
	"en-CM",
	"en-CX",
	"en-DG",
	"en-DM",
	"en-ER",
	"en-ET",
	"en-FJ",
	"en-FK",
	"en-FM",
	"en-GB",
	"en-GD",
	"en-GG",
	"en-GH",
	"en-GI",
	"en-GM",
	"en-GS",
	"en-GU",
	"en-GY",
	"en-HK",
	"en-HM",
	"en-IE",
	"en-IM",
	"en-IN",
	"en-IO",
	"en-JE",
	"en-JM",
	"en-KE",
	"en-KI",
	"en-KN",
	"en-KY",
	"en-LC",
	"en-LK",
	"en-LS",
	"en-MG",
	"en-MH",
	"en-MO",
	"en-MP",
	"en-MS",
	"en-MT",
	"en-MU",
	"en-MW",
	"en-MY",
	"en-NA",
	"en-NF",
	"en-NG",
	"en-NR",
	"en-NU",
	"en-NZ",
	"en-PG",
	"en-PK",
	"en-PN",
	"en-PW",
	"en-RW",
	"en-SB",
	"en-SC",
	"en-SD",
	"en-SG",
	"en-SH",
	"en-SL",
	"en-SS",
	"en-SX",
	"en-SZ",
	"en-TC",
	"en-TK",
	"en-TO",
	"en-TT",
	"en-TV",
	"en-TZ",
	"en-UG",
	"en-UM",
	"en-VC",
	"en-VI",
	"en-VU",
	"en-WS",
	"en-ZA",
	"en-ZM",
	"en-ZW"
];

/**
 * @class Create the right type of pseudo localization
 * resource bundle for the given locale.
 * 
 * @param {Project} project the project that is used for this request
 * @param {String} locale the locale for the requested resource
 * bundle
 * @returns {ResBundle|undefined} a resource bundle that pseudo-localizes
 * for the given locale, or undefined if there is no pseudo-localization
 * for that locale
 */
var PseudoFactory = function(options) {
	if (!options || !options.project || !options.locale) return undefined;
	
	if (britishLike.indexOf(options.locale) > -1) {
		logger.trace("Found pseudo resource bundle for locale " + options.locale);
		return new WordBasedPseudo({
			project: options.project,
			type: options.type || "text",
			pathName: "../db/britishSpellings.json"
		});
	}
	
	if (options.locale === "en-CA") {
		logger.trace("Found pseudo resource bundle for locale " + options.locale);
		return new WordBasedPseudo({
			project: options.project,
			type: options.type || "text",
			pathName: "../db/canadianSpellings.json"
		});
	}
	
	/*
	// mappings for simplified -> traditional Chinese
	var l = new Locale(options.locale);
	if (l.getScript() === "Hant") {
		return new HantPseudo({
			set: options.set
		});
	} 
	*/
	
	return undefined;
};

module.exports = PseudoFactory;