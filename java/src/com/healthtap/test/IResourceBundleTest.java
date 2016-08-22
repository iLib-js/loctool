/**
 * Copyright 2016, HealthTap, Inc., All Rights Reserved.
 */
package com.healthtap.test;

import java.util.Locale;

import com.healthtap.IResourceBundle;
import com.healthtap.IResourceBundle.MissingType;

import android.content.res.Resources;
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
	Resources res = MockResources.getSystem();
	
	public void testConstructorNotNull()
	{
		IResourceBundle rb = new IResourceBundle(res);
		assertNotNull(rb);
	}
	
	public void testConstructorResourcesNotNull()
	{
		IResourceBundle rb = new IResourceBundle(res);
		assertNotNull(rb);
	}
	
	public void testNullLocale()
	{
		IResourceBundle rb = new IResourceBundle(res, null);
		assertNotNull(rb);
		
		assertEquals("en-US", rb.getLocale().toString());
	}
	
	public void testEmptyLocale()
	{
		Locale l = new Locale("");
		IResourceBundle rb = new IResourceBundle(res, l);
		assertNotNull(rb);
		
		assertEquals("en-US", rb.getLocale().toString());
	}

	public void testConstructorResourcesAndLocale()
	{
		Locale l = new Locale("fr-FR");
		IResourceBundle rb = new IResourceBundle(res, l);
		assertNotNull(rb);
	}

	public void testContainsSourceTrue()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("fr-FR"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Signing in...");
		assertEquals("Connexion en cours...", result.toString());
	}

	public void testContainsSourceFalse()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("fr-FR"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Services Palm");
		assertEquals("Services Palm", result.toString());
		assertNotSame("Palm Services", result.toString());
	}

	public void testGetLocStringBaseLocale1()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("es-ES"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Opt out failed. Try later");
		assertEquals("Falló la opción de no participar. Intentarlo más tarde.", result.toString());
	}

	public void testGetLocStringNonBaseLocale1()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("es-MX"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Opt out failed. Try later");
		assertEquals("Falló la opción de no participar. Intenta más tarde", result.toString());
		assertNotSame("Falló la opción de no participar. Intentarlo más tarde.", result.toString());
	}
	
	public void testGetLocStringBaseLocale2()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("es-ES"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Aceptar", result.toString());
	}

	public void testGetLocStringNonBaseLocale2()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("es-MX"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Listo", result.toString());
		assertNotSame("Aceptar", result.toString());
	}
	
	public void testGetLocStringBaseLocale3()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("zh-Hans-CN"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Keep Backup On");
		assertEquals("保持备份打开", result.toString());
	}

	public void testGetLocStringNonBaseLocale3()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("zh-HK"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Keep Backup On");
		assertEquals("保持備份打開", result.toString());
		assertNotSame("保持备份打开", result.toString());
	}
	
	public void testGetLocStringWithExistedKey1()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("es-ES"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("A verification email was sent to {email}.");
		assertEquals("Se envió un mensaje de verificación a {email}.", result);
	}

	public void testGetLocStringWithExistedKey2()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("es-MX"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("A verification email was sent to {email}.");
		assertNotSame("Se envió un mensaje de verificación a {email}.", result);
		assertEquals("Se ha enviado un mensaje de verificación a {email}.", result);
	}

	public void testGetLocStringWithNonExistedKey1()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("it-IT"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Email Sent", "emailsent");
		//assertEquals("Email Sent", result.toString());
		assertEquals("emailsent", result.toString());
	}

	public void testGetLocStringWithNonExistedKey2()
	{
		IResourceBundle resBundle = new IResourceBundle(res, new Locale("it-IT"));
		assertNotNull(resBundle);
		
		String result = resBundle.getString("You must use a valid email address format.", "usevalidemail");
		//assertEquals("You must use a valid email address format.", result.toString());
		assertEquals("usevalidemail", result.toString());
	}
	
	public void testGetLocaleWithResourcesGermany()
	{
		final Locale locale = new Locale("de-DE");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		assertNotNull(resBundle);

		assertEquals(locale.toString(), resBundle.getLocale().toString());
	}

	public void testGetLocaleWithResourcesNetherlands()
	{
		final Locale locale = new Locale("nl-NL");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		assertNotNull(resBundle);

		assertEquals(locale.toString(), resBundle.getLocale().toString());
	}
	
	public void testGetStringDefaultPseudo()
	{
		final Locale locale = new Locale("zxx");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		assertNotNull(resBundle);

		assertEquals("Ïñvàľíð Ňëţŵõŕķ Ňàmë9876543210", resBundle.getString("Invalid Network Name").toString());
	}

	public void testGetStringCyrlPseudo()
	{
		final Locale locale = new Locale("zxx-Cyrl-RU");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		assertNotNull(resBundle);

		assertEquals("Инвалид Нэтwорк Намэ9876543210", resBundle.getString("Invalid Network Name").toString());
	}

	public void testGetStringPseudo()
	{
		final Locale locale = new Locale("de-DE");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ šţàţë fõŕ Ŵífí: 6543210", resBundle.getStringPseudo("actual state for Wifi: ").toString());
	}

	public void testGetStringPseudoMissing()
	{
		final Locale locale = new Locale("de-DE");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Nicht aktualisieren", resBundle.getString("Don't Update").toString());
		assertEquals("Ðõñ'ţ Úþðàţë àñ ëmàíľ6543210", resBundle.getString("Don't Update an email").toString());

	}

	public void testGetStringPseudoMissingLengthenFalse()
	{
		final Locale locale = new Locale("de-DE");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		resBundle.setLengthen(false);
		assertNotNull(resBundle);

		assertEquals("Ðõñ'ţ Úþðàţë àñ ëmàíľ", resBundle.getString("Don't Update an email").toString());
		assertNotSame("Ðõñ'ţ Úþðàţë àñ ëmàíľ6543210", resBundle.getString("Don't Update an email").toString());
	}
	
	public void testGetStringKeyValueNull()
	{
		final Locale locale = new Locale("de-DE");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		assertNotNull(resBundle);

		assertNull(resBundle.getString(null));
	}

	public void testGetStringEmptyMissing()
	{
		final Locale locale = new Locale("de-DE");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.EMPTY);
		assertNotNull(resBundle);

		assertEquals("", resBundle.getString("Don't Update an email").toString());
	}

	public void testGetStringSameTargetAndSourceLocalesKeySource()
	{
		final Locale locale = new Locale("uk-UA");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.EMPTY);
		assertNotNull(resBundle);

		assertEquals("Здоровенькі були!", resBundle.getString("Здоровенькі були!", "Cheers!").toString());
	}
	
	public void testGetStringSameTargetAndSourceLocalesSource()
	{
		final Locale locale = new Locale("uk-UA");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.EMPTY);
		assertNotNull(resBundle);

		assertEquals("Здоровенькі були!", resBundle.getString("Здоровенькі були!").toString());
	}
	
	public void testGetPseudoStringLatnScript()
	{
		final Locale locale = new Locale("en-GB");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Ëñğàğëmëñţ þõíñţ!76543210", resBundle.getString("Engagement point!").toString());
	}

	public void testGetPseudoStringCyrlScript()
	{
		final Locale locale = new Locale("uk-UA");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Энгагэмэнт поинт!76543210", resBundle.getString("Engagement point!").toString());
	}

	public void testGetPseudoStringHebrScript()
	{
		final Locale locale = new Locale("he-IL");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("ֶנגַגֶמֶנט פִֹנט!76543210", resBundle.getString("Engagement point!").toString());
	}
	
	public void testGetPseudoStringHansScript()
	{
		final Locale locale = new Locale("zh-HK");
		IResourceBundle resBundle = new IResourceBundle(res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		resBundle.setLengthen(false);
		assertNotNull(resBundle);

		assertEquals("俄尼个阿个俄们俄尼推 琶夥意尼推!",resBundle.getString("Engagement point!").toString());
	}
}
