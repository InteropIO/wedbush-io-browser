
1. Install tailwindcss via npm, and then run the init command to generate your tailwind.config.js file.

	npm install -D tailwindcss
	npx tailwindcss init
	
2. Add the paths to all of your template files in your tailwind.config.js file.

	/** @type {import('tailwindcss').Config} */
	module.exports = {
		content: [
			"./src/**/*.{js,jsx,ts,tsx}",
		],
		theme: {
			extend: {},
		},
		plugins: [],
	}
	
3. Add the Tailwind directives to ./src/index.css 

	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
	
	
4. Start the application

	npm start 
	
5. Open DevTools and select the element whose style you would like to override 
	(the example shows how to do this for the menu headers)
	
6. Override the style(s) in ./src/index.css

	main .io-list-header {
		@apply text-orange-300;
	}
