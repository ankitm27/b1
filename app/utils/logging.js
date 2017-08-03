exports.trace = trace;

var levels = {
    trace : 0,
    debug : 1,
    info  : 2,
    warn  : 3,
    error : 4
};


var debuggingPermissions = {   loggingEnabled : true, defaultLoggingLevel : levels.trace};


function log(loggingLevel, loggingParameters){
    const execFunction = loggingParameters[0];

    let enabledLoggingLevel = global.loggingLevel || debuggingPermissions.defaultLoggingLevel;
    if (!debuggingPermissions.loggingEnabled || loggingLevel < enabledLoggingLevel){
        return;
    }

    let stream = process.stdout;
    if(loggingLevel === levels.error){
        stream = process.stderr;
    }

    let data = "";
    for(let i = 0; i < loggingParameters.length; i++){
        data += ' ::: ' + '\t' + JSON.stringify(loggingParameters[i]) + '\t';
    }
    stream.write((new Date()).toUTCString()  + data + "\n");
}


function trace(/* arguments */){
    log(levels.trace, arguments);
}