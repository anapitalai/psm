const utm = require('../middleware/utm');

// Heavily based on https://gis.stackexchange.com/a/278112/4412.

function UTM2LL(easting, northing, utm_zone, is_north) {
    // First some validation:
    if (easting < 160000 || easting > 840000) {
      throw 'Outside permissible range of easting values.';
    }
    if (northing < 0) {
      throw 'Negative values are not allowed for northing.';
    }
    if (northing > 10000000) {
      throw 'Northing may not exceed 10,000,000.';
    }
  
    // Symbols as used in USGS PP 1395: Map Projections - A Working Manual
    const DatumEqRad = [
      6378137.0, 6378137.0, 6378137.0, 6378135.0, 6378160.0, 6378245.0, 6378206.4,
      6378388.0, 6378388.0, 6378249.1, 6378206.4, 6377563.4, 6377397.2, 6377276.3
    ];
    const DatumFlat = [
      298.2572236, 298.2572236, 298.2572215, 298.2597208, 298.2497323,
      298.2997381, 294.9786982, 296.9993621, 296.9993621, 293.4660167,
      294.9786982, 299.3247788, 299.1527052, 300.8021499
    ];
  
    const Item = 0;                              // default
    const a = DatumEqRad[Item];                  // equatorial radius (meters)
    const f = 1 / DatumFlat[Item];               // polar flattening
    const drad = Math.PI / 180;                  // convert degrees to radians
    const k0 = 0.9996;                           // scale on central meridian
    const b = a * (1 - f);                       // polar axis
    const e = Math.sqrt(1 - (b / a) * (b / a));  // eccentricity
    const esq = (1 - (b / a) * (b / a));         // e² for use in expansions
    const e0sq = e * e / (1 - e * e);            // e0² — always even powers
  
    // Now the actual calculation:
    const zcm = 3 + 6 * (utm_zone - 1) - 180;  // central meridian of zone
    const e1 = (1 - Math.sqrt(1 - e * e)) / (1 + Math.sqrt(1 - e * e));
    const M0 = 0;  // in case origin other than zero lat
  
    const M = is_north ?  // arc length along standard meridian
        M0 + northing / k0 :
        M0 + (northing - 10000000) / k0;
    const mu = M / (a * (1 - esq * (1 / 4 + esq * (3 / 64 + 5 * esq / 256))));
    var phi1 = mu + e1 * (3 / 2 - 27 * e1 * e1 / 32) * Math.sin(2 * mu) + e1 * e1 * (21 / 16 - 55 * e1 * e1 / 32) * Math.sin(4 * mu);
    phi1 = phi1 + e1 * e1 * e1 * (Math.sin(6 * mu) * 151 / 96 + e1 * Math.sin(8 * mu) * 1097 / 512);
    const C1 = e0sq * Math.pow(Math.cos(phi1), 2);
    const T1 = Math.pow(Math.tan(phi1), 2);
    const N1 = a / Math.sqrt(1 - Math.pow(e * Math.sin(phi1), 2));
    const R1 = N1 * (1 - e * e) / (1 - Math.pow(e * Math.sin(phi1), 2));
    const D = (easting - 500000) / (N1 * k0);
    var phi = (D * D) * (1 / 2 - D * D * (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * e0sq) / 24);
    phi = phi + Math.pow(D, 6) * (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * e0sq - 3 * C1 * C1) / 720;
    phi = phi1 - (N1 * Math.tan(phi1) / R1) * phi;
  
    const lon = D * (1 + D * D * ((-1 - 2 * T1 - C1) / 6 + D * D * (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * e0sq + 24 * T1 * T1) / 120)) / Math.cos(phi1);
  
    return [
      phi / drad,
      zcm + lon / drad,
    ];
  }
  
//   function UTM34N2LL(easting, northing) {
//     return UTM2LL(easting, northing, 34, true);
//   }


  //const res=UTM2LL(499642.937,9263205.309,55,false)
  const res=UTM2LL(499861.978,9262864.032,55,false)

  console.log(res)
  // const lat=res[0]

  // const lon=res[1]


module.exports = { UTM2LL };