document.addEventListener('readystatechange', function(){
	if(document.readyState=="complete"){
		setTimeout(function() { 
			var steam_price = document.querySelector("body > div.market-list > div > div.detail-header.black > div.detail-cont > div.detail-summ > span > strong").innerText;
			var re1 = /¥ (.*)\(.*\)/
			var market_price = parseFloat(re1.exec(steam_price)[1])
			var buff_price = parseFloat(/¥ (.*)/.exec(document.querySelector(".detail-tab-cont > table > tbody > tr:nth-child(2) > td:nth-child(5) > div:nth-child(1) > strong").innerText)[1]);
			var percent = buff_price/(market_price/1.15)
			document.querySelector("body > div.market-list > div > div.detail-header.black > div.detail-cont > div.detail-summ > span > strong").innerText = document.querySelector("body > div.market-list > div > div.detail-header.black > div.detail-cont > div.detail-summ > span > strong").innerText + "  "+(percent*100).toFixed(2) + "%"
			var url = document.querySelector("body > div.market-list > div > div.detail-header.black > div.detail-cont > div.detail-summ > a").href
			fetch(url)
			.then(response => response.text())
			  .then(function(result) {
				var item_id = /Market_LoadOrderSpread\( (.*) \)/.exec(result)[1]
				var new_url = "https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid="+item_id+"&two_factor=0"
				fetch(new_url)
				.then(response => response.json())
				.then(function(result) {
					var buy_price = 0
					var sell_price = 0
					if(result.buy_order_graph.length>0){
						buy_price = parseFloat(result.buy_order_graph[0][0])
					}
					if(result.sell_order_graph.length>0){
						sell_price = parseFloat(result.sell_order_graph[0][0])
					}
					var buy_percent = buff_price/(buy_price/1.15)*100
					var sell_percent = buff_price/(sell_price/1.15)*100
					document.querySelector("body > div.market-list > div > div.detail-header.black > div.detail-cont > div.detail-summ > a").innerText =  sell_percent.toFixed(2) + '% - '+ buy_percent.toFixed(2) + "%"
					console.log(buff_price,buy_price,sell_price)
				});
			  });
		}, 1000)
	}
})