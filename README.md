# alivefyi

A live FYI is a living information network.
 
 If you are building an app that wants to provide local information to your users you are a ***user***.
 
 If you have information that is relevant to fun things to do, eat, etc, you are a ***provider***. 

```
npm i alivefyi --save
```
# users
<ul>Users request information from the network and listen for responses from providers
  <li><em>ask:</em> ask alivefyi for relevant information (publishes questions to the request channel)
  <li><em>listen:</em> add listener to the response channel (listens to the response channel)
</ul>

# providers
<ul>Providers subscribe to the network and filter requests for relevant information. They might use satori queries to limit the information they receive.
  <li><em>subscribe:</em> add listener to request channel (listens to the request channel)
  <li><em>publish:</em> provide relevant information into the response channel (publish to the response channel)
</ul>

## Create a request:
```JavaScript
const alivefyi = require('alivefyi');
alivefyi.ask({
  // any terms to look for
  terms: 'Machine Zone', 
  geo: {
    "@type": "GeoCoordinates", 
    latitude: 37.2911779, 
    longitude: -121.9473625
  }
});
alivefyi.listen(data => update(data));

/**
* updates the console
* @param one of many data responses from one or more providers
*/
function update(data) {
  console.log('New data', data);
}

```
## Create a feed:
```JavaScript
const alivefyi = require('alivefyi');

/**
* listen for user inputs
*/
alivefyi.subscribe((data) => {
  if(data.terms.indexOf('Machine Zone')) {
    publishAddress();
  }
});

/**
* publish to data to user
*/
function publishAddress() {
  alivefyi.publish({
    const result = ADDRESS;
    result.url = getGoogleUrl(result);
    return result;
  }
}

function getGoogleUrl(location) {
  const info = `${location.address.streetAddress},+${location.address.addressLocality},+${location.address.addressRegion}+${location.address.postalCode}/@${location.geo.latitude},${location.geo.longitude}`;
  const result = info.replace('+', '%2B').replace(/\s/gm, '+');
  return `https://www.google.com/maps/place/${result}`;
}

const ADDRESS = {
  "@type": "Place",
  _pid: 'Test',
  name: `Machine Zone`,
  description: ``,
  address: {
    "@type": "PostalAddress",
    streetAddress: '1050 County Hwy G3',
    addressLocality: 'Palo Alto',
    addressRegion: 'CA',
    postalCode: '94304',
    addressCounty: 'US',
  },
  geo: {
    "@type": "GeoCoordinates",
    "latitude": 37.2911779,
    "longitude": -121.9473625,
  },
  data: {
    coupons: [],
  }
}
```
