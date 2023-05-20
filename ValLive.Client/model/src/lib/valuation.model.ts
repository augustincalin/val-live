import { Coordinates } from "./coordinates.model";

export interface Valuation
{
    id: number;
    minRent: number;
    maxRent: number;
    minPrice: number;
    maxPrice: number;
    currentPosition: Coordinates;
    cheapPosition: Coordinates;
    expensivePosition: Coordinates;

}