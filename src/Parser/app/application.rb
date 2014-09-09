require 'opal'
require 'ast'
require 'parser/current'

class CodeParser
  
  def initialize(code)
    @ast = Parser::CurrentRuby.parse(code)
  end
  
  def getFunction(name)
    getFunctionAux(@ast, name)
  end
  
  def getFunctionAux(tree, name)
  
    names = name.split(".", 2)
      
    unless tree.nil?
      if (tree.type.to_s.eql? "begin")
        tree = tree.children
      end
    end
    
    if(names.length.eql? 1)
      return getFunctionCode(tree, name)
    else
      if tree.kind_of?(Array)
        tree.each do |child|
           a = checkNode(child, names)
           unless a.nil?
             return a
           end
        end
      else
        a = checkNode(tree, names)
        unless a.nil?
           return a
        end
      end
    end
    return
  end
  
  def checkNode (node, names)
    unless node.nil?
      if(["module", "class"].include? node.type.to_s and node.children[0].loc.name.source.eql? names[0])
        if(node.children[1].nil?)
          a = getFunctionAux(node.children[2], names[1])
        else
          a = getFunctionAux(node.children[1], names[1])
        end
        unless a.nil?
           return a
        end
      end
    end
    return
  end
  
  def getFunctionCode(tree, name)

    if tree.kind_of?(Array)
      tree.each do |child|
        a = getFunctionCodeNode(child, name)
        unless a.nil?
           return a
        end
      end
    else
      a = getFunctionCodeNode(tree, name)
      unless a.nil?
           return a
        end
    end
    return
  end
  
  def getFunctionCodeNode(node, name)
    unless node.nil?
      if(node.type.to_s.eql? "def" and node.children[0].to_s.eql? name)
        return node.loc.expression.source
      end
    end
  end
  
  def getAST
    return @ast
  end
  
  private :getFunctionAux
  private :checkNode
  private :getFunctionCode
  private :getFunctionCodeNode
end
