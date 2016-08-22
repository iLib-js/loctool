/**
 * Copyright 2016, HealthTap, Inc., All Rights Reserved.
 */
package com.healthtap.test;

import java.util.HashMap;
import java.util.Locale;

import com.healthtap.IResourceBundle;
import com.healthtap.IResourceBundle.MissingType;
import com.healthtap.IStringProvider;

import junit.framework.TestCase;


/**
 * @author edwin
 *
 */
public class IResourceBundleTest extends TestCase
{
	public IResourceBundleTest() {
		System.out.println("Got here");
	}
	
	public class MockResources implements IStringProvider {
		protected HashMap<Integer,String> map = new HashMap<Integer,String>();
		
		public MockResources() {}
		
		public MockResources(Locale locale) {
			if (locale.getLanguage() == "fr") {
				map.put(1, "Connexion en cours...");
				map.put(6, "Services Palm");
			} else if (locale.getLanguage() == "de") {
				map.put(7, "Nicht aktualisieren");
			} else if (locale.getLanguage() == "es") {
				if (locale.getCountry() == "MX") {
					map.put(2, "Falló la opción de no participar. Intenta más tarde");
					map.put(3, "Listo");
					map.put(5, "Se ha enviado un mensaje de verificación a {email}.");
				} else {
					map.put(2, "Falló la opción de no participar. Intentarlo más tarde.");
					map.put(3, "Aceptar");
					map.put(5, "Se envió un mensaje de verificación a {email}.");
				}
			} else if (locale.getLanguage() == "it") {
				map.put(8,  "");
				map.put(9,  "");
			} else if (locale.getLanguage() == "zh") {
				if (locale.getCountry() == "CN") {
					map.put(4, "保持备份打开");
				} else {
					map.put(4, "保持備份打開");
				}
			}
		}

		public String getString(int id) {
			String translation = map.get(id);
			return translation;
		}
	}
		
	public void testConstructorNotNull()
	{
		MockResources res = new MockResources();
		IResourceBundle rb = new IResourceBundle(R.string.class, res);
		assertNotNull(rb);
	}
	
	public void testConstructorResourcesNotNull()
	{
		MockResources res = new MockResources();
		IResourceBundle rb = new IResourceBundle(R.string.class, res);
		assertNotNull(rb);
	}
	
	public void testNullLocale()
	{
		MockResources res = new MockResources();
		IResourceBundle rb = new IResourceBundle(R.string.class, res, null);
		assertNotNull(rb);
		
		assertEquals("en_US", rb.getLocale().toString());
	}
	
	public void testEmptyLocale()
	{
		Locale l = Locale.getDefault();
		MockResources res = new MockResources(l);
		IResourceBundle rb = new IResourceBundle(R.string.class, res, l);
		assertNotNull(rb);
		
		assertEquals("en_US", rb.getLocale().toString());
	}

	public void testConstructorResourcesAndLocale()
	{
		Locale l = Locale.forLanguageTag("fr-FR");
		MockResources res = new MockResources(l);
		IResourceBundle rb = new IResourceBundle(R.string.class, res, l);
		assertNotNull(rb);
	}

	public void testContainsSourceTrue()
	{
		Locale l = Locale.forLanguageTag("fr-FR");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Signing in...");
		assertEquals("Connexion en cours...", result.toString());
	}

	public void testContainsSourceFalse()
	{
		Locale l = Locale.forLanguageTag("fr-FR");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res,l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Palm Services");
		assertEquals("Services Palm", result.toString());
		assertNotSame("Palm Services", result.toString());
	}

	public void testGetLocStringBaseLocale1()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Opt out failed. Try later");
		assertEquals("Falló la opción de no participar. Intentarlo más tarde.", result.toString());
	}

	public void testGetLocStringNonBaseLocale1()
	{
		Locale l = Locale.forLanguageTag("es-MX");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Opt out failed. Try later");
		assertEquals("Falló la opción de no participar. Intenta más tarde", result.toString());
		assertNotSame("Falló la opción de no participar. Intentarlo más tarde.", result.toString());
	}
	
	public void testGetLocStringBaseLocale2()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Aceptar", result.toString());
	}

	public void testGetLocStringNonBaseLocale2()
	{
		Locale l = Locale.forLanguageTag("es-MX");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Listo", result.toString());
		assertNotSame("Aceptar", result.toString());
	}
	
	public void testGetLocStringBaseLocale3()
	{
		Locale l = Locale.forLanguageTag("zh-Hans-CN");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Keep Backup On");
		assertEquals("保持备份打开", result.toString());
	}

	public void testGetLocStringNonBaseLocale3()
	{
		Locale l = Locale.forLanguageTag("zh-HK");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Keep Backup On");
		assertEquals("保持備份打開", result.toString());
		assertNotSame("保持备份打开", result.toString());
	}
	
	public void testGetLocStringWithExistedKey1()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("A verification email was sent to {email}.");
		assertEquals("Se envió un mensaje de verificación a {email}.", result);
	}

	public void testGetLocStringWithExistedKey2()
	{
		Locale l = Locale.forLanguageTag("es-MX");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("A verification email was sent to {email}.");
		assertNotSame("Se envió un mensaje de verificación a {email}.", result);
		assertEquals("Se ha enviado un mensaje de verificación a {email}.", result);
	}

	public void testGetLocStringWithNonExistedKey1()
	{
		Locale l = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		// right string, wrong key means no match
		String result = resBundle.getString("Email Sent", "emailsent");
		assertEquals("Email Sent", result.toString());
		// assertEquals("emailsent", result.toString());
	}
	
	public void testGetLocaleWithResourcesGermany()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals(locale.toString(), resBundle.getLocale().toString());
	}

	public void testGetLocaleWithResourcesNetherlands()
	{
		final Locale locale = Locale.forLanguageTag("nl-NL");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals(locale.toString(), resBundle.getLocale().toString());
	}
	
	public void testGetStringDefaultPseudo()
	{
		final Locale locale = Locale.forLanguageTag("zxx");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals("Ïñvàľíð Ňëţŵõŕķ Ňàmë9876543210", resBundle.getString("Invalid Network Name").toString());
	}

	public void testGetStringCyrlPseudo()
	{
		final Locale locale = Locale.forLanguageTag("zxx-Cyrl-RU");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals("Инвалид Нэтwорк Намэ9876543210", resBundle.getString("Invalid Network Name").toString());
	}

	public void testGetStringPseudo()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ šţàţë fõŕ Ŵífí: 6543210", resBundle.getStringPseudo("actual state for Wifi: ").toString());
	}

	public void testGetStringPseudoMissing()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Nicht aktualisieren", resBundle.getString("Don't Update").toString());
		assertEquals("Ðõñ'ţ Úþðàţë àñ ëmàíľ6543210", resBundle.getString("Don't Update an email").toString());

	}

	public void testGetStringPseudoMissingLengthenFalse()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		resBundle.setLengthen(false);
		assertNotNull(resBundle);

		assertEquals("Ðõñ'ţ Úþðàţë àñ ëmàíľ", resBundle.getString("Don't Update an email").toString());
		assertNotSame("Ðõñ'ţ Úþðàţë àñ ëmàíľ6543210", resBundle.getString("Don't Update an email").toString());
	}
	
	public void testGetStringKeyValueNull()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertNull(resBundle.getString(null));
	}

	public void testGetStringEmptyMissing()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.EMPTY);
		assertNotNull(resBundle);

		assertEquals("", resBundle.getString("Don't Update an email").toString());
	}

	public void testGetPseudoStringLatnScript()
	{
		final Locale locale = Locale.forLanguageTag("en-GB");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Ëñğàğëmëñţ þõíñţ!76543210", resBundle.getString("Engagement point!").toString());
	}

	public void testGetPseudoStringCyrlScript()
	{
		final Locale locale = Locale.forLanguageTag("uk-UA");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Энгагэмэнт поинт!76543210", resBundle.getString("Engagement point!").toString());
	}

	public void testGetPseudoStringHebrScript()
	{
		final Locale locale = Locale.forLanguageTag("he-IL");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("ֶנגַגֶמֶנט פִֹנט!76543210", resBundle.getString("Engagement point!").toString());
	}
	
	public void testGetPseudoStringHansScript()
	{
		final Locale locale = Locale.forLanguageTag("zh-HK");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		resBundle.setLengthen(false);
		assertNotNull(resBundle);

		assertEquals("俄尼个阿个俄们俄尼推 琶夥意尼推!",resBundle.getString("Engagement point!").toString());
	}
}
