/**
 * Copyright (c) 2016, HealthTap, Inc. All Rights Reserved.
 */
package com.healthtap;

/**
 * @interface A provider of strings
 * 
 * @author edwinhoogerbeets
 */
public interface IStringProvider {
	/**
	 * Return a string based on the given numeric id.
	 * 
	 * @param id the numeric id to look up
	 * @return
	 */
	public String getString(int id);
}
