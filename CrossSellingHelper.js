function formatNumber(num, NumDecimals, Thousands, DecimalSep, ThousandSep) {
	if(NumDecimals === undefined){NumDecimals = 0;}
	if(Thousands === undefined){Thousands = false;}
	if(DecimalSep === undefined){DecimalSep = ",";}
	if(ThousandSep === undefined){ThousandSep = ".";}

	var decimalPart = '';
	num = num.toFixed(NumDecimals);
	if(DecimalSep != '.'){num = num.replace('.', DecimalSep);}
	//alert("NumDecimals: " + NumDecimals.toString() + " - Num: " + num.toString() + " - decimalPart: " + decimalPart + " - DecimalSep: " + DecimalSep + " - Thousands: " + Thousands);
	
	if(Thousands){
		if (num.indexOf(DecimalSep) != -1) {
			decimalPart = DecimalSep + num.split(DecimalSep)[1];
			num = parseInt(num.split(DecimalSep)[0]);
		}
		var array = num.toString().split('');
		var index = -3;
		while (array.length + index > 0) {
			array.splice(index, 0, ThousandSep);
			index -= 4;
		}
		return array.join('') + decimalPart;
	} else {
		return num;
	}	
};

function onlyUnique(value, index, self)
{ 
    return self.indexOf(value) === index;
}
