
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
			
				_changeDirAndOpen(branch, file.split('/'), version, callback);
			});
    	});
	});
}

function _changeDirAndOpen(previous, path, version, callback)
{
	if(path.length == 1)
	{
		_getFile(previous, path[0], version, callback);
	}
	else
	{
		var dir = previous.getDirByName(path[0]);
		
		dir.fetchContents(function (err, res2)
		{
			_changeDirAndOpen(dir, path.splice(1,path.length), version, callback);
		});
	}
}

function _getFile(directory, file, version, callback)
{
	var file_info = directory.getFileByName(file);
				
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
}


var configs = {
	user : 'diocas',
	repository : 'RubyFunctionGetter',
	branch : 'master'
};

getFile('GitHubAccess/application.js', configs, 1, function (content){
	$("textarea").text(content);
});
