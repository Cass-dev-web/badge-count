
// badge counter ez
// default : 152560680
function replaceColor(string){
    const colormap = {
        "&r" : "\x1b[0m",
        "&n" : "\x1b[4m",

        "&0" : "\x1b[30m",
        "&4" : "\x1b[31m",
        "&2" : "\x1b[32m",
        "&6"  : "\x1b[33m",
        "&3"  : "\x1b[34m",
        "&5"  : "\x1b[35m",
        "&b"  : "\x1b[36m",
        "&f"  : "\x1b[37m",
    }
    var terminalreadystring = string
    for (var key in colormap) {
        // replace 10 times
        for (var i = 0; i < 10; i++) {
            terminalreadystring = terminalreadystring.replace(key,colormap[key])
        }
    }
    return terminalreadystring+=colormap["&r"]
}
(async function(){
    const fetch = require('node-fetch');
    const prompt = require('prompt-sync')();

    var badges =0 
    var pagenum = 1
    var nextpagecursor = ""
    const userid=prompt('Enter your userid to begin counting: ');
    console.log(`Starting with userID: ${userid}...`);
    while (true){
        var badgeinfo
        while (true){
            console.log(replaceColor(`&5[&6-&5] &rGetting badge batch number &4${pagenum}&r.`))
            badgeinfo = await fetch(`https://badges.roblox.com/v1/users/${userid}/badges?limit=100&${(nextpagecursor=="")?"":`&cursor=${nextpagecursor}&`}sortOrder=Asc`)
            if(badgeinfo.status!=200){
                console.log(replaceColor(`&5[&4X&5] &rFailed to get badge batch number &4${pagenum}&r (code &5${badgeinfo.status}&r), retrying...`))
                continue
            }
            break
        }
        badgeinfo = await badgeinfo.json()
        var badgedata = badgeinfo['data']
        var currentbadges = 0
        badgedata.forEach(badge => {
            badges+=1
            currentbadges+=1
            console.log(replaceColor(`    &5[&6BADGE&5] &rFound badge &4${badge['name']}&r number &4${currentbadges}&r of its batch, or number &4${badges}&r of all badges.`))
        })
        nextpagecursor=badgeinfo['nextPageCursor']
        console.log(replaceColor(`&5[&2+&5] &rGot badge batch number &4${pagenum}&r, containing &4${currentbadges}&r badges and nextcursor is ${nextpagecursor}.`))
        if(badgeinfo['nextPageCursor']==null){
            console.log(replaceColor(`&5[&2!!&5] &rFinished counting badges, final count: &4${badges}&r badges.`))
            break
        }
        pagenum+=1
    }
})()