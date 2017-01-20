SKIP_PSEUDOLOCALIZE = true
TEST_ENV = true

# require '/Users/edwinhoogerbeets/src/ht-webapp12/lib/ht_rb.rb'
require '/Users/edwinhoogerbeets/src/loctool/ruby/haml_localizer.rb'

ARGV.each do |string|
  converted = string.encode("utf-8")
  # puts "Ruby: #{Rb.convert_string_to_resource_id(converted)} - #{converted}"
  puts "Haml: #{create_hashed_key(converted)} - #{string}"
end

#string = "This is a double quoted string with \u00A0 \x23 hex escape chars in it"
#puts "Ruby: #{Rb.convert_string_to_resource_id(string)} - #{clean_string(string)}"
