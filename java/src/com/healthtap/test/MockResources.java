  package com.healthtap.test;

import java.util.HashMap;
import java.util.Locale;

import android.content.res.Resources;


public class MockResources extends Resources {
	protected Locale locale;
	protected HashMap<Integer,String> strings = new HashMap<Integer,String>();
	
	public MockResources() {
		super(null, null, null);
	}

	public void setLocale(Locale l) {
		
	}
	
	public String getString(String key) {
		return "";
	}
}
