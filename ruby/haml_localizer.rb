# encoding: utf-8
require 'haml'
require 'csv'
require 'sanitize'
require 'yaml'

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
    if stripped.include?(orig_with_markup)
      return [orig_with_markup]
    else
      return []
    end
  end
  ret = []
  #puts "md[1]=#{md[1]}"
  if md[3].length == 0
    ret = []
  elsif stripped.include?(md[3])
    #(0..md.length-1).each{|i| puts "md [#{i}]=#{puts md[i]}\n"}
    #puts "res=#{md[3]}"
    #puts "last-char=#{orig_with_markup[orig_with_markup.length - 1]} ord=#{orig_with_markup[orig_with_markup.length - 1].ord.to_s(16)}"
    ret = [md[3]]
  end
  ret.concat(get_overlap_strings2(md[1], stripped))
end

# populate values with strings to translate. root is dom-tree node
def accumulate_values(root, values)
  orig = nil
  if root[:type] == :silent_script
    #skip
  elsif (root.value && root.value[:value])
    orig = root.value[:value]
    if root.value[:parse] && root.value[:name] == 'td'
      orig = nil
    elsif root.value[:parse]
      if orig.include?('[:') || orig.include?('__')
        # assumed this entire node is piece of code. skip it
        orig = nil
      else
        begin
          #puts "orig=#{orig}"
          orig = YAML.load(orig)
        rescue Psych::SyntaxError => ex
          #puts "orig=#{orig}"
          orig = nil
        end
      end
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
      values << s.gsub(/[^[:print:]]/ , '')
    else
      toks = get_overlap_strings2(orig, s)
      if orig.include?("Answers served")
        puts "toks=#{toks} orig=#{orig} s=#{s} orig.last=#{orig[orig.length-1].ord.to_s(16)}"
        #raise ArgumentError.new('debug')
      end
      values.concat(toks) if toks
    end
  end
  root.children.each{|c| accumulate_values(c, values)}
end


PSUEDO_MAP = {    "a"=> "à",    "c"=> "ç",    "d"=> "ð",    "e"=> "ë",    "g"=> "ğ",    "h"=> "ĥ",    "i"=> "í",    "j"=> "ĵ",    "k"=> "ķ",    "l"=> "ľ",    "n"=> "ñ",    "o"=> "õ",    "p"=> "þ",    "r"=> "ŕ",    "s"=> "š",    "t"=> "ţ",    "u"=> "ü",    "w"=> "ŵ",    "y"=> "ÿ",    "z"=> "ž",    "A"=> "Ã",    "B"=> "ß",    "C"=> "Ç",    "D"=> "Ð",    "E"=> "Ë",    "G"=> "Ĝ",    "H"=> "Ħ",    "I"=> "Ï",    "J"=> "Ĵ",    "K"=> "ĸ",    "L"=> "Ľ",    "N"=> "Ň",    "O"=> "Ø",    "R"=> "Ŗ",    "S"=> "Š",    "T"=> "Ť",    "U"=> "Ú",    "W"=> "Ŵ",    "Y"=> "Ŷ",    "Z"=> "Ż"}
#return <original string> => <string to replace with>
def process_pseudo_values(values)
  ret = {}
  values.each{|v|
    ret[v] = v.split('').map{|c| PSUEDO_MAP[c] ? PSUEDO_MAP[c] : c}.join('')
    string_padding = ((ret[v].length * 0.4).to_i).downto(1).to_a.join('')
    ret[v] = ret[v].concat(string_padding)
  }
  ret
end

#param locale_mappings - The existing mappings in out system we can map values to
# return <original string> => <string to repalce with>
# out-param unmapped_words contains words we could not map
def process_values(locale_mappings, values, unmapped_words)
  ret = {}
  values.each{|v|
    next if v.strip.length == 0
    if locale_mappings[v]
      ret[v] = locale_mappings[v]
    else
      unmapped_words << v
    end
  }
  ret
end

def replace_with_translations(template, from_to)
  from_to.keys.sort_by{|a| a.length}.reverse.each{|k|
    next if k.include?('@') || k.include?('#{')
    #next if !k.include?(' ') # there are too many cases where it is substituring method calls and variable names. Skip if its not a sentence
    v = from_to[k]
    #puts "translating=#{k} WITH v=#{v}"
    #raise ArgumentError.new('test')

    # match starting with word boundary and doesn't have / | : right before k
    # also skip k if suffix is .<something>. ex - topic.kb_attribute. Assumes regular english will have .<spave><char>
    res = template.gsub!(/\b(?<![-\/:_\.|])#{Regexp.escape(k)}(?![\.]\S)/, v) # match starting with word boundary and doesn't have / | : right before k
    #res = template.gsub!(/\b#{Regexp.escape(k)}/, v) # match starting with word boundary and doesn't have / | : right before k
    #res = template.gsub!(k, v)
    if res.nil?
      #puts "DID not replace:#{k} k.length=#{k.length} v:#{v} v.l=#{v.length}"
      #puts "include=#{template.include?(k)}"
      #puts "template=#{template}"
      #raise ArgumentError.new("stop")
    end
  }
  template
end

def produce_unmapped(unmapped_words)
  # File.open('/tmp/test.yml', 'w') {|f| f.write h.to_yaml}
  h = {}
  unmapped_words.each{|w|
    clean_w = w.gsub("\n", "");
    h[ to_yaml_friendly_key(clean_w) ] = to_yaml_friendly_value(clean_w)
  }
  File.open('./unmapped.yml', 'w') {|f|
    h.each{|k, v|
      f.write "#{k}:#{v}\n"
    }

  }
end

YAML_RESERVED_CHARACTERS = [':']

def to_yaml_friendly_key(key)
  "\"#{key.gsub(' ', '_')}\""
end

def to_yaml_friendly_value(value)
  if (YAML_RESERVED_CHARACTERS & value.split('')).size > 0
    "\"#{value}\""
  else
    value
  end
end


#file_name = "/Users/aseem/_language_form.html.haml"
raise ArgumentError.new("Usage: ruby haml_localizer.rb <locale-name> <lang-mapping> [<file-path>..]") if ARGV.count < 3
locale_name = ARGV[0]
local_mapping_file_name = ARGV[1]
local_mappings = nil
local_mappings ||= {}
#if locale_name != 'zxx-XX'
#  local_mappings = YAML.load(File.read(local_mapping_file_name))
#end

unmapped_words = []

ARGV[2, ARGV.length].each{|path_name|
  puts "file_name=#{path_name} locale_name=#{locale_name}"
  begin
    dirname = File.dirname(path_name)
    file_name = File.basename(path_name)
    file_name_components = file_name.split('.')
    raise ArgumentError.new('file must end with .html.haml') unless file_name.end_with?('.html.haml')

    template = File.read(path_name)
    x = HTParser.new(template, Haml::Options.new)
    root = x.parse
    # puts "root=#{root}"
    values = []
    accumulate_values(root, values)
    #puts "orig_values=#{values}"
    values = reject_special_words(reject_paran(break_aound_code_values(values)))

    #puts "values=#{values}"

    #if local_name == 'zxx-XX'
      from_to = process_pseudo_values(values)
    #else
    #  from_to = process_values(local_mappings, values, unmapped_words)
    #end
    #puts from_to
    process_values(local_mappings, from_to.keys, unmapped_words)

    replace_with_translations(template, from_to)
    #parse again to ensure no failure
    begin
      x = HTParser.new(template, Haml::Options.new)
      root = x.parse
    rescue => e
      puts "ERROR: Bad substitution created invalid template for #{path_name}"
      #puts e.backtrace # toggle to print entire trace
      next # if we make a bad file, do not try to print, just go to next file
    end
      
    if file_name_components[file_name_components.length - 3] == "en-US"
      new_file_name = dirname + '/' + file_name_components[0, file_name_components.length - 3].join('') + ".#{locale_name}.html.haml"
    else
      new_file_name = dirname + '/' + file_name_components[0, file_name_components.length - 2].join('') + ".#{locale_name}.html.haml"
    end
    
    #puts new_file_name
    File.open(new_file_name, 'w') { |file| file.write(template) }
  rescue => ex
    puts path_name
    puts "#{ex}"
    puts ex.backtrace
    break
  end
}

produce_unmapped(unmapped_words.uniq)
