import axios from 'axios';
import { useEffect, useState } from 'react';

const Directions = ({ mapboxToken, mapboxMap }) => {
	const apiEndpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/-74.742935,40.217052;-97.7618,30.4882?steps=true&geometries=geojson&access_token=${mapboxToken}`;

	const getRoute = async () => {
		const { data } = await axios.get(apiEndpoint);
		const result = data.routes[0];
		const route = result.geometry.coordinates;
		console.log(result);
		const geojson = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates: route
			}
		};

		// if the route already exists on the map, we'll reset it using setData
		if (mapboxMap.getSource('route')) {
			mapboxMap.getSource('route').setData(geojson);
		}

		// otherwise, we'll make a new request
		else {
			mapboxMap.addLayer({
				id: 'route',
				type: 'line',
				source: {
					type: 'geojson',
					data: geojson
				},
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#3887be',
					'line-width': 5,
					'line-opacity': 0.75
				}
			});
		}
	};

	return <div>Directions</div>;
};

export default Directions;
