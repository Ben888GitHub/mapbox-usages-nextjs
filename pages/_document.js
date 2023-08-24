import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css"
					rel="stylesheet"
				/>
				{/* <script src="https://api.mapbox.com/mapbox-gl-js/v2.x.x/mapbox-gl.js"></script> */}
				<Script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
