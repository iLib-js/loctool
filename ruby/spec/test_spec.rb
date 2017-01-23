#require_relative '../test'

describe 'HamlLocalizer' do
  NO_MATCH_STRING = 'these are words that should not trigger a match in the locale files dolphin zebra stock dollars'
  NO_MATCH_STRING_PSEUDOLOCALIZED = 'ţĥëšë àŕë ŵõŕðš ţĥàţ šĥõüľð ñõţ ţŕíğğëŕ à màţçĥ íñ ţĥë ľõçàľë fíľëš ðõľþĥíñ žëbŕà šţõçķ ðõľľàŕš3837363534333231302928272625242322212019181716151413121110987654321'

  before(:each) do
    unless defined?(TEST_ENV)
      TEST_ENV = true
    end
    require_relative '../haml_localizer.rb'
  end

  class TestRoot < Hash
    def value=(v)
      @value = v
    end
    def value
      @value
    end

    def children
      []
    end
  end
  describe 'replace with translations' do
    it 'should skip over .translator-section' do
      # from portal.html.haml
      orig = ' .translator-section'
      ret = replace_with_translations2(orig, {'to' => 'FOO'})
      expect(ret).to eq(orig)
    end

    it 'should translate all sections' do
      # from _terms.html.haml
      orig = " %p <strong>What is this Document?</strong> The Terms of Use (or \"TOU\") is an agreement between you and HealthTap Inc. (\"HealthTap\"). There are rules you agree to follow when using our mobile applications and websites (the \"Apps\"), including when you ask questions and when you view or input content on or into the Apps, and they are contained in these TOU. The <a href=\"/terms/privacy_statement\">HealthTap Privacy Statement</a> is officially part of these TOU even though it's a separate document."
      from_to = {'There are rules you agree to follow when using our mobile applications and' => 'FOO'}
      ret = replace_with_translations2(orig, from_to)
      ret.include?('FOO').should be_true
    end

    #it 'should include html tags' do
    #  # from _terms.html.haml
    #  orig = " %p <strong>What is this Document?</strong> The Terms of Use (or \"TOU\") is an agreement between you and HealthTap Inc. (\"HealthTap\"). There are rules you agree to follow when using our mobile applications and websites (the \"Apps\"), including when you ask questions and when you view or input content on or into the Apps, and they are contained in these TOU. The <a href=\"/terms/privacy_statement\">HealthTap Privacy Statement</a> is officially part of these TOU even though it's a separate document."
    #  from_to = {'<strong>What is this Document?</strong> The Terms of Use (or "TOU") is an agreement' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end


    #it 'should not break strings on self-closed html tags' do
    #  # from _footer_static_v2.html.haml
    #  orig = "            HealthTap does not provide medical advice, diagnosis, or treatment. <br />For these services, please use\n      HealthTap Prime or HealthTap Concierge."
    #  from_to = {'HealthTap does not provide medical advice, diagnosis, or treatment. <br />For these services' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end

    #it 'should not break strings on html entities' do
    #  # from app/views/what_we_make/medical_expert_network.html.haml
    #  orig = "      by doing what you do best &mdash; answering patient questions &mdash; through your Virtual Practice."
    #  from_to = {'by doing what you do best &mdash; answering patient questions &mdash; through' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end

    #it 'should not break strings on html tags with ruby substitutions in them' do
    #  # from app/views/what_we_make/virtual_practice.html.haml
    #  orig = '       Having broad online visibility is critical to creating a thriving practice, but it can be costly and confusing to set up and manage. With HealthTap, you get all of the benefits of an optimized website and a robust audience of patients for free. And your interactions on HealthTap are completely secure and safe in accordance with HIPAA standards. <a href=\"\#{new_expert_registration_path}\">Learn more &rsaquo;</a>'
    #  from_to = {'Learn more' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end
    #
    #it 'should not break strings on html tags with ruby substitutions in them (2)' do
    #  # from app/views/layouts/_enterprise_employee_search_header.html.haml
    #  orig = '        .hello <span class=\'sos-warning-icon\'></span> Hi #{shownName}, members in your area are experiencing #{@current_person.primary_active_disaster.description}. <br/>How can our doctors help you?'
    #  from_to = {'Hi #{shownName}, members in your area are experiencing #{@current_person.primary_active_disaster.description}. <br/>How' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end

    #it 'should not break strings on html tags with ruby substitutions in them after the text' do
    #  # from app/views/layouts/_enterprise_employee_search_header.html.haml
    #  orig = '    Thank Dr. #{checklist[:person][:last_name]}'
    #  from_to = {'Thank Dr. #{checklist[:person][:last_name]}' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end

    #it 'should not break strings on html tags with ruby substitutions in them before the text' do
    #  # from app/views/layouts/_enterprise_employee_search_header.html.haml
    #  orig = '                      #{convert_frequency(c_item[:frequency])} in a row'
    #  from_to = {'#{convert_frequency(c_item[:frequency])} in a row' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end

    #it 'should not crunch spaces before and after html tags' do
    #  # from app/views/pages/feelGood/sign_up_v2.html.haml
    #  orig = '          I agree to HealthTap\'s <a href=\'/terms\' target=\'_blank\'>Terms</a> and <a href=\'/terms/privacy_sharing\' target=\'_blank\'>Privacy Policy</a>'
    #  from_to = {'I agree to HealthTap\'s <a href=\'/terms\' target=\'_blank\'>Terms</a> and <a href=\'/terms/privacy_sharing\' target=\'_blank\'>Privacy Policy</a>' => 'Acepto los <a href=\'/terms\' target=\'_blank\'>Términos</a> y <a href=\'/terms/privacy_sharing\' target=\'_blank\'>Política de Privacidad</a> de HealthTap'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('Acepto los <a href=\'/terms\' target=\'_blank\'>Términos</a> y <a href=\'/terms/privacy_sharing\' target=\'_blank\'>Política de Privacidad</a> de HealthTap').should be_true
    #end

    #this test is wrong. / are comments. Should not replace it 'should not break strings on slash lines' do
    #  # from app/views/layouts/_enterprise_employee_search_header.html.haml
    #  orig = '  /   Send your question'
    #  from_to = {'Send your question' => 'FOO'}
    #  ret = replace_with_translations2(orig, from_to)
    #  ret.include?('FOO').should be_true
    #end

    #it 'Ensure we dont have special characters in accumulated values' do
    #  # from app/views/layouts/_expert_external_content_header.html.haml
    #  root = TestRoot.new
    #  root.value = {:value => ' ‹ Back to site'}
    #  values = []
    #  accumulate_values(root, values, nil)
    #  values.count.should == 1
    #  values[0].should == "Back to site"
    #end

    it 'should not substitute partial words' do
      # from app/views/layouts/_expert_external_content_header.html.haml
      orig = '    Following'
      from_to = {'Follow' => 'FOO'}
      ret = replace_with_translations2(orig, from_to)
      ret.include?('FOO').should be_false
    end

    it 'should localize this text' do
      orig = '          (It may take about 1-2 minutes for the video to load)'
      from_to = {"It may take about 1-2 minutes for the video to load" => 'FOO'}
      ret = replace_with_translations2(orig, from_to)
      ret.include?('FOO').should be_true
    end

    it 'should work' do
      # from investors.html.haml
      orig = "        <span class='ht-name' >HealthTap</span> is supported by world-class investors, advisors, and experienced company builders who have helped create, "
      from_to ={" is supported by world-class investors, advisors, and experienced company builders who have helped create,"=>"FOO"}
      ret = replace_with_translations2(orig, from_to)

      ret.include?('FOO').should be_true
    end

    it 'should work' do
      # from mission.html.haml
      orig = '        It may sound lofty, but we believe it comes down to something very basic. We all—at heart—simply want to <span class="no-break" >Feel Good</span>. Whether we’re trying to improve our already robust health, manage a chronic condition, or cope with a serious illness, we want to live better—and we always want to <span class="no-break" >Feel Good</span>. '
      from_to = {"It may sound lofty, but we believe it comes down to something very basic. We all—at heart—simply want to"=>"FOO"}
      ret = replace_with_translations2(orig, from_to)
      ret.include?('FOO').should be_true
    end

    it 'should work' do
      #from our_story.html.haml
      orig = "        <span class=\"ht-name\">HealthTap</span> Will Change Healthcare"
      from_to = {"Will Change Healthcare"=>"FOO",
                 "is creating the world’s most comprehensive, always-evolving,  and evergreen knowledgebase of personal health wisdom and expertise"=>"FOO"}
      ret = replace_with_translations2(orig, from_to)
      ret.include?('FOO').should be_true

      orig2 = '          In fact, <span class="ht-name">HealthTap</span> is creating the world’s most comprehensive, always-evolving,  and evergreen knowledgebase of personal health wisdom and expertise.'
      ret = replace_with_translations2(orig2, from_to)
      ret.include?('FOO').should be_true
    end

    it 'it should localize string' do
      # sourceL _hopes_diagram.html.haml
      line = "      Power your organization with HOPES<sup>TM</sup> — the fully integrated, engaging and smart Health Operating System, providing query-to-cure virtual care to your patients, anytime, anywhere."
      from_to = {" — the fully integrated, engaging and smart Health Operating System, providing query-to-cure virtual care to your patients, anytime, anywhere." => 'FOO'}
      ret = replace_with_translations2(line, from_to)
      ret.include?('FOO').should be_true

    end

    it 'should skip lines within <script>..</script> tags' do
      #source doctorView.html.haml
      line = '  :erb
    <script type="text/javascript">
      setTimeout(function(){var a=document.createElement("script");
      var b=document.getElementsByTagName("script")[0];
      a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/0027/0645.js?"+Math.floor(new Date().getTime()/3600000);
      a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
    </script>'
      from_to = {'location' => 'FOO'}
      ret = replace_with_translations2(line, from_to)
      ret.include?('FOO').should be_false
    end

    it 'should use the biggest matching translation' do
      line = 'words words words pigeon words words'
      from_to = {'pigeon' => 'bird', 'words words words pigeon words words' => 'FOO'}
      ret = replace_with_translations2(line, from_to)
      expect(ret).to eq('FOO')
    end

  end

  describe 'process pseudo values' do
    it 'works' do
      ret = process_pseudo_values([NO_MATCH_STRING])
      expect(ret[NO_MATCH_STRING]).to eq(NO_MATCH_STRING_PSEUDOLOCALIZED)
    end
  end

  describe 'process values' do
    it 'pseudolocalizes and stores unmapped when no match' do
      unmapped = []
      ret = process_values({}, [NO_MATCH_STRING], unmapped)
      expect(ret[NO_MATCH_STRING]).to eq(NO_MATCH_STRING_PSEUDOLOCALIZED)
      expect(unmapped).to include(NO_MATCH_STRING)
    end
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
    it 'should work with locale file with top-level object' do
      File.should_receive(:exists?).and_return(true)
      File.should_receive(:read).with('translations-en-XY.yml').and_return({en_XY: {'a' => 'b', 'c' => 'd'}}.to_yaml)
      ret = load_locale_maps(['en-XY'])
      expect(ret.keys).to include('en-XY')
      ret['en-XY'].keys.empty?.should be_false
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
  
    it 'works with cleaned sources' do
      expect(create_hashed_key("Medications in your profile")).to eq("r32020327");
      expect(create_hashed_key("All medications ")).to eq("r835310324");
      expect(create_hashed_key(" Conditions")).to eq("r103883086");
      expect(create_hashed_key("Symptoms  \t")).to eq("r481086103");
      expect(create_hashed_key("\t\t    Experts")).to eq("r343852585");
      expect(create_hashed_key("Procedures   \t\t")).to eq("r807691021");
      expect(create_hashed_key("Health    Apps")).to eq("r941505899");
      expect(create_hashed_key("Conditions \nin  \n your profile")).to eq("r240633868");
      expect(create_hashed_key("Treatment\tReviews")).to eq("r795086964");
      expect(create_hashed_key("Private Health <span class=\"foo\">Profile</span>")).to eq("r669315500");
      expect(create_hashed_key("People <span class=\"foo < bar\">you</span> care for")).to eq("r710774033");
      expect(create_hashed_key("   A \"B\"\\\\ \\\\C \t \n \u00A0 ")).to eq("r157781525")
     end

    it 'works with escaped characters' do
      expect(create_hashed_key("This has \"double quotes\" in it.")).to eq("r487572481");
      expect(create_hashed_key('This has \"double quotes\" in it.')).to eq("r487572481");
      expect(create_hashed_key("This has \'single quotes\' in it.")).to eq("r900797640");
      expect(create_hashed_key('This has \'single quotes\' in it.')).to eq("r900797640");
      expect(create_hashed_key("This is a double quoted string")).to eq("r494590307");
      expect(create_hashed_key('This is a single quoted string')).to eq("r683276274");
      expect(create_hashed_key("This is a double quoted string with \"quotes\" in it.")).to eq("r246354917");
      expect(create_hashed_key('This is a single quoted string with \'quotes\' in it.')).to eq("r248819747");
      expect(create_hashed_key("This is a double quoted string with \n return chars in it")).to eq("r1001831480");
      expect(create_hashed_key('This is a single quoted string with \n return chars in it')).to eq("r147719125");
      expect(create_hashed_key("This is a double quoted string with \t tab chars in it")).to eq("r276797171");
      expect(create_hashed_key('This is a single quoted string with \t tab chars in it')).to eq("r303137748");
      expect(create_hashed_key("This is a double quoted string with \d \g \h \i \j \k \l \m \o \p \q \w \y \z other escape chars in it")).to eq("r529567158");
      expect(create_hashed_key('This is a single quoted string with \d \g \h \i \j \k \l \m \o \p \q \w \y \z other escape chars in it')).to eq("r955027934");
      expect(create_hashed_key("This is a double quoted string with \u00A0 \x23 hex escape chars in it")).to eq("r347049046");
      expect(create_hashed_key('This is a single quoted string with \u00A0 \x23 hex escape chars in it')).to eq("r1000517606");
    end
    
  end

  describe 'pseudolocalize' do
    it 'works' do
      expect(pseudolocalize(NO_MATCH_STRING)).to eq(NO_MATCH_STRING_PSEUDOLOCALIZED)
    end
  end

  it 'should leave Rb.t params alone (double quotes)' do
    orig = "            .points_wrap{:title=>Rb.t(\"A doctor's DocScore is a measure of their knowledge, trust, compassion and engagement.\"), :style=>\"width : 80px\"}"
    from_to = {"DocScore" => 'FOO'}
    ret = replace_with_translations2(orig, from_to)
    ret.include?('FOO').should be_false
  end

  it 'should leave Rb.t params alone (single quotes)' do
    orig = "      %textarea.form_comment.question-input{:placeholder => Rb.t('Share a detailed description of your symptoms, concerns, and how you\'d like the doctor to help you. Attach images and files as necessary.')}"
    from_to = {"Attach" => 'FOO'}
    ret = replace_with_translations2(orig, from_to)
    ret.include?('FOO').should be_false
  end

  describe 'strip_whitespace_punct tests' do
    it 'tests that we strip punctuation at the end' do
      strip_whitespace_punct(['In fact,']).should == ['In fact']
    end
    it 'tests that we strip punctuation at the end' do
      strip_whitespace_punct(['In fact ,']).should == ['In fact']
    end
    it 'tests that we strip punctuation at the end' do
      strip_whitespace_punct(['In fact, ']).should == ['In fact']
    end
    it 'tests punctuation at beginning' do
      strip_whitespace_punct([' ‹ Back to site']).should == ['Back to site']
    end
  end


  describe 'complete template processing tests' do
    it 'should skip over .translator-section' do
      # from portal.html.haml
      template = '
.portal-content{:data=>{:is_reviewer=> @current_person.is_reviewer? ? \'true\' : false }}
  .translator-section
    .left-column.hidden
'
      def process_pseudo_values(values) {'to' => 'FOO'} end
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].nil?.should be_false
      local_name_to_output['de-DE'].include?('FOO').should be_false
    end

    it 'should translate all sections' do
      # from _terms.html.haml
      template = '
%div.scrollable{:class => terms_class}
  .box
    %p <strong>What is this Document?</strong> The Terms of Use (or "TOU") is an agreement between you and HealthTap Inc. ("HealthTap"). There are rules you agree to follow when using our mobile applications and websites (the "Apps"), including when you ask questions and when you view or input content on or into the Apps, and they are contained in these TOU. The <a href="/terms/privacy_statement">HealthTap Privacy Statement</a> is officially part of these TOU even though it’s a separate document.
'
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].nil?.should be_false
      local_name_to_output['de-DE'].include?('What is this Document?').should be_false

    end

    it 'should not replace comments' do
      # file _similar_questions.html.haml
      # commends are identified by /
      template = "
.margin-area
/ .bottom-content{ :style => \'margin-bottom: 20px;\' }
/   .btn.send-question
/     Send your question
"
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].include?('Send your question').should be_true
    end

    it 'should localize this text' do
      # file test_call.html.haml
      template = '
.test-call-container
  .steps-container
    .step-container.check-video.hidden
      .video-container.main-container
        .step-title
          Do you see a video of yourself? <br>
          (It may take about 1-2 minutes for the video to load)
'

      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].include?('It may take about 1-2 minutes for the video to load').should be_false
    end

    it 'tests that we retain the punctuations' do
      # file test_call.html.haml
      template = '
.test-call-container
  .steps-container
    .step-container.check-video.hidden
      .video-container.main-container
        .step-title
          Do you see a video of yourself? <br>
          (It may take about 1-2 minutes for the video to load)
'
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].include?('4321?').should be_false #padding should be after ? not before
      local_name_to_output['de-DE'].include?('Do you see a video of yourself').should be_false #translate it
    end

    it 'handles punctuation case' do
      # file _hopes_diagram.html.haml
      template = '
.hopes-diagram
  .text-content
    %p
      Power your organization with HOPES<sup>TM</sup> — the fully integrated, engaging and smart Health Operating System, providing query-to-cure virtual care to your patients, anytime, anywhere.
'
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].include?('</sup> — ').should be_true #retain the punctuation
      local_name_to_output['de-DE'].include?('the fully integrated').should be_false # should have translated
      local_name_to_output['de-DE'].include?('TM').should be_false #should have translated content with the <sup..</sup> tags
    end

    it 'handles funny characters at the edges' do
      #file _expert_vip.html.haml
      template = '
- content_for :guest_content do
  #expertsShowPage.logout
    .columns
      .right_column
        .expert_tabs_region{:class=>"#{params[:tab]}"}
          .expert_tabs_wrap
            - if !params[:tab].present? || params[:tab] == \'accolades\'
              .accolades-column-item.hidden
                .expert_tabs_inner_region{:itemscope=>"", :itemtype=>"http://schema.org/CreativeWork"}
                #doc_recommend_button.accolades_wrap{:style=>"padding: 10px"}
                  %h2.accoladeHeader
                    Doctor Recommendations 
'
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      local_name_to_output['de-DE'].include?('Doctor Recommendations').should be_false
    end

    it 'does translate this case' do
      template = '
.content-inner.clearfix.nux-content
  #content-wrap_inner
    .legal_content.mt20
      .top_area
        %h1 Terms of Use
        %h2
          %h3 Agreement
          .indent
            %div First things first: let\'s try to sort it out. We want to address your concerns without a formal arbitration or case. Before filing a claim against HealthTap, you agree to make a good faith effort to try to resolve the dispute informally by contacting dispute-notice@healthtap.com and responding promptly to any related communications. We\'ll try to resolve the dispute by contacting you via email. If a dispute is not resolved within 30 days of submission, you or HealthTap may bring a formal proceeding.

'
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      puts local_name_to_output['de-DE']
      local_name_to_output['de-DE'].include?('First things first').should be_false
      local_name_to_output['de-DE'].include?('.legal_content.mt20').should be_true
    end

    it 'translate text in line with markup' do
      template = '
.hopes-intro
  .vertical-align
    %p
      We’ve built the world’s first Health Operating System (HOPES<sup>TM</sup>),  powering the delivery of world-class healthcare, from Query-to-Cure
'
      local_name_to_output, unmapped_for_file = process_file_content(template, '/dont-care', ['de-DE'], {})
      puts local_name_to_output['de-DE']
      local_name_to_output['de-DE'].include?('powering the delivery').should be_false

    end

  end

  describe 'british translation' do
    describe 'load_british_spellings' do
      it 'works' do
        File.should_receive(:exists?).and_return(true)
        File.should_receive(:read).and_return('{}')
        expect(load_british_spellings).to eq({})
      end
    end
    describe 'process_british_values' do
      before :each do
        stub(:load_british_spellings) do
          {'acclimatization' => 'acclimatisation'}
        end
      end
      it 'works' do
        test_sentence = 'I love acclimatization'
        res = process_british_values([test_sentence])
        expect(res.keys).to include(test_sentence)
        expect(res[test_sentence]).to eq('I love acclimatisation')
      end
      it 'matches capitalized translation' do
        test_sentence = 'Acclimatization is the best'
        res = process_british_values([test_sentence])
        expect(res.keys).to include(test_sentence)
        expect(res[test_sentence]).to eq('Acclimatisation is the best')
      end
      it 'skips escape character content' do
        test_sentence = 'acclimatization <span class="acclimatization"> acclimatization </span> &acclimatization;'
        res = process_british_values([test_sentence])
        expect(res.keys).to include(test_sentence)
        expect(res[test_sentence]).to eq('acclimatisation <span class="acclimatization"> acclimatisation </span> &acclimatization;')
      end
    end
    describe 'match_case_for_words' do
      it 'works for lowercase' do
        expect(match_case_for_words('TEST','word')).to eq('test')
      end
      it 'works for uppercase' do
        expect(match_case_for_words('test','WORD')).to eq('TEST')
      end
      it 'works for capitalization' do
        expect(match_case_for_words('test','Word')).to eq('Test')
      end

    end
  end
end
