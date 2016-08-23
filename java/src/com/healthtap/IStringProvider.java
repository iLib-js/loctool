/**
 * Copyright (c) 2016, HealthTap, Inc. All Rights Reserved.
 */
package com.healthtap;

/**
 * A provider of strings for the IResourceBundle class. Callers
 * must wrap their own resource class with a class that implements
 * this interface.
 * 
 * @author edwinhoogerbeets
 */
public interface IStringProvider {
	/**
	 * Return a string based on the given numeric id.
	 * 
	 * @param id the numeric id to look up
	 * @return the translation with the given numeric id
	 */
	public String getString(int id);
}
