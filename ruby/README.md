# Haml Localizer
### Blame:
  Aseem (and Sid)

### Usage
  `ruby haml_localizer.rb <locale-name> <lang-mapping> [<file-path>..]`

### Notes
  * Reads HAML files, identifies localizable strings.
  * Replaces strings with translations from the lang-mapping YAML file, or pseudo-localizes string to mark for later translation.
  * Outputs 1 HAML file in the specified locale per input file. 
  * Creates a YAML file of words for which no translation was found. Hashes the keys for each string to prevent creation of invalid YAML.
  * Folder also includes valid.js, a Node script that uses the yamljs library to parse unmapped.yml
