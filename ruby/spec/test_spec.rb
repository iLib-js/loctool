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

  describe 'create_hashed_key' do
    it 'works' do
      expect(create_hashed_key("Medications in your profile")).to eq("r32020327");
      expect(create_hashed_key("All medications")).to eq("r835310324");
      expect(create_hashed_key("Conditions")).to eq("r103883086");
      expect(create_hashed_key("Symptoms")).to eq("r481086103");
      expect(create_hashed_key("Experts")).to eq("r343852585");
      expect(create_hashed_key("Procedures")).to eq("r807691021");
      expect(create_hashed_key("Health Apps")).to eq("r941505899");
      expect(create_hashed_key("Conditions in your profile")).to eq("r240633868");
      expect(create_hashed_key("Treatment Reviews")).to eq("r795086964");
      expect(create_hashed_key("Answers")).to eq("r221604632");
      expect(create_hashed_key("Private Health Profile")).to eq("r669315500");
      expect(create_hashed_key("People you care for")).to eq("r710774033");
      expect(create_hashed_key("Notifications")).to eq("r284964820");
      expect(create_hashed_key("News")).to eq("r613036745");
      expect(create_hashed_key("More Tips")).to eq("r216617786");
      expect(create_hashed_key("Goals")).to eq("r788359072");
      expect(create_hashed_key("Referral Link")).to eq("r140625167");
      expect(create_hashed_key("Questions")).to eq("r256277957");
      expect(create_hashed_key("Private consults")).to eq("r18128760");
      expect(create_hashed_key("Suggested doctors for you")).to eq("r584966709");
      expect(create_hashed_key("Can\'t find treatment id")).to eq("r926831062");
      expect(create_hashed_key("Can\'t find an application for SMS")).to eq("r909283218");
      expect(create_hashed_key("{topic_name}({topic_generic_name})")).to eq("r382554039");
      expect(create_hashed_key("{doctor_name}, {sharer_name} {start}found this helpful{end}")).to eq("r436261634");
      expect(create_hashed_key("{sharer_name} {start}found this helpful{end}")).to eq("r858107784");
      expect(create_hashed_key("Grow your Care-Team")).to eq("r522565682");
      expect(create_hashed_key("Failed to send connection request!")).to eq("r1015770123");
      expect(create_hashed_key("{goal_name} Goals")).to eq("r993422001");
      expect(create_hashed_key("Referral link copied!")).to eq("r201354363");
      expect(create_hashed_key("This is a test")).to eq("r654479252");
      expect(create_hashed_key("This is a test")).to eq("r654479252");
    end
  end
end
