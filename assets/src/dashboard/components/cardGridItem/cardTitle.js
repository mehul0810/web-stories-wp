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
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { STORY_STATUS } from '../../constants';
import { getFormattedDisplayDate, useFocusOut } from '../../utils/';
import { TextInput } from '../input';
import { DashboardStatusesPropType } from '../../types';
import { Paragraph2 } from '../typography';
import { Link } from '../link';

const StyledCardTitle = styled.div`
  padding-top: 12px;
  display: inline-block;
  overflow: hidden;
`;

const TitleStoryLink = styled(Link)`
  display: inline-block;
  max-width: 100%;
  margin-bottom: 2px;
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleBodyText = styled(Paragraph2)`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: ${({ theme }) => theme.typography.weight.light};
`;

const DateHelperText = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray900};
  &:after {
    content: '-';
    color: ${({ theme }) => theme.colors.gray500};
    font-weight: 400;
    padding: 0 0.25em;
  }
`;

const CardTitle = ({
  secondaryTitle,
  title,
  titleLink,
  status,
  displayDate,
  editMode,
  onEditComplete,
  onEditCancel,
}) => {
  const inputContainerRef = useRef(null);
  const [newTitle, setNewTitle] = useState(title);

  useFocusOut(
    inputContainerRef,
    () => {
      if (editMode) {
        onEditCancel();
      }
    },
    [editMode]
  );

  useEffect(() => {
    if (inputContainerRef.current && editMode) {
      inputContainerRef.current.firstChild?.focus();
    }
  }, [editMode]);

  const handleChange = useCallback(({ target }) => {
    setNewTitle(target.value);
  }, []);

  const handleKeyPress = useCallback(
    ({ nativeEvent }) => {
      if (nativeEvent.keyCode === 13) {
        onEditComplete(newTitle);
      } else if (nativeEvent.keyCode === 27) {
        onEditCancel();
      }
    },
    [newTitle, onEditComplete, onEditCancel]
  );

  const displayDateText = useMemo(() => {
    if (!displayDate) {
      return null;
    }
    return status === STORY_STATUS.PUBLISHED
      ? sprintf(
          /* translators: %s: last modified date */
          __('Published %s', 'web-stories'),
          getFormattedDisplayDate(displayDate)
        )
      : sprintf(
          /* translators: %s: last modified date */
          __('Modified %s', 'web-stories'),
          getFormattedDisplayDate(displayDate)
        );
  }, [status, displayDate]);

  return (
    <StyledCardTitle>
      {editMode ? (
        <div ref={inputContainerRef}>
          <TextInput
            data-testid={'title-rename-input'}
            value={newTitle}
            onKeyDown={handleKeyPress}
            onChange={handleChange}
          />
        </div>
      ) : (
        <TitleStoryLink href={titleLink}>{title}</TitleStoryLink>
      )}
      <TitleBodyText>
        {status === STORY_STATUS.DRAFT && (
          <DateHelperText>{__('draft', 'web-stories')}</DateHelperText>
        )}
        {displayDateText}
      </TitleBodyText>
      {secondaryTitle && <TitleBodyText>{secondaryTitle}</TitleBodyText>}
    </StyledCardTitle>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  titleLink: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  status: DashboardStatusesPropType,
  editMode: PropTypes.bool,
  displayDate: PropTypes.object,
  onEditComplete: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
};

export default CardTitle;
