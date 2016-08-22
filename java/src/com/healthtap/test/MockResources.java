  package com.healthtap.test;

import java.util.HashMap;
import java.util.Locale;

import android.content.res.Resources;

public class MockResources extends Resources {
	protected Locale locale;
	protected HashMap<Integer,String> strings = new HashMap<Integer,String>();
	private static final Object sSync = new Object();
	
	private MockResources() {
		super(null, null, null);
	}

	public static MockResources getSystem() {
        synchronized (sSync) {
            return new MockResources();
        }
	}
	
	public void setLocale(Locale l) {
		
	}
	
	public String getString(String key) {
		return "";
	}
}
