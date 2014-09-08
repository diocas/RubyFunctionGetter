//TODO: tratamento de erros quando usa versoes...

function RubyFunctionGetter(config)
{
	this.config = config;
	this.config.language = 'ruby';
	var github = new GitHubAccess(this.config);
	var beuatifier = new Beuatifier(this.config);
	this.files = [];
	this.files_status = [];
	this.codes_status = [];
	this.codes_temp = [];
	
	this.gettify = function()
	{
		var getter = this;
		$( document ).ready(function() {
			$('.gettify').each(function () {
				
				var text = $(this).text();
				var path = {}, flags = {};
				
				$(this).text('Loading...');
				$(this).addClass('gettified').removeClass('gettify');
				
				path.file = text.match("^([A-Za-z0-9_.\/])+")[0];
				//path.version = text.match("\:[0-9]+");
				path.version = text.match("\:[a-fA-F0-9]+");
				if(path.version) path.version = path.version[0].substring(1, path.version[0].length);
				path.method = text.match("\#([A-Za-z0-9_.])+");
				path.method = path.method[0].substring(1, path.method[0].length);
				flags.lines  = text.match("-l [0-9\-\, ]+");
				if(flags.lines) flags.lines = flags.lines[0].substring(3, flags.lines[0].length);
				flags.showLines = text.match("( -ls )|( -ls$)") != null ? true : false;
				
				getter.insertFunction(path, flags, $(this));
				
			});
		});
	};
	
	
	this.insertFunction = function (path, flags, place)
	{
		var method_code = {};
		$.when(this._getMethod(path, method_code)).done(function () {
			beuatifier.insertCode(method_code.code, place, flags);
		}).fail(function () {
			beuatifier.insertError(method_code.code, place);
		});
	};
	
	
	this._getFile = function(path, file_code)
	{
		var loaded = $.Deferred();
		var converted_path = this._convertPath(path, false);
		var this_class = this;
		
		if (this.files_status[converted_path])
		{
			//console.log('ficheiro existe ou em pedido');
			$.when(this.files_status[converted_path]).always(function () {
				file_code.code = this_class.files[converted_path];
			}).done(function (){
				loaded.resolve();
			}).fail(function (){
				loaded.reject();
			});
		}
		else
		{
			//console.log('ficheiro nao existe');
			var getting_file = $.Deferred();
			this.files_status[converted_path] = getting_file;
			github.getFile(path.file, path.version, function (content, err)
			{
				this_class.files[converted_path] = new CodeParser(content);
				file_code.code = this_class.files[converted_path];
				
				if (err == null || !err){
					getting_file.resolve();
					loaded.resolve();
				} else {
					getting_file.reject();
					loaded.reject();
				} 
			});
		}
		return loaded;
	};
	
	this._getMethod = function(path, method_code)
	{
		var loaded = $.Deferred();
		var converted_path = this._convertPath(path);
		
		if (path.version == null)
		{
			var this_class = this;
			if (this.codes_status[converted_path])
			{
				//console.log('recente + a ir buscar...');
				$.when(this.codes_status[converted_path]).always(function () {
					method_code.code = this_class.codes_temp[converted_path];
				}).done(function () {
					loaded.resolve();
				}).fail(function () {
					loaded.reject();
				});
			}
			else
			{
				//console.log('recente + NAO cache');
				
				var getting_code = $.Deferred();
				this.codes_status[converted_path] = getting_code;
				
				var file_code = {};
				$.when(this._getFile(path, file_code)).always(function () {
					var code =  file_code.code.getFunction(path.method);
					this_class.codes_temp[converted_path] = code;
					method_code.code = code;
				}).done(function () {
					getting_code.resolve();
					loaded.resolve();
				}).fail(function () {
					getting_code.reject();
					loaded.reject();
				});
			}
		}
		else
		{
			var storage_code = $.jStorage.get(converted_path);
			if (storage_code)
			{
				//console.log('versao + disponivel em cache');
				
				method_code.code = storage_code;
				loaded.resolve();
			}
			else if (this.codes_status[converted_path])
			{
				//console.log('versao + a ir buscar...');
				
				$.when(this.codes_status[converted_path]).always(function () {
					method_code.code = $.jStorage.get(converted_path);
				}).done(function () {
					loaded.resolve();
				}).fail(function () {
					loaded.reject();
				});
			}
			else
			{
				//console.log('versao + NAO disponivel em cache');
				
				var getting_code = $.Deferred();
				this.codes_status[converted_path] = getting_code;
				
				var file_code = {};
				$.when(this._getFile(path, file_code)).always(function () {
					var code =  file_code.code.getFunction(path.method);
					$.jStorage.set(converted_path, code);
					method_code.code = code;
				}).done(function () {
					getting_code.resolve();
					loaded.resolve();
				}).fail(function () {
					getting_code.reject();
					loaded.reject();
				});
			}
		}
		return loaded;
	};
	
	this._convertPath = function(file_path, showMethod)
	{
		var path = this.config.user + '/' + this.config.repository + '/' + this.config.branch + '/';
		path += file_path.file + '/' + file_path.version;
		if(showMethod == null || showMethod) path += '/' + file_path.method;
		
		return path;
	};

}