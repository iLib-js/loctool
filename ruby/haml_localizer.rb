# encoding: utf-8
require 'haml'
require 'csv'
require 'sanitize'
require 'yaml'
require 'json'

PSEUDO_LOCALE = 'de-DE'
BRITISH_LOCALE = 'en-GB'
BRITISH_DICTIONARY_PATH = '../db/britishSpellings.json'
SKIP_LOADING_LOCALES = [PSEUDO_LOCALE, BRITISH_LOCALE]
# Hash that stores start/end mapping of HTML escape sequences
# Check spec for details
HTML_ESCAPE_CHARS = {
    '<' => ['>'],
    '&' => [';',' ']
  }

class HTParser < Haml::Parser
  attr_accessor :parent, :node_to_texts, :text_to_nodes,
                :raw_text_to_parents, :parents_to_raw_texts
  def initialize(a, b)
    @node_to_texts = {}
    @text_to_nodes = {}
    @raw_text_to_parents = {}
    @parents_to_raw_texts = {}
    super(a, b)
  end

  def raw_next_line
    text, index = super
    @raw_text_to_parents[text] = [] unless @raw_text_to_parents[text]
    @raw_text_to_parents[text] << @parent
    @parents_to_raw_texts[@parent] = [] unless @parents_to_raw_texts[@parent]
    @parents_to_raw_texts[@parent] << text
    return text, index
  end

  def process_line(text, index)
    ret = super(text, index)
    # we can also use @parent.
    @text_to_nodes[text] = [] unless @text_to_nodes[text]
    @text_to_nodes[text] << ret
    @node_to_texts[ret] = [] unless @node_to_texts[ret]
    @node_to_texts[ret] << text
    ret
  end

end


# return array of words tokenizing around code blocks for str
# stripped is the originally Sanitized word
def break_around_code(str)
  ret = []
  if str.include?("\#{")
    md = /(.*)#\{.*}(.*)/.match str
  else
    md = /(.*)\{.*}(.*)/.match str
  end
  if md.nil?
    return [str]
  end
  if md[2].strip.length > 0
    ret << md[2].strip
  end
  if md[1].strip.length > 0
    ret.concat(break_around_code(md[1]))
  end
  ret
end

def break_aound_code_values(values)
  values.map{|v| break_around_code(v)}.flatten.reject{|s| s.strip.length == 0}
end

def reject_paran(values)
  values.reject{|c| ['(', ')'].include?(c)}
end

def reject_special_words(values)
  values.reject{|w| w.include?('__') || w.include?('_')} #skip or, and, which are common in method names
end

#break string around ^[:print:] characters
def break_around_non_clean_chars(orig_with_markup, stripped)
  return [] if orig_with_markup.nil? || orig_with_markup.length == 0
  md = /(.*)(&.*;)(.*)/.match(orig_with_markup)
  return [orig_with_markup] if md.nil?
  ret = []
  if md[3].length == 0
  elsif stripped.include?(md[3])
    ret = [md[3]]
  end
  ret.concat(break_around_non_clean_chars(md[1], stripped))
end

# new algo: search for markup identified by <, >
def get_overlap_strings2(orig_with_markup, stripped)
  #puts "get_overlap_strings2 called with orig_with_markup=#{orig_with_markup} stripped=#{stripped} ol=#{orig_with_markup.length} sl=#{stripped.length} orig_with_markup.last=#{orig_with_markup[orig_with_markup.length - 1].ord.to_s(16)}"
  return [] if orig_with_markup.nil? || orig_with_markup.length == 0
  md = nil
  if orig_with_markup.is_a?(Hash)
    return []
  else
    md = /(.*)(<[^>]*>)(.*)/.match(orig_with_markup)
  end
  if md.nil?
    if stripped.include?(orig_with_markup) || stripped.include?(Sanitize.clean(orig_with_markup))
      return [orig_with_markup]
    else
      return []
    end
  end
  ret = []
  #puts "md[1]=#{md[1]}"
  if md[3].length == 0
    ret = []
  elsif stripped.include?(Sanitize.clean(md[3]))
    #(0..md.length-1).each{|i| puts "md [#{i}]=#{puts md[i]}\n"}
    #puts "res=#{md[3]}"
    #puts "last-char=#{orig_with_markup[orig_with_markup.length - 1]} ord=#{orig_with_markup[orig_with_markup.length - 1].ord.to_s(16)}"
    ret = [md[3]]
  end
  ret.concat(get_overlap_strings2(md[1], stripped))
end

# populate values with strings to translate. root is dom-tree node
def accumulate_values(root, values, path_name)
  orig = nil
  if root[:type] == :silent_script
    #skip
  elsif (root.value && root.value[:value])
    orig = root.value[:value]
    if root.value[:parse]
      #skip all parsed nodes. i.e, ruby code
      puts "skipping line with ruby code:#{root.value[:value]}" if !root.value[:value].strip.start_with?('-') && !root.value[:value].strip.start_with?('=') && !root.value[:value].strip.start_with?('/')
      orig = nil
    end
  elsif root.value && root.value[:attributes] && root.value[:attributes]['title']
    #puts "Found title=#{root.value[:attributes]['title']}"
    orig = root.value[:attributes]['title']
  elsif (root[:type] == :plain && root.value && root.value[:text])
    orig = root.value[:text]
  end
  if orig && orig.is_a?(String)
    s = Sanitize.clean(orig)
    if s.gsub(/[^[:print:]]/ , '').strip == orig.gsub(/[^[:print:]]/ , '').strip
      #values << orig.gsub(/[^[:print:]]/ , '')
      values << orig
    elsif !(/(.*)(<[^>]*>)(.*)/.match(orig))
      #there is no html only special characters filtered out by Sanitize.clean
      values.concat(break_around_non_clean_chars(orig, s))
    else
      toks = get_overlap_strings2(orig, s)
      if orig.include?("Answers served")
        #raise ArgumentError.new('debug')
      end
      values.concat(toks) if toks
    end
  end
  root.children.each{|c| accumulate_values(c, values, path_name)}
end


PSEUDO_MAP = {    "a"=> "à",    "c"=> "ç",    "d"=> "ð",    "e"=> "ë",    "g"=> "ğ",    "h"=> "ĥ",    "i"=> "í",    "j"=> "ĵ",    "k"=> "ķ",    "l"=> "ľ",    "n"=> "ñ",    "o"=> "õ",    "p"=> "þ",    "r"=> "ŕ",    "s"=> "š",    "t"=> "ţ",    "u"=> "ü",    "w"=> "ŵ",    "y"=> "ÿ",    "z"=> "ž",    "A"=> "Ã",    "B"=> "ß",    "C"=> "Ç",    "D"=> "Ð",    "E"=> "Ë",    "G"=> "Ĝ",    "H"=> "Ħ",    "I"=> "Ï",    "J"=> "Ĵ",    "K"=> "ĸ",    "L"=> "Ľ",    "N"=> "Ň",    "O"=> "Ø",    "R"=> "Ŗ",    "S"=> "Š",    "T"=> "Ť",    "U"=> "Ú",    "W"=> "Ŵ",    "Y"=> "Ŷ",    "Z"=> "Ż"}
#return <original string> => <string to replace with>
def process_pseudo_values(values)
  ret = {}
  values.each{|v|
    ret[v] = pseudolocalize(v)
  }
  ret
end

def pseudolocalize(string)
  string = string.gsub(/(&.*?;)/, '')
  replaced = string.split('').map{|c| PSEUDO_MAP[c] ? PSEUDO_MAP[c] : c}.join('')
  padding = ((string.length * 0.4).to_i).downto(1).to_a.join('')
  (replaced).concat(padding)
end

#param locale_mappings - The existing mappings in out system we can map values to
# return <original string> => <string to replace with>
# out-param unmapped_words contains words we could not map
def process_values(locale_mappings, values, unmapped_words)
  ret = {}
  values.each{|v|
    next if v.strip.length == 0
    hashed_key = create_hashed_key(v)
    formatted_key = v.gsub('\n', '').gsub(' ','_').capitalize
    # puts "checking #{v} #{hashed_key} #{formatted_key}"
    # puts locale_mappings.keys.first(50).to_s
    # puts "got #{locale_mappings[v]} #{locale_mappings[hashed_key]} #{locale_mappings[formatted_key]}"
    if locale_mappings[hashed_key]
      ret[v] = locale_mappings[hashed_key]
    elsif locale_mappings[formatted_key]
      ret[v] = locale_mappings[formatted_key]
    elsif locale_mappings[v]
      ret[v] = locale_mappings[v]
    else
      # TODO: turn off pseudolocalize for missing translation via a command-line switch
      # ret[v] = pseudolocalize(v)
      ret[v] = v
      unmapped_words << v
    end
  }
  ret
end

#param values - the extracted strings that we want to process
# return <original string> => <string to replace with>
def process_british_values(values)
  ret = {}
  values.each do |v|
    next if v.strip.length == 0
    processed = ''
    curr_word = ''
    as_chars = v.split('')
    skipping = false
    matching_chars_to_stop_skipping = []
    as_chars.each_with_index do |c, i|
      if skipping
        # we previously hit an escape character
        if matching_chars_to_stop_skipping.include?(c)
          # we hit a stop char, so stop skipping and reset the stop chars
          skipping = false
          matching_chars_to_stop_skipping = []
        end
        # keep moving forward
        processed << c
        next
      end
      is_letter = /[[:alpha:]]/.match(c)
      last_character = i == as_chars.count - 1
      if is_letter
        curr_word << c
      end
      if (!is_letter || last_character)
        processed << check_for_british(curr_word)
        processed << c unless (last_character && is_letter)
        curr_word = ''
        if HTML_ESCAPE_CHARS.keys.include?(c) and !skipping
          skipping = true
          matching_chars_to_stop_skipping = HTML_ESCAPE_CHARS[c]
        end
      end
    end
    ret[v] = processed
  end
  ret
end

def british_spellings
  @british_spellings ||= load_british_spellings
end

def load_british_spellings
  raise "British dictionary not found at #{BRITISH_DICTIONARY_PATH}" unless File.exists?(BRITISH_DICTIONARY_PATH)
  f = File.read(BRITISH_DICTIONARY_PATH)
  JSON.parse(f)
end

def check_for_british(word)
  if british_spellings[word.downcase]
    translated_word = british_spellings[word.downcase]
    match_case_for_words(translated_word, word)
  else
    #add as is to string
    word
  end
end

# makes param target match the capitalization of param source
def match_case_for_words(target, source)
  return target if target == source
  return target.downcase if /^[a-z]+$/.match(source)
  return target.capitalize if /^[A-Z]{1}[a-z]+$/.match(source)
  return target.upcase if /^[A-Z]+$/.match(source)
  puts "RUBY EN-GB ERROR: found weird capitalization #{target} #{source}"
  target
end

#def replace_with_translations(template, from_to)
#  from_to.keys.sort_by{|a| a.length}.reverse.each{|k|
#    next if k.include?('@') || k.include?('#{')
#    v = from_to[k]
#
#    res = template.gsub!(/\b(?<=:title=>\")#{Regexp.escape(k)}(?=\")/, v)
#    res = template.gsub!(/\b(?<=:title =>\")#{Regexp.escape(k)}(?=\")/, v)
#    res = template.gsub!(/\b(?<=:title => \")#{Regexp.escape(k)}(?=\")/, v)
#    res = template.gsub!(/\b(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, v) # match starting with word boundary and doesn't have / | : right before k
#
#    if res
#      puts "replaced #{k} WITH: #{v}"
#    end
#  }
#  template
#end

def process_line(skip_block_indent, ret, line, from_to)
  #puts "process_line called with skip_block_indent=#{!skip_block_indent.nil?} from_to=#{from_to.size} line=#{line}"
  if !skip_block_indent.nil?
    ret << line
  else
    if line.strip[0] == "="
      ret << line
    else
      from_to.keys.sort_by{|a| a.length}.reverse.each{|k|
        next if k.include?('#{')
        v = from_to[k].to_s
        begin
          res = line.gsub!(/\b(?<=:title=>\")#{Regexp.escape(k)}(?=\")/, v)
          #if res
          #  puts "replacing #{k} WITH #{v}"
          #end
          res = line.gsub!(/\b(?<=:title =>\")#{Regexp.escape(k)}(?=\")/, v)
          #if res
          #  puts "replacing #{k} WITH #{v}"
          #end

          res = line.gsub!(/\b(?<=:title => \")#{Regexp.escape(k)}(?=\")/, v)
          #puts "k=#{k}"
          #if res
          #  puts "replacing #{k} WITH #{v}"
          #end
          unless line.match(/Rb.t\([\"\'].*#{Regexp.escape(k)}.*[\"\']\)/)
            #puts "1"
            if line.match(/>(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/)
              #puts '2'
              res = line.gsub!(/>(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, ">#{v}") #for some reason it replaces the > char as well. replcae it
            elsif k.strip.match(/^[[:punct:]]/) && k.strip.match(/[[:punct:]]$/)
              #puts '3'
              #punctuation in beginning
              res = line.gsub!(/(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, v)
              #if !res && Sanitize.clean(line).gsub(/(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, v)
              #  line = Sanitize.clean(line).gsub(/(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, v)
              #end

            elsif k.strip.match(/^([[:punct:]]|[[:space:]])/)
              #after stripping in beginning, still funny characters present like \u2028
              #puts '4'
              res = line.gsub!(/(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)\b/, v)
            elsif k.strip.match(/([[:punct:]]|[[:space:]])$/)
              #after stripping in end, still funny characters present like \u2028
              #puts '5'
              res = line.gsub!(/\b(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, v)
            else
              #puts '6'
              res = line.gsub!(/\b(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)\b/, v)
            end
          end
          #if res
          #  puts "replacing #{k} WITH #{v}"
          #end
        rescue => e
          puts "ERROR could not substitute #{v} into #{line}"
          puts e.backtrace
        end
      }
      ret << line
    end
  end
end

# approach to go line-by line and replace. SHould give us better control of the context for search/replace
def replace_with_translations2(template, from_to)
  arr = template.split("\n")
  indent_stack = [0]
  ret = []
  skip_block_indent = nil
  arr.each{|line|
    curr_indent = /\S/ =~ line
    #puts "curr_indent=#{curr_indent} skip_block_indent=#{skip_block_indent}"
    if curr_indent.nil?
      ret << line
      next
    end
    if curr_indent > indent_stack.last
      #new block
      indent_stack << curr_indent
      if line.include?(':ruby')
        skip_block_indent = curr_indent
      elsif line.strip.start_with?('<script')
        skip_block_indent = curr_indent
      elsif line.strip.start_with?('</script>') && skip_block_indent
        skip_block_indent = nil
      end
      process_line(skip_block_indent, ret, line, from_to)
    elsif curr_indent < indent_stack.last
      #previous block ended, now in old block
      indent_stack.pop
      if skip_block_indent && curr_indent <= skip_block_indent
        skip_block_indent = nil
      end
      process_line(skip_block_indent, ret, line, from_to)

    else
      #same block
      process_line(skip_block_indent, ret, line, from_to)
    end
  }
  ret.join("\n")
end

def produce_unmapped(file_to_words)
  # File.open('/tmp/test.yml', 'w') {|f| f.write h.to_yaml}
  h = {}
  file_to_words.each do |filename,words|
    child_hash = {}
    words.each{|w|
      child_hash[ create_hashed_key(w) ] = w.gsub("\n", "")
    }
    h[filename] = child_hash unless child_hash.keys.count == 0
  end
  File.open('./unmapped.yml', 'w') {|f|
    f.write(h.to_yaml(line_width: -1))
  }
  begin
    YAML::load_file('./unmapped.yml')
  rescue => e
    puts "ERROR: Bad YAML created for object=#{h}"
  end
end

#def strip_whitespace_punct_word(v)
#  if v.match(/^[[:punct:]]/) || v.match(/[[:punct:]]$/)
#end

def strip_whitespace_punct(values)
  values.map{|v| v.strip.gsub(/^[[:punct:]]/,'').gsub(/[[:punct:]]$/, '').strip }
end

def strip_whitespace(values)
  values.map{|v| v.strip.gsub(/^[[:blank:]]/, '').gsub(/[[:blank:]]$/, '')}
end

# clean the source string so that whitespace and html changes do not matter
# and two strings that have whitespace or html differences but the same
# text get hashed to the same thing
def clean_string(string)
  string.
    # gsub(/<(['"][^'"]*['"]|[^>])*>/, "").
    gsub(/\u2028/,' '). # remove weird unicode space (line break character)
    gsub(/\\\\/, "\\").
    gsub(/\\t/, "\t").
    gsub(/\\n/, "\n").
    gsub(/\s+/, " ").
    gsub(/\\'/, '\'').
    gsub(/\\"/, '"').strip
end

# from loctool/lib/JavaFile.js
def create_hashed_key(string)
  string = string.to_s unless string.is_a?(String) and !string.nil? and string != ''
  string = clean_string(string)
  # puts "cleaned string is '#{string}'"
  hashed_key = 0
  # these two numbers together = 46 bits so it won't blow out the precision of an integer in javascript
  modulus = 1073741789  # largest prime number that fits in 30 bits
  multiple = 65521      #largest prime that fits in 16 bits, co-prime with the modulus

  string.split('').each do |char|
    # puts "hash #{hashed_key} char #{char.ord}=#{char}"
    hashed_key += char.ord
    hashed_key *= multiple
    hashed_key %= modulus
  end
  "r#{hashed_key}"
end

def load_locale_maps(locales, file_prefix= 'translations')
  ret = {}
  locales.each do |locale|
    filename_for_locale = "#{file_prefix}-#{locale}.yml"
    if File.exists?(filename_for_locale)
      ret[locale] = YAML.load(File.read(filename_for_locale))
      if ret[locale].keys.count == 1
        first_key = ret[locale].keys.first
        ret[locale] = ret[locale][first_key]
      end
    else
      raise "Could not find #{filename_for_locale} for #{locale}"
    end
  end
  ret
end


# return hash{locale_name => output_template}, unmapped_files
# param template - the entire file-content in English
# path_name of the file whose content this is.
# all_locale_mappings hash {locale => <Mapping for key=>string>}
def process_file_content(template, path_name, locale_names, all_locale_mappings)
  unmapped_for_file = []
  ret = {}
  x = HTParser.new(template, Haml::Options.new)
  root = x.parse
  values = []
  accumulate_values(root, values, path_name)
  #puts root
  #puts "orig_values=#{values}"
  values = reject_special_words(reject_paran(break_aound_code_values(values)))
  #puts "values before=#{values}"
  #values = strip_whitespace_punct(values)
  values = strip_whitespace(values)

  #puts "values=#{values}"
  locale_names.each do |locale_name|
    #puts "file_name=#{path_name} locale_name=#{locale_name}"
    locale_mappings = all_locale_mappings[locale_name] || {}
    locale_mappings = locale_mappings[locale_name] unless locale_mappings[locale_name].nil?
    if locale_name == PSEUDO_LOCALE
      from_to = process_pseudo_values(values)
      #unmapped_for_file = values # removing because it makes every string unmapped
    elsif locale_name == BRITISH_LOCALE
      from_to = process_british_values(values)
    else
      from_to = process_values(locale_mappings, values, unmapped_for_file)
    end
    puts "from_to=#{from_to}"
    puts from_to if locale_name != PSEUDO_LOCALE and from_to.keys.count > 0
    #process_values(locale_mappings, from_to.keys, unmapped_for_file)
    output_template = replace_with_translations2(template.dup, from_to)
    begin
      x = HTParser.new(output_template, Haml::Options.new)
      root = x.parse
    rescue => e
      puts e.backtrace
      puts "ERROR: Bad substitution created invalid template for #{path_name}"
      File.open('ERROR.html.haml', 'w') { |file| file.write(output_template) }
      raise e if defined?(TEST_ENV)
      next # if we make a bad file, do not try to print, just go to next file
    end
    ret[locale_name] = output_template
  end
  return ret, unmapped_for_file
end

#file_name = "/Users/aseem/_language_form.html.haml"
unless defined?(TEST_ENV)
  raise ArgumentError.new("Usage: ruby haml_localizer.rb <locale-name> <lang-mapping> [<file-path>..]") if ARGV.count < 3
  locale_names = ARGV[0].split(',')
  locale_mapping_file_name = ARGV[1]
  all_locale_mappings = load_locale_maps(locale_names.reject{|x| SKIP_LOADING_LOCALES.include?(x)}, locale_mapping_file_name)
  unmapped_words = {}

  ARGV[2, ARGV.length].each do |path_name|
    begin
      dirname = File.dirname(path_name)
      file_name = File.basename(path_name)
      file_name_components = file_name.split('.')
      raise ArgumentError.new('file must end with .html.haml') unless file_name.end_with?('.html.haml')

      template = File.read(path_name)

      locale_name_to_output, unmapped_for_file = process_file_content(template, path_name, locale_names, all_locale_mappings)
      locale_name_to_output.each{|locale_name, output_template|
        if file_name_components[file_name_components.length - 3] == "en-US"
          # the original template has a lang_locale, test.en-US.html.haml
          new_file_name = dirname + '/' + file_name_components[0, file_name_components.length - 3].join('') + ".#{locale_name}.html.haml"
        else
          # the original template does not have a lang_locale, test.html.haml
          new_file_name = dirname + '/' + file_name_components[0, file_name_components.length - 2].join('') + ".#{locale_name}.html.haml"
        end
        File.open(new_file_name, 'w') { |file| file.write(output_template) }
      }
      unmapped_words[file_name] = unmapped_for_file
    rescue => ex
      puts path_name
      puts "#{ex}"
      puts ex.backtrace
      break
    end
  end
  produce_unmapped(unmapped_words)
end