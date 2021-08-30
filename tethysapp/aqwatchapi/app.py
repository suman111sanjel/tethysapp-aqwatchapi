from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.app_settings import PersistentStoreDatabaseSetting, PersistentStoreConnectionSetting


class Aqwatchapi(TethysAppBase):
    """
    Tethys app class for Aqwatchapi.
    """

    name = 'Aqwatchapi'
    index = 'aqwatchapi:home'
    icon = 'aqwatchapi/images/icon.gif'
    package = 'aqwatchapi'
    root_url = 'aqwatchapi'
    color = '#c0392b'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='aqwatchapi',
                controller='aqwatchapi.controllers.home.home'
            ),
            UrlMap(
                name='aeronetData',
                url='aqwatchapi/getGeoJSONofStations',
                controller='aqwatchapi.controllers.viewer.getGeoJSONofStations',
            ),
            UrlMap(
                name='getGeoJsonForOneSatation',
                url='aqwatchapi/getGeoJsonForOneSatation',
                controller='aqwatchapi.controllers.viewer.getGeoJsonForOneSatation',
            ),
            UrlMap(
                name='getData',
                url='aqwatchapi/getData',
                controller='aqwatchapi.controllers.viewer.GetData',
            ),
            UrlMap(
                name='GeojsonRegion',
                url='aqwatchapi/geojsonregion',
                controller='aqwatchapi.controllers.viewer.GeojsonRegion',
            ),
            UrlMap(
                name='AOIPolygon',
                url='aqwatchapi/aoipolygon',
                controller='aqwatchapi.controllers.viewer.AOIPolygon',
            ),
            UrlMap(
                name='GetMapPNG',
                url='aqwatchapi/getmapimage',
                controller='aqwatchapi.controllers.viewer.GetMapIMAGE',
            ),  UrlMap(
                name='create_GIF_Map_IMAGE',
                url='aqwatchapi/creategifmapimage',
                controller='aqwatchapi.controllers.viewer.Create_GIF_Map_IMAGE',
            ), UrlMap(
                name='timeseriesmodeldata',
                url='aqwatchapi/timeseriesmodeldata',
                controller='aqwatchapi.controllers.viewer.TimeSeriesModelSata',
            ), UrlMap(
                name='downloadImage',
                url='aqwatchapi/downloadImage',
                controller='aqwatchapi.controllers.viewer.downloadImage',
            ), UrlMap(
                name='slicedfromcatalog',
                url='aqwatchapi/slicedfromcatalog',
                controller='aqwatchapi.controllers.viewer.SlicedFromCatalog',
            ),
        )

        return url_maps
