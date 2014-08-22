
/**
 * @param file Path to file
 * @param file_return Object with the response
 * @param config Object with the repository configurations
 * @param version Commit version of the file to get. Optional.
 * @return Status of call (jQuery Deferred object).
 */
function getFile(file, file_return, config, version)
{
	var user = new Gh3.User(config.user);
	var repository = new Gh3.Repository(config.repository, user);
	var loaded = $.Deferred();
	
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
    		
    		var branch = repository.getBranchByName(config.branch);
    		branch.fetchContents(function (err, res)
    		{
				if(err) {
					throw "Branch not found";
				}
				
				var file_info = branch.getFileByName(file);
				
				file_info.fetchContent(function (err, res) {
					if(err)
					{
						throw "File not found";
					}
					file_return.content = file_info.getRawContent();
					loaded.resolve();
				});
				
				//TODO acesso a outras versoes
				/*
				myfile.fetchCommits(function (err, res) {
            if(err) { throw "outch ..." }

            console.log(myfile.getCommits());

            myfile.eachCommit(function (commit) {
              console.log(commit.author.login, commit.message, commit.date);
            });
          });
          */
			});
    	});
	});
	
	return loaded;
}

var configs = {
	user : 'k33g',
	repository : 'k33g.github.com',
	branch : 'master'
};

var loaded, content1 = {};
loaded = getFile('index.html',content1,configs);

$.when(loaded).done(function () {
	console.log(content1);
	$("textarea").text(content1.content);
});