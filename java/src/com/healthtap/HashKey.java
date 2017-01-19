/**
 * Copyright (c) 2017, HealthTap, Inc. All Rights Reserved.
 */
package com.healthtap;


/**
 * A class that represents a hash key.<p>
 *
 * @author edwinhoogerbeets
 *
 */
public class HashKey {
	public HashKey() {}
	
	/**
	 * Hash the string and return the hash key
	 * 
	 * @param source the string to hash
	 * @return the hash key
	 */
	public static String hash(String source) {
		// multiple whitespace chars are compressed into one, and leading and trailing 
		// whitespace do not matter
		String str = source.
			replaceAll("^\\\\\\\\", " ").
			replaceAll("([^\\\\])\\\\\\\\", "$1 ").
			replaceAll("\\\\n", "\n").
			replaceAll("\\\\t", "\t").
			replaceAll("\\\\'", "'").
			replaceAll("([^\\\\])\\\\'", "$1'").
			replaceAll("\\\\\"", "\"").
			replaceAll("([^\\\\])\\\\\"", "$1\"").
			replaceAll("\\s+", " ").
			trim();
		
		System.out.println("After mucking: '" + str + "'");
		long hash = 0;
		// these two numbers together = 46 bits so it won't blow out the precision of an integer in javascript
		long modulus = 1073741789L;  // largest prime number that fits in 30 bits
		long multiple = 65521;       // largest prime that fits in 16 bits, co-prime with the modulus
		
		for (int i = 0; i < str.length(); i++) {
			hash += str.charAt(i);
			hash *= multiple;
			hash %= modulus;
		}
		String value = "r" + hash;
		return value;
	}
	
	public static void main(String[] argv) {
		if (argv.length > 0) {
			String str = argv[0].replaceAll("\\\\n", "\n").replaceAll("\\\\t", "\t");
			System.out.println("Java: " + hash(str) + " - '" + argv[0] + "'");
		} else {
			System.out.println("no params");
		}
	}
}