// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as reselect from 'reselect';
import {GlobalState} from 'types/store';
import {Group} from 'types/groups';
import {filterGroupsMatchingTerm} from 'utils/group_utils';
import {getChannel} from 'selectors/entities/channels';
import {getTeam} from 'selectors/entities/teams';

const emptyList: any[] = [];
const emptySyncables = {
    teams: [],
    channels: [],
};

export function getAllGroups(state: GlobalState) {
    return state.entities.groups.groups;
}

export function getGroup(state: GlobalState, id: string) {
    return getAllGroups(state)[id];
}

export function getGroupMemberCount(state: GlobalState, id: string) {
    const memberData = state.entities.groups.members;
    const groupMemberData = memberData[id];
    if (!groupMemberData) {
        return 0;
    }
    return memberData[id].totalMemberCount;
}

function getGroupSyncables(state: GlobalState, id: string) {
    return state.entities.groups.syncables[id] || emptySyncables;
}

export function getGroupTeams(state: GlobalState, id: string) {
    return getGroupSyncables(state, id).teams;
}

export function getGroupChannels(state: GlobalState, id: string) {
    return getGroupSyncables(state, id).channels;
}

export function getGroupMembers(state: GlobalState, id: string) {
    const groupMemberData = state.entities.groups.members[id];
    if (!groupMemberData) {
        return emptyList;
    }
    return groupMemberData.members;
}

export function searchAssociatedGroupsForReferenceLocal(state: GlobalState, term: string, teamId: string, channelId: string): Array<Group> {
    const groups = getAssociatedGroupsForReference(state, teamId, channelId);
    if (!groups) {
        return emptyList;
    }
    const filteredGroups = filterGroupsMatchingTerm(groups, term);
    return filteredGroups;
    return groups;
}

export function getAssociatedGroupsForReference(state: GlobalState, teamId: string, channelId: string): Array<Group> {
    const team = getTeam(state, teamId);
    const channel = getChannel(state, channelId);

    let groupsForReference = [];
    if (team && team.group_constrained && channel && channel.group_constrained) {
        const groupsFromChannel = getGroupsAssociatedToChannelForReference(state, channelId);
        const groupsFromTeam = getGroupsAssociatedToTeamForReference(state, teamId);
        groupsForReference = groupsFromChannel.concat(groupsFromTeam.filter((item) => groupsFromChannel.indexOf(item) < 0));
    } else if (team && team.group_constrained) {
        groupsForReference = getGroupsAssociatedToTeamForReference(state, teamId);
    } else if (channel && channel.group_constrained) {
        groupsForReference = getGroupsAssociatedToChannelForReference(state, channelId);
    } else {
        groupsForReference = getAllAssociatedGroupsForReference(state);
    }
    return groupsForReference;
}

const teamGroupIDs = (state: GlobalState, teamID: string) => (state.entities.teams.groupsAssociatedToTeam[teamID] == null ? undefined : state.entities.teams.groupsAssociatedToTeam[teamID].ids == null ? undefined : state.entities.teams.groupsAssociatedToTeam[teamID].ids) || [];

const channelGroupIDs = (state: GlobalState, channelID: string) => (state.entities.channels.groupsAssociatedToChannel[channelID] == null ? undefined : state.entities.channels.groupsAssociatedToChannel[channelID].ids == null ? undefined : state.entities.channels.groupsAssociatedToChannel[channelID].ids) || [];

const getTeamGroupIDSet = reselect.createSelector(
    teamGroupIDs,
    (teamIDs) => new Set(teamIDs),
);

const getChannelGroupIDSet = reselect.createSelector(
    channelGroupIDs,
    (channelIDs) => new Set(channelIDs),
);

export const getGroupsNotAssociatedToTeam = reselect.createSelector(
    getAllGroups,
    (state: GlobalState, teamID: string) => getTeamGroupIDSet(state, teamID),
    (allGroups, teamGroupIDSet) => {
        return Object.entries(allGroups).filter(([groupID]) => !teamGroupIDSet.has(groupID)).map((entry) => entry[1]);
    }
);

export const getGroupsAssociatedToTeam = reselect.createSelector(
    getAllGroups,
    (state: GlobalState, teamID: string) => getTeamGroupIDSet(state, teamID),
    (allGroups, teamGroupIDSet) => {
        return Object.entries(allGroups).filter(([groupID]) => teamGroupIDSet.has(groupID)).map((entry) => entry[1]);
    }
);

export const getGroupsNotAssociatedToChannel = reselect.createSelector(
    getAllGroups,
    (state: GlobalState, channelID: string) => getChannelGroupIDSet(state, channelID),
    (allGroups, channelGroupIDSet) => {
        return Object.entries(allGroups).filter(([groupID]) => !channelGroupIDSet.has(groupID)).map((entry) => entry[1]);
    }
);

export const getGroupsAssociatedToChannel = reselect.createSelector(
    getAllGroups,
    (state: GlobalState, channelID: string) => getChannelGroupIDSet(state, channelID),
    (allGroups, channelGroupIDSet) => {
        return Object.entries(allGroups).filter(([groupID]) => channelGroupIDSet.has(groupID)).map((entry) => entry[1]);
    }
);

export const getGroupsAssociatedToTeamForReference = reselect.createSelector(
    getAllGroups,
    (state: GlobalState, teamID: string) => getTeamGroupIDSet(state, teamID),
    (allGroups, teamGroupIDSet) => {
        return Object.entries(allGroups).filter(([groupID]) => teamGroupIDSet.has(groupID)).filter((entry) => entry[1].allow_reference).map((entry) => entry[1]);
    }
);

export const getGroupsAssociatedToChannelForReference = reselect.createSelector(
    getAllGroups,
    (state: GlobalState, channelID: string) => getChannelGroupIDSet(state, channelID),
    (allGroups, channelGroupIDSet) => {
        return Object.entries(allGroups).filter(([groupID]) => channelGroupIDSet.has(groupID)).filter((entry) => entry[1].allow_reference).map((entry) => entry[1]);
    }
);

export const getAllAssociatedGroupsForReference = reselect.createSelector(
    getAllGroups,
    (allGroups) => {
        return Object.entries(allGroups).filter((entry) => entry[1].allow_reference).map((entry) => entry[1]);
    }
);

