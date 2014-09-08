require 'sinatra'
require_relative 'application'
require 'json'

# TODO maintain this data only for a session

#use Rack::Session::Pool, :expire_after => 2592000

codeList = Array.new

before do
  headers['Access-Control-Allow-Methods'] = 'POST'
  headers['Access-Control-Allow-Origin'] = 'http://localhost'   #To allow cross-site scripting 
                                                                #is necessary to allow the request server address
  headers['Access-Control-Allow-Headers'] = 'accept, authorization, origin'
  headers['Access-Control-Allow-Credentials'] = 'true'
end

post '/' do
  begin
    code = CodeParser.new(params[:code])
    codeList.push(code)
    codeList.index(code).to_s
  rescue
    
  end
end

get '/code/' do
  begin
    idCode = params[:idCode]
    method = params[:method]
    codeList[idCode.to_i].getFunction(method)
  rescue
    
  end
end
