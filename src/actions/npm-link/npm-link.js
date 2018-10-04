const { spawn } = require('child_process');

module.exports = function (name, sourceDestination, finalDestination) {

    return new Promise((resolve, reject) => {
        const child = spawn(`cd ${sourceDestination} && npm link  && cd ${finalDestination} && npm link ${name}`, {
            shell: true
        });

        child.stderr.on('data', function (data) {
            // console.error("STDERR:", data.toString());
        });

        child.stdout.on('data', function (data) {
            // console.log("STDOUT:", data.toString());
        });

        child.on('exit', function (exitCode) {
            if (exitCode) {
                return reject('Error in npm link child process: ' + exitCode);
            }
            resolve();
        });
    });
}