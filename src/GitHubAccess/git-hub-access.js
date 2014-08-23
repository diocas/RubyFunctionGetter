
/**
 * @param file Path to file
 * @param config Object with the repository configurations
 * @param version Commit version of the file to get. Optional.
 * @param callback Function to be called when complete (parameter with content).
 */

function GitHubAccess (config)
{
	this.config = config;
	
	this.getFile = function(file, version, callback)
	{
		var user = new Gh3.User(this.config.user);
		var repository = new Gh3.Repository(this.config.repository, user);
		
		repository.fetch(function (err, res)
		{
			if (err)
			{
	    		callback("Repository not found", true);
			}
			repository.fetchBranches(function (err, res)
			{
				if(err)
				{
					callback("Error fetching branches", true);
				}
				
	    		var branch = repository.getBranchByName(config.branch == null ? 'master' : config.branch);
		    	try
		    	{
		    		branch.fetchContents(function (err, res)
		    		{
		    			if (err)
		    			{
		    				callback("Error fetching contents", true);
		    			}
						_changeDirAndOpen(branch, file.split('/'), version, callback);
					});
				} catch (e) {
					callback("Branch not found", true);
				}
	    	});
		});
	};
	
	function _changeDirAndOpen(previous, path, version, callback)
	{
		if(path.length == 1)
		{
			_getFile(previous, path[0], version, callback);
		}
		else
		{
			var dir = previous.getDirByName(path[0]);
			try 
			{
				dir.fetchContents(function (err, res2)
				{
					if (err)
					{
						callback("Error fetching contents inside folder " + path[0], true);
					}
					_changeDirAndOpen(dir, path.splice(1,path.length), version, callback);
				});
			} catch (e) {
				callback("Path to file not valid. Folder " + path[0] + " doesn't exist.", true);
			}
		}
	}
	
	function _getFile(directory, file, version, callback)
	{
		var file_info = directory.getFileByName(file);
		
		if(version == null)
		{
			try
			{
				file_info.fetchContent(function (err, res)
				{
					if (err)
					{
						callback("Error fetching contents", true);
					}
					callback(file_info.getRawContent());
				});
			}catch(e) {
				callback("Could not open file", true);
			}
		}
		else
		{
			file_info.fetchCommits(function (err, res) {
				try
				{
					file_info.fetchContentVersion(version, function (err, res)
					{
						if (err)
						{
							callback("Error fetching contents", true);
						}
						callback(file_info.getRawContent());
					});
				}catch(e) {
					callback("Could not open file", true);
				}
	         });
		}
	}
	
}
