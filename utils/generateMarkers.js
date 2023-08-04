import { locations } from '@/locations';
import { getRoute } from './generateRoute';

const popupHTML = (city, lng, lat) => ` <div class="bg-white  p-2">
                   
<p class="text-black text-lg font-medium">You are in: ${city}</p>

  <p class="text-black text-[14px]">Coordinate: ${lng}, ${lat}</p>
 
</div>`;

const generateNewMarker = ({ map, mapStyle, light, mapboxgl }) => {
	console.log(locations);

	locations.map(({ city, lng, lat }) => {
		const markerElement = document.createElement('div');
		markerElement.className = 'custom-marker text-[50px] text-center';
		markerElement.innerHTML = `🇺🇸`;
		// markerElement.style.fontSize = '35px';
		// markerElement.style.textAlign = 'center';
		const textElement = document.createElement('div');
		textElement.innerHTML = city;
		textElement.className = `${
			mapStyle === light ? 'text-black' : 'text-white'
		} text-lg font-medium text-center`;

		const markerContainer = document.createElement('div');
		markerContainer.appendChild(markerElement);
		markerContainer.appendChild(textElement);

		new mapboxgl.Marker(markerContainer)
			.setLngLat([lng, lat])
			.setPopup(
				new mapboxgl.Popup({
					closeButton: false,
					anchor: 'left'
				}).setHTML(popupHTML(city, lng, lat))
			)
			.addTo(map);
	});
};

const generateGeocoderMarker = (
	result,
	mapboxMap,
	geocoder,
	geoMarker,
	mapStyle,
	light,
	mapboxgl,
	mapboxToken
) => {
	const { text, center } = result;

	const [lng, lat] = center;

	// ? understand this
	if (geoMarker) {
		geoMarker.remove();

		if (mapboxMap.getLayer('route')) {
			mapboxMap.removeLayer('route');
		}
		if (mapboxMap.getSource('route')) {
			mapboxMap.removeSource('route');
		}
	}

	const markerElement = document.createElement('div');
	markerElement.className = 'custom-marker text-[50px] text-center';
	markerElement.innerHTML = `🇺🇸`;

	const textElement = document.createElement('div');
	textElement.innerHTML = text;
	textElement.className = `text-center ${
		mapStyle === light ? 'text-black' : 'text-white'
	} text-lg font-medium `;
	// textElement.style.textAlign = 'center';

	// Create a button element
	const buttonElement = document.createElement('button');
	buttonElement.textContent = 'Show route';
	buttonElement.className = 'bg-blue-500 text-white px-3 py-1 rounded mx-auto';

	// Center the button horizontally using flexbox
	const buttonContainer = document.createElement('div');
	buttonContainer.className = 'flex justify-center';
	buttonContainer.appendChild(buttonElement);

	buttonElement.addEventListener('click', () => {
		// Perform an action when the button is clicked
		// console.log(buttonElement.textContent);
		// toggleButtonText();
		getRoute(mapboxToken, mapboxMap, lng, lat, mapStyle, light);
	});

	const markerContainer = document.createElement('div');
	markerContainer.appendChild(markerElement);
	markerContainer.appendChild(textElement);
	markerContainer.appendChild(buttonContainer);

	geoMarker = new mapboxgl.Marker(markerContainer)
		.setLngLat(center)
		.setPopup(
			new mapboxgl.Popup({
				closeButton: false,
				anchor: 'left'
			}).setHTML(popupHTML(text, lng, lat))
		)
		.addTo(mapboxMap);

	// Listen to the 'clear' event of the geocoder
	geocoder.on('clear', () => {
		// Remove the custom marker from the map
		if (geoMarker) {
			geoMarker.remove();

			if (mapboxMap.getLayer('route')) {
				mapboxMap.removeLayer('route');
			}
			if (mapboxMap.getSource('route')) {
				mapboxMap.removeSource('route');
			}
		}
	});
};

export { generateNewMarker, generateGeocoderMarker };
