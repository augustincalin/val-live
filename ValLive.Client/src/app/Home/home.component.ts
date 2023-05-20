import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { SignalrService } from '../signalr-service/signalr.service';
import { Coordinates, Valuation } from '@val-live/model';
import { GeoService } from '../geo/geo.service';

@Component({
  selector: 'val-live-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v12';
  maxValueRent = 0;
  minValueRent = 0;
  maxValueValuation = 0;
  minValueValuation = 0;

  currentLocation: Coordinates = { longitude: 7.132136, latitude: 50.548148 };
  cheapLocation: Coordinates = this.currentLocation;
  expensiveLocation: Coordinates = this.currentLocation;

  constructor(
    private signalrService: SignalrService,
    private geoService: GeoService
  ) {}

  ngOnInit() {
    this.signalrService.dataReceived$.subscribe((data: Valuation) => {
      console.log('data', data);
      this.minValueRent = data.minRent;
      this.maxValueRent = data.maxRent;
      this.minValueValuation = data.minPrice;
      this.maxValueValuation = data.maxPrice;
      this.cheapLocation = data.cheapPosition;
      this.expensiveLocation = data.expensivePosition;
      const source = this.map?.getSource('points') as mapboxgl.GeoJSONSource;
      source.setData(this.buildSource(this.currentLocation));
      this.setCheapArrow();
      this.setExpensiveArrow();
    });

    this.makeMap();
  }

  makeMap() {
    this.map = new mapboxgl.Map({
      accessToken:
        'pk.eyJ1IjoiZ29vc2V0ZWEiLCJhIjoiY2xndXo1cnl4MDE1ZDNyb2Z3NTJkbmFyNCJ9.a6_FuJw1i6-jM-AP3itjTw',
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
      center: [this.currentLocation.longitude, this.currentLocation.latitude],
    });

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    geolocateControl.on('geolocate', (e: any) => {
      this.currentLocation = {
        longitude: e.coords.longitude,
        latitude: e.coords.latitude,
      };
      this.signalrService.getValuation({
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
      });
    });

    this.map.addControl(geolocateControl);

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click', (e) => {
      console.log('click', e.lngLat);
      this.signalrService.getValuation({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      });
    });

    const geojsonObject: GeoJSON.FeatureCollection<GeoJSON.Geometry> =
      this.buildSource(this.currentLocation);

    this.map.on('load', () => {
      this.map?.loadImage('assets/arrow-cheap.png', (error, image) => {
        if (error) throw error;
        this.map?.addImage('cheapArrow', <ImageBitmap>image);
      });
      this.map?.loadImage('assets/arrow-expensive.png', (error, image) => {
        if (error) throw error;
        this.map?.addImage('expensiveArrow', <ImageBitmap>image);
      });
      this.map?.loadImage('assets/compass.png', (error, image) => { 
        if (error) throw error;
        this.map?.addImage('compass', <ImageBitmap>image);
      });
      this.map?.loadImage('assets/shadow.png', (error, image) => { 
        if (error) throw error;
        this.map?.addImage('shadow', <ImageBitmap>image);
      });

      this.map?.addSource('points', { type: 'geojson', data: geojsonObject });

      this.map?.addLayer({
        id: 'cheapLayer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-anchor': 'left',
          'icon-image': 'cheapArrow',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-offset': [10, 0],
        },
      });

      this.map?.addLayer({
        id: 'cheapShadowLayer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-anchor': 'left',
          'icon-image': 'shadow',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-offset': [13, 3],
        },
      },'cheapLayer');


      this.map?.addLayer({
        id: 'expensiveLayer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-anchor': 'left',
          'icon-image': 'expensiveArrow',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-offset': [10, 0],
        },
      });

      this.map?.addLayer({
        id: 'expensiveShadowLayer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-anchor': 'left',
          'icon-image': 'shadow',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-offset': [13, 3],
        },
      }, 'expensiveLayer');

      this.map?.addLayer({
        id: 'compassLayer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-image': 'compass',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,

        },
      }, 'cheapShadowLayer');

      this.setCheapArrow();
      this.setExpensiveArrow();

      this.map?.resize();
      geolocateControl.trigger();
    });
  }

  private setExpensiveArrow() {
    const bearingExpensive = this.geoService.getAngleBetweenTwoPoints(
      this.currentLocation,
      this.expensiveLocation
    );

    this.map?.setLayoutProperty(
      'expensiveLayer',
      'icon-rotate',
      bearingExpensive
    );
    this.map?.setLayoutProperty(
      'expensiveShadowLayer',
      'icon-rotate',
      bearingExpensive
    );
  }

  private setCheapArrow() {
    const bearingCheap = this.geoService.getAngleBetweenTwoPoints(
      this.currentLocation,
      this.cheapLocation
    );
    this.map?.setLayoutProperty('cheapLayer', 'icon-rotate', bearingCheap);
    this.map?.setLayoutProperty('cheapShadowLayer', 'icon-rotate', bearingCheap);
  }

  private buildSource(position: Coordinates) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [position.longitude, position.latitude],
          },
          properties: {},
        },
      ],
    } as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  }
}
