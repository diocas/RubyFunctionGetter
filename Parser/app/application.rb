require 'opal'
require 'ast'
require 'parser/current'

#require 'ruby_parser'
#puts RubyParser.new.parse("while false : 42 end")

class CodeFile
  
  def initialize(code)
    @ast = Parser::CurrentRuby.parse(code)
  end
  
  def getFunction(name)
    
    names = name.split(".") #only class and function
    
    if(names.length.eql? 1)
      return getFunctionAux(@ast, name)
    else
       @ast.children.each do |child|
         unless child.nil?
          if(child.type.to_s.eql? "class" and child.children[0].loc.name.source.eql? names[0])
            return getFunctionAux(child, names[1])
          end
        end
      end
    end
    
    return
  end
  
  def getFunctionAux(tree, name)

    tree.children.each do |child|
      unless child.nil?
        if(child.type.to_s.eql? "def" and child.children[0].to_s.eql? name)
          return child.loc.expression.source
        end
      end
    end
    return
  end
  
  def getAST
    return @ast
  end
  
  private :getFunctionAux
end
