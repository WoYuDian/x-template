import React from 'react';
import { render } from '@demon673/react-panorama';
import {UIBody} from './ui'

GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false)

render(<UIBody/>, $.GetContextPanel());