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
 * External dependencies
 */
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import LayerStyle from '../layerStyle';
import { renderPanel } from './_utils';

describe('Panels/LayerStyle', () => {
  function renderLayerStyle(...args) {
    return renderPanel(LayerStyle, ...args);
  }

  it('should render <LayerStyle /> panel', () => {
    const { getByRole } = renderLayerStyle([{ opacity: 100 }]);
    const element = getByRole('button', { name: 'Layer' });
    expect(element).toBeDefined();
  });

  it('should set opacity to 100 if not set', () => {
    const { getByRole } = renderLayerStyle([{}]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input.value).toStrictEqual('100%');
  });

  it('should set opacity to 100 if set to 0', () => {
    const { getByRole } = renderLayerStyle([{ opacity: 0 }]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input.value).toStrictEqual('100%');
  });

  it('should set opacity to 49 if set to 49', () => {
    const { getByRole } = renderLayerStyle([{ opacity: 49 }]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input.value).toStrictEqual('49%');
  });

  it('should update opacity value on change', () => {
    const { getByRole, pushUpdate } = renderLayerStyle([{ opacity: 49 }]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    fireEvent.change(input, { target: { value: '23' } });
    expect(pushUpdate).toHaveBeenCalledWith({ opacity: 23 });
  });
});
