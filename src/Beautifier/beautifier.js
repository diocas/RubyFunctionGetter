function Beuatifier(config)
{
	this.config = config;
	
	this.insertCode = function(code, place, highlight)
	{
		var random = Math.floor(Math.random()*101);
		
		var code_to_insert = '<pre';
		if (this.config.showLines){
			code_to_insert += ' class="line-numbers"';
		}
		if (highlight != null){
			code_to_insert += ' data-line="'+highlight+'"';
		}
		code_to_insert += '><code id="beautifier-'+random+'" class="language-'+this.config.language+'">';
		code_to_insert += code;
		code_to_insert += '</code></pre>';
		$(place).append(code_to_insert);
		Prism.highlightElement($('#beautifier-'+random)[0]);
	};
}