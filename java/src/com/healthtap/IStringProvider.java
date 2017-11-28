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
