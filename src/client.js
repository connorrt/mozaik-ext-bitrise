import request from 'superagent-bluebird-promise';
import chalk from 'chalk';
import process from 'process';
import _       from 'lodash';
import * as Promise from 'bluebird';

import convict from 'convict';

const config = convict({
    bitrise: {
        token: {
            doc: 'The Bitrise API Token',
            default: null,
            format: String,
            env: 'BITRISE_API_TOKEN'
        }
    }
});

/**
 * adds a estimation about the build time
 */
function addEstimation(builds) {

    if (builds.length < 2) {
        return builds;
    }

    const estimatedWorkflowTime = {};

    for (const build of builds) {
        if ( build.status === 1 && !estimatedWorkflowTime[build.triggered_workflow]) {
            const start = Date.parse(build.triggered_at);
            const end = Date.parse(build.finished_at);

            estimatedWorkflowTime[build.triggered_workflow] = end - start;
        }
    }

    return builds.map((build) => {
        if (build.status === 0 && build.is_on_hold === false) {
            return Object.assign({}, build, {estimation: estimatedWorkflowTime[build.triggered_workflow]});
        }

        return build;
    });
}

const client = mozaik => {

    const buildApiRequest = (path, params) => {

        mozaik.loadApiConfig(config);

        // Will change to v1.0 when API is finalized, TODO: Update when it comes out
        const baseURL = 'https://api.bitrise.io/v0.1';
        const req = request.get(`${baseURL}/${path}`)
            .set('Authorization', `token ${config.get('bitrise.token')}`)

        if (params) {
            req.query(params);
        }

        return req.promise();
    }

    return {
        getApp({slug}) {

            return buildApiRequest(`apps/${slug}`)
                .then(res => res.body);
        },
        getMe() {

            return buildApiRequest(`me`)
                .then(res => res.body);
        },
        getBuilds({ slug , limit = 10, workflow}) {
            let path = `apps/${slug}/builds?limit=${limit}`;
            if (workflow) {
                path += `&workflow=${workflow}`;
            }

            return buildApiRequest(path).then((res) => {
                return res.body; // res.json() ???
            }).then((res) => {
                return res.data;
            }).then(addEstimation);
        }
    };
};

export default client;
