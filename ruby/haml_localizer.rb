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
def accumulate_values(root, values, path_name)
  orig = nil
  if root[:type] == :silent_script
    #skip
  elsif (root.value && root.value[:value])
    orig = root.value[:value]
    if root.value[:parse]
      #skip all parsed nodes. i.e, ruby code
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
      values << s.gsub(/[^[:print:]]/ , '')
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
  #puts "process_line called with line=#{line}"
  if !skip_block_indent.nil?
    ret << line
  else
    if line.strip[0] == "="
      ret << line
    else
      from_to.keys.sort_by{|a| a.length}.reverse.each{|k|
        next if k.include?('@') || k.include?('#{')
        v = from_to[k]
        res = line.gsub!(/\b(?<=:title=>\")#{Regexp.escape(k)}(?=\")/, v)
        #if res
        #  puts "replacing #{k} WITH #{v}"
        #end
        res = line.gsub!(/\b(?<=:title =>\")#{Regexp.escape(k)}(?=\")/, v)
        #if res
        #  puts "replacing #{k} WITH #{v}"
        #end

        res = line.gsub!(/\b(?<=:title => \")#{Regexp.escape(k)}(?=\")/, v)
        #if res
        #  puts "replacing #{k} WITH #{v}"
        #end
        res = line.gsub!(/\b(?<![-\/:_\.|#%"'])#{Regexp.escape(k)}(?![\.="']\S)/, v) # match starting with word boundary and doesn't have / | : right before k
        #if res
        #  puts "replacing #{k} WITH #{v}"
        #end
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
    if curr_indent.nil?
      ret << line
      next
    end
    if curr_indent > indent_stack.last
      #new block
      indent_stack << curr_indent
      if line.include?(':ruby')
        skip_block_indent = curr_indent
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
      clean_w = w.gsub("\n", "");
      child_hash[ clean_w.gsub(' ', '_') ] = clean_w
    }
    h[filename] = child_hash
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

def strip_whitespace(from_to)
  ret = {}
  from_to.each{|k, v|
    ret[k.strip] = v.strip
  }
  ret
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

unmapped_words = {}

ARGV[2, ARGV.length].each{|path_name|
  puts "file_name=#{path_name} locale_name=#{locale_name}"
  begin
    dirname = File.dirname(path_name)
    file_name = File.basename(path_name)
    file_name_components = file_name.split('.')
    unmapped_for_file = []
    raise ArgumentError.new('file must end with .html.haml') unless file_name.end_with?('.html.haml')

    template = File.read(path_name)
    x = HTParser.new(template, Haml::Options.new)
    root = x.parse
    values = []
    accumulate_values(root, values, path_name)
    #puts root
    #puts "orig_values=#{values}"
    values = reject_special_words(reject_paran(break_aound_code_values(values)))

    #puts "values=#{values}"

    #if local_name == 'zxx-XX'
      from_to = process_pseudo_values(values)
    #else
    #  from_to = process_values(local_mappings, values, unmapped_words)
    #end
    from_to = strip_whitespace(from_to)
    #puts from_to
    process_values(local_mappings, from_to.keys, unmapped_for_file)

    #replace_with_translations(template, from_to)
    template = replace_with_translations2(template, from_to)
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
    unmapped_words[file_name] = unmapped_for_file
  rescue => ex
    puts path_name
    puts "#{ex}"
    puts ex.backtrace
    break
  end
}

produce_unmapped(unmapped_words)
