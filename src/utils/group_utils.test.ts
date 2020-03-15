// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import assert from 'assert';

import {
    filterGroupsMatchingTerm,
} from './group_utils';

describe('group utils', () => {
    describe('filterGroupsMatchingTerm', () => {
        const groupA = {
            id: 'groupid1',
            name: 'group1',
            description: 'group1 description',
            display_name: 'board-group',
            type: 'ldap',
            remote_id: 'group1',
            create_at: 1,
            update_at: 2,
            delete_at: 0,
            has_syncables: true,
            member_count: 3,
            scheme_admin: false,
            allow_reference: true,
            groupname: 'board-group',
        };
        const groupB = {
            id: 'groupid2',
            name: 'group2',
            description: 'group2 description',
            display_name: 'developers-group',
            type: 'ldap',
            remote_id: 'group2',
            create_at: 1,
            update_at: 2,
            delete_at: 0,
            has_syncables: true,
            member_count: 3,
            scheme_admin: false,
            allow_reference: true,
            groupname: 'developers-group',
        };
        const groupC = {
            id: 'groupid3',
            name: 'group3',
            description: 'group3 description',
            display_name: 'software engineers',
            type: 'ldap',
            remote_id: 'group3',
            create_at: 1,
            update_at: 2,
            delete_at: 0,
            has_syncables: true,
            member_count: 3,
            scheme_admin: false,
            allow_reference: true,
            groupname: 'software-engineers',
        };
        const groups = [groupA, groupB, groupC];

        it('should match all for empty filter', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, ''), [groupA, groupB, groupC]);
        });

        it('should filter out results which do not match', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, 'testBad'), []);
        });

        it('should match by groupname', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, 'software-engineers'), [groupC]);
        });

        it('should match by split part of the groupname', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, 'group'), [groupA, groupB]);
            assert.deepEqual(filterGroupsMatchingTerm(groups, 'board'), [groupA]);
        });

        it('should match by display_name fully', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, 'software engineers'), [groupC]);
        });

        it('should match by display_name case-insensitive', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, 'software ENGINEERS'), [groupC]);
        });

        it('should ignore leading @ for groupname', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, '@developers'), [groupB]);
        });

        it('should ignore leading @ for display_name', () => {
            assert.deepEqual(filterGroupsMatchingTerm(groups, '@software'), [groupC]);
        });
    });
});
