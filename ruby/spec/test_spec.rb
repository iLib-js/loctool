#require_relative '../test'

describe 'HamlLocalizer' do
  before(:each) do
    TEST_ENV = true
    require_relative '../haml_localizer.rb'
  end

  it 'should skip over .translator-section' do
    orig = ' .translator-section'
    ret = replace_with_translations2(orig, {'to' => 'FOO'})
    ret.should == orig
  end
end
