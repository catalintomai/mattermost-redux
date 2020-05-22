// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';
import {GeneralTypes, UserTypes} from 'action_types';
import {GenericAction} from 'types/actions';
import {ClientLicense, Config} from 'types/config';

function config(state: Partial<Config> = {}, action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.CLIENT_CONFIG_RECEIVED:
        return Object.assign({}, state, action.data);
    case UserTypes.LOGIN: // Used by the mobile app
    case GeneralTypes.SET_CONFIG_AND_LICENSE:
        return Object.assign({}, state, action.data.config);
    case GeneralTypes.CLIENT_CONFIG_RESET:
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}

function appState(state = false, action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.RECEIVED_APP_STATE:
        return action.data;

    default:
        return state;
    }
}

function credentials(state: any = {}, action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.RECEIVED_APP_CREDENTIALS:
        return Object.assign({}, state, action.data);

    case UserTypes.LOGIN: // Used by the mobile app
        return {
            url: action.data.url,
        };
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}

function dataRetentionPolicy(state: any = {}, action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.RECEIVED_DATA_RETENTION_POLICY:
        return action.data;
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}

function deviceToken(state = '', action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.RECEIVED_APP_DEVICE_TOKEN:
        return action.data;
    default:
        return state;
    }
}

function license(state: ClientLicense = {}, action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.CLIENT_LICENSE_RECEIVED:
        return action.data;
    case GeneralTypes.SET_CONFIG_AND_LICENSE:
        return Object.assign({}, state, action.data.license);
    case GeneralTypes.CLIENT_LICENSE_RESET:
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}

function timezones(state: string[] = [], action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.SUPPORTED_TIMEZONES_RECEIVED:
        return action.data;
    case UserTypes.LOGOUT_SUCCESS:
        return [];
    default:
        return state;
    }
}

function serverVersion(state = '', action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.RECEIVED_SERVER_VERSION:
        return action.data;
    case UserTypes.LOGOUT_SUCCESS:
        return '';
    default:
        return state;
    }
}

function warnMetricsStatus(state: any = {}, action: GenericAction) {
    switch (action.type) {
    case GeneralTypes.RECEIVED_WARN_METRICS_STATUS:
        return action.data;
    default:
        return state;
    }
}

export default combineReducers({
    appState,
    credentials,
    config,
    dataRetentionPolicy,
    deviceToken,
    license,
    serverVersion,
    timezones,
    warnMetricsStatus,
});
