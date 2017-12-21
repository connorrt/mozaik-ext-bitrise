import React, { Component, PropTypes } from 'react';

import reactMixin from 'react-mixin';
import { ListenerMixin } from 'reflux';

import Mozaik from 'mozaik/browser';;

import moment from 'moment';

import { BuildStatus, getBuildStatus, getBuildProgress } from './util';

class SingleBuildStatus extends Component {
    constructor(props) {
        super(props);

        this.state = { currentBuild: null, previousBuild: null };
    }

    getApiRequest() {
        const { slug, workflow } = this.props;

        return {
            id: `bitrise.getBuilds.${slug}.3.${workflow}`,
            params: {
                slug,
                limit: 3, // increase the estimation accuracy
                workflow
            }
        };
    }

    onApiData(builds) {
        const currentBuild = builds.length > 0 ? builds[0] : null;
        const previousBuild = builds.length > 1 ? builds[1] : null;
        this.setState({ currentBuild, previousBuild });
    }

    render() {
        const { currentBuild, previousBuild } = this.state;

        if (!currentBuild) {
            return (<div className="widget__body__colored">{'Build not found'}</div>);
        }

        const currentStatus = getBuildStatus(currentBuild);
        const previousStatus = getBuildStatus(previousBuild);
        const title = this.props.title || currentBuild.triggered_workflow;

        const classList = [
            'widget__body__colored',
            `bitrise__view__job__build__colored_status--${(currentStatus === 'running' ? previousStatus : currentStatus).toLowerCase()}`
        ];

        var iconClass;
        var statusString;
        if (currentStatus === 'success') { iconClass = 'fa fa-check'; statusString = 'finished'; };
        if (currentStatus === 'failed') { iconClass = 'fa fa-close'; statusString = 'failed'; };
        if (currentStatus === 'cancelled') { iconClass = 'fa fa-meh-o'; statusString = 'cacnelled'; };
        if (currentStatus === 'running') { iconClass = 'fa fa-spin fa-cog'; statusString = 'started'; };

        const progress = currentStatus == 'running' ? getBuildProgress(currentBuild) * 100 : 100;
        const time = currentStatus === 'running' ? currentBuild.triggered_at : currentBuild.finished_at;

        const gradientString = `linear-gradient(to right, rgba(0,0,0,.5) 0%, rgba(0,0,0,.5) ${progress}%, transparent ${progress}%, transparent 100%)`;
        const progressDiv = currentStatus === 'running' ? (<div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: gradientString}}/>) : null;
        
        return (
            <div className={classList.join(' ')}>
                {progressDiv}
                <div className="bitrise__job-status__current">
                    Build #{currentBuild.build_number}<br />
                    <a className="bitrise__job-status__current__status" href={`https://www.bitrise.io/build/${currentBuild.slug}`}>
                        {title}&nbsp;<br />
                        <i className={iconClass} />&nbsp;
                    </a>
                    <time className="bitrise__job-status__current__time">    
                        {statusString}&nbsp;
                        {moment(time).fromNow()}
                    </time>
                </div>
            </div>
        );
    }
}

SingleBuildStatus.displayName = 'SingleBuildStatus';

SingleBuildStatus.propTypes = {
    slug: PropTypes.string.isRequired,
    workflow: PropTypes.number.isRequired,
    title: PropTypes.string
};

reactMixin(SingleBuildStatus.prototype, ListenerMixin);
reactMixin(SingleBuildStatus.prototype, Mozaik.Mixin.ApiConsumer);

export default SingleBuildStatus;
