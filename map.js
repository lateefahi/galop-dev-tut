require(["esri/config",
"esri/Map",
"esri/views/MapView",
"esri/widgets/Locate",
"esri/layers/FeatureLayer",
"esri/Basemap",
"esri/layers/VectorTileLayer",
"esri/layers/TileLayer",
"esri/geometry/Point",
"esri/widgets/Track",
"esri/Graphic",
"esri/layers/ElevationLayer",
"esri/widgets/ElevationProfile",
"esri/widgets/BasemapToggle",
"esri/widgets/BasemapGallery",
"esri/widgets/LayerList",
"esri/layers/ImageryTileLayer",

], function (
esriConfig,
Map,
MapView,
Locate,
FeatureLayer,
Basemap,
VectorTileLayer,
TileLayer,
Point,
Track,
Graphic,
ElevationLayer,
ElevationProfile,
BasemapToggle, 
BasemapGallery,
LayerList,
ImageryTileLayer,
) {

esriConfig.apiKey = "AAPK05b17ef26c44418690ada98c9cc5fb4bmXyy4jRyJkvddW7qd1N7ahKMLSQ3Ywh8NkbmNtNDDeoJLPBoDGqALVM5yX9pxiZl";

const windForecast = new ImageryTileLayer({url: "https://tiledimageservices.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/vector_field_layer/ImageServer",
 title: "Wind",
 renderer: {
    type: "animated-flow", // autocasts to new AnimatedFlowRenderer
    lineWidth: "2px",
    lineColor: [50, 120, 240],
    density: 1
},
effect: "bloom(2, 0.25px, 30)",

});

const vectorTileLayer = new VectorTileLayer({
    portalItem: {
        id: "734c12e9904b4a8086d2dff8582a93a1" // topolayer
    },

});

const imageTileLayer = new TileLayer({
    portalItem: {
        id: "38c860f8dbd24820b2a59ccc9a3dabdb" // Hillshade layer
    }
});
const basemap = new Basemap({
    baseLayers: [

        imageTileLayer,
        vectorTileLayer

    ]

});
// this is the additional basemap code
const linzTopoLayer = new TileLayer({
    portalItem: {
        id: "85027f060e2b47249a508ada6f44403d" // NZ LINZ Topographic
    },
});
const linzBasemap = new Basemap({
    baseLayers: [
        linzTopoLayer
    ],
    title: "LINZ Topographic",
    id: "linzbasemap"
});
const imageryLayer = new TileLayer({
    portalItem: {
        id: "d284729222d04a3cb548cfe27716ea43" // NZ imagery
    }
});
const imageryBasemap = new Basemap({
    baseLayers: [
        imageryLayer
    ],
    title: "Imagery",
    id: "imagerybasemap"
});


const popupHuts = {
    "content": "<img src={introductionThumbnail} /><br />" +
        "<h1>{name}</h1><i>{place}, {region}</i><br /><br />" +
        "<b>Facilities:</b> {facilities}<br />" +
        "<b>Status:</b> {status}<br />" +
        "<b>Bookable:</b> {bookable}<br />" +
        "<a href='{staticLink}'>More Info</a>"
}

const labelHuts = {
    // autocasts as new LabelClass()
    symbol: {
        type: "text", // autocasts as new TextSymbol()
        color: [43, 43, 43, 255],
        font: {
            // autocast as new Font()
            weight: "bold"
        },
        haloSize: 1,
        haloColor: "white"
    },
    labelPlacement: "below-center",
    labelExpressionInfo: {
        expression: "$feature.name"
    }
};
//Trailheads feature layer (points)
const hutsLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/3JjYDyG3oajxU6HO/arcgis/rest/services/DOC_Huts/FeatureServer",
    popupTemplate: popupHuts,
    labelingInfo: [labelHuts],
    renderer: hutsRenderer,
});



//Trails feature layer (lines)
const trailsLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/3JjYDyG3oajxU6HO/arcgis/rest/services/DOC_Tracks/FeatureServer",
    renderer: trailsRenderer
});

const elevationLayer = new ElevationLayer({
    portalItem: {
        id: "2ce4fe7d77024e719f8a04d2155b3fd2"
    }
});

const map = new Map({
    basemap: basemap,
    layers: [trailsLayer, hutsLayer, windForecast],
    ground: {
    layers: [elevationLayer]
    }
});

const view = new MapView({
    map: map,
    center: new Point({ x: 1795999, y: 5457405, spatialReference: { wkid: 2193 } }), // nztm coordinates
    zoom: 10, // Zoom level
    container: "viewDiv", // Div element
});

const elevationProfile = new ElevationProfile({
    view: view,
    profiles: [{ type: "ground" }]
});

view.when(function () {
    view.ui.add(elevationProfile);
});
view.when(() => {
    const layerList = new LayerList({
    view: view
    });

    // Add widget to the top right corner of the view
    view.ui.add(layerList, "top-right");
});
const track = new Track({
    view: view,
    graphic: new Graphic({
      symbol: {
        type: "simple-marker",
        size: "12px",
        color: "green",
        outline: {
          color: "#efefef",
          width: "1.5px"
        }
      }
    }),
    useHeadingEnabled: false
  });

  view.ui.add(track, "top-left");


  const basemapGallery = new BasemapGallery({
    view: view,
    source: [basemap, linzBasemap, imageryBasemap]
});
view.ui.add(basemapGallery, "top-right");


});