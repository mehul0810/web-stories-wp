/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Internal dependencies
 */
import {
  StoriesPropType,
  StoryActionsPropType,
  UsersPropType,
} from '../../../../../types';
import {
  SortPropTypes,
  ViewPropTypes,
} from '../../../../../utils/useStoryView';
import { Button, Dialog } from '../../../../../components';
import {
  VIEW_STYLE,
  STORY_ITEM_CENTER_ACTION_LABELS,
  STORY_CONTEXT_MENU_ACTIONS,
  BUTTON_TYPES,
} from '../../../../../constants';
import { StoryGridView, StoryListView } from '../../../shared';

function StoriesView({
  filterValue,
  sort,
  storyActions,
  stories,
  users,
  view,
}) {
  const [contextMenuId, setContextMenuId] = useState(-1);
  const [titleRenameId, setTitleRenameId] = useState(-1);
  const [activeModal, setActiveModal] = useState('');
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    if (!activeModal) {
      setActiveStory(null);
    }
  }, [activeModal, setActiveStory]);

  const handleOnRenameStory = useCallback(
    (story, newTitle) => {
      setTitleRenameId(-1);
      storyActions.updateStory({ ...story, title: { raw: newTitle } });
    },
    [storyActions]
  );

  const handleMenuItemSelected = useCallback(
    (sender, story) => {
      setContextMenuId(-1);
      switch (sender.value) {
        case STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR:
          window.location.href = story.bottomTargetAction;
          break;
        case STORY_CONTEXT_MENU_ACTIONS.RENAME:
          setTitleRenameId(story.id);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.DUPLICATE:
          storyActions.duplicateStory(story);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.CREATE_TEMPLATE:
          storyActions.createTemplateFromStory(story);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.DELETE:
          setActiveModal('DELETE_STORY');
          setActiveStory(story);
          break;

        default:
          break;
      }
    },
    [storyActions]
  );

  const storyMenu = useMemo(() => {
    return {
      handleMenuToggle: setContextMenuId,
      contextMenuId,
      handleMenuItemSelected,
    };
  }, [setContextMenuId, contextMenuId, handleMenuItemSelected]);

  const renameStory = useMemo(() => {
    return {
      id: titleRenameId,
      handleOnRenameStory,
      handleCancelRename: () => setTitleRenameId(-1),
    };
  }, [handleOnRenameStory, setTitleRenameId, titleRenameId]);

  const ActiveView =
    view.style === VIEW_STYLE.LIST ? (
      <StoryListView
        handleSortChange={sort.set}
        handleSortDirectionChange={sort.setDirection}
        renameStory={renameStory}
        sortDirection={sort.direction}
        stories={stories}
        storyMenu={storyMenu}
        storySort={sort.value}
        storyStatus={filterValue}
        users={users}
      />
    ) : (
      <StoryGridView
        bottomActionLabel={__('Open in editor', 'web-stories')}
        centerActionLabelByStatus={STORY_ITEM_CENTER_ACTION_LABELS}
        pageSize={view.pageSize}
        renameStory={renameStory}
        storyMenu={storyMenu}
        stories={stories}
        users={users}
      />
    );

  return (
    <>
      {ActiveView}
      {activeModal === 'DELETE_STORY' && (
        <Dialog
          isOpen={true}
          contentLabel={__('Modal to confirm deleting a story', 'web-stories')}
          title={__('Delete Story', 'web-stories')}
          onClose={() => setActiveModal('')}
          actions={
            <>
              <Button
                type={BUTTON_TYPES.DEFAULT}
                onClick={() => setActiveModal('')}
              >
                {__('Cancel', 'web-stories')}
              </Button>
              <Button
                type={BUTTON_TYPES.CTA}
                onClick={() => {
                  storyActions.trashStory(activeStory);
                  setActiveModal('');
                }}
              >
                {__('Delete', 'web-stories')}
              </Button>
            </>
          }
        >
          {sprintf(
            /* translators: %s: story title. */
            __('Are you sure you want to delete "%s"?', 'web-stories'),
            activeStory.title
          )}
        </Dialog>
      )}
    </>
  );
}

StoriesView.propTypes = {
  filterValue: PropTypes.string,
  sort: SortPropTypes,
  storyActions: StoryActionsPropType,
  stories: StoriesPropType,
  users: UsersPropType,
  view: ViewPropTypes,
};
export default StoriesView;
