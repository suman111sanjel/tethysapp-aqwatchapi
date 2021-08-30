# import netCDF4
# import matplotlib
# matplotlib.use('Agg')
# import numpy as np
# import rasterio as rio
# import numpy
# import rasterstats as rstats
# import datetime
#
# def TimeSeriesModelDataCompute(collectionDir, parameterName, wkt,WKTType):
#
#     AllNetCDFList=collectionDir
#     seriesData=[]
#     AllDates=[]
#     AllNetCDFList.sort()
#     for i in AllNetCDFList:
#         nc_fid = netCDF4.Dataset(i, 'r')  # Reading the netCDF file
#         lis_var = nc_fid.variables
#
#         lats=None
#         lons=None
#
#         try:
#             lats = nc_fid.variables['latitude'][:]  # Defining the latitude array
#             lons = nc_fid.variables['longitude'][:]  # Defining the longitude array
#         except:
#             lats = nc_fid.variables['lat'][:]  # Defining the latitude array
#             lons = nc_fid.variables['lon'][:]  # Defining the longitude array
#
#         field = nc_fid.variables[parameterName][:]  # Defning the variable array
#         time = nc_fid.variables['time'][:]
#
#         deltaLats = lats[1] - lats[0]
#         deltaLons = lons[1] - lons[0]
#
#         deltaLatsAbs = numpy.abs(deltaLats)
#         deltaLonsAbs = numpy.abs(deltaLons)
#
#         if WKTType=='point':
#             stn_lat=float(wkt.split("(")[1].split(")")[0].split(" ")[1])
#             stn_lon=float(wkt.split("(")[1].split(")")[0].split(" ")[0])
#             abslat = numpy.abs(lats - stn_lat)  # Finding the absolute latitude
#             abslon = numpy.abs(lons - stn_lon)  # Finding the absolute longitude
#
#             lat_idx = (abslat.argmin())
#             lon_idx = (abslon.argmin())
#
#         geotransform = rio.transform.from_origin(lons.min(), lats.max(), deltaLatsAbs, deltaLonsAbs)
#
#         for timestep, v in enumerate(time):
#
#             nc_arr = field[timestep]
#             nc_arr[nc_arr < -9000] = numpy.nan  # use the comparator to drop nodata fills
#             if deltaLats > 0:
#                 nc_arr = nc_arr[::-1]  # vertically flip array so tiff orientation is right (you just have to, try it)
#
#             dt_str = netCDF4.num2date(lis_var['time'][timestep], units=lis_var['time'].units,
#                                       calendar=lis_var['time'].calendar)
#             strTime = str(dt_str)
#             dt_str = datetime.datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
#             dateInmillisecond = dt_str.timestamp() * 1000
#             AllDates.append(dt_str.date())
#
#             interestedValue=None
#             if WKTType == 'polygon':
#                 tt = rstats.zonal_stats(wkt, nc_arr, affine=geotransform, stats='mean')
#                 interestedValue=tt[0]['mean']
#             else:
#                 a = field[timestep, lat_idx, lon_idx]
#                 if np.isnan(a):
#                     interestedValue=False
#                 else:
#                     b=str(a)
#                     interestedValue=float(b)
#             print("hello")
#
#             if interestedValue:
#                 # strTime=str(dt_str)
#                 # print(strTime)
#                 # dt_str=datetime.datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
#                 # dateInmillisecond = dt_str.timestamp() * 1000
#                 value = round(interestedValue, 3)
#                 seriesData.append([int(dateInmillisecond), value])
#                 # AllDates.append(dt_str.date())
#
#         nc_fid.close()
#     print(seriesData)
#     XaxisLabel=None
#     try:
#         XaxisLabel = 'From ' + str(AllDates[0]) + " To " + str(AllDates[-1])
#     except:
#         XaxisLabel = 'From - To - '
#     return {"SeriesData":seriesData,"status":200,"XaxisLabel":XaxisLabel}
#

import netCDF4
import numpy
import datetime
import threading



def init():
    tt1 = datetime.datetime.now()
    ncFullPath = '/home/suman/192.168.11.242 user Suman/Qout_era5_t640_24hr_19790101to20191231.nc'
    # ncFullPath = '/zData/temps/south_asia-geoglows/Qout_era5_t640_24hr_19790101to20191231.nc'
    nc_fid = netCDF4.Dataset(ncFullPath, 'r')
    lis_var = nc_fid.variables
    Comid = 5084007
    rividAll = nc_fid.variables['rivid'][:]
    time = nc_fid.variables['time'][:]
    tt2 = datetime.datetime.now()
    getDifference = numpy.abs(rividAll - Comid)
    absRiverId = numpy.abs(getDifference - Comid)
    comid_idx = (absRiverId.argmin())
    listNew = []
    DateList = []

    def collectDates():
        for timestep, v in enumerate(time):
            dt = netCDF4.num2date(lis_var['time'][timestep], units=lis_var['time'].units, calendar=lis_var['time'].calendar)
            dt_str = dt.strftime("%Y-%m-%d %H:%M:%S")
            DateList.append(dt_str)
    def collectValues():
        for timestep, v in enumerate(time):
            nc_arr = nc_fid.variables['Qout'][timestep,comid_idx]
            listNew.append(float(nc_arr))

    t1 = threading.Thread(target=collectDates, name='t1')
    t2 = threading.Thread(target=collectValues, name='t2')

    # starting threads
    t1.start()
    t2.start()

    # wait until all threads finish
    t1.join()
    t2.join()

    # print(listNew)
    # print(DateList)
    nc_fid.close()
    tt3 = datetime.datetime.now()
    print('t2-t1', tt2 - tt1)
    print('t3-t2', tt3 - tt2)
    print('t3-t1', tt3 - tt1)

init()