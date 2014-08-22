
//TODO tratamento de erros

/**
 * @param file Path to file
 * @param config Object with the repository configurations
 * @param version Commit version of the file to get. Optional.
 * @param callback Function to be called when complete (parameter with content).
 */
function getFile(file, config, version, callback)
{
	var user = new Gh3.User(config.user);
	var repository = new Gh3.Repository(config.repository, user);
	
	repository.fetch(function (err, res)
	{
		if(err)
		{
			throw "Repository not found";
		}
		
		repository.fetchBranches(function (err, res)
		{
    		if(err)
    		{
    			throw "Branches not available";
    		}
    		
    		var branch = repository.getBranchByName(config.branch == null ? 'master' : config.branch);
    		branch.fetchContents(function (err, res)
    		{
				if(err) {
					throw "Branch not found";
				}
				
				var file_info = branch.getFileByName(file);
				
				if(!version)
				{
					file_info.fetchContent(function (err, res) {
						if(err)
						{
							throw "File not found";
						}
						callback(file_info.getRawContent());
					});
				}
				else
				{
					file_info.fetchCommits(function (err, res) {
			            if(err) {
			            	throw "Error retrieving commits";
			            }
						
						file_info.fetchContentVersion(version, function (err, res) {
							if(err)
							{
								throw "File not found";
							}
							callback(file_info.getRawContent());
						});
			         });
				}
			});
    	});
	});
}


var configs = {
	user : 'k33g',
	repository : 'k33g.github.com',
	branch : 'master'
};

getFile('index.html', configs, null, function (content){
	$("textarea").text(content);
});
