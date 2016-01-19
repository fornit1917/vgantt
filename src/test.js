window.Events = Events;

function test()
{
	window.ev = new Events();
	ev.bind('e1 e2', e1f);
	ev.bind('e2', e2f);
	ev.bind('e3', e3f);
}

function e1f(data)
{
	document.getElementById('e1t').value = data.eventName + data.a;
}

function e2f(data)
{
	document.getElementById('e2t').value = data.eventName + data.a;
}

function e3f(data)
{
	document.getElementById('e3t').value = data.eventName + data.a;
}

function e1()
{
	ev.on('e1', {'a':'1'});
}

function e2()
{
	ev.on('e2', {'a':'2'});
}

function e3()
{
	ev.on('e3', {'a':'3'});
}

window.test = test;
window.e1 = e1;
window.e2 = e2;
window.e3 = e3;