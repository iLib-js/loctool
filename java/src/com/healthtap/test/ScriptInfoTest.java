/**
 * Copyright © 2016-2017, HealthTap, Inc.
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
