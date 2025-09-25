module.exports = (job, settings, fn, fnName) => {
    if (settings && settings.skipSteps && settings.skipSteps.includes(fnName)) {
        return Promise.resolve(job);
    }

    if (settings && settings.abortSignal && settings.abortSignal.aborted) {
        return Promise.reject(new Error('Aborted'));
    }

    job.state = `render:${fnName}`;

    if (job.onChange) {
        job.onChange(job, job.state);
    }

    return fn(job, settings);
}
