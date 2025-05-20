// Music Store Data
window.musicStores = [
  // Wisconsin
  { name: "Baraboo Music LLC", address: "129 3rd St", city: "Baraboo", state: "WI", zip: "53913", phone: "(608) 355-0207", website: "baraboomusic.com", email: "info@baraboomusic.com", tags: ["Instrument Shops"], lat: 43.4716, lng: -89.7430 },
  { name: "Lincoln Music House", address: "3379 S 13th St", city: "Milwaukee", state: "WI", zip: "53215", phone: "(414) 647-9608", website: "lincolnmusichouse.com", email: "info@lincolnmusichouse.com", tags: ["Instrument Shops"], lat: 42.9887, lng: -87.9293 },
  { name: "Uncle Bob's Music Center", address: "5080 S 108th St", city: "Greenfield", state: "WI", zip: "53228", phone: "(414) 529-8910", website: "unclebobsmusic.com", email: "info@unclebobsmusic.com", tags: ["Instrument Shops"], lat: 42.9611, lng: -88.0483 },
  { name: "Outpost Music", address: "1330 S Commercial St", city: "Neenah", state: "WI", zip: "54956", phone: "(920) 722-9400", website: "outpostmusic.com", email: "info@outpostmusic.com", tags: ["Instrument Shops"], lat: 44.1595, lng: -88.4626 },
  { name: "Schmitt Music", address: "6750 W Layton Ave", city: "Greenfield", state: "WI", zip: "53220", phone: "(414) 281-3500", website: "schmittmusic.com", email: "info@schmittmusic.com", tags: ["Instrument Shops"], lat: 42.9599, lng: -87.9992 },
  { name: "West End Music", address: "1131 N 8th St", city: "Sheboygan", state: "WI", zip: "53081", phone: "(920) 458-5842", website: "westendmusic.com", email: "info@westendmusic.com", tags: ["Instrument Shops"], lat: 43.7564, lng: -87.7131 },
  
  // Additional Milwaukee, WI stores
  { name: "Brass Bell Music", address: "210 W Silver Spring Dr", city: "Milwaukee", state: "WI", zip: "53217", phone: "(414) 963-1000", website: "brassbellmusic.com", email: "info@brassbellmusic.com", tags: ["Instrument Shops", "Music Lessons"], lat: 43.1248, lng: -87.9396 },
  { name: "Dave's Guitar Shop", address: "914 S. 5th Street", city: "Milwaukee", state: "WI", zip: "53204", phone: "(608) 790-9816", website: "davesguitar.com", email: "info@davesguitar.com", tags: ["Instrument Shops", "Guitar Shop"], lat: 43.0223, lng: -87.9164 },
  { name: "Wade's Guitar Shop", address: "1120 E Brady St", city: "Milwaukee", state: "WI", zip: "53202", phone: "(414) 961-0848", website: "wadesguitars.com", email: "wadesguitarshop@gmail.com", tags: ["Instrument Shops", "Guitar Shop"], lat: 43.0528, lng: -87.8992 },
  { name: "Rockhaus Guitars & Drums", address: "820 E. Locust St", city: "Milwaukee", state: "WI", zip: "53212", phone: "(414) 545-5900", website: "rockhausguitars.com", email: "rockhausguitars@att.net", tags: ["Instrument Shops", "Guitar Shop"], lat: 43.0722, lng: -87.9032 },
  { name: "Family Music Center", address: "5020 W. Oklahoma Ave", city: "Milwaukee", state: "WI", zip: "53219", phone: "(414) 546-6664", website: "mysite778.dudaone.com", email: "FamilyMusicInc@yahoo.com", tags: ["Instrument Shops", "Music Lessons"], lat: 42.9867, lng: -87.9775 },
  { name: "Cream City Music", address: "12505 W Burleigh Rd", city: "Brookfield", state: "WI", zip: "53005", phone: "(262) 785-9770", website: "creamcitymusic.com", email: "info@creamcitymusic.com", tags: ["Instrument Shops", "Guitar Shop"], lat: 43.0759, lng: -88.0647, milwaukeeArea: true },
  
  // White House of Music Locations (Milwaukee area)
  { name: "White House of Music - Waukesha", address: "2101 N Springdale Rd", city: "Waukesha", state: "WI", zip: "53186", phone: "(262) 798-9700", website: "whitehouseofmusic.com", email: "info@whitehouseofmusic.com", tags: ["Instrument Shops", "Music Lessons"], lat: 43.0433, lng: -88.2150, milwaukeeArea: true },
  { name: "White House of Music - Brookfield", address: "13630 W Capitol Dr", city: "Brookfield", state: "WI", zip: "53005", phone: "(262) 783-4400", website: "whitehouseofmusic.com", email: "info@whitehouseofmusic.com", tags: ["Instrument Shops", "Music Lessons"], lat: 43.0885, lng: -88.0778, milwaukeeArea: true },
  { name: "White House of Music - Watertown", address: "1724 S Church St", city: "Watertown", state: "WI", zip: "53094", phone: "(920) 261-0700", website: "whitehouseofmusic.com", email: "info@whitehouseofmusic.com", tags: ["Instrument Shops", "Music Lessons"], lat: 43.1765, lng: -88.7286 },
  { name: "White House of Music - West Bend", address: "869 S Main St", city: "West Bend", state: "WI", zip: "53095", phone: "(262) 334-4426", website: "whitehouseofmusic.com", email: "info@whitehouseofmusic.com", tags: ["Instrument Shops", "Music Lessons"], lat: 43.4088, lng: -88.1852 },

  // Minnesota
  { name: "Twin Town Guitars", address: "3400 Lyndale Ave S", city: "Minneapolis", state: "MN", zip: "55408", phone: "(612) 822-3334", website: "twintown.com", email: "info@twintown.com", tags: ["Instrument Shops"], lat: 44.9396, lng: -93.2880 },
  { name: "Willie's American Guitars", address: "254 Cleveland Ave S", city: "St. Paul", state: "MN", zip: "55105", phone: "(651) 699-1913", website: "williesguitars.com", email: "info@williesguitars.com", tags: ["Instrument Shops"], lat: 44.9396, lng: -93.1827 },
  { name: "Groth Music", address: "8056 Nicollet Ave S", city: "Bloomington", state: "MN", zip: "55420", phone: "(952) 884-4772", website: "grothmusic.com", email: "info@grothmusic.com", tags: ["Instrument Shops"], lat: 44.8570, lng: -93.2780 },
  { name: "Schmitt Music Brooklyn Ctr", address: "2400 Freeway Blvd", city: "Brooklyn Center", state: "MN", zip: "55430", phone: "(763) 566-4560", website: "schmittmusic.com", email: "info@schmittmusic.com", tags: ["Instrument Shops"], lat: 45.0546, lng: -93.3047 },

  // Illinois
  { name: "Chicago Music Exchange", address: "3316 N Lincoln Ave", city: "Chicago", state: "IL", zip: "60657", phone: "(773) 525-7773", website: "chicagomusicexchange.com", email: "info@chicagomusicexchange.com", tags: ["Instrument Shops"], lat: 41.9428, lng: -87.6687 },
  { name: "Reckless Records", address: "1379 N Milwaukee Ave", city: "Chicago", state: "IL", zip: "60622", phone: "(773) 235-3727", website: "reckless.com", email: "info@reckless.com", tags: ["Record Stores"], lat: 41.9066, lng: -87.6687 },
  { name: "Shuga Records", address: "1272 N Milwaukee Ave", city: "Chicago", state: "IL", zip: "60622", phone: "(773) 278-4085", website: "shugarecords.com", email: "info@shugarecords.com", tags: ["Record Stores"], lat: 41.9066, lng: -87.6687 },
  
  // Additional Chicago, IL stores
  { name: "Guitar Center Chicago", address: "2633 N. Halsted St", city: "Chicago", state: "IL", zip: "60614", phone: "(773) 248-2808", website: "guitarcenter.com", email: "info@guitarcenter.com", tags: ["Instrument Shops", "Guitar Shop"], lat: 41.9302, lng: -87.6492 },
  { name: "Rock N Roll Vintage & Synth City", address: "4727 N Damen Ave", city: "Chicago", state: "IL", zip: "60625", phone: "(773) 878-8616", website: "rocknrollvintage.com", email: "rocknrollvintage@gmail.com", tags: ["Instrument Shops", "Vintage Instruments"], lat: 41.9675, lng: -87.6790 },
  { name: "Music Direct", address: "1811 W Bryn Mawr Ave", city: "Chicago", state: "IL", zip: "60660", phone: "(312) 433-0200", website: "musicdirect.com", email: "info@musicdirect.com", tags: ["Audio Equipment", "Record Stores"], lat: 41.9835, lng: -87.6766 },
  { name: "Coulsons Music Bookstore", address: "900 N Michigan Ave, Level 6", city: "Chicago", state: "IL", zip: "60611", phone: "(312) 461-1989", website: "coulsonsmusic.com", email: "info@coulsonsmusic.com", tags: ["Sheet Music", "Music Books"], lat: 41.9001, lng: -87.6246 },
  { name: "Dusty Groove", address: "1120 N Ashland Ave", city: "Chicago", state: "IL", zip: "60622", phone: "(773) 342-5800", website: "dustygroove.com", email: "info@dustygroove.com", tags: ["Record Stores", "Vinyl"], lat: 41.9024, lng: -87.6673 },
  { name: "The Music Gallery", address: "1940 First St", city: "Highland Park", state: "IL", zip: "60035", phone: "(847) 432-6350", website: "musicgalleryinc.com", email: "musicglry@gmail.com", tags: ["Instrument Shops", "Music Lessons"], lat: 42.1851, lng: -87.7968 },
  { name: "Shuga Records", address: "1272 N Milwaukee Ave", city: "Chicago", state: "IL", zip: "60622", phone: "(773) 278-4085", website: "shugarecords.com", email: "info@shugarecords.com", tags: ["Record Stores", "Vinyl"], lat: 41.9066, lng: -87.6687 },

  // Indiana
  { name: "Indy CD & Vinyl", address: "806 Broad Ripple Ave", city: "Indianapolis", state: "IN", zip: "46220", phone: "(317) 259-1012", website: "indycdandvinyl.com", email: "info@indycdandvinyl.com", tags: ["Record Stores"], lat: 39.8698, lng: -86.1458 },
  { name: "Irvington Vinyl & Books", address: "202 S Audubon Rd", city: "Indianapolis", state: "IN", zip: "46219", phone: "(317) 354-0891", website: "irvingtonvinyl.com", email: "info@irvingtonvinyl.com", tags: ["Record Stores"], lat: 39.7654, lng: -86.0707 },

  // Michigan
  { name: "Elderly Instruments", address: "1100 N Washington Ave", city: "Lansing", state: "MI", zip: "48906", phone: "(517) 372-7880", website: "elderly.com", email: "info@elderly.com", tags: ["Instrument Shops"], lat: 42.7431, lng: -84.5555 },
  { name: "Motor City Guitar", address: "24350 Hoover Rd", city: "Warren", state: "MI", zip: "48089", phone: "(586) 755-2450", website: "motorcityguitar.com", email: "info@motorcityguitar.com", tags: ["Instrument Shops"], lat: 42.4759, lng: -83.0323 },

  // Tennessee
  { name: "Memphis Drum Shop", address: "878 S Cooper St", city: "Memphis", state: "TN", zip: "38104", phone: "(901) 276-2328", website: "memphisdrumshop.com", email: "info@memphisdrumshop.com", tags: ["Instrument Shops"], lat: 35.1270, lng: -89.9975 },
  { name: "Shangri-La Records", address: "1916 Madison Ave", city: "Memphis", state: "TN", zip: "38104", phone: "(901) 274-1916", website: "shangri.com", email: "info@shangri.com", tags: ["Record Stores"], lat: 35.1382, lng: -89.9928 },
  { name: "Gruhn Guitars", address: "2120 8th Ave S", city: "Nashville", state: "TN", zip: "37204", phone: "(615) 256-2033", website: "gruhnguitars.com", email: "gruhn@gruhn.com", tags: ["Instrument Shops"], lat: 36.1231, lng: -86.7794 },
  { name: "Grimey's New & Preloved", address: "1060 E Trinity Ln", city: "Nashville", state: "TN", zip: "37216", phone: "(615) 226-3811", website: "grimeys.com", email: "info@grimeys.com", tags: ["Record Stores"], lat: 36.2090, lng: -86.7534 }
];
