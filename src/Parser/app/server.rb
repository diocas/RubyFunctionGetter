require 'sinatra'
require_relative 'application'


class Session
  @@id = 0;
  
  def initialize (code)
    @id = @@id
    @@id += 1
    @time = Time.new
    @code = code
  end
  
  def valid?
    (Time.new - @time) < 120  # after 3 minutes clean the old session
  end
  
  def update
    @time = Time.new
  end
  
  def id
    @id
  end
  
  def code
    @code
  end
end



sessionList = Array.new

before do
  headers['Access-Control-Allow-Methods'] = 'POST'
  headers['Access-Control-Allow-Origin'] = 'http://localhost'   #To allow cross-site scripting 
                                                                #is necessary to allow the request server address
  headers['Access-Control-Allow-Headers'] = 'accept, authorization, origin'
  headers['Access-Control-Allow-Credentials'] = 'true'
end

post '/' do
  begin
    Thread.new{cleanOld(sessionList)}
    code = CodeParser.new(params[:code])
    session = Session.new(code)
    sessionList.push(session)
    return session.id.to_s
  rescue
    
  end
end

get '/code/' do
  begin
    idCode = params[:idCode]
    method = params[:method]
    
    sessionList.each do |session|
      if(session.id == idCode.to_i)
        session.update
        return session.code.getFunction(method)
      end
    end
  rescue
    
  end
end

def cleanOld(sessionList)
  sessionList.each do |session|
    unless (session.valid?)
      sessionList.delete(session)
    end
  end
end
