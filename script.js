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

const educationStep = 15;
const colorMap = [
	'rgb(16, 92, 200)',
	'rgb(105, 180, 255)',
	'rgb(230, 150, 84)',
	'rgb(247, 77, 58)',
	'rgb(255, 32, 8)',
];

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
	// console.log(educationData, countyData);

	// attr('d') for drawing path on the canvas based on coords
	// d3.geoPath converts coordinates into string that is passed to path
	svg
		.selectAll('path')
		.data(countyData)
		.enter()
		.append('path')
		.attr('d', d3.geoPath())
		.attr('class', 'county')
		.attr('fill', countyDataItem => {
			const matchedEducationObject = educationData.find(
				countyObject => countyObject.fips === countyDataItem.id
			);

			const {bachelorsOrHigher} = matchedEducationObject;

			// console.log(id, matchedEducationObject);

			if (bachelorsOrHigher < educationStep * 1) {
				return colorMap[0];
			} else if (bachelorsOrHigher < educationStep * 2) {
				return colorMap[1];
			} else if (bachelorsOrHigher < educationStep * 3) {
				return colorMap[2];
			} else if (bachelorsOrHigher < educationStep * 4) {
				return colorMap[3];
			}
			return colorMap[4];
		})
		.attr('data-fips', countyDataItem => countyDataItem.id)
		.attr(
			'data-education',
			countyDataItem =>
				educationData.find(countyObject => countyObject.fips === countyDataItem.id)
					.bachelorsOrHigher
		)
		.on('mouseover', function (mouseEvent, countyDataItem) {
			const countyEducationData = educationData.find(
				countyObject => countyObject.fips === countyDataItem.id
			);
			const {bachelorsOrHigher, area_name, state} = countyEducationData;

			// d3.select(this).style('r', 8);
			// console.log(countyDataItem, countyEducationData);

			tooltip.transition().duration(200).style('opacity', 0.9);
			tooltip
				.html(`${area_name}, ${state}, Degree: ${bachelorsOrHigher}%`)
				.style('text-align', 'center')
				.attr('data-education', bachelorsOrHigher)
				// .style('left', d.pageX + 'px')
				.style('left', mouseEvent.offsetX + 'px')
				.style('top', mouseEvent.offsetY + 'px');
		})
		.on('mouseout', function (d, i) {
			// d3.select(this).style('fill', 'black');
			tooltip.transition().duration(500).style('opacity', 0);
		});

	const legend = svg
		.append('g')
		.attr('transform', `translate(${w / 2 + padding * 2}, ${padding * 1.1})`)
		.attr('id', 'legend');

	const legendAxisScale = d3.scaleLinear().domain([0, 5]).range([0, 200]);

	const lWidth = legendAxisScale(2) - legendAxisScale(1);

	legend
		.selectAll('rect')
		.data([0, 1, 2, 3, 4])
		.enter()
		.append('rect')
		.attr('height', 10)
		.attr('width', lWidth)
		.attr('x', (d, i) => legendAxisScale(i))
		.attr('fill', (d, i) => colorMap[i]);

	const legendXAxis = d3
		.axisBottom(legendAxisScale)
		.tickFormat((x, i) => (i === 0 || i === 5 ? '' : `${i * educationStep}%`))
		.ticks(5);

	legend
		.append('g')
		.attr('transform', `translate(0, 10)`)
		.attr('id', 'legend-x-axis')
		.call(legendXAxis);
}

loadAndPlotData();
