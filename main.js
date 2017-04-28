var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
var nodeset = null;

var Node = function(set)
{
	for(var i in set)
		this[i] = set[i];

	this.distanceFrom = (other) => {
		const dx = Math.abs(this.x - other.x);
		const dy = Math.abs(this.y - other.y);
		return Math.pow(dx + dy, .5);
	};
};

var KNN =
{
	/* @args: node: {x, y} */
	run: (node = {x: 0.5487, y: 0.1250}) =>
	{
		var prototipo = new Node(node);

		var sorted_dataset = KNN.sort(prototipo, nodeset);
		var top_k = KNN.topK(sorted_dataset, 3);
		var counts = KNN.classFrequency(top_k);
		var classification = KNN.classify(counts);

		console.log("Node ("+prototipo.x+","+prototipo.y+") classified as "+classification)

		Draw(nodeset, prototipo);
	},

	/* Draw dataset on canvas. */
	draw: (dataset, colorMap, sample) => 
	{
		dataset.forEach(set => {
			const x = 125 + set.x * 350;
			const y = 50 + set.y * 350;

			ctx.fillStyle = colorMap[set.type-1];
			ctx.fillRect(x-2, y-2, 4, 4);
		});

		if(sample)
		{
			const x = 125 + sample.x * 350;
			const y = 50 + sample.y * 350;

			ctx.fillStyle = "white";//colorMap[set.type-1];
			ctx.fillRect(x-1, y-1, 6, 6);

			ctx.fillStyle = colorMap[1];
			ctx.fillRect(x, y, 4, 4);
		}
	},

	// sort the training data by distance from the sample.
	sort: (sample, dataset) =>
	{
		return _.sortBy(dataset, item => {
			return item.distanceFrom(sample);
		})
	},

	topK: (dataset, k) => {
		return _.first(dataset, k);
	},

	classFrequency: dataset => 
	{
		return _.countBy(dataset, item => {
			return item.type;
		});
	},

	classify: dataset =>
	{
		var list = _.max(_.pairs(dataset), item => {
			return item[1];
		});

		return list[0];
	}
};

var Main = () =>
{
	nodeset = [];
	DATASET.forEach(data => {
		nodeset.push(new Node(data));
	});

	Draw(nodeset);
};

var Draw = (dataset, sample) =>
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const colors = ["red", "green", "blue", "yellow"];
	KNN.draw(dataset, colors, sample);
};

Main();