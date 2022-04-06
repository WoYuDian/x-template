import React from 'react';
import { render } from '@demon673/react-panorama';

render(	<Panel className="AddonLoadingRoot">
            <Panel id="TitlePanel"> 
                <Label id="AddonTitle" localizedText={'#addon_game_name'} />
            </Panel>
        </Panel>, 
    $.GetContextPanel());