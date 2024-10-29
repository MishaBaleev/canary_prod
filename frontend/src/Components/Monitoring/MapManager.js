import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapManager{
    constructor(is_interactive=true){
        const token = "pk.eyJ1IjoiYmFsZWV2IiwiYSI6ImNsYXBqNmk4dTE5Y3UzcWxiYmt1bTJtcG8ifQ.aE8lRdfDnWq52szIP7gAHw"
        mapboxgl.accessToken = token;
        this.map = null
        this.marker = null
        this.azimuth = 0
    }

    init(){
        this.map = new mapboxgl.Map({
            container: "map",
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [38.943917, 47.203948],
            zoom: 15,
            minZoom: 2
        })
        this.map.on("click", (e) => {this.mapClick(e)})
    }

    createGeoJSONCircle(center, radius, angle, vector, is_update=false) {
        let coords = {
            latitude: center[1],
            longitude: center[0]
        };
        let km = radius;
        let ret = [];
        let distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
        let distanceY = km/110.574;
        let theta, x, y;
        for(let i = (vector - angle / 2); i < (vector + angle / 2); i = i + 4) {
            theta = (i/360)*(2*Math.PI);
            x = distanceX*Math.cos(theta);
            y = distanceY*Math.sin(theta);
            ret.push([coords.longitude+x, coords.latitude+y]);
        }
        ret.push(center)
        ret.unshift(center)
        if (is_update){
            return {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {"name": "sector"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
            }
        }else{
            return {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
                }
            };
        }
    };

    mapClick(e){
        this.setDevice({lon: e.lngLat.lng, lat: e.lngLat.lat, azimuth: this.azimuth})
    }

    setDevice(params){
        if (this.marker !== null){
            this.marker.remove()
            this.marker = null
            this.map.removeLayer("sector_layer")
            this.map.removeSource("sector_source")
        }
        this.marker = new mapboxgl.Marker({
            "color": "#02D402"
        }).setLngLat([Number(params.lon), Number(params.lat)]).addTo(this.map)
        this.map.addSource("sector_source", this.createGeoJSONCircle([Number(params.lon), Number(params.lat)], 1, 120, -params.azimuth+90))
        this.map.addLayer({
            "id": "sector_layer",
            "type": "fill",
            "source": "sector_source",
            "layout": {},
            "paint": {
                "fill-color": "#02d402",
                "fill-opacity": 0.6
            }
        })
        this.map.flyTo({center: [Number(params.lon), Number(params.lat)]})
    }

    rotateDevice(angle){
        this.azimuth = angle
        if (this.marker){
            let geojson = this.createGeoJSONCircle([this.marker.getLngLat().lng, this.marker.getLngLat().lat], 1, 120, Number(-angle)+90, true)
            this.map.getSource("sector_source").setData(geojson)
        }
    }

    clear(){
        this.marker.remove()
        this.marker = null
        this.map.removeLayer("sector_layer")
        this.map.removeSource("sector_source")
    }

    warning(){
        if (this.marker){
            this.map.setPaintProperty("sector_layer", "fill-color", "#ff0000")
        }
    }
    safe(){
        if (this.marker){
            this.map.setPaintProperty("sector_layer", "fill-color", "#02d402")
        }
    }
}