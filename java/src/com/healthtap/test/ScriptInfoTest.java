/**
 * Copyright 2016, HealthTap, Inc., All Rights Reserved.
 */
package com.healthtap.test;

import java.util.HashMap;
import java.util.Locale;

import com.healthtap.ScriptInfo;

import junit.framework.TestCase;


/**
 * @author edwin
 *
 */
public class ScriptInfoTest extends TestCase
{
	public void testGetScriptByLocaleByLanguage()
	{
		Locale l = new Locale("ru");
		assertEquals(ScriptInfo.getScriptByLocale(l), "Cyrl");
	}

	public void testGetScriptByLocaleByLanguage2()
	{
		Locale l = new Locale("zh");
		assertEquals(ScriptInfo.getScriptByLocale(l), "Hans");
	}

	public void testGetScriptByLocaleByLanguageAndRegion()
	{
		Locale l = new Locale("el", "GR");
		assertEquals(ScriptInfo.getScriptByLocale(l), "Grek");
	}

	public void testGetScriptByLocale()
	{
		Locale l = new Locale("el", "GR");
		assertEquals(ScriptInfo.getScriptByLocale(l), "Grek");
	}

	public void testGetScriptByLocaleDefault()
	{
		assertEquals(ScriptInfo.getScriptByLocale(null), "Latn");
	}
}	
