import { Injectable } from '@angular/core';
import bearing from '@turf/bearing';
import { point } from '@turf/helpers';
import { Coordinates } from '@val-live/model';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  public getAngleBetweenTwoPoints(point1 : Coordinates, point2: Coordinates) {
    const coord1 = point([point1.longitude, point1.latitude]);
    const coord2 = point([point2.longitude, point2.latitude]);
    return bearing(coord1, coord2);
  }
}
