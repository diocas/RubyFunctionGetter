function Beuatifier(config)
{
	this.config = config;
	
	this.insertCode = function(code, place, flags)
	{
		var random = Math.floor(Math.random()*101);
		
		var code_to_insert = '<pre';
		if (flags.showLines){
			code_to_insert += ' class="line-numbers"';
		}
		if (flags.lines != null){
			code_to_insert += ' data-line="'+flags.lines+'"';
		}
		code_to_insert += '><code id="beautifier-'+random+'" class="language-'+this.config.language+'">';
		code_to_insert += code;
		code_to_insert += '</code></pre>';
		$(place).html(code_to_insert);
		Prism.highlightElement($('#beautifier-'+random)[0]);
	};
	
	this.insertError = function(text, place)
	{
		$(place).html('<span class="error">'+text);
	};
}