//this is only for production
var myApp = {};

let initialZindex = 50;

myApp.selectChangeOldValueCompute = function (layerID, layerStyle, Workingvalue, CurrentIndex, GroupValue) {
    let layer = myApp.getBindedLayer(layerID);
    let CurrentValue = 0;
    // let chartIndex = '';
    $('.sel-pol-div').each(function (index, item) {
        if ($(this).val() === Workingvalue) {
            CurrentValue += 1;
        }
    });
    if ($('.sel-pol-div').eq(CurrentIndex).parent().children().eq(1).attr("st-id")) {
        let deletingId = myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + CurrentIndex.toString()]
        let selIdlist = layer.getLayer().get('selId');
        let selObject = selIdlist.filter(function (x) {
            let tf = false;
            if (x) {
                if (x.featureId === deletingId) {
                    tf = true;
                }
            }
            return tf
        })[0]
        selIdlist.splice(selIdlist.indexOf(selObject), 1);
        delete myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + CurrentIndex.toString()];
        $('.sel-pol-div').eq(CurrentIndex).parent().children().eq(1).attr("st-id", "");

    }
    if ($("#chart" + CurrentIndex.toString()).highcharts()) {
        $("#chart" + CurrentIndex.toString()).highcharts().destroy();
    }
    if (CurrentValue === 0) {
        layer.setVisibleDivBind(false);
    }
    layer.getLayer().setStyle(layerStyle);
}

myApp.selectChangeOld = function (oldVal, CurrentIndex) {
    myApp.TreeDataObject.forEach(function (obj1) {
        obj1.child.forEach(function (obj2) {
            if (obj2.hasOwnProperty("stationData")) {
                if (oldVal == obj2.value) {
                    myApp.selectChangeOldValueCompute(obj2.layerId, obj2.styleFunction, obj2.value.toString(), CurrentIndex, obj1.value)
                }
            } else {
                if (oldVal == obj2.value) {
                    let layer = myApp.getBindedLayer(obj2.layerId);
                    let CurrentValue = 0;
                    // let chartIndex = '';
                    $('.sel-pol-div').each(function (index, item) {
                        if ($(this).val() == obj2.value.toString()) {
                            CurrentValue += 1;
                        }
                    });
                    if ($("#chart" + CurrentIndex.toString()).highcharts()) {
                        $("#chart" + CurrentIndex.toString()).highcharts().destroy();
                    } else {
                        $("#chart" + CurrentIndex.toString()).html('')
                    }
                    if (CurrentValue === 0) {
                        layer.setVisibleDivBind(false);
                    }
                }
            }
        })
    });
};

myApp.selectChangeNewValueCompute = async function (layerID, layerStyle, Workingvalue, notificationMessage, GroupValue, obj) {
    let layer = myApp.getBindedLayer(layerID);
    layer.setVisible(true);
    let CurrentValue = 0;
    let chartIndex = '';
    $('.sel-pol-div').each(function (index, item) {
        if ($(this).val() === Workingvalue) {
            CurrentValue += 1
            chartIndex = index
        }
    });
    if (CurrentValue > 1) {
    } else {
        let ll = myApp.getLayer(layerID);
        ll.set('selId', []);
        ll.setStyle(layerStyle);
        delete myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + chartIndex.toString()];
    }
    // myApp.notify(notificationMessage);
    // if (layer.getLayer().getProperties().loadGeoJSON) {
    //     let sd = myApp.formatDate(myApp.nowRecent);
    //     let ed = myApp.formatDate(myApp.endDate);
    //     let regionOrCountry = $('#selectl0').val();
    //     let Param = '?ModelClass=' + obj.ModelClass + "&ModelClassDataList=" + obj.ModelClassDataList + '&typeName=' + obj.typeName + '&StartDate=' + sd + '&EndDate=' + ed+'&rid='+regionOrCountry
    //     let GeoJSON = await myApp.makeRequest('GET', myApp.APICollection.layerData.getGeoJsonForOneSatation + Param);
    //     let GeoJSONParse = JSON.parse(GeoJSON);
    //     let Features = (new ol.format.GeoJSON()).readFeatures(GeoJSONParse);
    //     layer.getLayer().getSource().addFeatures(Features);
    //     layer.getLayer().set("loadGeoJSON", false);
    // }
};

myApp.selectChangeNewValueComputeTimeSeries2D = async function (layerId, Workingvalue, WorkingIndex) {
    let layer = myApp.getBindedLayer(layerId);
    layer.setVisibleDivBind(true);
    // let NewMapObj = myApp.CreateMapObject(WorkingIndex);
    let layerPropertiesObject = myApp.getLayer(layerId).getCurrentLayer().getProperties();
    let layerSourceParam = layerPropertiesObject.source.getParams();
    let layerUrl = layerPropertiesObject.source.getUrls()[0].split('wms')[1];
    let plotProp = layerPropertiesObject.plotInfo();
    plotProp.wmsList = layerPropertiesObject.wmsList
    plotProp.LAYER = layerSourceParam.LAYERS
    plotProp.TIME = layerSourceParam.TIME
    plotProp.COLORSCALERANGE = layerSourceParam.COLORSCALERANGE
    let date = new Date(layerSourceParam.TIME)
    let dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: '2-digit'})
    let [{value: month}, , {value: day}, , {value: year}] = dateTimeFormat.formatToParts(date)
    let completeDateLabel = `${day} ${month} ${year}`;
    plotProp.labelName = completeDateLabel + layerPropertiesObject.plotInfo().LabelTitleTime;
    let w = $('#chart' + WorkingIndex.toString()).width()
    let h = $('#chart' + WorkingIndex.toString()).height()
    let width = w / 96;
    let height = h / 96;
    plotProp.width = width.toFixed(3);
    plotProp.height = height.toFixed(3);
    plotProp.rid = parseInt($('#selectl0').val());
    $('#chart' + WorkingIndex.toString()).html('<div class="vertically-center" ><div  class="spinner-border text-primary" role="status">\n' +
        '  <span class="sr-only">Loading...</span>\n' +
        '</div></div></div>');
    let responseData = await myApp.makeRequestWithCookieCSRFToken('POST', myApp.APICollection.api.GetMapImage, plotProp);
    let ParseJson = JSON.parse(responseData);
    let imageURL = myApp.APICollection.api.GetImage + "?ImageName=" + ParseJson.image
    $('#chart' + WorkingIndex.toString()).html(`
<div  class="position-relative  full-width full-height" ><a download="${plotProp.title}.png" href="${imageURL}" class="download-map-Image"><i class="glyphicon glyphicon-download-alt"></i></a><div  class="vertically-center" ><img class="generated-image" width="${w.toString()}" src="${imageURL}"></div>
`)

};

myApp.pointClickEventMap = async function (feature, layer, layerStyle, Workingvalue, GroupValue) {
    let SelIdList = layer.get('selId');
    let id = feature.get('id').toString();
    let CurrentValue = 0;
    let chartIndex = '';
    $('.sel-pol-div').each(function (index, item) {
        if ($(this).val() === Workingvalue) {
            CurrentValue += 1
            chartIndex = index
        }
    });
    myApp.OnlyOnce = true;
    if (CurrentValue > 1) {
        await $('.sel-pol-div').each(function (index, item) {
            if ($(this).val() === Workingvalue) {
                if (myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + index.toString()] === id) {
                    myApp.notify('Warning Please select Other Station');
                } else if (myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + index.toString()] === undefined) {
                    if (myApp.OnlyOnce === true) {
                        myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + index.toString()] = id;
                        let Text = myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0].title + " (" + feature.get('name').toString() + ")";
                        $(this).parent().children().eq(1).attr("st-id", id);
                        $(this).parent().children().eq(1).text(Text);
                        let selectedIdlist = layer.get('selId');
                        let SelectedObject = {
                            featureId: id,
                            index: index
                        }
                        selectedIdlist.push(SelectedObject);
                        layer.set('selId', selectedIdlist);
                        myApp.computeIndicesClickFun(Workingvalue, index, GroupValue, feature);
                        myApp.OnlyOnce = false;
                    }
                }
            }
        });
        layer.setStyle(layerStyle);
    } else {
        if (!SelIdList.includes(id)) {
            $('.sel-pol-div').each(function (index, item) {
                if ($(this).val() === Workingvalue) {
                    let Text = myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0].title + " (" + feature.get('name').toString() + ")";
                    $(this).parent().children().eq(1).text(Text);
                    $(this).parent().children().eq(1).attr("st-id", id);
                }
            });
            let SelectedObject = {
                featureId: id,
                index: chartIndex
            }
            layer.set('selId', [SelectedObject]);
            layer.setStyle(layerStyle);
            myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + chartIndex.toString()] = id;
            await myApp.computeIndicesClickFun(Workingvalue, chartIndex.toString(), GroupValue, feature)
        }
    }
};

myApp.computeIndicesClickFun = async function (Workingvalue, index, GroupValue, feature) {
    await myApp.TreeDataObject.forEach(async function (obj1) {
        obj1.child.forEach(async function (obj2, ind) {
            if (obj2.hasOwnProperty("stationData")) {
                if (Workingvalue === obj2.value.toString()) {
                    let st_id = parseInt(myApp.treeSelect.datatree.filter(x => x.value === GroupValue)[0].child.filter(y => y.value === parseInt(Workingvalue))[0]['sel_st_id' + '-' + index.toString()]);
                    if (!isNaN(st_id)) {
                        let sd = myApp.formatDate(myApp.nowRecent);
                        let ed = myApp.formatDate(myApp.endDate);
                        let param = {
                            stId: st_id,
                            ModelClass: obj2.ModelClass,
                            ModelClassDataList: obj2.ModelClassDataList,
                            typeName: obj2.typeName,
                            StartDate: sd,
                            EndDate: ed
                        }
                        let dataRecived = await myApp.makeRequest('GET', myApp.APICollection.api.commonAPI + '?param=' + JSON.stringify(param).toString())
                        let parsedData = JSON.parse(dataRecived);
                        let stationName = feature.getProperties().folder_name;
                        let title = obj2.chart.title(stationName, sd);
                        // debugger;
                        let XaxisLabel = obj2.chart.XaxisLabel();
                        let plotType = obj2.chart.plotType;
                        let highchartsObj = null;
                        console.log(plotType);
                        if (plotType === 'point') {
                            highchartsObj = myApp.datetimePointChartObj(title, obj2.chart.subTitle, parsedData.SeriesData, obj2.chart.SeriesName, obj2.chart.YaxisLabel, XaxisLabel, myApp.IndexColors[index])
                        } else {
                            highchartsObj = myApp.datetimeChartObj(title, obj2.chart.subTitle, parsedData.SeriesData, obj2.chart.SeriesName, obj2.chart.YaxisLabel, XaxisLabel, myApp.IndexColors[index])
                        }
                        if ($("#chart" + index.toString()).highcharts()) {
                            $("#chart" + index.toString()).highcharts().destroy();
                        }
                        $("#chart" + index.toString()).highcharts(highchartsObj);
                    } else {
                        myApp.notify("Please select staion for US Embassy PM before compute");
                    }
                }
            }
        })
    });
};

myApp.datetimeChartObj = function (title, subTitle, SeriesData, SeriesName, YaxisLabel, XaxisLabel, plotColor) {
    let data = {
        chart: {
            marginLeft: 65,
            /* marginRight: 0, */
            /* spacingLeft: 0, */
            /* spacingRight: 0 */
            backgroundColor: 'transparent',
            plotBorderColor: '#afafaf',
            plotBorderWidth: 1,
        },
        title: {
            text: title,
            fontSize: '10px',
            useHTML: true
        },
        subtitle: {
            text: subTitle,
            fontSize: '8px'
        },
        series: [{
            name: SeriesName,
            data: SeriesData,
            // marker: {
            //     enabled: true,
            //     symbol: 'diamond',
            //     radius: 3
            // },
        }],
        xAxis: {
            type: 'datetime',
            title: {
                text: XaxisLabel,
                align: 'high',
            },
            tickLength: 0,
            lineColor: 0,
            lineWidth: 0
        },
        yAxis: {
            title: {
                text: `<span style="display:inline-block; -webkit-transform: rotate(270deg); -moz-transform: rotate(270deg); -ms-transform: rotate(270deg); -o-transform: rotate(270deg); filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);">${YaxisLabel}</span>`,
                useHTML: true,
                rotation: 0,
                // align: 'high',
                offset: 0,
                x: -50
            },
            tickLength: 0,
            lineColor: 0,
            lineWidth: 0,
            gridLineWidth: 0
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                color: plotColor
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["printChart",
                        "separator",
                        "downloadPNG",
                        "downloadJPEG",
                        "downloadPDF",
                        "downloadSVG",
                        "separator",
                        "downloadCSV",
                        "downloadXLS",
                        //"viewData",
                        "openInCloud"]
                }
            },
            // chartOptions: {
            //     title: {
            //         text: title,
            //         fontSize: '10px',
            //         useHTML: true
            //     }, yAxis: {
            //         title: {
            //             text: `<span style="display:inline-block; -webkit-transform: rotate(90deg); -moz-transform: rotate(90deg); -ms-transform: rotate(90deg); -o-transform: rotate(90deg); filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);">${YaxisLabel}</span>`,
            //             useHTML: true,
            //             rotation: 250
            //         }
            //     },
            // },
            allowHTML: true,
            // fallbackToExportServer: false,
            // libURL: 'http://localhost:8000/static/airqualitywatch/js/Highcharts/lib/'
        }
    };
    return data
};

myApp.datetimePointChartObj = function (title, subTitle, SeriesData, SeriesName, YaxisLabel, XaxisLabel, plotColor) {
    let data = {
            chart: {
                marginLeft: 65,
                /* marginRight: 0, */
                /* spacingLeft: 0, */
                /* spacingRight: 0 */
                backgroundColor: 'transparent',
                plotBorderColor: '#afafaf',
                plotBorderWidth: 1,
            },
            title: {
                text: title,
                fontSize: '10px',
                useHTML: true
            },
            subtitle: {
                text: subTitle,
                fontSize: '8px'
            },
            series: [{
                name: SeriesName,
                data: SeriesData,
                lineWidth: 0,
                marker: {
                    enabled: true,
                    symbol: 'diamond',
                    radius: 2
                },
            }],
            xAxis: {
                type: 'datetime',
                title: {
                    text: XaxisLabel,
                    align: 'high',
                },
                tickLength: 0,
                lineColor: 0,
                lineWidth: 0
            },
            yAxis: {
                title: {
                    text: `<span style="display:inline-block; -webkit-transform: rotate(270deg); -moz-transform: rotate(270deg); -ms-transform: rotate(270deg); -o-transform: rotate(270deg); filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);">${YaxisLabel}</span>`,
                    useHTML: true,
                    rotation: 0,
                    // align: 'high',
                    offset: 0,
                    x: -50
                },
                tickLength: 0,
                lineColor: 0,
                lineWidth: 0,
                gridLineWidth: 0
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    color: plotColor
                }
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["printChart",
                            "separator",
                            "downloadPNG",
                            "downloadJPEG",
                            "downloadPDF",
                            "downloadSVG",
                            "separator",
                            "downloadCSV",
                            "downloadXLS",
                            //"viewData",
                            "openInCloud"]
                    }
                },
                // chartOptions: {
                //     title: {
                //         text: title,
                //         fontSize: '10px',
                //         useHTML: true
                //     }, yAxis: {
                //         title: {
                //             text: `<span style="display:inline-block; -webkit-transform: rotate(90deg); -moz-transform: rotate(90deg); -ms-transform: rotate(90deg); -o-transform: rotate(90deg); filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);">${YaxisLabel}</span>`,
                //             useHTML: true,
                //             rotation: 250
                //         }
                //     },
                // },
                allowHTML: true,
                // fallbackToExportServer: false,
                // libURL: 'http://localhost:8000/static/airqualitywatch/js/Highcharts/lib/'
            }
        }
    ;
    return data
};


myApp.CatalogSlicingParam = function (url, startDate, endDate) {
    let param = {
        url: url,
        data_ext: '.nc',
        startDate: startDate,
        endDate: endDate,
    }
    return param
}

let addLayerToMap = async function (kk) {
    let wmsList = [];
    let catalogURl = threddDataSource + kk.catalog;
    let slicingParam = myApp.CatalogSlicingParam(catalogURl, kk.getStartDate(), kk.getEndDate());
    let responseData = await myApp.makeRequestWithCookieCSRFToken('POST', myApp.APICollection.api.SlicedFromCatalog, slicingParam);

    let resPonseParsed = JSON.parse(responseData);
    if (resPonseParsed.data.length) {
        resPonseParsed.data.forEach(function (fileName) {
            let url = catalogURl.replace("/catalog/", "/wms/").replace("catalog.xml", fileName);
            wmsList.push(url)
        });

        if (kk.isTimeDimensionLayer) {
            if (kk.useSLD) {
                let SLD = kk.SLD.replace(/(\r\n|\n|\r)/gm, "");
                let LegendParameter = '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&WIDTH=10&HEIGHT=230&SLD_BODY=';
                let legendWMS = '';
                if (!kk.legendPath) {
                    if (Array.isArray(wmsList)) {
                        legendWMS = wmsList[0] + LegendParameter + encodeURIComponent(SLD).toString();
                    } else {
                        legendWMS = wmsList + LegendParameter + encodeURIComponent(SLD).toString();
                    }
                } else {
                    legendWMS = kk.legendPath
                }
                let timedimensionTilePara = kk.threddLayerProp;
                timedimensionTilePara.source.params.SLD_BODY = SLD;
                timedimensionTilePara.source.url = wmsList;
                timedimensionTilePara.legendPath = legendWMS;
                timedimensionTilePara.wmsList = wmsList;

                var Newlayer = new ol.layer.TimeDimensionTile(timedimensionTilePara);
                await Newlayer.init().then(function (val) {
                    myApp.map.addThreddsLayer(val);
                    let l5 = new layerCheckBoxBinding(".layerCollection", Newlayer, true);
                    l5.setVisibleDivBind(kk.VisibleDivBind);
                    let properties = Newlayer.getProperties()
                    if (properties.mask) {
                        console.log(properties)
                        if (properties.CropOrMask == 'crop') {
                            Newlayer.setCrop(myApp.RegionGeoJSONParse.coordinates);
                        } else {
                            Newlayer.setMask(myApp.RegionGeoJSONParse.coordinates);
                        }
                    }
                    myApp.AllBindedLayersList.push(l5);
                }, (error) => console.error(error));
            } else {
                let timedimensionTilePara = kk.threddLayerProp;
                let LegendParameter = '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&WIDTH=10&HEIGHT=230&LAYERS=' + timedimensionTilePara.source.params.LAYERS + '&COLORSCALERANGE=' + timedimensionTilePara.source.params.COLORSCALERANGE + '&STYLES=' + timedimensionTilePara.source.params.STYLES;
                let legendWMS = '';
                if (!kk.legendPath) {
                    if (Array.isArray(wmsList)) {
                        legendWMS = wmsList[0] + LegendParameter;
                    } else {
                        legendWMS = wmsList + LegendParameter;
                    }
                } else {
                    legendWMS = kk.legendPath
                }
                timedimensionTilePara.source.url = wmsList;
                timedimensionTilePara.legendPath = legendWMS;
                timedimensionTilePara.wmsList = wmsList;

                var Newlayer = new ol.layer.TimeDimensionTile(timedimensionTilePara);
                await Newlayer.init().then(function (val) {
                    myApp.map.addThreddsLayer(val);
                    let l5 = new layerCheckBoxBinding(".layerCollection", Newlayer, true);
                    l5.setVisibleDivBind(kk.VisibleDivBind);
                    let properties = Newlayer.getProperties()
                    if (properties.mask) {
                        if (properties.CropOrMask == 'crop') {
                            Newlayer.setCrop(myApp.RegionGeoJSONParse.coordinates);
                        } else {
                            Newlayer.setMask(myApp.RegionGeoJSONParse.coordinates);
                        }
                    }
                    myApp.AllBindedLayersList.push(l5);
                }, (error) => console.error(error));
            }
        }
        kk.isDataThere = true;
    } else {
        kk.isDataThere = false;
    }
}

myApp.VectorStylesCollection = function () {
    myApp.AeronetAODStyleFun = function (feature, resolution) {
        let name = feature.get('name');
        let id = feature.get('id').toString();

        if (resolution > 2445.98490512564) {
            name = ''
        }
        let selectedList = myApp.getLayer(myApp.constants.recent.layerId.PM_AeronetAOD).get('selId');
        let AeronetStyle = null;
        // let selObject = selectedList.filter(x => x.featureId === id)[0]
        let selObject = selectedList.filter(function (x) {
            let tf = false;
            if (x) {
                if (x.featureId === id) {
                    tf = true;
                }
            }
            return tf
        })[0]
        if (selObject) {
            if (selObject.featureId === id) {
                AeronetStyle = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({color: myApp.IndexColors[selObject.index]}),
                        stroke: new ol.style.Stroke({color: 'white', width: 1}),
                        points: 3,
                        radius: 10,
                        rotation: 0,
                        angle: 0
                    }),
                    text: new ol.style.Text({
                        font: "normal 12px Arial",
                        text: name,
                        fill: new ol.style.Fill({color: '#aa3300'}),
                        stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                        offsetX: 0,
                        offsetY: 15,
                    })
                });
            }
        } else {
            AeronetStyle = new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({color: '#D5212E'}),
                    stroke: new ol.style.Stroke({color: 'black', width: 1}),
                    points: 3,
                    radius: 10,
                    rotation: 0,
                    angle: 0
                }),
                text: new ol.style.Text({
                    font: "normal 12px Arial",
                    text: name,
                    fill: new ol.style.Fill({color: '#aa3300'}),
                    stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                    offsetX: 0,
                    offsetY: 15,
                })
            });
        }
        return AeronetStyle;
    };
    myApp.USEmbassyPM25StyleFun = function (feature, resolution) {
        let name = feature.get('name');
        let id = feature.get('id').toString();

        if (resolution > 2445.98490512564) {
            name = ''
        }
        let selectedList = myApp.getLayer(myApp.constants.recent.layerId.PM_usembassy).get('selId');
        let USEmbassyAODStyle = null;
        let selObject = selectedList.filter(function (x) {
            let tf = false;
            if (x) {
                if (x.featureId === id) {
                    tf = true;
                }
            }
            return tf
        })[0]
        if (selObject) {
            if (selObject.featureId === id) {
                USEmbassyAODStyle = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({color: myApp.IndexColors[selObject.index]}),
                        stroke: new ol.style.Stroke({color: 'white', width: 1}),
                        points: 4,
                        radius: 10,
                        angle: Math.PI / 4
                    }),
                    text: new ol.style.Text({
                        font: "normal 12px Arial",
                        text: name,
                        fill: new ol.style.Fill({color: '#aa3300'}),
                        stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                        offsetX: 0,
                        offsetY: 15,
                    })
                });
            }
        } else {
            USEmbassyAODStyle = new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({color: '#CBCB59'}),
                    stroke: new ol.style.Stroke({color: 'black', width: 1}),
                    points: 4,
                    radius: 10,
                    angle: Math.PI / 4
                }),
                text: new ol.style.Text({
                    font: "normal 12px Arial",
                    text: name,
                    fill: new ol.style.Fill({color: '#aa3300'}),
                    stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                    offsetX: 0,
                    offsetY: 15,
                })
            });
        }
        return USEmbassyAODStyle;
    };
    myApp.USEmbassyO3StyleFun = function (feature, resolution) {
        let name = feature.get('name');
        let id = feature.get('id').toString();

        if (resolution > 2445.98490512564) {
            name = ''
        }
        let selectedList = myApp.getLayer(myApp.constants.recent.layerId.O3_usembassy).get('selId');
        let USEmbassyAODStyle = null;
        let selObject = selectedList.filter(function (x) {
            let tf = false;
            if (x) {
                if (x.featureId === id) {
                    tf = true;
                }
            }
            return tf
        })[0]
        if (selObject) {
            if (selObject.featureId === id) {
                USEmbassyAODStyle = new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({color: myApp.IndexColors[selObject.index]}),
                        stroke: new ol.style.Stroke({color: 'white', width: 1}),
                        points: 4,
                        radius: 10,
                        angle: Math.PI / 4
                    }),
                    text: new ol.style.Text({
                        font: "normal 12px Arial",
                        text: name,
                        fill: new ol.style.Fill({color: '#aa3300'}),
                        stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                        offsetX: 0,
                        offsetY: 15,
                    })
                });
            }
        } else {
            USEmbassyAODStyle = new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: new ol.style.Fill({color: '#CBCB59'}),
                    stroke: new ol.style.Stroke({color: 'black', width: 1}),
                    points: 4,
                    radius: 10,
                    angle: Math.PI / 4
                }),
                text: new ol.style.Text({
                    font: "normal 12px Arial",
                    text: name,
                    fill: new ol.style.Fill({color: '#aa3300'}),
                    stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                    offsetX: 0,
                    offsetY: 15,
                })
            });
        }
        return USEmbassyAODStyle;
    };
}

myApp.VectorStylesCollection();