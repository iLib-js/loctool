# encoding: utf-8
require 'haml'
require 'csv'
require 'sanitize'

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

# assumed one space between stripped?
def toks_with_n_breaks(markup, stripped, num_breaks)
  #puts "toks_with_n_breaks caleld with markup=#{markup} stripped=#{stripped} num_breaks=#{num_breaks}"
  if num_breaks==0
    if markup.strip.include?(stripped.strip)
      return [stripped.strip]
    else
      return nil
    end
  end
  stripped_words = stripped.split(' ').reject{|s| s.strip.empty?}
  #break and recurse
  for i in (1..stripped_words.count) do
    cand = stripped_words[0, i].join(' ')
    #puts "cand=#{cand}"
    if markup.include?(cand)
      #found a break. recurse
      ret = toks_with_n_breaks(markup.gsub(cand, ''), stripped.gsub(cand, ''), num_breaks - 1)
      if ret
        return [cand] + ret
      end
    end
  end
  nil
end

#return array of tokenized strings. Break into as few phrases as possible
def get_overlap_strings(orig_with_markup, stripped)
  stripped_words = stripped.split(' ').reject{|s| s.empty?}
  for num_breaks in (0..stripped_words.count) do
    ret = toks_with_n_breaks(orig_with_markup, stripped, num_breaks)
    return ret if ret
  end
  nil
end

def accumulate_values(root, values)
  orig = nil
  if (root.value && root.value[:value])
    orig = root.value[:value]
  elsif (root[:type] == :plain && root.value && root.value[:text])
    orig = root.value[:text]
  end
  if orig
    s = Sanitize.clean(orig)
    if s == orig
      values << s
    else
      toks = get_overlap_strings(orig, s)
      values.concat(toks) if toks
    end
  end
  root.children.each{|c| accumulate_values(c, values)}
end


PSUEDO_MAP = {    "a"=> "à",    "c"=> "ç",    "d"=> "ð",    "e"=> "ë",    "g"=> "ğ",    "h"=> "ĥ",    "i"=> "í",    "j"=> "ĵ",    "k"=> "ķ",    "l"=> "ľ",    "n"=> "ñ",    "o"=> "õ",    "p"=> "þ",    "r"=> "ŕ",    "s"=> "š",    "t"=> "ţ",    "u"=> "ü",    "w"=> "ŵ",    "y"=> "ÿ",    "z"=> "ž",    "A"=> "Ã",    "B"=> "ß",    "C"=> "Ç",    "D"=> "Ð",    "E"=> "Ë",    "G"=> "Ĝ",    "H"=> "Ħ",    "I"=> "Ï",    "J"=> "Ĵ",    "K"=> "ĸ",    "L"=> "Ľ",    "N"=> "Ň",    "O"=> "Ø",    "R"=> "Ŗ",    "S"=> "Š",    "T"=> "Ť",    "U"=> "Ú",    "W"=> "Ŵ",    "Y"=> "Ŷ",    "Z"=> "Ż"}
#return <original string> => <string to repalce with>
def process_values(values)
  ret = {}
  values.each{|v|
    ret[v] = v.split('').map{|c| PSUEDO_MAP[c] ? PSUEDO_MAP[c] : c}.join('')
  }
  ret
end

def replace_with_translations(template, from_to)
  from_to.keys.sort{|a| a.length}.reverse.each{|k|
    v = from_to[k]
    template.gsub!(k, v)
  }
  template
end


#file_name = "/Users/aseem/_language_form.html.haml"
raise ArgumentError.new("Usage: ruby haml_localizer.rb <local-name> [<file-path>..]") if ARGV.count < 2
local_name = ARGV[0]

ARGV[1, ARGV.length].each{|file_name|
  puts "file_name=#{file_name} local_name=#{local_name}"
  file_name_components = file_name.split('.')
  raise ArgumentError.new('file must end with .html.haml') unless file_name.end_with?('.html.haml')

  template = File.read(file_name)
  x = HTParser.new(template, Haml::Options.new)
  root = x.parse
  values = []
  special_values = []
  accumulate_values(root, values)
#puts x.node_to_text.count

  from_to = process_values(values)
  puts from_to

  replace_with_translations(template, from_to)

  new_file_name = file_name_components[0, file_name_components.length - 2].join('') + ".#{local_name}.html.haml"
  puts new_file_name
  File.open(new_file_name, 'w') { |file| file.write(template) }
}

