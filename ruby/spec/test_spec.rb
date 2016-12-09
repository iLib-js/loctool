#require_relative '../test'

describe 'HamlLocalizer' do
  before(:each) do
    unless defined?(TEST_ENV)
      TEST_ENV = true
    end
    require_relative '../haml_localizer.rb'
  end

  it 'should skip over .translator-section' do
    # from portal.html.haml
    orig = ' .translator-section'
    ret = replace_with_translations2(orig, {'to' => 'FOO'})
    ret.should == orig
  end

  it 'should translate all sections' do
    # from _terms.html.haml
    orig = " %p <strong>What is this Document?</strong> The Terms of Use (or \"TOU\") is an agreement between you and HealthTap Inc. (\"HealthTap\"). There are rules you agree to follow when using our mobile applications and websites (the \"Apps\"), including when you ask questions and when you view or input content on or into the Apps, and they are contained in these TOU. The <a href=\"/terms/privacy_statement\">HealthTap Privacy Statement</a> is officially part of these TOU even though it's a separate document."
    from_to = {'There are rules you agree to follow when using our mobile applications and' => 'FOO'}
    ret = replace_with_translations2(orig, {'to' => 'FOO'})
    ret.include?('FOO').should be_true
  end

  it 'should work' do
    orig = "        <span class='ht-name' >HealthTap</span> is supported by world-class investors, advisors, and experienced company builders who have helped create, "
    from_to ={"is supported by world-class investors, advisors, and experienced company builders who have helped create,"=>"FOO"}
    ret = replace_with_translations2(orig, from_to)

    ret.include?('FOO').should be_true
  end
end
