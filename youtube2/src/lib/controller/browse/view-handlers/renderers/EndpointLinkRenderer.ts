import { ContentItem } from '../../../../types';
import { EndpointType } from '../../../../types/Endpoint';
import EndpointHelper from '../../../../util/EndpointHelper';
import ViewHelper from '../ViewHelper';
import BaseRenderer, { RenderedListItem } from './BaseRenderer';

const ICON_BY_BROWSE_ID: Record<string, string> = {
  // Keep this in case we need it in the future
};

const ICON_BY_NAME: Record<string, string> = {
  'WHAT_TO_WATCH': 'fa fa-home',
  'SUBSCRIPTIONS': 'fa fa-th-large',
  'UNLIMITED': 'fa fa-film',
  'VIDEO_LIBRARY_WHITE': 'fa fa-youtube-play',
  'WATCH_HISTORY': 'fa fa-history',
  'WATCH_LATER': 'fa fa-clock-o',
  'LIKES_PLAYLIST': 'fa fa-heart',
  'PLAYLISTS': 'fa fa-list',
  'MIX': 'fa fa-random',
  'YT2_SHOWING_RESULTS_FOR': 'fa fa-info-circle' // Our own icon type
};

const VIEW_NAME_BY_BROWSE_ID: Record<string, string> = {
  'FEsubscriptions': 'subscriptions'
};

export default class EndpointLinkRenderer extends BaseRenderer<ContentItem.EndpointLink | ContentItem.GuideEntry> {

  renderToListItem(data: ContentItem.EndpointLink | ContentItem.GuideEntry): RenderedListItem | null {
    if (!EndpointHelper.validate(data.endpoint)) {
      return null;
    }

    const targetViewName = data.endpoint.type === EndpointType.Search ? 'search' : (VIEW_NAME_BY_BROWSE_ID[data.endpoint.payload.browseId] || 'generic');
    const targetView = {
      name: targetViewName,
      endpoint: data.endpoint
    };
    const uri = `${this.uri}/${ViewHelper.constructUriSegmentFromView(targetView)}`;

    const result: RenderedListItem = {
      service: 'youtube2',
      // Setting type to 'album' is important for 'watch' endpoint items, as we
      // Only want this item to be exploded and not others in the same list when
      // It is clicked.
      type: data.endpoint.type === EndpointType.Watch ? 'album' : 'item-no-menu',
      title: data.title,
      uri
    };

    if (data.thumbnail) {
      result.albumart = data.thumbnail;
    }
    else {
      result.icon = this.#getIcon(data) || undefined;
    }

    return result;
  }

  #getIcon(data: ContentItem.EndpointLink | ContentItem.GuideEntry) {
    const iconByName = data.icon ? ICON_BY_NAME[data.icon] : null;
    if (iconByName) {
      return iconByName;
    }

    const endpoint = data.endpoint;
    if (endpoint.type === EndpointType.Browse) {
      return ICON_BY_BROWSE_ID[endpoint.payload.browseId] || 'fa fa-arrow-circle-right';
    }
    else if (endpoint.type === EndpointType.Watch) {
      return 'fa fa-play-circle';
    }

    return null;
  }
}
