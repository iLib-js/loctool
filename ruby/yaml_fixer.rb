require 'yaml'

def fixed_yaml(data)
  data = fix_bad_array_syntax(data)
  data.to_yaml
end

#takes a hash representing an array and turns it into an actual array
def fix_bad_array_syntax( hash )
  if hash.keys.reject{|x| /\d/.match(x.to_s).nil? }.count == hash.keys.count
    # bad array notation
    hash.values
  else
    # check if any values are hashes that need to be fixed (recursive)
    hash.each do |k,v|
      next unless v.is_a?(Hash)
      hash[k] = fix_bad_array_syntax(v)
    end
    hash
  end
end

ARGV.each do |filename|
  if File.exists?(filename)
    fixed_file = fixed_yaml(YAML.load_file(filename))
    File.open(filename, 'w'){|f| f << fixed_file}
  end
end