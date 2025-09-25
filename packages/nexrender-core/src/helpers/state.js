module.exports = (job, settings, fn, fnName) => {
    if (settings && settings.skipSteps && settings.skipSteps.includes(fnName)) {
        return Promise.resolve(job);
    }

    job.state = `render:${fnName}`;

    if (job.onChange) {
        job.onChange(job, job.state);
    }

    return fn(job, settings);
}
