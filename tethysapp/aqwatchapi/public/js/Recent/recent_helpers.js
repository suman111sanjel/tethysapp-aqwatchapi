var aoiInitilization = true
let initialLayerStartIntervalCAMPM25;



myApp.APICollection = {
    layerData: {
        Aeronet: '/apps/' + TethysAPIAppName + '/aeronetaodpm/',
        USEmbassyAOD: '/apps/' + TethysAPIAppName + '/usembassypm/',
        getGeoJSONofStations: '/apps/' + TethysAPIAppName + '/getGeoJSONofStations/',
        getGeoJsonForOneSatation: '/apps/' + TethysAPIAppName + '/getGeoJsonForOneSatation/',
        getAllStationsID: '/apps/' + TethysAPIAppName + '/getAllStationsID/',
    },
    api: {
        commonAPI: '/apps/' + TethysAPIAppName + '/getData/',
        RegionGeojson: '/apps/' + TethysAPIAppName + '/geojsonregion/',
        AOIPolygon: '/apps/' + TethysAPIAppName + '/aoipolygon/',
        GetMapImage: '/apps/' + TethysAPIAppName + '/getmapimage/',
        GetImage: '/apps/' + TethysAPIAppName + '/downloadImage/',
        SlicedFromCatalog: '/apps/' + TethysAPIAppName + '/slicedfromcatalog/'
    }
};


myApp.constants = {
    recent: {
        layerId: {
            TerraModisTrueColor: 'TerraModisTrueColor',
            PM_AeronetAOD: 'aeronet',
            PM_usembassy: 'usembassy',
            GEOS_PM2p5: 'GEOS_PM2p5',
            TerraModisAOD: 'TerraModisAOD',
            O3_GEOS: 'GEOS_O3',
            O3_usembassy: 'archive__usembassy_O3',
            SO2_GEOS: 'GEOS_SO2',
            NO2_GEOS: 'GEOS_NO2',
            CO_GEOS: 'GEOS_CO',
        }
    }
}


myApp.DEFAULTS = {
    pollutant: [{
        layerId: myApp.constants.recent.layerId.CO_GEOS,
        stationId: 1,
        index: 0
    }, {layerId: myApp.constants.recent.layerId.TerraModisAOD, index: 1},
        {
            layerId: myApp.constants.recent.layerId.NO2_GEOS,
            // stationId: 1,
            index: 2
        }, {
            layerId: myApp.constants.recent.layerId.GEOS_PM2p5, index: 3
        }]
};

myApp.TreeDataObject = [{
    title: 'PM',
    value: 1,
    child: [
        {
            title: 'Surface Observation-AOD (AERONET)',
            value: 11,
            layerId: myApp.constants.recent.layerId.PM_AeronetAOD,
            otherval: "test",
            child: [],
            stationData: true,
            styleFunction: myApp.AeronetAODStyleFun,
            NotificationWhenAdded: "Please Select AERONET AOD Station on map",
            ModelClass: 'AeronetAod',
            ModelClassDataList: 'AeronetDataList',
            typeName: 'aod',
            chart: {
                title: function (stationName, sd) {
                    return 'AERONET AOD at ' + stationName + ' (' + sd + ')';
                },
                subTitle: 'AERONET level 1.5 data measured at 500nm',
                SeriesName: 'SeriesName',
                YaxisLabel: 'AOD (500nm)',
                XaxisLabel: function () {
                    return 'Time (UTC)'
                },
                plotType:'point'
            }
        },
        {
            title: 'Ground Observation-PM2.5',
            layerId: myApp.constants.recent.layerId.PM_usembassy,
            value: 12,
            child: [],
            stationData: true,
            styleFunction: myApp.USEmbassyPM25StyleFun,
            NotificationWhenAdded: "Please Select US Embassy 2.5 Station on map",
            ModelClass: 'UsEmbassyPm',
            ModelClassDataList: 'UsEmbassyDataList',
            typeName: 'pm',
            chart: {
                title: function (stationName, sd) {
                    return stationName + ' (' + sd + ')'
                },
                subTitle: 'source: AirNow',
                SeriesName: 'PM2.5',
                YaxisLabel: 'PM<sub>2.5</sub>(μg/m<sup>3</sup>)',
                XaxisLabel: function () {
                    return 'Time (UTC)'
                }
            }
        },
        {
            title: 'Model-PM2.5 (GEOS)',
            layerId: myApp.constants.recent.layerId.GEOS_PM2p5,
            value: 13,
            child: []
        },
        {
            title: 'Satellite-AOD(Terra-MODIS)',
            layerId: myApp.constants.recent.layerId.TerraModisAOD,
            value: 14,
            child: []
        }
    ]
}, {
    title: 'O3',
    value: 2,
    child: [
        {
            title: 'Model-O3 (GEOS)',
            layerId: myApp.constants.recent.layerId.O3_GEOS,
            value: 22,
            child: []
        },
        {
            title: 'Surface Observation-O3',
            layerId: myApp.constants.recent.layerId.O3_usembassy,
            value: 23,
            child: [],
            stationData: true,
            styleFunction: myApp.USEmbassyO3StyleFun,
            NotificationWhenAdded: "Please Select US Embassy O3 Station on map",
            ModelClass: 'UsEmbassyPm',
            ModelClassDataList: 'UsEmbassyDataList',
            typeName: 'O3',
            chart: {
                title: function (stationName, sd) {
                    return stationName + ' (' + sd + ')'
                },
                subTitle: 'source: AirNow',
                SeriesName: 'O3',
                YaxisLabel: 'O<sub>3</sub>(ppb)',
                XaxisLabel: function () {
                    return 'Time (UTC)'
                }            }
        },
    ]
},
    {
        title: 'SO2',
        value: 3,
        child: [
            {
                title: 'Model-SO2 (GEOS)',
                layerId: myApp.constants.recent.layerId.SO2_GEOS,
                value: 32,
                child: []
            }
        ]
    },
    {
        title: 'NO2',
        value: 4,
        child: [
            {
                title: 'Model-NO2 (GEOS)',
                layerId: myApp.constants.recent.layerId.NO2_GEOS,
                value: 42,
                child: []
            }
        ]
    },
    {
        title: 'CO',
        value: 5,
        child: [
            {
                title: 'Model-CO (GEOS)',
                layerId: myApp.constants.recent.layerId.CO_GEOS,
                value: 52,
                child: []
            }
        ]
    }]

myApp.treeSelect = {
    mainTitle: 'Pollutants',
    datatree: myApp.TreeDataObject,
    onOpen: function () {
    },
    OnSelect: function (selected) {
        let data_period = $('#selectl1').val()
        let oldVal = this.CurrentValue;
        let newVal = selected;
        myApp.selectChangeOld(oldVal.value, this.CurrentIndex);
        let currentIndex = this.CurrentIndex;

        myApp.TreeDataObject.forEach(function (obj1) {
            obj1.child.forEach(function (obj2) {

                if (oldVal.value === obj2.value) {
                    myApp.selectChangeOld(oldVal.value, currentIndex);
                }
                if (obj2.hasOwnProperty("stationData")) {

                    if (newVal.value === obj2.value) {
                        myApp.selectChangeNewValueCompute(obj2.layerId, obj2.styleFunction, obj2.value.toString(), obj2.NotificationWhenAdded, obj1.value, obj2);
                    }

                } else {
                    if (newVal.value == obj2.value) {
                        myApp.selectChangeNewValueComputeTimeSeries2D(obj2.layerId, obj2.value, currentIndex);
                    }
                }
            })
        });
        this.CurrentValue = selected;
    },
    OnChange: function (oldVal, newVal) {

    },
    onClose: function () {
    },

};



// myApp.IndexColors = ['#53A9EB', '#F5D657', '#F06368', '#52AE9A'];
myApp.IndexColors = ['#0C6CE9', '#962422', '#1D5430', '#F76743'];
myApp.OnlyOnce = true;

myApp.layerswitcher = function () {
    myApp.LayerSwitcherButton = myApp.createDiv('ol-unselectable ol-control');
    myApp.LayerSwitcherButton.setAttribute("id", "layer-switcher");
    let button = myApp.createButton();
    button.setAttribute("type", "button");
    button.setAttribute("title", "Layers");
    let img = myApp.createImg();
    img.setAttribute("src", "/static/" + TethysAPIAppName + "/images/layers.svg");
    img.setAttribute("style", "height: 20px; width: 20px;");

    button.append(img);
    myApp.LayerSwitcherButton.append(button);

    let olOverlaycontainer = document.querySelector('div.ol-overlaycontainer-stopevent');
    olOverlaycontainer.append(myApp.LayerSwitcherButton);

    myApp.layerSwitcherDiv = myApp.createDiv()
    myApp.layerSwitcherDiv.setAttribute('id', 'layer');

    //base map start
    // let upperDiv = myApp.createDiv();
    // let headingBaseMap = myApp.createH('6', 'centering font-weight-bold');
    // headingBaseMap.innerText = 'Base Maps';
    //
    // let RadioDiv1 = myApp.InlineRadio("inlineRadio1", "inLineRadioBaseMap", "None", false, "none");
    // let RadioDiv2 = myApp.InlineRadio("inlineRadio2", "inLineRadioBaseMap", "OSM", true, 'osm');
    //
    // upperDiv.append(headingBaseMap);
    // upperDiv.append(RadioDiv1);
    // upperDiv.append(RadioDiv2);

    //base map end

    let lowerDiv = myApp.createDiv("layerSwitcherLowerdiv");

    let OtherLayersH4 = myApp.createH(6, 'centering font-weight-bold');
    OtherLayersH4.innerText = 'Layers';
    let layerCollectionDiv = myApp.createDiv("layerCollection");


    lowerDiv.append(OtherLayersH4);
    lowerDiv.append(layerCollectionDiv);
    // myApp.layerSwitcherDiv.append(upperDiv);
    myApp.layerSwitcherDiv.append(lowerDiv);

    olOverlaycontainer.append(myApp.layerSwitcherDiv);


    $('#satellite-Slider').slider({
        tooltip: 'always', step: 1, min: 0, max: 100,
        formatter: function (value) {
            return value + " %";
        }
    });
};

myApp.DrawUI = function () {
    let DrawSection = myApp.createDiv('draw-section');
    DrawSection.setAttribute("id", "draw-section");
    let DrawPannel = myApp.createDiv('draw-pannel');
    let polygonAnchor = myApp.createA('ol-draw-polygon');
    polygonAnchor.setAttribute("title", "Draw a polygon");
    let pointAnchor = myApp.createA('ol-draw-point');
    pointAnchor.setAttribute("title", "Draw a point");

    DrawPannel.append(polygonAnchor);
    DrawPannel.append(pointAnchor);

    DrawSection.append(DrawPannel)

    let olOverlaycontainer = document.querySelector('div.ol-overlaycontainer-stopevent');
    olOverlaycontainer.append(DrawSection);

    let deleteFeature = myApp.createDiv('clear-features');
    let deleteFeaturePannel = myApp.createDiv('clear-feature');
    let clearFeatureAnchor = myApp.createA('clear-layer');
    clearFeatureAnchor.setAttribute("title", "Clear AOI");
    deleteFeaturePannel.append(clearFeatureAnchor);
    deleteFeature.append(deleteFeaturePannel);
    olOverlaycontainer.append(deleteFeature);

    polygonAnchor.addEventListener("click", () => {
        console.log("polygon");
        myApp.map.removeInteraction(myApp.drawPoint);
        myApp.map.addInteraction(myApp.drawPolygon);
    }, true);

    pointAnchor.addEventListener("click", () => {
        myApp.map.removeInteraction(myApp.drawPolygon);
        myApp.map.addInteraction(myApp.drawPoint);
    }, true);

    clearFeatureAnchor.addEventListener("click", () => {
        // myApp.map.removeInteraction(myApp.drawPolygon);
        // myApp.map.addInteraction(myApp.drawPoint);
        myApp.map.removeInteraction(myApp.drawPolygon);
        myApp.map.removeInteraction(myApp.drawPoint);
        myApp.Drawsource.clear();
        myApp.locationOverlay.setPosition(undefined);

        console.log("point");
        myApp.revertAbout();
    }, true);
}
myApp.UIInit = function () {
    let chartValues = [0, 1, 2, 3];
    myApp.treeSelectAllObject = []
    chartValues.forEach(function (currentValue) {
        let newObject = Object.create(myApp.treeSelect);
        newObject.CurrentIndex = currentValue;
        newObject.CurrentValue = '';
        myApp.treeSelectAllObject.push(newObject);
        // Add UI after layer availiabilty checking
        // $("#test" + currentValue.toString()).treeSelect(newObject);
        $("#chart" + currentValue.toString()).html('<div class="full-height full-width"> <p class="center-content">Please Select Pollutant From Dropdown menu</p> </div>');
    });
};

myApp.BindControls = function () {


    myApp.LayerSwitcherButton.addEventListener("click", () => {
        if (getComputedStyle(myApp.layerSwitcherDiv)["display"] === "block") {
            myApp.layerSwitcherDiv.style.animation = 'MoveLeft 0.4s';
            setTimeout(function () {
                myApp.layerSwitcherDiv.style.display = 'none';
            }, 300)
        } else {
            myApp.layerSwitcherDiv.style.display = 'block';
            myApp.layerSwitcherDiv.style.animation = 'MoveRight 0.4s';
        }
    }, true);

    $("input[type='radio'][name='inLineRadioBaseMap']").change(function () {
        var value = $(this).attr('LayerId');
        myApp.BaseLayerList.forEach(function (item) {
            let lyId = item.getProperties()['id'];
            if (lyId === value) {
                item.setVisible(true);
            } else {
                item.setVisible(false);
            }
        })
    });

    $("#test1").on('change', function (e) {
        console.log("");
    });

    myApp.map.on('click', function (evt) {
        var feature = myApp.map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
                return feature;
            });
        var coordinate = evt.coordinate;
        if (feature) {
            var layer = feature.getLayer(myApp.map);
            if (layer) {
                var layer_id = layer.getProperties()['id'];

                myApp.TreeDataObject.forEach(function (obj1) {
                    obj1.child.forEach(function (obj2, ind) {
                        if (obj2.hasOwnProperty("stationData")) {
                            if (layer_id === obj2.layerId) {
                                myApp.pointClickEventMap(feature, layer, obj2.styleFunction, obj2.value.toString(), obj1.value);
                            }
                        }
                    })
                });
            }
        }
    });
    myApp.computeClicked = async function (e) {
        let SelectedCount = 0
        $('.sel-pol-div').each(function (index, item) {
            if (parseInt($(this).val())) {
                console.log("check");
                SelectedCount += 1;
            }
        });
        if (SelectedCount === 4) {
            $('.sel-pol-div').each(function (index, item) {
                myApp.computeIndicesClickFun($(this).val(), index);
            });

        } else {
            myApp.notify('Please Select all indices');
        }
    };
    myApp.resetAll = function (e) {
        console.log('clear All');
        let chartValues = [0, 1, 2, 3];
        chartValues.forEach(function (currentValue) {
            if ($("#chart" + currentValue.toString()).highcharts()) {
                $("#chart" + currentValue.toString()).highcharts().destroy();
            } else {
                $("#chart" + currentValue.toString()).text('')
            }
            // let aa=
            let aa = $('#test' + currentValue.toString()).val();
            console.log(aa);
            $("#test" + currentValue.toString()).val('')
            if (aa) {
                myApp.selectChangeOld(parseInt(aa), currentValue);
            }
            // $('#test' + currentValue.toString()).parent().empty();
            let inputParentDiv = document.querySelector("#selpol" + currentValue.toString());
            inputParentDiv.innerHTML = '';

            let html = myApp.createInput('sel-pol-div');
            html.setAttribute('type', 'text');
            html.setAttribute('id', 'test' + currentValue.toString());
            html.setAttribute('placeholder', 'Select Pollutant');

            inputParentDiv.append(html);
            let newObject = Object.create(myApp.treeSelect);
            newObject.CurrentIndex = currentValue;
            newObject.CurrentValue = '';
            myApp.treeSelectAllObject[currentValue] = newObject;
            $("#test" + currentValue.toString()).treeSelect(newObject);
            $("#chart" + currentValue.toString()).html('<div class="full-height full-width"> <p class="center-content">Please Select Pollutant From Dropdown menu</p> </div>');

        });

        myApp.locationOverlay.setPosition(undefined);
        myApp.Drawsource.clear();
        myApp.revertAbout();
    };
    myApp.AdjustLayerCollectionHeight();
    $(window).on('resize', function () {
        myApp.AdjustLayerCollectionHeight();
    });
};

myApp.getLayer = function (id) {
    // console.log(id)
    var layer;
    for (i = 0; i < myApp.AllBindedLayersList.length; i++) {
        // console.log(myApp.AllBindedLayersList[i].getProperties().id);
        if (id == myApp.AllBindedLayersList[i].getProperties().id) { ///popDensityLayer.getProperties().id
            layer = myApp.AllBindedLayersList[i].getLayer();

            break;
        }
    }
    return layer;
};

myApp.getBindedLayer = function (id) {
    var layer;
    for (i = 0; i < myApp.AllBindedLayersList.length; i++) {
        if (id == myApp.AllBindedLayersList[i].getProperties().id) { ///popDensityLayer.getProperties().id
            layer = myApp.AllBindedLayersList[i];
            break;
        }
    }
    return layer;
};
myApp.makeRequest = function (method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
};
myApp.makeRequestWithCookieCSRFToken = function (method, url, data) {
    return new Promise(function (resolve, reject) {
        let csrftokenCookie = myApp.getCookie('csrftoken');
        let csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        let dataStr = ''
        for (var key in data) {
            dataStr += key.toString() + '=' + JSON.stringify(data[key]).toString() + '&'
        }
        dataStr += 'csrfmiddlewaretoken' + '=' + csrftoken.toString()
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.setRequestHeader('X-CSRFToken', csrftokenCookie);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(dataStr);
    });
};
myApp.getUpperLayer = function () {
    let selectedLayer = null;
    myApp.AllBindedLayersList.forEach(function (Layer) {
        let Properties = Layer.getProperties();
        console.log("----")
        console.log(Properties)
        console.log(Properties.hasOwnProperty('aoi'))
        console.log(Properties.visible === true)
        console.log("----")

        if (Properties.hasOwnProperty('aoi') && Properties.visible === true) {
            if (selectedLayer === null) {
                selectedLayer = Layer
            } else {
                if (selectedLayer.getProperties().zIndex < Properties.zIndex) {
                    selectedLayer = Layer
                }
            }
        }
    });
    return selectedLayer;
};
myApp.revertAbout = function () {
    $("#about-aoi").html("About");
    $("#about-aoi-body").html(' <p style="text-align:justify;font-size:12px;">' +
        'ICIMOD is developing an integrated information platform linking weather and climate data' +
        'with agriculture practices in the region. The platform provides data analysis support to' +
        'professionals responsible for developing agro-met advisories for government agencies and ...' +
        '</p><a data-toggle="modal" href="#aboutModal"><b>View More ...</b></a>');
};
myApp.getCookie = function (name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
myApp.formatDate = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

