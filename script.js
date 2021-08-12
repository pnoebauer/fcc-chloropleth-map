const w = 900;
const h = 500;

const padding = 60;

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

async function loadAndPlotData() {
	// const res = await fetch(
	// 	'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
	// );
	// const data = await res.json();
}

loadAndPlotData();
