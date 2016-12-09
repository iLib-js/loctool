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
    # from investors.html.haml
    orig = "        <span class='ht-name' >HealthTap</span> is supported by world-class investors, advisors, and experienced company builders who have helped create, "
    from_to ={"is supported by world-class investors, advisors, and experienced company builders who have helped create,"=>"FOO"}
    ret = replace_with_translations2(orig, from_to)

    ret.include?('FOO').should be_true
  end

  it 'should work' do
    # from mission.html.haml
    orig = "It may sound lofty, but we believe it comes down to something very basic. We all-at heart-simply want to <span class=\"no-break\" >Feel Good</span>. Whether we're trying to improve our already robust health, manage a chronic condition, or cope with a serious illness, we want to live better-and we always want to <span class=\"no-break\" >Feel Good</span>. "
    from_to = {"It may sound lofty, but we believe it comes down to something very basic. We all-at heart-simply want to"=>"FOO"}
    ret = replace_with_translations2(orig, from_to)
    ret.include?('FOO').should be_true
  end

  it 'should work' do
    #from our_story.html.haml
    orig = "        <span class=\"ht-name\">HealthTap</span> Will Change Healthcare"
    from_to = {"Will Change Healthcare"=>"FOO",
               "is creating the world's most comprehensive, always-evolving,  and evergreen knowledgebase of personal health wisdom and expertise."=>"FOO"}
    ret = replace_with_translations2(orig, from_to)
    ret.include?('FOO').should be_true

    orig2 = "          In fact, <span class=\"ht-name\">HealthTap</span> is creating the world's most comprehensive, always-evolving,  and evergreen knowledgebase of personal health wisdom and expertise."
    ret = replace_with_translations2(orig2, from_to)
    ret.include?('FOO').should be_true
  end

  describe 'load_locale_maps' do 
    it 'should work with no locales' do
      ret = load_locale_maps([])
      expect(ret).to eq({})
    end
    it 'should raise error if provided locale file does not exist' do
      File.should_receive(:exists?).and_return(false)
      expect {load_locale_maps(['en-XY'])}.to raise_error
    end
    it 'should work with locale file' do
      File.should_receive(:exists?).and_return(true)
      File.should_receive(:read).with('translations-en-XY.yml').and_return({}.to_yaml)
      ret = load_locale_maps(['en-XY'])
      expect(ret.keys).to include('en-XY')
      expect(ret['en-XY']).to eq({})
    end
  end
end
