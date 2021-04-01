const price_graphing = async () => {
    let URL = `https://server-mauve-two.vercel.app/products/search?`;
    const response = await fetch(URL);
    const body = await response.json();
    let prices_list = Array.from(body.data.meta.price_list,
		(value, index) => value.price);

    const p50 = Quartile(prices_list,0.5)
    const p90 = Quartile(prices_list,0.9)
    const p95 = Quartile(prices_list,0.95)
	var trace = {
		x: prices_list,
		type: 'histogram',
		name: 'Prices in range'
	};
	var per_legend = {
		x:[p50, p90, p95],
		y: [515, 515, 515],
		text: ['p50', 'p90', 'p95'],
		mode: 'text'
	}
	var data = [trace, per_legend];

	var layout = {
		shapes : [{
			type: 'line',
			x0 : p50,
			y0 : 0,
			x1 : p50,
			y1 : 500,
			line : {
				color: 'grey',
				width: 2.5,
				dash:'dot'
			}
		},
		{
			type: 'line',
			x0 : p90,
			y0 : 0,
			x1 : p90,
			y1 : 500,
			line : {
				color: 'red',
				width: 2.5,
				dash:'dot'
			}
		},
		{
			type: 'line',
			x0 : p95,
			y0 : 0,
			x1 : p95,
			y1 : 500,
			line : {
				color: 'green',
				width: 2.5,
				dash:'dot'
			}
		}],
		title: "Distribution graph of the products' prices",
		showlegend: false
	}

Plotly.newPlot('price-distrib', data, layout);
};

price_graphing();

function Quartile(data, q) {
    data.sort((a,b) => a-b);
    var pos = ((data.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if( (data[base+1]!==undefined) ) {
      return data[base] + rest * (data[base+1] - data[base]);
    } else {
      return data[base];
    }
}