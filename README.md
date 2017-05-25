# alivefyi

A live FYI is a living information network. 

```
npm i alivefyi --save
```

<ul>users
  <li><em>ask</em> ask alivefyi for relevant information (publish to the request channel)
  <li><em>listen</em> add listener to the response channel
</ul>
<ul>provider
  <li><em>subscribe</em> add listener to request channel
  <li><em>publish</em> give relevant information (publish to the response channel)
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
```
## Create a feed:
```JavaScript
const alivefyi = require('alivefyi');

alivefyi.subscribe((data) => {
  console.log(data);
  if(data.terms.indexOf('Machine Zone')) {
    publishAddress();
  }
});

function publishAddress() {
  alivefyi.publish({
    const result = ADDRESS;
    result.url = getGoogleUrl(result);
    return result;
  }
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
