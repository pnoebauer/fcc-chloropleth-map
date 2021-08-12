const w = 1000;
const h = 800;

const padding = 50;

const svg = d3
	.select('.svg-container')
	.style('padding-bottom', `${((h - padding / 2) / w) * 100}%`)
	.append('svg')
	.attr('preserveAspectRatio', 'xMinYMin meet')
	.attr('viewBox', `0 0 ${w} ${h}`)
	.classed('svg-content', true)
	.style('background-color', '#fff');

const tooltip = d3
	.select('.svg-container')
	.append('div')
	.attr('id', 'tooltip')
	.style('opacity', 0);

svg
	.append('text')
	.attr('x', w / 2)
	.attr('y', 20)
	.attr('id', 'title')
	.style('text-anchor', 'middle')
	.style('font-size', 20)
	.text('United States Educational Attainment');

// svg
// 	.append('text')
// 	.attr('x', -250)
// 	.attr('y', 60)
// 	.style('font-size', 16)
// 	.attr('transform', 'rotate(-90)')
// 	.text('Months');

svg
	.append('text')
	.attr('x', w / 2)
	.attr('y', 40)
	.attr('id', 'description')
	.style('text-anchor', 'middle')
	.style('font-size', 15)
	.text(
		`Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`
	);

const educationURL =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyURL =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

async function loadAndPlotData() {
	const resEducation = await fetch(educationURL);
	const educationData = await resEducation.json();

	const resCounty = await fetch(countyURL);
	const countyDataTopoJson = await resCounty.json();

	// topojson.feature converts topojson into geojson (required for d3)
	// .feature requires as arg1 the dataset, and as arg2 the object of interest (here: the geometries of each county)
	const countyData = topojson.feature(
		countyDataTopoJson,
		countyDataTopoJson.objects.counties
	).features; //extract features array from object (object also contains type key, which is not required)

	// console.log(countyDataTopoJson);
	// console.log(countyData);

	// attr('d') for drawing path on the canvas based on coords
	// d3.geoPath converts coordinates into string that is passed to path
	svg
		.selectAll('path')
		.data(countyData)
		.enter()
		.append('path')
		.attr('d', d3.geoPath())
		.attr('class', 'county');
}

loadAndPlotData();
