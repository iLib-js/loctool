/**
 * Copyright 2016, HealthTap, Inc., All Rights Reserved.
 */
package com.healthtap.test;

import junit.framework.TestSuite;

public class AllTests extends TestSuite {

	public AllTests(String name) {
		super(name);
	}

	public static TestSuite suite() {
		TestSuite suite = new TestSuite("Android tests");
		suite.addTestSuite(IResourceBundleTest.class);
		suite.addTestSuite(ScriptInfoTest.class);
		return suite;
	}
}

