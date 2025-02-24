const fse = require('fs-extra')
const path = require('path')

/**
 * Clean up all workpath files and remove folder
 */
module.exports = async function(job, settings) {
    settings.track('Job Cleanup');

    if (settings.skipCleanup) {
        settings.logger.log(`[${job.uid}] skipping the clean up...`);
        return Promise.resolve(job)
    }

    settings.logger.log(`[${job.uid}] cleaning up...`);

    // sometimes this attribute (workpath) is undefined
    if (!job.workpath) {
        job.workpath = path.join(settings.workpath, job.uid)
    }

    try {
        await fse.emptyDir(job.workpath);

        // If we've deleted the contents of the folder successfully,
        // removing the folder itself may throw error but we treat it as success in any case.
        try {
            await fse.remove(job.workpath);
        } catch { /* empty */ }
        settings.logger.log(`[${job.uid}] Temporary AfterEffects project deleted. If you want to inspect it for debugging, use "--skip-cleanup"`)
    } catch (err) {
        settings.logger.log(`[${job.uid}] [fse] Temporary AfterEffects could not be deleted. (Error: ${err.code}). Please delete the folder manually: ${job.workpath}\n${err}`)
    }

    return job;
};
