function formatNumber(num) {
	if (num==0)
	{
		return("");
	}else
	{
		return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + " " });
	}
};

function onlyUnique(value, index, self)
{ 
    return self.indexOf(value) === index;
};
