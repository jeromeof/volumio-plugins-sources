"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = require("../types/Endpoint");
const EXCLUDE_ENDPOINT_BROWSE_IDS = [
    'SPreport_history',
    'SPaccount_overview',
    'SPunlimited'
];
class EndpointHelper {
    static validate(endpoint) {
        if (!endpoint?.type) {
            return false;
        }
        switch (endpoint.type) {
            case Endpoint_1.EndpointType.Browse:
                return !!endpoint.payload?.browseId && !EXCLUDE_ENDPOINT_BROWSE_IDS.includes(endpoint.payload.browseId);
            case Endpoint_1.EndpointType.Watch:
                return !!endpoint.payload?.videoId || !!endpoint.payload?.playlistId;
            case Endpoint_1.EndpointType.Search:
                return !!endpoint.payload?.query;
            case Endpoint_1.EndpointType.BrowseContinuation:
            case Endpoint_1.EndpointType.SearchContinuation:
                return !!endpoint.payload?.token;
            default:
                return false;
        }
    }
}
exports.default = EndpointHelper;
//# sourceMappingURL=EndpointHelper.js.map